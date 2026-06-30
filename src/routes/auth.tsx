import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthApiError } from "@supabase/supabase-js";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Connexion — Vélon" }, { name: "description", content: "Connectez-vous pour gérer vos invitations." }],
  }),
  validateSearch: (s) => searchSchema.parse(s),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: search.redirect ?? "/dashboard", replace: true });
    }
  }, [user, authLoading, navigate, search.redirect]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const schema = z.object({
        email: z.string().email("Email invalide"),
        password: z.string().min(6, "Au moins 6 caractères"),
      });
      const parsed = schema.safeParse({ email, password });
      if (!parsed.success) {
        toast.error(parsed.error.issues[0].message);
        return;
      }
      if (mode === "signup") {
        const result = await signUp(email, password);
        if (result === "email_confirmation") {
          toast.success("Compte créé. Vérifiez votre boîte mail pour confirmer, puis connectez-vous.");
          setMode("signin");
          return;
        }
        toast.success("Compte créé. Bienvenue !");
        navigate({ to: search.redirect ?? "/dashboard" });
      } else {
        await signIn(email, password);
        toast.success("Bienvenue !");
        navigate({ to: search.redirect ?? "/dashboard" });
      }
    } catch (err) {
      toast.error(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-serif text-3xl mb-8">Vélon</Link>
        <div className="rounded-2xl bg-card p-8 ring-1 ring-border shadow-xl shadow-ink/5 animate-reveal">
          <h1 className="font-serif text-3xl text-center">
            {mode === "signin" ? "Bon retour" : "Créer un compte"}
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Connectez-vous pour gérer vos invitations." : "Quelques secondes suffisent."}
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                placeholder="vous@exemple.com"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground hover:bg-accent transition-colors disabled:opacity-50"
            >
              {loading ? "..." : mode === "signin" ? "Se connecter" : "Créer le compte"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-medium text-foreground underline underline-offset-4 hover:text-accent"
            >
              {mode === "signin" ? "Créer un compte" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function formatAuthError(err: unknown): string {
  if (err instanceof AuthApiError) {
    const msg = err.message.toLowerCase();
    if (err.status === 429) {
      return "Trop de tentatives. Attendez 5 à 10 minutes, ou connectez-vous si le compte existe déjà.";
    }
    if (err.status === 400 && (msg.includes("invalid login") || msg.includes("invalid credentials"))) {
      return "Email ou mot de passe incorrect.";
    }
    if (msg.includes("email not confirmed")) {
      return "Confirmez votre email avant de vous connecter (vérifiez votre boîte mail).";
    }
    if (err.status === 422 || msg.includes("already registered") || msg.includes("already been registered")) {
      return "Cet email est déjà utilisé. Essayez de vous connecter.";
    }
  }
  if (err instanceof Error) {
    return err.message.replace(/\(auth\/[^)]+\)\.?/g, "").trim() || err.message;
  }
  return "Erreur de connexion";
}
