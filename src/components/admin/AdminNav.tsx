import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Users, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useQueryClient } from "@tanstack/react-query";

const ADMIN_LINKS = [
  { to: "/admin/dashboard" as const, label: "Tableau de bord", short: "Stats", icon: LayoutDashboard },
  { to: "/admin/users" as const, label: "Utilisateurs", short: "Users", icon: Users },
];

export function AdminNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout, isDevSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await logout();
    navigate({ to: "/auth", replace: true });
  }

  const linkCls = (active: boolean) =>
    `flex-1 flex flex-col items-center justify-center min-h-[52px] py-1.5 rounded-lg text-[10px] font-medium transition ${
      active ? "text-foreground bg-accent/10" : "text-muted-foreground"
    }`;

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md safe-top safe-x">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <Link to="/admin/dashboard" className="font-serif text-xl sm:text-2xl tracking-tight shrink-0">
              Vélon <span className="text-accent text-xs sm:text-sm">Admin</span>
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              {ADMIN_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 min-h-10 py-2 text-xs font-medium transition ${
                    pathname === to ? "bg-accent/10 text-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="size-3.5" /> {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isDevSuperAdmin && (
              <span className="hidden md:inline text-[10px] uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded">
                Dev
              </span>
            )}
            <Link to="/dashboard" className="hidden sm:inline text-xs text-muted-foreground hover:text-foreground underline">
              Vue client
            </Link>
            <span className="hidden lg:inline text-xs text-muted-foreground max-w-[120px] truncate">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-full border border-border min-h-10 min-w-10 p-2 hover:bg-muted transition touch-target"
              aria-label="Déconnexion"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </nav>

      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-md safe-x pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex items-stretch justify-around gap-1 px-2 pt-1">
          {ADMIN_LINKS.map(({ to, short, icon: Icon }) => (
            <Link key={to} to={to} className={linkCls(pathname === to)}>
              <Icon className="size-5 mb-0.5" />
              <span>{short}</span>
            </Link>
          ))}
          <Link to="/dashboard" className={linkCls(false)}>
            <LayoutDashboard className="size-5 mb-0.5" />
            <span>Client</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
