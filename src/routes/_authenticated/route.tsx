// Protected layout — Supabase Auth gate (client-only).
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { user, loading, isSuperAdmin, accountActive, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", replace: true, search: { redirect: window.location.pathname } });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user && profile && !isSuperAdmin && !accountActive) {
      const status = profile.status;
      if (status === "suspended") {
        navigate({ to: "/auth", replace: true, search: { reason: "suspended" } });
      } else {
        navigate({ to: "/auth", replace: true, search: { reason: "expired" } });
      }
    }
  }, [loading, user, profile, isSuperAdmin, accountActive, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Chargement…</div>
      </div>
    );
  }

  if (profile && !isSuperAdmin && !accountActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Vérification du compte…</div>
      </div>
    );
  }

  return <Outlet />;
}
