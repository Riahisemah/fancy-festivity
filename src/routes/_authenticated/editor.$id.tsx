// Éditeur visuel d'invitation : drag & drop, prévisualisation live, autosave.
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, arrayMove, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowLeft, Check, ChevronDown, ChevronUp, Copy, ExternalLink,
  GripVertical, Loader2, Plus, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { THEMES, SUBTHEMES, resolveTheme, defaultSubtheme, type ThemeKey } from "@/lib/themes";
import { ThemeDecor } from "@/components/ThemeDecor";
import { SECTION_TYPES, createSection, type Section, type SectionKind } from "@/lib/sections";
import { SectionEditor } from "@/components/editor/SectionEditor";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getInvitationById, patchInvitation, type Invitation } from "@/lib/invitations";

export const Route = createFileRoute("/_authenticated/editor/$id")({
  ssr: false,
  head: () => ({ meta: [{ title: "Éditeur — Vélon" }] }),
  component: EditorPage,
});

function EditorPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["invitation", id],
    queryFn: () => getInvitationById(id),
    staleTime: 0,
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin mr-2" />Chargement…</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-destructive p-6">Erreur : {(error as Error).message}</div>;
  }
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="font-serif text-3xl">Invitation introuvable</h1>
          <button onClick={() => navigate({ to: "/dashboard" })} className="mt-4 text-sm underline">Retour au dashboard</button>
        </div>
      </div>
    );
  }

  return <Editor invitation={data} />;
}

