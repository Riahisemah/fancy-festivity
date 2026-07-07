/**
 * DEV ONLY — Authentification Super Admin codée en dur.
 * Retirer ce fichier et ses imports lors du passage en production.
 */
import type { User } from "@supabase/supabase-js";

export const DEV_ADMIN_ENABLED = import.meta.env.DEV;

export const DEV_ADMIN_EMAIL = "admin@gmail.com";
export const DEV_ADMIN_PASSWORD = "1234567890";
export const DEV_ADMIN_USER_ID = "00000000-0000-0000-0000-000000000001";

const DEV_ADMIN_STORAGE_KEY = "velon:dev-super-admin";

export function isDevAdminCredentials(email: string, password: string): boolean {
  return (
    DEV_ADMIN_ENABLED &&
    email.trim().toLowerCase() === DEV_ADMIN_EMAIL &&
    password === DEV_ADMIN_PASSWORD
  );
}

export function createDevAdminUser(): User {
  return {
    id: DEV_ADMIN_USER_ID,
    aud: "authenticated",
    role: "authenticated",
    email: DEV_ADMIN_EMAIL,
    email_confirmed_at: new Date().toISOString(),
    phone: "",
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    app_metadata: { provider: "dev", providers: ["dev"] },
    user_metadata: { full_name: "Super Admin (Dev)" },
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_anonymous: false,
  } as User;
}

export function persistDevSuperAdmin(): void {
  if (!DEV_ADMIN_ENABLED) return;
  try {
    sessionStorage.setItem(DEV_ADMIN_STORAGE_KEY, "1");
  } catch {
    // ignore
  }
}

export function clearDevSuperAdmin(): void {
  try {
    sessionStorage.removeItem(DEV_ADMIN_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function isDevSuperAdminSession(): boolean {
  if (!DEV_ADMIN_ENABLED) return false;
  try {
    return sessionStorage.getItem(DEV_ADMIN_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}
