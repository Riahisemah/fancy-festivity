import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Key, Ban, CheckCircle, X,
} from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  adminListUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  adminResetPassword,
} from "@/lib/admin/admin.functions";
import type { UserWithDetails, PlanKey, AccountStatus } from "@/lib/saas/types";
import { ACCOUNT_DURATIONS, PUBLICATION_DURATIONS, addMonths } from "@/lib/saas/types";

export const Route = createFileRoute("/_authenticated/admin/users")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Gestion des utilisateurs" }] }),
  component: AdminUsers,
});

function AdminUsers() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<UserWithDetails | null>(null);
  const [resetUser, setResetUser] = useState<UserWithDetails | null>(null);

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminListUsers(),
    staleTime: 30_000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminDeleteUser({ data: id }),
    onSuccess: () => { toast.success("Utilisateur supprimé"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const suspendMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AccountStatus }) =>
      adminUpdateUser({ data: { user_id: id, status } }),
    onSuccess: () => { toast.success("Statut mis à jour"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  function statusBadge(status: AccountStatus) {
    const map = {
      active: "bg-green-50 text-green-700",
      suspended: "bg-amber-50 text-amber-700",
      expired: "bg-red-50 text-red-700",
    };
    const labels = { active: "Actif", suspended: "Suspendu", expired: "Expiré" };
    return (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest ${map[status]}`}>
        {labels[status]}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 pb-24 sm:pb-12">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-accent">Super Admin</span>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight">Gestion des utilisateurs</h1>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-accent transition"
          >
            <Plus className="size-4" /> Créer un utilisateur
          </button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {(error as Error).message}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl ring-1 ring-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left p-4 font-medium">Nom</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Plan</th>
                  <th className="text-left p-4 font-medium">Invitations</th>
                  <th className="text-left p-4 font-medium">Expiration</th>
                  <th className="text-left p-4 font-medium">Statut</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(users ?? []).map((u) => {
                  const max = u.limits?.max_invitations ?? u.subscription?.plan?.max_invitations;
                  return (
                    <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="p-4 font-medium">{u.full_name || "—"}</td>
                      <td className="p-4 text-muted-foreground">{u.email}</td>
                      <td className="p-4">{u.subscription?.plan?.name ?? "—"}</td>
                      <td className="p-4">
                        {u.invitations_count}{max !== null && max !== undefined ? ` / ${max}` : " / ∞"}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {u.subscription?.expires_at
                          ? new Date(u.subscription.expires_at).toLocaleDateString("fr-FR")
                          : "—"}
                      </td>
                      <td className="p-4">{statusBadge(u.status)}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setEditing(u)} title="Modifier" className="p-2 rounded-lg hover:bg-muted">
                            <Pencil className="size-3.5" />
                          </button>
                          <button onClick={() => setResetUser(u)} title="Réinitialiser mot de passe" className="p-2 rounded-lg hover:bg-muted">
                            <Key className="size-3.5" />
                          </button>
                          {u.status === "active" ? (
                            <button
                              onClick={() => suspendMut.mutate({ id: u.id, status: "suspended" })}
                              title="Suspendre"
                              className="p-2 rounded-lg hover:bg-muted text-amber-600"
                            >
                              <Ban className="size-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => suspendMut.mutate({ id: u.id, status: "active" })}
                              title="Réactiver"
                              className="p-2 rounded-lg hover:bg-muted text-green-600"
                            >
                              <CheckCircle className="size-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => { if (confirm("Supprimer cet utilisateur ?")) deleteMut.mutate(u.id); }}
                            title="Supprimer"
                            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!users?.length && (
              <p className="p-8 text-center text-sm text-muted-foreground">Aucun utilisateur client.</p>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {showCreate && (
          <UserFormModal
            title="Créer un utilisateur"
            onClose={() => setShowCreate(false)}
            onSubmit={async (data) => {
              await adminCreateUser({ data });
              toast.success("Utilisateur créé");
              setShowCreate(false);
              invalidate();
            }}
          />
        )}
        {editing && (
          <UserFormModal
            title="Modifier l'utilisateur"
            user={editing}
            onClose={() => setEditing(null)}
            onSubmit={async (data) => {
              await adminUpdateUser({ data: { user_id: editing.id, ...data } });
              toast.success("Utilisateur mis à jour");
              setEditing(null);
              invalidate();
            }}
          />
        )}
        {resetUser && (
          <ResetPasswordModal user={resetUser} onClose={() => setResetUser(null)} onSuccess={invalidate} />
        )}
      </AnimatePresence>
    </div>
  );
}

function UserFormModal({
  title,
  user,
  onClose,
  onSubmit,
}: {
  title: string;
  user?: UserWithDetails;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [planKey, setPlanKey] = useState<PlanKey>(user?.subscription?.plan?.key ?? "bronze");
  const [maxInvitations, setMaxInvitations] = useState<string>(
    String(user?.limits?.max_invitations ?? user?.subscription?.plan?.max_invitations ?? ""),
  );
  const [durationMonths, setDurationMonths] = useState(12);
  const [customExpiry, setCustomExpiry] = useState(
    user?.subscription?.expires_at?.slice(0, 10) ?? addMonths(new Date(), 12).toISOString().slice(0, 10),
  );
  const [useCustomDate, setUseCustomDate] = useState(!!user);
  const [pubDays, setPubDays] = useState<number | null>(
    user?.subscription?.default_publication_days ?? 30,
  );

  const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/40";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const expiresAt = useCustomDate
        ? new Date(customExpiry).toISOString()
        : addMonths(new Date(), durationMonths).toISOString();

      const payload: Record<string, unknown> = {
        full_name: fullName,
        email,
        plan_key: planKey,
        max_invitations: maxInvitations === "" ? null : Number(maxInvitations),
        expires_at: expiresAt,
        default_publication_days: pubDays,
      };
      if (!user) payload.password = password;
      await onSubmit(payload);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-card p-8 ring-1 ring-border shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl">{title}</h2>
          <button onClick={onClose}><X className="size-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input required placeholder="Nom complet" className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input required type="email" placeholder="Email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
          {!user && (
            <input required type="password" placeholder="Mot de passe" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />
          )}

          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Plan</label>
            <select className={inputCls + " mt-1"} value={planKey} onChange={(e) => setPlanKey(e.target.value as PlanKey)}>
              <option value="bronze">Bronze (5 invitations)</option>
              <option value="silver">Silver (20 invitations)</option>
              <option value="gold">Gold (50 invitations)</option>
              <option value="unlimited">Unlimited (∞)</option>
            </select>
          </div>

          <input type="number" placeholder="Quota max invitations (vide = plan)" className={inputCls}
            value={maxInvitations} onChange={(e) => setMaxInvitations(e.target.value)} min={0} />

          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Durée du compte</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {ACCOUNT_DURATIONS.map((d) => (
                <button key={d.months} type="button"
                  onClick={() => { setUseCustomDate(false); setDurationMonths(d.months); }}
                  className={`rounded-lg border px-3 py-1.5 text-xs ${!useCustomDate && durationMonths === d.months ? "border-accent bg-accent/5" : "border-border"}`}>
                  {d.label}
                </button>
              ))}
              <button type="button" onClick={() => setUseCustomDate(true)}
                className={`rounded-lg border px-3 py-1.5 text-xs ${useCustomDate ? "border-accent bg-accent/5" : "border-border"}`}>
                Date personnalisée
              </button>
            </div>
            {useCustomDate && (
              <input type="date" className={inputCls + " mt-2"} value={customExpiry} onChange={(e) => setCustomExpiry(e.target.value)} />
            )}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Publication par défaut</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PUBLICATION_DURATIONS.map((d) => (
                <button key={String(d.days)} type="button" onClick={() => setPubDays(d.days)}
                  className={`rounded-lg border px-3 py-1.5 text-xs ${pubDays === d.days ? "border-accent bg-accent/5" : "border-border"}`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button disabled={loading} type="submit"
            className="w-full mt-4 rounded-full bg-primary text-primary-foreground py-3.5 text-sm font-medium disabled:opacity-60">
            {loading ? "Enregistrement…" : user ? "Mettre à jour" : "Créer le compte"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ResetPasswordModal({
  user,
  onClose,
  onSuccess,
}: {
  user: UserWithDetails;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-card p-8 ring-1 ring-border shadow-2xl">
        <h2 className="font-serif text-2xl mb-2">Réinitialiser le mot de passe</h2>
        <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
        <input type="password" placeholder="Nouveau mot de passe" minLength={6}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm mb-4"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button
          disabled={loading || password.length < 6}
          onClick={async () => {
            setLoading(true);
            try {
              await adminResetPassword({ data: { user_id: user.id, password } });
              toast.success("Mot de passe réinitialisé");
              onSuccess();
              onClose();
            } catch (e) {
              toast.error((e as Error).message);
            } finally {
              setLoading(false);
            }
          }}
          className="w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-medium disabled:opacity-60"
        >
          {loading ? "…" : "Confirmer"}
        </button>
      </motion.div>
    </motion.div>
  );
}
