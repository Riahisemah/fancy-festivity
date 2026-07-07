import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users, FileText, Eye, TrendingUp, LogIn, Euro, UserCheck, UserX, Clock,
} from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { adminGetStats } from "@/lib/admin/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Tableau de bord" }] }),
  component: AdminDashboard,
});

function StatCard({ label, value, icon: Icon, sub }: {
  label: string; value: string | number; icon: typeof Users; sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card p-6 ring-1 ring-border"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <Icon className="size-4 text-accent" />
      </div>
      <p className="mt-3 font-serif text-4xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </motion.div>
  );
}

function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminGetStats(),
    staleTime: 30_000,
  });

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 pb-24 sm:pb-12">
        <div className="mb-10">
          <span className="text-[11px] uppercase tracking-[0.3em] text-accent">Super Admin</span>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight">Tableau de bord</h1>
          <p className="mt-2 text-sm text-muted-foreground">Vue d&apos;ensemble de la plateforme.</p>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement des statistiques…</p>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {(error as Error).message}
          </div>
        ) : stats ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Utilisateurs" value={stats.total_users} icon={Users} sub={`${stats.active_users} actifs`} />
              <StatCard label="Actifs" value={stats.active_users} icon={UserCheck} />
              <StatCard label="Expirés" value={stats.expired_users} icon={Clock} />
              <StatCard label="Suspendus" value={stats.suspended_users} icon={UserX} />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Invitations totales" value={stats.total_invitations} icon={FileText} />
              <StatCard label="Créées aujourd'hui" value={stats.invitations_today} icon={TrendingUp} />
              <StatCard label="Invitations actives" value={stats.active_invitations} icon={Eye} />
              <StatCard label="Invitations expirées" value={stats.expired_invitations} icon={Clock} />
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              <StatCard label="Connexions aujourd'hui" value={stats.logins_today} icon={LogIn} />
              <StatCard label="Connexions (7 jours)" value={stats.logins_week} icon={LogIn} />
              <StatCard
                label="Revenus"
                value={`${(stats.total_revenue_cents / 100).toFixed(2)} €`}
                icon={Euro}
                sub="Préparé pour intégration paiement"
              />
            </div>

            <section className="rounded-2xl bg-card p-6 ring-1 ring-border">
              <h2 className="font-serif text-2xl mb-4">Invitations les plus consultées</h2>
              {stats.top_invitations.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune donnée.</p>
              ) : (
                <div className="space-y-3">
                  {stats.top_invitations.map((inv, i) => (
                    <div key={inv.id} className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs text-muted-foreground w-5">{i + 1}</span>
                        <span className="truncate font-medium">{inv.event_name}</span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="size-3" /> {inv.views_count}
                        </span>
                        <Link
                          to="/invite/$slug"
                          params={{ slug: inv.slug }}
                          target="_blank"
                          className="text-xs text-accent underline"
                        >
                          Voir
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="mt-8">
              <Link
                to="/admin/users"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-accent transition"
              >
                <Users className="size-4" /> Gestion des utilisateurs
              </Link>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
