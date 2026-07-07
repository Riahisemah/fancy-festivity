/**
 * Assistant « IA » — génération intelligente par règles (MVP commercial).
 * Remplacez par un appel API LLM lorsque prêt pour la production.
 */
import type { Lang } from "@/lib/i18n";
import type { InvitationTemplate } from "@/lib/templates/types";
import type { EventCategory, InvitationTone } from "@/lib/templates/texts/types";
import { TEMPLATE_CATALOG } from "@/lib/templates/catalog";
import { materializeTemplate } from "@/lib/templates/clone";
import type { InvitationCreateInput } from "@/lib/invitations";
import type { Section } from "@/lib/sections";

export type WizardInput = {
  category: EventCategory;
  eventName: string;
  hosts: string;
  city: string;
  eventDate: string;
  style: InvitationTone;
  language: Lang;
  sectionLevel: "minimal" | "standard" | "complete";
};

function scoreTemplate(t: InvitationTemplate, input: WizardInput): number {
  let score = 0;
  if (t.category === input.category) score += 40;
  if (t.language === input.language) score += 25;
  if (t.tone === input.style) score += 20;
  if (t.badge === "premium" || t.badge === "exclusive") score += 5;
  if (t.featured) score += 3;
  return score;
}

export function pickBestTemplate(input: WizardInput): InvitationTemplate {
  const ranked = [...TEMPLATE_CATALOG]
    .map((t) => ({ t, score: scoreTemplate(t, input) }))
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.t ?? TEMPLATE_CATALOG[0];
}

function trimSections(sections: Section[], level: WizardInput["sectionLevel"]): Section[] {
  if (level === "complete") return sections;
  if (level === "standard") return sections.slice(0, Math.min(sections.length, 8));
  return sections.slice(0, Math.min(sections.length, 5));
}

export function generateInvitationFromWizard(input: WizardInput): {
  template: InvitationTemplate;
  data: InvitationCreateInput;
} {
  const template = pickBestTemplate(input);
  const base = materializeTemplate(template, input.language);
  const eventDate = input.eventDate ? new Date(input.eventDate).toISOString() : base.event_date;

  const sections = trimSections(base.sections as Section[], input.sectionLevel).map((s) => {
    const copy = structuredClone(s);
    if (copy.kind === "hero") {
      copy.title = input.eventName || copy.title;
      copy.subtitle = input.hosts || copy.subtitle;
      copy.location = input.city || copy.location;
      copy.date = eventDate;
    }
    if (copy.kind === "map") {
      copy.address = input.city ? `${input.city}, Tunisie` : copy.address;
    }
    if (copy.kind === "countdown") {
      copy.targetDate = eventDate;
    }
    return copy;
  });

  return {
    template,
    data: {
      event_name: input.eventName,
      hosts: input.hosts,
      event_date: eventDate,
      location: input.city,
      theme: base.theme,
      subtheme: base.subtheme,
      language: input.language,
      sections,
    },
  };
}
