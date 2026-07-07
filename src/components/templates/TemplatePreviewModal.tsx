import { motion, AnimatePresence } from "framer-motion";

import { useMemo, useState, useEffect } from "react";

import { X } from "lucide-react";

import { resolveTheme } from "@/lib/themes";

import { SectionRenderer } from "@/components/sections/SectionRenderer";

import { materializeTemplate, rebuildTemplateLanguage, TEMPLATE_LANGUAGES, type InvitationTemplate } from "@/lib/templates";

import type { Section } from "@/lib/sections";

import { newId } from "@/lib/sections";

import type { Lang } from "@/lib/i18n";

import { dirFor } from "@/lib/i18n";



export function TemplatePreviewModal({

  template,

  onClose,

  onUse,

  using,

}: {

  template: InvitationTemplate | null;

  onClose: () => void;

  onUse: (t: InvitationTemplate, language: Lang) => void;

  using?: boolean;

}) {

  const [language, setLanguage] = useState<Lang>(template?.language ?? "fr");

  useEffect(() => {
    if (template) setLanguage(template.language);
  }, [template?.id, template?.language]);



  const resolvedTemplate = useMemo(() => {

    if (!template) return null;

    return language === template.language ? template : rebuildTemplateLanguage(template, language);

  }, [template, language]);



  if (!template || !resolvedTemplate) return null;



  const data = materializeTemplate(resolvedTemplate);

  const theme = resolveTheme(data.theme, data.subtheme);

  const sections = data.sections.map((s) => ({ ...s, id: newId() })) as Section[];



  return (

    <AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}

        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/50 backdrop-blur-sm p-0 sm:p-4"

        onClick={onClose}>

        <motion.div

          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}

          transition={{ type: "spring", stiffness: 280, damping: 28 }}

          onClick={(e) => e.stopPropagation()}

          className="w-full sm:max-w-4xl max-h-[92vh] overflow-hidden rounded-t-3xl sm:rounded-3xl bg-card ring-1 ring-border shadow-2xl flex flex-col"

        >

          <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0 gap-4">

            <div className="min-w-0">

              <h2 className="font-serif text-2xl truncate">{template.name}</h2>

              <p className="text-xs text-muted-foreground mt-0.5">{template.style} · {template.tone} · {template.sections.length} sections</p>

            </div>

            <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted shrink-0"><X className="size-5" /></button>

          </div>



          <div className="px-5 py-3 border-b border-border shrink-0">

            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Langue du modèle</p>

            <div className="flex flex-wrap gap-2">

              {TEMPLATE_LANGUAGES.map((l) => (

                <button

                  key={l.code}

                  type="button"

                  onClick={() => setLanguage(l.code)}

                  className={`rounded-full border px-3 py-1 text-xs transition ${

                    language === l.code ? "border-accent bg-accent/10" : "border-border hover:bg-muted"

                  }`}

                >

                  {l.flag} {l.label}

                </button>

              ))}

            </div>

          </div>



          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/30">

            <div className="mx-auto max-w-2xl rounded-2xl overflow-hidden shadow-xl ring-1 ring-border">

              <div

                dir={dirFor(data.language)}

                lang={data.language === "bilingual" ? "ar" : data.language}

                className={`${theme.pageBg} ${theme.pageText} ${data.language === "ar" || data.language === "bilingual" ? "font-arabic" : theme.font} min-h-[400px] px-4 py-10`}

              >

                {sections.map((s, i) => (

                  <SectionRenderer key={s.id} section={s} theme={theme} index={i} lang={data.language} preview />

                ))}

              </div>

            </div>

          </div>



          <div className="border-t border-border p-4 flex gap-2 shrink-0">

            <button onClick={onClose} className="flex-1 rounded-full border border-border py-3 text-sm font-medium hover:bg-muted">

              Fermer

            </button>

            <button

              disabled={using}

              onClick={() => onUse(resolvedTemplate, language)}

              className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-accent disabled:opacity-60"

            >

              {using ? "Création…" : "Utiliser ce modèle"}

            </button>

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>

  );

}

