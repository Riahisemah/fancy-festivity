import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/integrations/supabase/get-client";
import type { Profile, Subscription } from "@/lib/saas/types";
import { isAccountActive } from "@/lib/saas/types";
import { getProfile, recordLogin } from "@/lib/saas/profiles";
import { getSubscription } from "@/lib/saas/subscriptions";
import {
  DEV_ADMIN_ENABLED,
  isDevAdminCredentials,
  createDevAdminUser,
  persistDevSuperAdmin,
  clearDevSuperAdmin,
  isDevSuperAdminSession,
} from "@/lib/dev-admin";

export type SignUpResult = "session" | "email_confirmation";

type AuthCtx = {
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  isSuperAdmin: boolean;
  isDevSuperAdmin: boolean;
  accountActive: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  resendConfirmation: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

const DEV_PROFILE: Profile = {
  id: "00000000-0000-0000-0000-000000000001",
  full_name: "Super Admin (Dev)",
  email: "admin@gmail.com",
  role: "super_admin",
  status: "active",
  last_login_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isDevSuperAdmin, setIsDevSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async (u: User) => {
    try {
      const [p, s] = await Promise.all([getProfile(u.id), getSubscription(u.id)]);
      setProfile(p);
      setSubscription(s);
      if (p && p.role !== "super_admin") {
        void recordLogin(u.id);
      }
    } catch {
      setProfile(null);
      setSubscription(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    if (DEV_ADMIN_ENABLED && isDevSuperAdminSession()) {
      setUser(createDevAdminUser());
      setProfile(DEV_PROFILE);
      setIsDevSuperAdmin(true);
      setLoading(false);
      return;
    }

    void getSupabase().then((supabase) => {
      if (cancelled) return;

      void supabase.auth.getSession().then(({ data }) => {
        if (!cancelled) {
          const u = data.session?.user ?? null;
          setUser(u);
          if (u) void loadUserData(u);
          setLoading(false);
        }
      });

      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!cancelled) {
          const u = session?.user ?? null;
          setUser(u);
          if (u) void loadUserData(u);
          else {
            setProfile(null);
            setSubscription(null);
          }
          setLoading(false);
        }
      });

      unsubscribe = () => sub.unsubscribe();
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [loadUserData]);

  const refreshProfile = useCallback(async () => {
    if (isDevSuperAdmin) return;
    if (!user) return;
    await loadUserData(user);
  }, [user, isDevSuperAdmin, loadUserData]);

  const value: AuthCtx = {
    user,
    profile,
    subscription,
    isSuperAdmin: isDevSuperAdmin || profile?.role === "super_admin",
    isDevSuperAdmin,
    accountActive: isDevSuperAdmin || (profile ? isAccountActive(profile, subscription) : false),
    loading,
    refreshProfile,
    signIn: async (email, password) => {
      if (isDevAdminCredentials(email, password)) {
        persistDevSuperAdmin();
        setUser(createDevAdminUser());
        setProfile(DEV_PROFILE);
        setIsDevSuperAdmin(true);
        return;
      }
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setIsDevSuperAdmin(false);
    },
    signUp: async () => {
      throw new Error("L'inscription publique est désactivée. Contactez l'administrateur.");
    },
    resendConfirmation: async (email) => {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth` : undefined,
        },
      });
      if (error) throw error;
    },
    logout: async () => {
      if (isDevSuperAdmin) {
        clearDevSuperAdmin();
        setUser(null);
        setProfile(null);
        setSubscription(null);
        setIsDevSuperAdmin(false);
        return;
      }
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
