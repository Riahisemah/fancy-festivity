/**
 * Server functions for Super Admin operations (service role).
 * In dev mode, also accessible via X-Dev-Admin header.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import type { AdminStats, CreateUserInput, UpdateUserInput, UserWithDetails } from "@/lib/saas/types";
import { DEV_ADMIN_ENABLED } from "@/lib/dev-admin";

async function assertSuperAdmin(): Promise<void> {
  if (DEV_ADMIN_ENABLED) {
    const request = getRequest();
    if (request?.headers.get("X-Dev-Admin") === "1") return;
  }

  const request = getRequest();
  const authHeader = request?.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Non autorisé");
  }

  const token = authHeader.replace("Bearer ", "");
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Configuration Supabase manquante");

  const supabase = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new Error("Non autorisé");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || profile.role !== "super_admin" || profile.status !== "active") {
    throw new Error("Accès réservé au Super Admin");
  }
}

async function getAdminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const createUserSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  plan_key: z.enum(["bronze", "silver", "gold", "unlimited"]),
  max_invitations: z.number().nullable().optional(),
  expires_at: z.string(),
  default_publication_days: z.number().nullable(),
  revenue_cents: z.number().optional(),
});

export const adminCreateUser = createServerFn({ method: "POST" })
  .validator((data: CreateUserInput) => createUserSchema.parse(data))
  .handler(async ({ data }) => {
    await assertSuperAdmin();
    const admin = await getAdminClient();

    const { data: plan, error: planErr } = await admin
      .from("plans")
      .select("id")
      .eq("key", data.plan_key)
      .single();
    if (planErr || !plan) throw new Error("Plan introuvable");

    const { data: authData, error: authErr } = await admin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.full_name },
    });
    if (authErr || !authData.user) throw new Error(authErr?.message ?? "Échec création utilisateur");

    const userId = authData.user.id;

    const { error: profileErr } = await admin.from("profiles").insert({
      id: userId,
      email: data.email,
      full_name: data.full_name,
      role: "client",
      status: "active",
    });
    if (profileErr) {
      await admin.auth.admin.deleteUser(userId);
      throw new Error(profileErr.message);
    }

    const { error: subErr } = await admin.from("subscriptions").insert({
      user_id: userId,
      plan_id: plan.id,
      status: "active",
      expires_at: data.expires_at,
      default_publication_days: data.default_publication_days,
      revenue_cents: data.revenue_cents ?? 0,
    });
    if (subErr) throw new Error(subErr.message);

    if (data.max_invitations !== undefined) {
      await admin.from("user_limits").upsert({
        user_id: userId,
        max_invitations: data.max_invitations,
      });
    }

    return { id: userId };
  });

const updateUserSchema = z.object({
  user_id: z.string().uuid(),
  full_name: z.string().optional(),
  email: z.string().email().optional(),
  status: z.enum(["active", "suspended", "expired"]).optional(),
  plan_key: z.enum(["bronze", "silver", "gold", "unlimited"]).optional(),
  max_invitations: z.number().nullable().optional(),
  expires_at: z.string().optional(),
  default_publication_days: z.number().nullable().optional(),
  revenue_cents: z.number().optional(),
});

export const adminUpdateUser = createServerFn({ method: "POST" })
  .validator((data: UpdateUserInput) => updateUserSchema.parse(data))
  .handler(async ({ data }) => {
    await assertSuperAdmin();
    const admin = await getAdminClient();
    const { user_id, ...patch } = data;

    if (patch.full_name !== undefined || patch.email !== undefined || patch.status !== undefined) {
      const profilePatch: Record<string, unknown> = {};
      if (patch.full_name !== undefined) profilePatch.full_name = patch.full_name;
      if (patch.email !== undefined) profilePatch.email = patch.email;
      if (patch.status !== undefined) profilePatch.status = patch.status;
      const { error } = await admin.from("profiles").update(profilePatch).eq("id", user_id);
      if (error) throw new Error(error.message);
    }

    if (patch.email) {
      await admin.auth.admin.updateUserById(user_id, { email: patch.email });
    }

    const subPatch: Record<string, unknown> = {};
    if (patch.expires_at !== undefined) subPatch.expires_at = patch.expires_at;
    if (patch.default_publication_days !== undefined) subPatch.default_publication_days = patch.default_publication_days;
    if (patch.revenue_cents !== undefined) subPatch.revenue_cents = patch.revenue_cents;
    if (patch.status === "suspended") subPatch.status = "suspended";
    if (patch.status === "expired") subPatch.status = "expired";
    if (patch.status === "active") subPatch.status = "active";

    if (patch.plan_key) {
      const { data: plan } = await admin.from("plans").select("id").eq("key", patch.plan_key).single();
      if (plan) subPatch.plan_id = plan.id;
    }

    if (Object.keys(subPatch).length > 0) {
      const { error } = await admin.from("subscriptions").update(subPatch).eq("user_id", user_id);
      if (error) throw new Error(error.message);
    }

    if (patch.max_invitations !== undefined) {
      await admin.from("user_limits").upsert({ user_id, max_invitations: patch.max_invitations });
    }

    return { ok: true };
  });

export const adminDeleteUser = createServerFn({ method: "POST" })
  .validator((userId: string) => z.string().uuid().parse(userId))
  .handler(async ({ data: userId }) => {
    await assertSuperAdmin();
    const admin = await getAdminClient();
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminResetPassword = createServerFn({ method: "POST" })
  .validator((input: { user_id: string; password: string }) =>
    z.object({ user_id: z.string().uuid(), password: z.string().min(6) }).parse(input),
  )
  .handler(async ({ data }) => {
    await assertSuperAdmin();
    const admin = await getAdminClient();
    const { error } = await admin.auth.admin.updateUserById(data.user_id, { password: data.password });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListUsers = createServerFn({ method: "GET" }).handler(async (): Promise<UserWithDetails[]> => {
  await assertSuperAdmin();
  const admin = await getAdminClient();

  const { data: profiles, error } = await admin
    .from("profiles")
    .select("*")
    .neq("role", "super_admin")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  const results: UserWithDetails[] = [];

  for (const p of profiles ?? []) {
    const [{ data: sub }, { data: limits }, { count }] = await Promise.all([
      admin.from("subscriptions").select("*, plans(*)").eq("user_id", p.id).maybeSingle(),
      admin.from("user_limits").select("*").eq("user_id", p.id).maybeSingle(),
      admin.from("invitations").select("id", { count: "exact", head: true }).eq("user_id", p.id),
    ]);

    const planData = sub?.plans;
    const plan = Array.isArray(planData) ? planData[0] : planData;

    results.push({
      id: p.id,
      full_name: p.full_name,
      email: p.email,
      role: p.role,
      status: p.status,
      last_login_at: p.last_login_at,
      created_at: p.created_at,
      updated_at: p.updated_at,
      subscription: sub
        ? {
            id: sub.id,
            user_id: sub.user_id,
            plan_id: sub.plan_id,
            status: sub.status,
            starts_at: sub.starts_at,
            expires_at: sub.expires_at,
            default_publication_days: sub.default_publication_days,
            revenue_cents: sub.revenue_cents,
            plan: plan
              ? {
                  id: plan.id,
                  key: plan.key,
                  name: plan.name,
                  max_invitations: plan.max_invitations,
                  price_cents: plan.price_cents,
                }
              : undefined,
          }
        : null,
      limits: limits ? { user_id: limits.user_id, max_invitations: limits.max_invitations } : null,
      invitations_count: count ?? 0,
    });
  }

  return results;
});

export const adminGetStats = createServerFn({ method: "GET" }).handler(async (): Promise<AdminStats> => {
  await assertSuperAdmin();
  const admin = await getAdminClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [
    { count: totalUsers },
    { count: activeUsers },
    { count: expiredUsers },
    { count: suspendedUsers },
    { count: totalInvitations },
    { count: invitationsToday },
    { count: activeInvitations },
    { count: expiredInvitations },
    { data: topInvitations },
    { count: loginsToday },
    { count: loginsWeek },
    { data: revenueData },
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client"),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client").eq("status", "active"),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client").eq("status", "expired"),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client").eq("status", "suspended"),
    admin.from("invitations").select("id", { count: "exact", head: true }),
    admin.from("invitations").select("id", { count: "exact", head: true }).gte("created_at", todayIso),
    admin.from("invitations").select("id", { count: "exact", head: true }).or("published_until.is.null,published_until.gt." + new Date().toISOString()),
    admin.from("invitations").select("id", { count: "exact", head: true }).not("published_until", "is", null).lte("published_until", new Date().toISOString()),
    admin.from("invitations").select("id, event_name, views_count, slug").order("views_count", { ascending: false }).limit(5),
    admin.from("login_sessions").select("id", { count: "exact", head: true }).gte("logged_in_at", todayIso),
    admin.from("login_sessions").select("id", { count: "exact", head: true }).gte("logged_in_at", weekAgo.toISOString()),
    admin.from("subscriptions").select("revenue_cents"),
  ]);

  const totalRevenue = (revenueData ?? []).reduce((sum, r) => sum + (r.revenue_cents ?? 0), 0);

  return {
    total_users: totalUsers ?? 0,
    active_users: activeUsers ?? 0,
    expired_users: expiredUsers ?? 0,
    suspended_users: suspendedUsers ?? 0,
    total_invitations: totalInvitations ?? 0,
    invitations_today: invitationsToday ?? 0,
    active_invitations: activeInvitations ?? 0,
    expired_invitations: expiredInvitations ?? 0,
    top_invitations: topInvitations ?? [],
    logins_today: loginsToday ?? 0,
    logins_week: loginsWeek ?? 0,
    total_revenue_cents: totalRevenue,
  };
});

export const adminListAllInvitations = createServerFn({ method: "GET" }).handler(async () => {
  await assertSuperAdmin();
  const admin = await getAdminClient();
  const { data, error } = await admin
    .from("invitations")
    .select("*, profiles!invitations_user_id_fkey(full_name, email)")
    .order("created_at", { ascending: false });
  if (error) {
    const { data: fallback, error: fallbackErr } = await admin
      .from("invitations")
      .select("*")
      .order("created_at", { ascending: false });
    if (fallbackErr) throw new Error(fallbackErr.message);
    return fallback ?? [];
  }
  return data ?? [];
});
