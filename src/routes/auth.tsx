import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthApiError } from "@supabase/supabase-js";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
  redirect: z.string().optional(),
  reason: z.enum(["suspended", "expired"]).optional(),
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
  const { user, loading: authLoading, signIn, resendConfirmation, isSuperAdmin } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      const dest = isSuperAdmin ? "/admin/dashboard" : (search.redirect ?? "/dashboard");
      navigate({ to: dest, replace: true });
    }
  }, [user, authLoading, navigate, search.redirect, isSuperAdmin]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setNeedsEmailConfirmation(false);
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
        toast.error("L'inscription publique est désactivée. Contactez l'administrateur.");
        return;
      } else {
        await signIn(email, password);
        toast.success("Bienvenue !");
        navigate({ to: search.redirect ?? (email.trim().toLowerCase() === "admin@gmail.com" ? "/admin/dashboard" : "/dashboard") });
      }
    } catch (err) {
      if (isEmailNotConfirmedError(err)) {
        setNeedsEmailConfirmation(true);
      }
      toast.error(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 sm:py-12 safe-x">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-serif text-3xl mb-8">Vélon</Link>
        <div className="rounded-2xl bg-card p-6 sm:p-8 ring-1 ring-border shadow-xl shadow-ink/5 animate-reveal">
          <h1 className="font-serif text-3xl text-center">Bon retour</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Connectez-vous pour gérer vos invitations.
          </p>

          {search.reason === "suspended" && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800">
              Votre compte a été suspendu. Contactez l&apos;administrateur.
            </div>
          )}
          {search.reason === "expired" && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-800">
              Votre abonnement a expiré. Contactez l&apos;administrateur pour le renouveler.
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3.5 text-base outline-none focus:border-accent transition-colors"
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
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3.5 text-base outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground hover:bg-accent transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Se connecter"}
            </button>
          </form>

          {needsEmailConfirmation && mode === "signin" && (
            <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4 text-center text-sm">
              <p className="text-muted-foreground">
                Votre compte existe mais l&apos;email n&apos;est pas encore confirmé.
              </p>
              <button
                type="button"
                disabled={loading || !email}
                onClick={async () => {
                  if (!email || loading) return;
                  setLoading(true);
                  try {
                    await resendConfirmation(email);
                    toast.success("Email de confirmation renvoyé. Vérifiez votre boîte mail.");
                  } catch (err) {
                    toast.error(formatAuthError(err));
                  } finally {
                    setLoading(false);
                  }
                }}
                className="mt-3 font-medium text-foreground underline underline-offset-4 hover:text-accent disabled:opacity-50"
              >
                Renvoyer l&apos;email de confirmation
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte ? Contactez l&apos;administrateur de la plateforme.
          </p>
        </div>
      </div>
    </div>
  );
}

function isEmailNotConfirmedError(err: unknown): boolean {
  if (!(err instanceof AuthApiError)) return false;
  const code = (err as AuthApiError & { code?: string }).code;
  const msg = err.message.toLowerCase();
  return code === "email_not_confirmed" || msg.includes("email not confirmed");
}

function formatAuthError(err: unknown): string {
  if (err instanceof AuthApiError) {
    const code = (err as AuthApiError & { code?: string }).code;
    const msg = err.message.toLowerCase();
    if (err.status === 429 || code === "over_request_rate_limit") {
      return "Trop de tentatives. Attendez 5 à 10 minutes, ou connectez-vous si le compte existe déjà.";
    }
    if (
      code === "invalid_credentials" ||
      code === "invalid_grant" ||
      (err.status === 400 && (msg.includes("invalid login") || msg.includes("invalid credentials")))
    ) {
      return "Email ou mot de passe incorrect.";
    }
    if (isEmailNotConfirmedError(err)) {
      return "Confirmez votre email avant de vous connecter (vérifiez votre boîte mail).";
    }
    if (err.status === 422 || code === "user_already_exists" || msg.includes("already registered") || msg.includes("already been registered")) {
      return "Cet email est déjà utilisé. Essayez de vous connecter.";
    }
  }
  if (err instanceof Error) {
    return err.message.replace(/\(auth\/[^)]+\)\.?/g, "").trim() || err.message;
  }
  return "Erreur de connexion";
}
