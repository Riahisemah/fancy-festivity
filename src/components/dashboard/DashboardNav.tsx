import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutGrid, LogOut, Plus, Sparkles, Clapperboard, User, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useQueryClient } from "@tanstack/react-query";

const CLIENT_LINKS = [
  { to: "/dashboard" as const, label: "Invitations", short: "Liste", icon: LayoutGrid },
  { to: "/templates" as const, label: "Templates", short: "Modèles", icon: Sparkles },
  { to: "/animations" as const, label: "Animations", short: "Anim.", icon: Clapperboard },
  { to: "/profile" as const, label: "Profil", short: "Profil", icon: User },
];

export function DashboardNav({
  email,
  onSignOut,
  onCreate,
}: {
  email?: string | null;
  onSignOut: () => void;
  onCreate: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const links = isSuperAdmin
    ? [{ to: "/admin/dashboard" as const, label: "Admin", short: "Admin", icon: Shield }, ...CLIENT_LINKS]
    : CLIENT_LINKS;

  async function handleSignOut() {
    if (onSignOut) {
      onSignOut();
      return;
    }
    await queryClient.cancelQueries();
    queryClient.clear();
    navigate({ to: "/auth", replace: true });
  }

  const navLinkCls = (active: boolean) =>
    `inline-flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 rounded-xl px-2 sm:px-3 min-h-11 py-2 text-[10px] sm:text-xs font-medium transition shrink-0 ${
      active ? "bg-accent/10 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md safe-top safe-x">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <Link to={isSuperAdmin ? "/admin/dashboard" : "/dashboard"} className="font-serif text-xl sm:text-2xl tracking-tight shrink-0">
              Vélon
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {links.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} className={navLinkCls(pathname === to || pathname.startsWith(to + "/"))}>
                  <Icon className="size-3.5" /> {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={onCreate}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 sm:px-4 min-h-10 py-2 text-xs font-medium text-primary-foreground hover:bg-accent transition touch-target"
            >
              <Plus className="size-3.5" /> <span className="hidden xs:inline">Créer</span>
            </button>
            <span className="hidden xl:inline text-xs text-muted-foreground max-w-[140px] truncate">{email}</span>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-full border border-border min-h-10 min-w-10 p-2 text-xs font-medium hover:bg-muted transition touch-target"
              aria-label="Déconnexion"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Barre de navigation mobile fixée en bas */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-md safe-bottom safe-x pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex items-stretch justify-around gap-0.5 px-1 pt-1">
          {links.map(({ to, label, short, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center justify-center min-h-[52px] py-1.5 rounded-lg text-[10px] font-medium transition ${
                pathname === to || pathname.startsWith(to + "/") ? "text-foreground bg-accent/10" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-5 mb-0.5" />
              <span className="truncate max-w-full px-0.5">{short ?? label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
