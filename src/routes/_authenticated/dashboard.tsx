// Dashboard : liste les invitations, crée une nouvelle invitation puis ouvre l'éditeur.
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, ExternalLink, LogOut, Pencil, Plus, Trash2, Eye } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { THEMES, SUBTHEMES, defaultSubtheme, type ThemeKey } from "@/lib/themes";
import { createSection } from "@/lib/sections";
import {
  listInvitationsByUser, createInvitation, deleteInvitation,
  type Invitation,
} from "@/lib/invitations";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Vélon" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  const { data: invitations, isLoading, error } = useQuery({
    queryKey: ["invitations", user?.id],
    queryFn: () => listInvitationsByUser(user!.id),
    enabled: !!user,
    staleTime: 60_000,
  });

  const createMut = useMutation({
    mutationFn: async (v: { event_name: string; hosts: string; event_date: string; location: string; theme: ThemeKey; subtheme: string }) => {
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
        sections: [hero],
      });
    },
    onSuccess: (inv) => {
      toast.success("Invitation créée");
      setShowCreate(false);
      queryClient.invalidateQueries({ queryKey: ["invitations", user?.id] });
      navigate({ to: "/editor/$id", params: { id: inv.id } });
    },
    onError: (e: Error) => toast.error(e.message),
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

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="font-serif text-2xl tracking-tight">Vélon</Link>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-xs text-muted-foreground">{user?.email}</span>
            <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-muted transition-colors">
              <LogOut className="size-3.5" /> Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-accent">Dashboard</span>
            <h1 className="mt-3 font-serif text-5xl tracking-tight">Vos invitations</h1>
            <p className="mt-2 text-sm text-muted-foreground">Composez des invitations sur mesure section par section.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-accent transition-colors"
          >
            <Plus className="size-4" /> Nouvelle invitation
          </motion.button>
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
          <p className="mt-2 text-[11px] text-muted-foreground">{inv.sections.length} section{inv.sections.length > 1 ? "s" : ""}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
          <Eye className="size-3" /> {inv.views_count}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link to="/invite/$slug" params={{ slug: inv.slug }} target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted transition-colors">
          <ExternalLink className="size-3.5" /> Voir
        </Link>
        <button onClick={onCopy} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted transition-colors">
          <Copy className="size-3.5" /> Lien
        </button>
        <button onClick={onEdit} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted transition-colors">
          <Pencil className="size-3.5" /> Éditer
        </button>
        <button onClick={onDelete} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

function CreateModal({ onClose, onSubmit, loading }: {
  onClose: () => void;
  loading: boolean;
  onSubmit: (v: { event_name: string; hosts: string; event_date: string; location: string; theme: ThemeKey; subtheme: string }) => void;
}) {
  const [event_name, setEventName] = useState("");
  const [hosts, setHosts] = useState("");
  const [event_date, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [theme, setTheme] = useState<ThemeKey>("wedding");
  const [subtheme, setSubtheme] = useState<string>(defaultSubtheme("wedding"));

  const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/40";
  const subs = SUBTHEMES[theme] ?? [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card p-8 ring-1 ring-border shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-3xl">Nouvelle invitation</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">×</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ event_name, hosts, event_date, location, theme, subtheme }); }}
          className="space-y-3">
          <input required placeholder="Nom de l'événement" className={inputCls} value={event_name} onChange={(e) => setEventName(e.target.value)} />
          <input required placeholder="Hôtes" className={inputCls} value={hosts} onChange={(e) => setHosts(e.target.value)} />
          <input required type="datetime-local" className={inputCls} value={event_date} onChange={(e) => setEventDate(e.target.value)} />
          <input required placeholder="Lieu" className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)} />

          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 mt-2">Thème</div>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
                <button type="button" key={k} onClick={() => { setTheme(k); setSubtheme(defaultSubtheme(k)); }}
                  className={`rounded-xl border px-2 py-3 text-xs flex flex-col items-center gap-1 ${theme === k ? "border-accent bg-accent/5" : "border-border hover:bg-muted"}`}>
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
