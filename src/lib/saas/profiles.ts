import { getSupabase } from "@/integrations/supabase/get-client";
import type { Profile, UserRole, AccountStatus } from "./types";

type ProfileRow = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    role: row.role,
    status: row.status,
    last_login_at: row.last_login_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    if (error.code === "42P01" || error.message.includes("does not exist")) return null;
    throw error;
  }
  return data ? mapProfile(data as ProfileRow) : null;
}

export async function updateOwnProfile(userId: string, patch: { full_name?: string }): Promise<void> {
  const supabase = await getSupabase();
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) throw error;
}

export async function recordLogin(userId: string): Promise<void> {
  const supabase = await getSupabase();
  const now = new Date().toISOString();
  await supabase.from("profiles").update({ last_login_at: now }).eq("id", userId);
  await supabase.from("login_sessions").insert({ user_id: userId });
}