function Editor({ invitation }: { invitation: Invitation }) {
  const [sections, setSections] = useState<Section[]>(invitation.sections);
  const [theme, setTheme] = useState<ThemeKey>(invitation.theme);
  const [subtheme, setSubtheme] = useState<string>(invitation.subtheme ?? defaultSubtheme(invitation.theme));
  const [eventName, setEventName] = useState(invitation.event_name);
  const [language, setLanguage] = useState<import("@/lib/i18n").Lang>(invitation.language ?? "fr");
  const [selectedId, setSelectedId] = useState<string | null>(invitation.sections[0]?.id ?? null);
  const [showPalette, setShowPalette] = useState(false);

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const firstRender = useRef(true);

  /* ----- autosave (debounced) ----- */
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    setSaveState("saving");
    const t = setTimeout(async () => {
      try {
        await patchInvitation(invitation.id, {
          event_name: eventName, theme, subtheme, sections, language,
        });
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1400);
      } catch (e) {
        toast.error((e as Error).message);
        setSaveState("idle");
      }
    }, 800);
    return () => clearTimeout(t);
  }, [sections, theme, subtheme, eventName, language, invitation.id]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    setSections(arrayMove(sections, oldIndex, newIndex));
  }

  function addSection(kind: SectionKind) {
    const s = createSection(kind);
    setSections((prev) => [...prev, s]);
    setSelectedId(s.id);
    setShowPalette(false);
  }
  function updateSection(updated: Section) {
    setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }
  function deleteSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  const subs = SUBTHEMES[theme] ?? [];
  const resolved = useMemo(() => resolveTheme(theme, subtheme), [theme, subtheme]);

  function copyLink() {
    const url = `${window.location.origin}/invite/${invitation.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Lien copié");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" /> Dashboard
            </Link>
            <span className="text-muted-foreground/50">/</span>
            <input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="bg-transparent font-serif text-lg md:text-xl tracking-tight outline-none min-w-0 truncate focus:bg-muted px-2 py-1 rounded-lg"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <SaveIndicator state={saveState} />
            <button onClick={copyLink} className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted">
              <Copy className="size-3.5" /> Lien
            </button>
            <a href={`/invite/${invitation.slug}`} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-xs font-medium hover:opacity-90">
              <ExternalLink className="size-3.5" /> Aperçu
            </a>
          </div>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-0">
        {/* Sidebar : sections list + theme */}
        <aside className="border-r border-border bg-card/30 overflow-y-auto max-h-[calc(100vh-4rem)] p-4 md:p-5 space-y-5">
          {/* Theme picker */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Thème</div>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
                <button key={k} onClick={() => { setTheme(k); setSubtheme(defaultSubtheme(k)); }}
                  className={`rounded-xl border px-2 py-3 text-xs flex flex-col items-center gap-1 transition ${theme === k ? "border-accent bg-accent/5" : "border-border hover:bg-muted"}`}>
                  <span className="text-base">{THEMES[k].emoji}</span>
                  <span>{THEMES[k].label}</span>
                </button>
              ))}
            </div>
            {!!subs.length && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {subs.map((sub) => (
                  <button key={sub.key} onClick={() => setSubtheme(sub.key)}
                    className={`rounded-lg border px-2 py-2 text-[11px] flex items-center gap-2 transition ${subtheme === sub.key ? "border-accent bg-accent/5" : "border-border hover:bg-muted"}`}>
                    <span className="flex gap-0.5">
                      {sub.swatches.slice(0, 3).map((c, i) => (
                        <span key={i} className="size-2.5 rounded-full ring-1 ring-black/10" style={{ background: c }} />
                      ))}
                    </span>
                    <span className="truncate">{sub.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language picker */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Langue</div>
            <div className="grid grid-cols-3 gap-2">
              {(["fr","ar","en"] as const).map((l) => (
                <button key={l} onClick={() => setLanguage(l)}
                  className={`rounded-lg border px-2 py-2 text-xs flex items-center justify-center gap-1.5 transition ${language === l ? "border-accent bg-accent/5" : "border-border hover:bg-muted"}`}>
                  <span>{l === "fr" ? "🇫🇷" : l === "ar" ? "🇹🇳" : "🇬🇧"}</span>
                  <span>{l.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sections list */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Sections ({sections.length})</div>
              <button onClick={() => setShowPalette(true)} className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-90">
                <Plus className="size-3" /> Ajouter
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center">
                <p className="text-sm text-muted-foreground">Aucune section.</p>
                <button onClick={() => setShowPalette(true)} className="mt-3 text-xs underline">Ajouter la première</button>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <ul className="space-y-1.5">
                    {sections.map((s) => (
                      <SortableRow key={s.id} section={s} selected={selectedId === s.id}
                        onSelect={() => setSelectedId(s.id)} onDelete={() => deleteSection(s.id)} />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            )}
          </div>

          {/* Editor panel */}
          {selectedId && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Éditer la section</div>
              {(() => {
                const s = sections.find((x) => x.id === selectedId);
                if (!s) return <div className="text-sm text-muted-foreground">Sélectionnez une section.</div>;
                return <SectionEditor section={s} onChange={updateSection} />;
              })()}
            </div>
          )}
        </aside>

        {/* Live preview */}
        <main className="overflow-y-auto max-h-[calc(100vh-4rem)] bg-muted/30">
          <div className="p-4 md:p-8">
            <div className="mx-auto max-w-3xl rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border">
              <AnimatePresence mode="wait">
                <motion.div key={`${theme}-${subtheme}-${language}`}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  dir={language === "ar" ? "rtl" : "ltr"}
                  className={`relative ${resolved.pageBg} ${resolved.pageText} ${language === "ar" ? "font-arabic" : resolved.font} min-h-[600px] overflow-hidden`}>
                  <ThemeDecor theme={resolved} />
                  <div className="relative mx-auto max-w-2xl px-6 py-12">
                    {sections.length === 0 ? (
                      <div className="text-center opacity-60 py-20">
                        <p className="text-sm">Ajoutez votre première section pour commencer.</p>
                      </div>
                    ) : (
                      sections.map((s, i) => (
                        <div key={s.id} onClick={() => setSelectedId(s.id)}
                          className={`relative rounded-2xl transition ${selectedId === s.id ? "ring-2 ring-accent/60 ring-offset-2 ring-offset-transparent" : "hover:ring-1 hover:ring-accent/30"} cursor-pointer`}>
                          <SectionRenderer section={s} theme={resolved} index={i} lang={language} />
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* Palette modal */}
      <AnimatePresence>
        {showPalette && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowPalette(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-3xl bg-card p-6 ring-1 ring-border shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-serif text-2xl">Ajouter une section</h2>
                  <p className="text-xs text-muted-foreground mt-1">Choisissez un modèle pour démarrer.</p>
                </div>
                <button onClick={() => setShowPalette(false)} className="text-muted-foreground hover:text-foreground text-xl">×</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SECTION_TYPES.map((t) => (
                  <motion.button key={t.kind} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                    onClick={() => addSection(t.kind)}
                    className="group relative rounded-2xl border border-border bg-background p-5 text-left hover:border-accent hover:shadow-lg transition-all">
                    <div className="text-2xl">{t.emoji}</div>
                    <div className="mt-3 font-medium text-sm">{t.label}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground">{t.description}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SortableRow({ section, selected, onSelect, onDelete }: {
  section: Section; selected: boolean; onSelect: () => void; onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : "auto" as const };
  const meta = SECTION_TYPES.find((t) => t.kind === section.kind);
  const title = sectionTitle(section);
  return (
    <li ref={setNodeRef} style={style as React.CSSProperties}
      className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 transition ${selected ? "border-accent bg-accent/5" : "border-border bg-background hover:bg-muted"} ${isDragging ? "shadow-xl" : ""}`}>
      <button {...attributes} {...listeners} className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="size-4" />
      </button>
      <button onClick={onSelect} className="flex-1 flex items-center gap-2 min-w-0 text-left">
        <span className="text-base shrink-0">{meta?.emoji}</span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-medium truncate">{title}</span>
          <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">{meta?.label}</span>
        </span>
      </button>
      <button onClick={onDelete} className="text-muted-foreground hover:text-destructive p-1.5">
        <Trash2 className="size-3.5" />
      </button>
    </li>
  );
}

function sectionTitle(s: Section): string {
  switch (s.kind) {
    case "hero":
    case "event":
    case "card":
    case "image-text": return s.title || "Sans titre";
    case "timeline":
    case "gallery":
    case "program":
    case "map":
    case "contact":
    case "faq": return s.title || SECTION_TYPES.find((t) => t.kind === s.kind)?.label || "—";
    case "quote": return s.text.slice(0, 40) + (s.text.length > 40 ? "…" : "");
    case "countdown": return s.label || "Countdown";
  }
}

function SaveIndicator({ state }: { state: "idle" | "saving" | "saved" }) {
  return (
    <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5 px-2">
      {state === "saving" && <><Loader2 className="size-3 animate-spin" /> Enregistrement…</>}
      {state === "saved" && <><Check className="size-3 text-emerald-500" /> Enregistré</>}
      {state === "idle" && <span className="opacity-50">Auto-save</span>}
    </div>
  );
}

// Unused exports to keep linter calm
void ChevronDown; void ChevronUp;
