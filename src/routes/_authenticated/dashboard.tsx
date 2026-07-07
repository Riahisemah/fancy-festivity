// Dashboard : liste les invitations, crée une nouvelle invitation puis ouvre l'éditeur.
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, ExternalLink, Pencil, Plus, Trash2, Eye } from "lucide-react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useAuth } from "@/lib/auth-context";
import { getInvitationQuota } from "@/lib/saas/subscriptions";
import { isInvitationPublished } from "@/lib/saas/types";
import { THEMES, SUBTHEMES, defaultSubtheme, type ThemeKey } from "@/lib/themes";
import { createSection } from "@/lib/sections";
import { LANGUAGES, type Lang } from "@/lib/i18n";
import {
  listInvitationsByUser, createInvitation, deleteInvitation,
  type Invitation,
} from "@/lib/invitations";

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    create: s.create === true || s.create === "true",
  }),
  head: () => ({ meta: [{ title: "Dashboard — Vélon" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user, logout, subscription } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (search.create) setShowCreate(true);
  }, [search.create]);

  const { data: quota } = useQuery({
    queryKey: ["quota", user?.id],
    queryFn: () => getInvitationQuota(user!.id),
    enabled: !!user,
  });

  const { data: invitations, isLoading, error } = useQuery({
    queryKey: ["invitations", user?.id],
    queryFn: () => listInvitationsByUser(user!.id),
    enabled: !!user,
    staleTime: 60_000,
  });

  const createMut = useMutation({
    mutationFn: async (v: { event_name: string; hosts: string; event_date: string; location: string; theme: ThemeKey; subtheme: string; language: Lang }) => {
      // Pré-remplir avec un Hero pour démarrer
      const hero = createSection("hero");
      if (hero.kind === "hero") {
        hero.title = v.event_name;
        hero.subtitle = v.hosts;
        hero.date = v.event_date ? new Date(v.event_date).toISOString() : "";
        hero.location = v.location;
      }
      return createInvitation(user!.id, {
        event_name: v.event_name,
        hosts: v.hosts,
        event_date: new Date(v.event_date).toISOString(),
        location: v.location,
        theme: v.theme,
        subtheme: v.subtheme,
        language: v.language,
        sections: [hero],
      }, {
        publication_days: subscription?.default_publication_days ?? 30,
      });
    },
    onSuccess: (inv) => {
      toast.success("Invitation créée");
      setShowCreate(false);
      queryClient.invalidateQueries({ queryKey: ["invitations", user?.id] });
      navigate({ to: "/editor/$id", params: { id: inv.id } });
    },
    onError: (e: Error) => {
      const msg = e.message.includes("row-level security") || e.message.includes("can_create")
        ? "Limite d'invitations atteinte pour votre abonnement."
        : e.message;
      toast.error(msg);
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteInvitation(id),
    onSuccess: () => {
      toast.success("Supprimée");
      queryClient.invalidateQueries({ queryKey: ["invitations", user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await logout();
    navigate({ to: "/auth", replace: true });
  }

  function copyLink(slug: string) {
    const url = `${window.location.origin}/invite/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Lien copié");
  }

  function handleCreate() {
    if (quota && quota.remaining !== null && quota.remaining <= 0) {
      toast.error("Limite d'invitations atteinte pour votre abonnement. Contactez l'administrateur.");
      return;
    }
    setShowCreate(true);
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav
        email={user?.email}
        onSignOut={handleSignOut}
        onCreate={handleCreate}
      />

      {quota && quota.max !== null && (
        <div className="mx-auto max-w-7xl px-6 pt-4">
          <p className="text-xs text-muted-foreground">
            Invitations : {quota.used} / {quota.max} utilisées
            {quota.remaining !== null && quota.remaining <= 2 && quota.remaining > 0 && (
              <span className="text-amber-600 ml-2">({quota.remaining} restante{quota.remaining > 1 ? "s" : ""})</span>
            )}
          </p>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 pb-24 md:pb-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-accent">Dashboard</span>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight">Vos invitations</h1>
            <p className="mt-2 text-sm text-muted-foreground">Composez des invitations sur mesure section par section.</p>
            <Link to="/templates" className="mt-3 inline-block text-sm text-accent underline underline-offset-4 hover:opacity-80">
              Parcourir les templates tunisiens →
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link to="/templates"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors">
              Templates
            </Link>
            <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-accent transition-colors"
          >
            <Plus className="size-4" /> Nouvelle invitation
          </motion.button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="text-muted-foreground text-sm">Chargement…</div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            Erreur : {(error as Error).message}
          </div>
        ) : !invitations?.length ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="rounded-3xl border border-dashed border-border p-16 text-center">
            <p className="font-serif text-3xl">Aucune invitation pour le moment</p>
            <p className="mt-2 text-sm text-muted-foreground">Lancez votre première création.</p>
            <button onClick={() => setShowCreate(true)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
              <Plus className="size-4" /> Nouvelle invitation
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((inv, idx) => (
              <Card key={inv.id} inv={inv} index={idx} onDelete={() => { if (confirm("Supprimer cette invitation ?")) deleteMut.mutate(inv.id); }}
                onCopy={() => copyLink(inv.slug)} onEdit={() => navigate({ to: "/editor/$id", params: { id: inv.id } })} />
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {showCreate && (
          <CreateModal onClose={() => setShowCreate(false)} loading={createMut.isPending}
            onSubmit={(v) => createMut.mutate(v)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Card({ inv, index, onDelete, onCopy, onEdit }: {
  inv: Invitation; index: number; onDelete: () => void; onCopy: () => void; onEdit: () => void;
}) {
  const theme = THEMES[inv.theme];
  const sub = SUBTHEMES[inv.theme]?.find((s) => s.key === inv.subtheme);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-3xl bg-card p-6 ring-1 ring-border transition-all hover:shadow-2xl hover:shadow-ink/5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-2xl">{theme.emoji}</div>
          <h3 className="mt-3 font-serif text-2xl truncate">{inv.event_name}</h3>
          <p className="mt-1 text-sm text-muted-foreground truncate">{inv.hosts}</p>
          {sub && (
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              {sub.emoji} {sub.label}
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            {new Date(inv.event_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · {inv.location}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">{inv.sections.length} section{inv.sections.length > 1 ? "s" : ""}</p>
          {inv.published_until && (
            <p className={`mt-1 text-[10px] ${isInvitationPublished(inv.published_until) ? "text-muted-foreground" : "text-destructive"}`}>
              {isInvitationPublished(inv.published_until)
                ? `Publiée jusqu'au ${new Date(inv.published_until).toLocaleDateString("fr-FR")}`
                : "Publication expirée"}
            </p>
          )}
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
          <Eye className="size-3" /> {inv.views_count}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link to="/invite/$slug" params={{ slug: inv.slug }} target="_blank"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 min-h-10 text-xs font-medium hover:bg-muted transition-colors">
          <ExternalLink className="size-3.5" /> Voir
        </Link>
        <button onClick={onCopy} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 min-h-10 text-xs font-medium hover:bg-muted transition-colors">
          <Copy className="size-3.5" /> Lien
        </button>
        <button onClick={onEdit} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 min-h-10 text-xs font-medium hover:bg-muted transition-colors">
          <Pencil className="size-3.5" /> Éditer
        </button>
        <button onClick={onDelete} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 min-h-10 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

function CreateModal({ onClose, onSubmit, loading }: {
  onClose: () => void;
  loading: boolean;
  onSubmit: (v: { event_name: string; hosts: string; event_date: string; location: string; theme: ThemeKey; subtheme: string; language: Lang }) => void;
}) {
  const [event_name, setEventName] = useState("");
  const [hosts, setHosts] = useState("");
  const [event_date, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [theme, setTheme] = useState<ThemeKey>("wedding");
  const [subtheme, setSubtheme] = useState<string>(defaultSubtheme("wedding"));
  const [language, setLanguage] = useState<Lang>("fr");

  const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/40";
  const subs = SUBTHEMES[theme] ?? [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm p-0 sm:p-4">
      <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card p-5 sm:p-8 ring-1 ring-border shadow-2xl safe-bottom">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl">Nouvelle invitation</h2>
          <button onClick={onClose} className="min-h-10 min-w-10 flex items-center justify-center text-muted-foreground hover:text-foreground text-xl touch-target" aria-label="Fermer">×</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ event_name, hosts, event_date, location, theme, subtheme, language }); }}
          className="space-y-3">
          <input required placeholder="Nom de l'événement" className={inputCls} value={event_name} onChange={(e) => setEventName(e.target.value)} />
          <input required placeholder="Hôtes" className={inputCls} value={hosts} onChange={(e) => setHosts(e.target.value)} />
          <input required type="datetime-local" className={inputCls} value={event_date} onChange={(e) => setEventDate(e.target.value)} />
          <input required placeholder="Lieu" className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)} />

          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 mt-2">Langue</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LANGUAGES.map((l) => (
                <button type="button" key={l.code} onClick={() => setLanguage(l.code)}
                  className={`rounded-xl border px-2 py-3 min-h-11 text-xs flex items-center justify-center gap-1.5 ${language === l.code ? "border-accent bg-accent/5" : "border-border hover:bg-muted"}`}>
                  <span>{l.flag}</span><span>{l.native}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 mt-2">Thème</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
                <button type="button" key={k} onClick={() => { setTheme(k); setSubtheme(defaultSubtheme(k)); }}
                  className={`rounded-xl border px-2 py-3 min-h-11 text-xs flex flex-col items-center justify-center gap-1 ${theme === k ? "border-accent bg-accent/5" : "border-border hover:bg-muted"}`}>
                  <span className="text-base">{THEMES[k].emoji}</span>{THEMES[k].label}
                </button>
              ))}
            </div>
            {!!subs.length && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {subs.map((sub) => (
                  <button type="button" key={sub.key} onClick={() => setSubtheme(sub.key)}
                    className={`rounded-lg border px-2 py-2 text-[11px] flex items-center gap-2 ${subtheme === sub.key ? "border-accent bg-accent/5" : "border-border hover:bg-muted"}`}>
                    <span className="flex gap-0.5">
                      {sub.swatches.slice(0, 3).map((c, i) => (<span key={i} className="size-2.5 rounded-full ring-1 ring-black/10" style={{ background: c }} />))}
                    </span>
                    <span className="truncate">{sub.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button disabled={loading} type="submit"
            className="w-full mt-3 rounded-full bg-primary text-primary-foreground py-3.5 text-sm font-medium disabled:opacity-60">
            {loading ? "Création…" : "Créer et ouvrir l'éditeur"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
