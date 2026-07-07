import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Wand2 } from "lucide-react";
import { EVENT_CATEGORIES, INVITATION_TONES } from "@/lib/templates/texts";
import type { EventCategory, InvitationTone } from "@/lib/templates/texts/types";
import type { Lang } from "@/lib/i18n";
import { LANGUAGES } from "@/lib/i18n";
import { generateInvitationFromWizard } from "@/lib/wizard/generate-invitation";

export function AIInvitationWizard({
  open,
  onClose,
  onGenerated,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onGenerated: (result: ReturnType<typeof generateInvitationFromWizard>) => void;
  loading?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<EventCategory>("wedding");
  const [eventName, setEventName] = useState("");
  const [hosts, setHosts] = useState("");
  const [city, setCity] = useState("Tunis");
  const [eventDate, setEventDate] = useState("");
  const [style, setStyle] = useState<InvitationTone>("classic");
  const [language, setLanguage] = useState<Lang>("bilingual");
  const [sectionLevel, setSectionLevel] = useState<"minimal" | "standard" | "complete">("standard");

  const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-accent/40";

  function handleGenerate() {
    const result = generateInvitationFromWizard({
      category,
      eventName: eventName || "Notre événement",
      hosts: hosts || "Famille & Amis",
      city,
      eventDate,
      style,
      language,
      sectionLevel,
    });
    onGenerated(result);
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/50 backdrop-blur-sm p-0 sm:p-4">
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card p-5 sm:p-8 ring-1 ring-border shadow-2xl safe-bottom">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-accent">
                <Sparkles className="size-3.5" /> Assistant IA
              </span>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl">Créer en 30 secondes</h2>
              <p className="mt-1 text-sm text-muted-foreground">Répondez à quelques questions — nous générons design, textes et structure.</p>
            </div>
            <button onClick={onClose} className="min-h-10 min-w-10 flex items-center justify-center touch-target" aria-label="Fermer">
              <X className="size-5 text-muted-foreground" />
            </button>
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Type d&apos;événement</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {EVENT_CATEGORIES.slice(0, 8).map((c) => (
                    <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                      className={`rounded-full border px-3 py-2 min-h-10 text-xs ${category === c.id ? "border-accent bg-accent/10" : "border-border"}`}>
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <input className={inputCls} placeholder="Nom de l'événement" value={eventName} onChange={(e) => setEventName(e.target.value)} />
              <input className={inputCls} placeholder="Hôtes / Familles" value={hosts} onChange={(e) => setHosts(e.target.value)} />
              <input className={inputCls} placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} />
              <input type="datetime-local" className={inputCls} value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              <button type="button" onClick={() => setStep(1)}
                className="w-full rounded-full bg-primary text-primary-foreground min-h-12 py-3 text-sm font-medium">
                Continuer
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Style</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {INVITATION_TONES.slice(0, 6).map((t) => (
                    <button key={t.id} type="button" onClick={() => setStyle(t.id)}
                      className={`rounded-full border px-3 py-2 min-h-10 text-xs ${style === t.id ? "border-accent bg-accent/10" : "border-border"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Langue</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {LANGUAGES.map((l) => (
                    <button key={l.code} type="button" onClick={() => setLanguage(l.code)}
                      className={`rounded-xl border py-3 min-h-11 text-xs ${language === l.code ? "border-accent bg-accent/10" : "border-border"}`}>
                      {l.flag} {l.native}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Nombre de sections</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {([
                    ["minimal", "Essentiel"],
                    ["standard", "Complet"],
                    ["complete", "Premium"],
                  ] as const).map(([v, label]) => (
                    <button key={v} type="button" onClick={() => setSectionLevel(v)}
                      className={`rounded-xl border py-3 min-h-11 text-xs ${sectionLevel === v ? "border-accent bg-accent/10" : "border-border"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setStep(0)} className="flex-1 rounded-full border border-border min-h-12 py-3 text-sm">Retour</button>
                <button type="button" disabled={loading} onClick={handleGenerate}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground min-h-12 py-3 text-sm font-medium disabled:opacity-60">
                  <Wand2 className="size-4" /> {loading ? "Création…" : "Générer"}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
