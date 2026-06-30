import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/integrations/supabase/get-client";

export type SignUpResult = "session" | "email_confirmation";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    void getSupabase().then((supabase) => {
      if (cancelled) return;

      void supabase.auth.getSession().then(({ data }) => {
        if (!cancelled) {
          setUser(data.session?.user ?? null);
          setLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!cancelled) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      });

      unsubscribe = () => subscription.unsubscribe();
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const value: AuthCtx = {
    user,
    loading,
    signIn: async (email, password) => {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    signUp: async (email, password) => {
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return data.session ? "session" : "email_confirmation";
    },
    logout: async () => {
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
