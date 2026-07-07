import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useAuth } from "@/lib/auth-context";
import { getInvitationQuota } from "@/lib/saas/subscriptions";
import { listInvitationsByUser } from "@/lib/invitations";
import { isInvitationPublished } from "@/lib/saas/types";
import { useNavigate } from "@tanstack/react-router";
import { COMMERCIAL_PACKS } from "@/lib/templates/marketplace";

export const Route = createFileRoute("/_authenticated/profile")({
  ssr: false,
  head: () => ({ meta: [{ title: "Mon profil — Vélon" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, subscription, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: quota } = useQuery({
    queryKey: ["quota", user?.id],
    queryFn: () => getInvitationQuota(user!.id),
    enabled: !!user,
  });

  const { data: invitations } = useQuery({
    queryKey: ["invitations", user?.id],
    queryFn: () => listInvitationsByUser(user!.id),
    enabled: !!user,
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await logout();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav email={user?.email} onSignOut={handleSignOut} onCreate={() => navigate({ to: "/dashboard", search: { create: true } })} />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12 pb-24 md:pb-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[11px] uppercase tracking-[0.3em] text-accent">Profil</span>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight">Mon compte</h1>
        </motion.div>

        <div className="mt-10 space-y-6">
          <section className="rounded-2xl bg-card p-6 ring-1 ring-border">
            <h2 className="font-serif text-xl mb-4">Informations</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Nom</dt>
                <dd className="font-medium">{profile?.full_name || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium text-right break-all max-w-[60%]">{user?.email}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl bg-card p-6 ring-1 ring-border">
            <h2 className="font-serif text-xl mb-4">Abonnement</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Plan</dt>
                <dd className="font-medium">{subscription?.plan?.name ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Invitations utilisées</dt>
                <dd className="font-medium">
                  {quota?.used ?? 0}
                  {quota?.max !== null && quota?.max !== undefined ? ` / ${quota.max}` : " / ∞"}
                </dd>
              </div>
              {quota?.remaining !== null && quota?.remaining !== undefined && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Restantes</dt>
                  <dd className="font-medium">{quota.remaining}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Expiration du compte</dt>
                <dd className="font-medium">
                  {subscription?.expires_at
                    ? new Date(subscription.expires_at).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "long", year: "numeric",
                      })
                    : "—"}
                </dd>
              </div>
            </dl>
          </section>

          {invitations && invitations.length > 0 && (
            <section className="rounded-2xl bg-card p-6 ring-1 ring-border">
              <h2 className="font-serif text-xl mb-4">Expiration des invitations</h2>
              <div className="space-y-2">
                {invitations.map((inv) => (
                  <div key={inv.id} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                    <span className="truncate mr-4">{inv.event_name}</span>
                    <span className={`shrink-0 text-xs ${isInvitationPublished(inv.published_until) ? "text-muted-foreground" : "text-destructive"}`}>
                      {inv.published_until
                        ? isInvitationPublished(inv.published_until)
                          ? `Expire le ${new Date(inv.published_until).toLocaleDateString("fr-FR")}`
                          : "Expirée"
                        : "Illimitée"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl bg-card p-6 ring-1 ring-border">
            <h2 className="font-serif text-xl mb-2">Nos offres</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Choisissez le pack adapté à vos événements. Contactez-nous pour passer à un plan supérieur.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(COMMERCIAL_PACKS).map(([key, pack]) => {
                const isCurrent = subscription?.plan?.key === key;
                return (
                  <div
                    key={key}
                    className={`rounded-xl border p-4 ${isCurrent ? "border-accent bg-accent/5 ring-1 ring-accent/30" : "border-border"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif text-lg">{pack.name}</h3>
                      {isCurrent && (
                        <span className="text-[10px] uppercase tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                          Actuel
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {pack.invitations} invitation{typeof pack.invitations === "number" && pack.invitations > 1 ? "s" : ""}
                      {" · "}
                      {pack.templates} templates
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {pack.features.map((f) => (
                        <li key={f} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-accent mt-0.5">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
