import { getSupabase } from "@/integrations/supabase/get-client";
import type { Plan, PlanKey, Subscription } from "./types";

type PlanRow = {
  id: string;
  key: PlanKey;
  name: string;
  max_invitations: number | null;
  price_cents: number;
};

type SubscriptionRow = {
  id: string;
  user_id: string;
  plan_id: string;
  status: Subscription["status"];
  starts_at: string;
  expires_at: string;
  default_publication_days: number | null;
  revenue_cents: number;
  plans?: PlanRow | PlanRow[] | null;
};

function mapPlan(row: PlanRow): Plan {
  return {
    id: row.id,
    key: row.key,
    name: row.name,
    max_invitations: row.max_invitations,
    price_cents: row.price_cents,
  };
}

function mapSubscription(row: SubscriptionRow): Subscription {
  const planData = Array.isArray(row.plans) ? row.plans[0] : row.plans;
  return {
    id: row.id,
    user_id: row.user_id,
    plan_id: row.plan_id,
    status: row.status,
    starts_at: row.starts_at,
    expires_at: row.expires_at,
    default_publication_days: row.default_publication_days,
    revenue_cents: row.revenue_cents,
    plan: planData ? mapPlan(planData) : undefined,
  };
}

export async function listPlans(): Promise<Plan[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.from("plans").select("*").order("price_cents");
  if (error) throw error;
  return (data ?? []).map((r) => mapPlan(r as PlanRow));
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, plans(*)")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    if (error.code === "42P01" || error.message.includes("does not exist")) return null;
    throw error;
  }
  return data ? mapSubscription(data as SubscriptionRow) : null;
}

export async function getUserLimits(userId: string): Promise<{ max_invitations: number | null } | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("user_limits")
    .select("max_invitations")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    if (error.code === "42P01") return null;
    throw error;
  }
  return data;
}

export async function getInvitationQuota(userId: string): Promise<{
  used: number;
  max: number | null;
  remaining: number | null;
}> {
  const supabase = await getSupabase();
  const [sub, limits, countRes] = await Promise.all([
    getSubscription(userId),
    getUserLimits(userId),
    supabase.from("invitations").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  const used = countRes.count ?? 0;
  const max = limits?.max_invitations ?? sub?.plan?.max_invitations ?? null;
  const remaining = max === null ? null : Math.max(0, max - used);

  return { used, max, remaining };
}
