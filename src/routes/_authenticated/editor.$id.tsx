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
  GripVertical, Loader2, Plus, Trash2, CopyPlus,
} from "lucide-react";
import { toast } from "sonner";
import { THEMES, SUBTHEMES, resolveTheme, defaultSubtheme, type ThemeKey } from "@/lib/themes";
import { ThemeDecor } from "@/components/ThemeDecor";
import { SECTION_TYPES, createSection, newId, type Section, type SectionKind } from "@/lib/sections";
import { SectionEditor } from "@/components/editor/SectionEditor";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getInvitationById, patchInvitation, hasAnimationSettingsColumn, type Invitation } from "@/lib/invitations";
import { parseAnimationSettings, type InvitationAnimationSettings } from "@/lib/animations";
import { resolveSectionTransitionVariant } from "@/lib/animations";
import { AnimationEditorPanel } from "@/components/editor/AnimationEditorPanel";

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
  const [animationSettings, setAnimationSettings] = useState<InvitationAnimationSettings>(
    parseAnimationSettings(invitation.animation_settings),
  );
  const [animColumnReady, setAnimColumnReady] = useState<boolean | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(invitation.sections[0]?.id ?? null);
  const [showPalette, setShowPalette] = useState(false);
  const [mobilePane, setMobilePane] = useState<"edit" | "preview">("edit");

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const firstRender = useRef(true);

  useEffect(() => {
    hasAnimationSettingsColumn().then(setAnimColumnReady);
  }, []);

  /* ----- autosave (debounced) ----- */
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    setSaveState("saving");
    const t = setTimeout(async () => {
      try {
        await patchInvitation(invitation.id, {
          event_name: eventName, theme, subtheme, sections, language, animation_settings: animationSettings,
        });
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1400);
      } catch (e) {
        toast.error((e as Error).message);
        setSaveState("idle");
      }
    }, 800);
    return () => clearTimeout(t);
  }, [sections, theme, subtheme, eventName, language, animationSettings, invitation.id]);

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
  function duplicateSection(id: string) {
    const src = sections.find((s) => s.id === id);
    if (!src) return;
    const copy = { ...structuredClone(src), id: newId() };
    const idx = sections.findIndex((s) => s.id === id);
    setSections((prev) => [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)]);
    setSelectedId(copy.id);
    toast.success("Section dupliquée");
  }
  function moveSection(id: string, dir: -1 | 1) {
    const idx = sections.findIndex((s) => s.id === id);
    const next = idx + dir;
    if (idx < 0 || next < 0 || next >= sections.length) return;
    setSections(arrayMove(sections, idx, next));
  }

  const subs = SUBTHEMES[theme] ?? [];
  const resolved = useMemo(() => resolveTheme(theme, subtheme), [theme, subtheme]);
  const sectionTransitionVariant = useMemo(() => {
    const v = resolveSectionTransitionVariant(animationSettings);
    return v === "theme" ? undefined : v;
  }, [animationSettings]);

  function copyLink() {
    const url = `${window.location.origin}/invite/${invitation.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Lien copié");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md safe-top">
        <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground shrink-0 touch-target">
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <span className="text-muted-foreground/50 hidden sm:inline">/</span>
            <input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              dir={language === "ar" ? "rtl" : "ltr"}
              className={`bg-transparent font-serif text-base sm:text-lg md:text-xl tracking-tight outline-none min-w-0 flex-1 truncate focus:bg-muted px-2 py-1.5 rounded-lg ${language === "ar" ? "font-arabic" : ""}`}
            />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <SaveIndicator state={saveState} />
            <button onClick={copyLink} className="inline-flex items-center justify-center min-h-10 min-w-10 sm:min-w-0 sm:px-3 sm:py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted touch-target" aria-label="Copier le lien">
              <Copy className="size-4" />
              <span className="hidden sm:inline sm:ml-1.5">Lien</span>
            </button>
            <a href={`/invite/${invitation.slug}`} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 min-h-10 py-2 text-xs font-medium hover:opacity-90 touch-target">
              <ExternalLink className="size-3.5" /> <span className="hidden xs:inline">Aperçu</span>
            </a>
          </div>
        </div>
        <div className="lg:hidden flex border-t border-border">
          <button type="button" onClick={() => setMobilePane("edit")}
            className={`flex-1 min-h-11 text-xs font-medium transition ${mobilePane === "edit" ? "bg-accent/10 text-foreground" : "text-muted-foreground"}`}>
            Éditer
          </button>
          <button type="button" onClick={() => setMobilePane("preview")}
            className={`flex-1 min-h-11 text-xs font-medium transition ${mobilePane === "preview" ? "bg-accent/10 text-foreground" : "text-muted-foreground"}`}>
            Aperçu
          </button>
        </div>
      </header>

      {/* Workspace */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-0">
        {/* Sidebar : sections list + theme */}
        <aside className={`border-r border-border bg-card/30 overflow-y-auto p-4 md:p-5 space-y-5 lg:max-h-[calc(100dvh-4rem)] ${mobilePane === "preview" ? "hidden lg:block" : ""}`}>
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

          <AnimationEditorPanel
            settings={animationSettings}
            onChange={setAnimationSettings}
            themeKey={theme}
            theme={resolved}
            title={eventName}
            hosts={invitation.hosts}
            lang={language}
            persistWarning={animColumnReady === false}
          />

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
              <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <ul className="space-y-1.5">
                    {sections.map((s) => (
                      <SortableRow key={s.id} section={s} selected={selectedId === s.id}
                        onSelect={() => setSelectedId(s.id)} onDelete={() => deleteSection(s.id)} />
                    ))}
                  </ul>
              </SortableContext>
            )}
          </div>

          {/* Editor panel */}
          {selectedId && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Éditer la section</div>
              {(() => {
                const s = sections.find((x) => x.id === selectedId);
                if (!s) return <div className="text-sm text-muted-foreground">Sélectionnez une section.</div>;
                return <SectionEditor section={s} onChange={updateSection} dir={language === "ar" ? "rtl" : "ltr"} />;
              })()}
            </div>
          )}
        </aside>

        {/* Live preview — instant updates, drag sections here too */}
        <main className={`overflow-y-auto bg-muted/30 lg:max-h-[calc(100dvh-4rem)] ${mobilePane === "edit" ? "hidden lg:block" : ""}`}>
          <div className="sticky top-0 z-10 border-b border-border bg-muted/80 backdrop-blur px-4 py-2 text-center">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Aperçu en direct</span>
          </div>
          <div className="p-4 md:p-8">
            <div className="mx-auto max-w-3xl rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border">
              <div
                dir={language === "ar" ? "rtl" : "ltr"}
                lang={language}
                className={`relative ${resolved.pageBg} ${resolved.pageText} ${language === "ar" ? "font-arabic" : resolved.font} min-h-[min(600px,80dvh)] lg:min-h-[600px] overflow-hidden`}
              >
                <ThemeDecor theme={resolved} />
                  <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="relative mx-auto max-w-2xl px-6 py-12">
                      {sections.length === 0 ? (
                        <div className="text-center opacity-60 py-20">
                          <p className="text-sm">Ajoutez votre première section pour commencer.</p>
                        </div>
                      ) : (
                        sections.map((s, i) => (
                          <PreviewSection
                            key={s.id}
                            section={s}
                            index={i}
                            selected={selectedId === s.id}
                            theme={resolved}
                            language={language}
                            onSelect={() => setSelectedId(s.id)}
                            onDelete={() => deleteSection(s.id)}
                            onDuplicate={() => duplicateSection(s.id)}
                            onMoveUp={() => moveSection(s.id, -1)}
                            onMoveDown={() => moveSection(s.id, 1)}
                            canMoveUp={i > 0}
                            canMoveDown={i < sections.length - 1}
                            sectionTransitionVariant={sectionTransitionVariant}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>
              </div>
            </div>
          </div>
        </main>
      </div>
      </DndContext>

      {/* Palette modal */}
      <AnimatePresence>
        {showPalette && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowPalette(false)}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm p-0 sm:p-4">
            <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[92dvh] sm:max-h-[80vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card p-5 sm:p-6 ring-1 ring-border shadow-2xl safe-bottom">
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

function PreviewSection({
  section, index, selected, theme, language, onSelect, onDelete, onDuplicate, onMoveUp, onMoveDown, canMoveUp, canMoveDown, sectionTransitionVariant,
}: {
  section: Section;
  index: number;
  selected: boolean;
  theme: ReturnType<typeof resolveTheme>;
  language: import("@/lib/i18n").Lang;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  sectionTransitionVariant?: import("@/lib/animations").SectionShellVariant;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : undefined };

  return (
    <div ref={setNodeRef} style={style}
      onClick={onSelect}
      className={`group relative rounded-2xl transition mb-1 ${section.hidden ? "opacity-40 border border-dashed border-muted-foreground/40" : ""} ${selected ? "ring-2 ring-accent/70 ring-offset-2 ring-offset-transparent" : "hover:ring-1 hover:ring-accent/30"} cursor-pointer ${isDragging ? "opacity-90 shadow-2xl" : ""}`}>
      {section.hidden && (
        <span className="absolute top-2 right-2 z-10 text-[10px] uppercase tracking-wider bg-muted px-2 py-0.5 rounded-full text-muted-foreground">Masquée</span>
      )}
      {selected && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-0.5 rounded-full border border-border bg-background/95 backdrop-blur px-1 py-0.5 shadow-lg"
          onClick={(e) => e.stopPropagation()}>
          <PreviewToolBtn onClick={onMoveUp} disabled={!canMoveUp} title="Monter"><ChevronUp className="size-3.5" /></PreviewToolBtn>
          <PreviewToolBtn onClick={onMoveDown} disabled={!canMoveDown} title="Descendre"><ChevronDown className="size-3.5" /></PreviewToolBtn>
          <button {...attributes} {...listeners} className="p-1.5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing" title="Déplacer">
            <GripVertical className="size-3.5" />
          </button>
          <PreviewToolBtn onClick={onDuplicate} title="Dupliquer"><CopyPlus className="size-3.5" /></PreviewToolBtn>
          <PreviewToolBtn onClick={onDelete} danger title="Supprimer"><Trash2 className="size-3.5" /></PreviewToolBtn>
        </div>
      )}
      <SectionRenderer section={section} theme={theme} index={index} lang={language} preview sectionTransitionVariant={sectionTransitionVariant} />
    </div>
  );
}

function PreviewToolBtn({ children, onClick, disabled, danger, title }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; danger?: boolean; title?: string;
}) {
  return (
    <button type="button" title={title} disabled={disabled} onClick={onClick}
      className={`p-2.5 sm:p-1.5 rounded-md transition disabled:opacity-30 min-h-10 min-w-10 sm:min-h-0 sm:min-w-0 flex items-center justify-center touch-target ${danger ? "text-destructive hover:bg-destructive/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
      {children}
    </button>
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
