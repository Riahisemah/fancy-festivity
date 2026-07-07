import type { Lang } from "@/lib/i18n";
import type { InvitationTemplate, TemplateJsonDefinition } from "./types";
import { buildInvitationSections } from "./presets";
import { getCopyById, resolveCopy } from "./texts";
import type { TemplateLanguage } from "./texts/types";

type TplOpts = Pick<InvitationTemplate, "id" | "name" | "style" | "subtheme" | "copyId" | "tone"> &
  Partial<InvitationTemplate> & {
    accent: string;
    text?: string;
    layout?: "full" | "minimal" | "royal" | "modern";
    language?: Lang;
    category?: InvitationTemplate["category"];
  };

function tpl(base: TplOpts): InvitationTemplate {
  const copy = getCopyById(base.copyId);
  if (!copy) throw new Error(`Copy not found: ${base.copyId}`);

  const language = (base.language ?? "fr") as TemplateLanguage;
  const texts = resolveCopy(copy, language);
  const headingFont = language === "fr" ? "serif" : "arabic-display";
  const bodyFont = language === "fr" ? "inherit" : "arabic";

  const category = base.category ?? copy.category;
  const tags = base.tags ?? [
    category === "wedding" ? "Mariage" : copy.label,
    copy.tone.charAt(0).toUpperCase() + copy.tone.slice(1),
    language === "bilingual" ? "Bilingue" : language === "ar" ? "Arabe" : "Français",
  ];

  return {
    category,
    tags,
    theme: "tunisian",
    language,
    copyId: base.copyId,
    tone: base.tone ?? copy.tone,
    event_name: texts.eventName,
    hosts: texts.hosts,
    location: texts.mapAddress.split("\n")[0],
    eventDateOffsetDays: base.eventDateOffsetDays ?? 45,
    description: copy.description,
    colors: {
      primary: base.accent,
      accent: base.accent,
      background: base.text ? "#f8f2e6" : "#0f0a04",
      text: base.text ?? "#2a1f14",
    },
    fonts: { heading: headingFont, body: bodyFont },
    sections: buildInvitationSections(texts, {
      accent: base.accent,
      text: base.text,
      language,
      layout: base.layout ?? "full",
      headingFont,
      bodyFont,
      eventDateOffsetDays: base.eventDateOffsetDays,
    }),
    ...base,
    name: base.name,
    id: base.id,
    style: base.style,
    subtheme: base.subtheme,
  };
}

/** Reconstruit un modèle avec une autre langue (sections + textes) */
export function rebuildTemplateLanguage(template: InvitationTemplate, language: Lang): InvitationTemplate {
  const copy = getCopyById(template.copyId);
  if (!copy) return template;

  const lang = language as TemplateLanguage;
  const texts = resolveCopy(copy, lang);
  const headingFont = template.fonts?.heading ?? (lang === "fr" ? "serif" : "arabic-display");
  const bodyFont = template.fonts?.body ?? (lang === "fr" ? "inherit" : "arabic");

  return {
    ...template,
    language,
    event_name: texts.eventName,
    hosts: texts.hosts,
    location: texts.mapAddress.split("\n")[0],
    sections: buildInvitationSections(texts, {
      accent: template.colors.accent,
      text: template.colors.text !== "#2a1f14" ? template.colors.text : undefined,
      language: lang,
      layout: inferLayout(template),
      headingFont,
      bodyFont,
      eventDateOffsetDays: template.eventDateOffsetDays,
    }),
  };
}

function inferLayout(t: InvitationTemplate): "full" | "minimal" | "royal" | "modern" {
  const n = t.sections.length;
  if (n <= 6) return "minimal";
  if (t.tags.some((x) => /royal|prestige|luxury/i.test(x))) return "royal";
  if (t.tags.some((x) => /modern|contemporain/i.test(x))) return "modern";
  return "full";
}

import { getGeneratedCatalog } from "./catalog-generator";

const HANDCRAFTED_IDS = new Set([
  "tunisian-classic", "tunisian-classic-bilingual", "classic-arabic",
  "tunisian-luxury-gold", "arabic-luxury", "tunisian-prestige", "premium-tunisian-bilingual",
  "wedding-religious-ar", "wedding-religious-fr", "tunisian-modern", "modern-arabic",
  "tunisian-minimal", "tunisian-white-gold", "tunisian-floral", "tunisian-royal",
  "tunisian-elegant", "oriental-floral", "traditional-tunisian", "ivory-wedding",
  "royal-palace", "golden-roses", "emerald-wedding", "engagement-classic-fr",
  "engagement-classic-ar", "henna-traditional", "birth-classic", "circumcision-traditional",
  "graduation-modern",
]);

const HANDCRAFTED: InvitationTemplate[] = [
  tpl({ id: "tunisian-classic", name: "Tunisian Classic", style: "Classique ivoire & or", subtheme: "tunisian-classic", copyId: "wedding-classic", tone: "classic", accent: "#a8884a", language: "fr" }),
  tpl({ id: "tunisian-classic-bilingual", name: "Tunisian Classic Bilingue", style: "Arabe + Français", subtheme: "tunisian-classic", copyId: "wedding-classic", tone: "classic", accent: "#a8884a", language: "bilingual" }),
  tpl({ id: "classic-arabic", name: "Classic Arabic", style: "Arabe classique authentique", subtheme: "tunisian-classic", copyId: "wedding-classic", tone: "classic", accent: "#a8884a", language: "ar" }),
  tpl({ id: "tunisian-luxury-gold", name: "Tunisian Luxury Gold", style: "Or somptueux", subtheme: "tunisian-luxury-gold", copyId: "wedding-luxury", tone: "luxury", accent: "#d4af37", text: "#f5e9c8", layout: "royal", language: "fr" }),
  tpl({ id: "arabic-luxury", name: "Arabic Luxury", style: "Calligraphie luxueuse", subtheme: "tunisian-arabic-luxury", copyId: "wedding-luxury", tone: "luxury", accent: "#c9a227", language: "ar", layout: "royal" }),
  tpl({ id: "tunisian-prestige", name: "Tunisian Prestige", style: "Prestige impérial", subtheme: "tunisian-prestige", copyId: "wedding-luxury", tone: "luxury", accent: "#b8860b", layout: "royal" }),
  tpl({ id: "premium-tunisian-bilingual", name: "Premium Bilingue", style: "Signature premium AR+FR", subtheme: "tunisian-luxury-gold", copyId: "wedding-luxury", tone: "luxury", accent: "#e8c547", text: "#f5e9c8", language: "bilingual", layout: "royal" }),
  tpl({ id: "wedding-religious-ar", name: "Mariage Religieux", style: "Ton pieux & baraka", subtheme: "tunisian-traditional", copyId: "wedding-religious", tone: "religious", accent: "#2d5016", language: "ar" }),
  tpl({ id: "wedding-religious-fr", name: "Mariage Religieux FR", style: "Cérémonie bénie", subtheme: "tunisian-traditional", copyId: "wedding-religious", tone: "religious", accent: "#2d5016", language: "fr" }),
  tpl({ id: "tunisian-modern", name: "Tunisian Modern", style: "Contemporain bronze", subtheme: "tunisian-modern-elegant", copyId: "wedding-modern", tone: "modern", accent: "#8a7350", layout: "modern", language: "fr" }),
  tpl({ id: "modern-arabic", name: "Modern Arabic", style: "Arabe contemporain", subtheme: "tunisian-modern-elegant", copyId: "wedding-modern", tone: "modern", accent: "#6b5b45", language: "ar", layout: "modern" }),
  tpl({ id: "tunisian-minimal", name: "Tunisian Minimal", style: "Minimaliste crème", subtheme: "tunisian-minimal", copyId: "wedding-minimal", tone: "minimal", accent: "#a8884a", layout: "minimal", language: "fr" }),
  tpl({ id: "tunisian-white-gold", name: "Tunisian White & Gold", style: "Blanc pur & filet doré", subtheme: "tunisian-white-gold", copyId: "wedding-minimal", tone: "minimal", accent: "#c9a86a", layout: "minimal", language: "bilingual" }),
  tpl({ id: "tunisian-floral", name: "Tunisian Floral", style: "Floral romantique", subtheme: "tunisian-floral", copyId: "wedding-classic", tone: "elegant", accent: "#c47a7a" }),
  tpl({ id: "tunisian-royal", name: "Tunisian Royal", style: "Bordeaux royal", subtheme: "tunisian-royal", copyId: "wedding-classic", tone: "traditional", accent: "#8a1e1e", layout: "royal" }),
  tpl({ id: "tunisian-elegant", name: "Tunisian Elegant", style: "Élégance raffinée", subtheme: "tunisian-elegant", copyId: "wedding-classic", tone: "elegant", accent: "#9a7b4f" }),
  tpl({ id: "oriental-floral", name: "Oriental Floral", style: "Motifs orientaux", subtheme: "tunisian-oriental", copyId: "wedding-classic", tone: "oriental", accent: "#b56576" }),
  tpl({ id: "traditional-tunisian", name: "Traditional Tunisian", style: "Tradition authentique", subtheme: "tunisian-traditional", copyId: "wedding-classic", tone: "traditional", accent: "#8b4513", language: "ar" }),
  tpl({ id: "ivory-wedding", name: "Ivory Wedding", style: "Ivoire nuptial", subtheme: "tunisian-ivory", copyId: "wedding-classic", tone: "elegant", accent: "#b8956a", layout: "minimal" }),
  tpl({ id: "royal-palace", name: "Royal Palace", style: "Palais royal", subtheme: "tunisian-royal-palace", copyId: "wedding-luxury", tone: "luxury", accent: "#7a1f1f", layout: "royal" }),
  tpl({ id: "golden-roses", name: "Golden Roses", style: "Roses dorées", subtheme: "tunisian-golden-roses", copyId: "wedding-classic", tone: "elegant", accent: "#c9956b" }),
  tpl({ id: "emerald-wedding", name: "Emerald Wedding", style: "Vert émeraude", subtheme: "tunisian-emerald", copyId: "wedding-classic", tone: "classic", accent: "#1a6b4a" }),
  tpl({ id: "engagement-classic-fr", name: "Fiançailles Classiques", style: "Khotba traditionnelle", subtheme: "tunisian-elegant", copyId: "engagement-classic", tone: "classic", accent: "#9a7b4f", category: "engagement", language: "fr" }),
  tpl({ id: "engagement-classic-ar", name: "خطوبة كلاسيكية", style: "خطوبة تونسية", subtheme: "tunisian-elegant", copyId: "engagement-classic", tone: "classic", accent: "#9a7b4f", category: "engagement", language: "ar" }),
  tpl({ id: "henna-traditional", name: "Soirée du Henné", style: "Laylat al-henna", subtheme: "tunisian-oriental", copyId: "henna-traditional", tone: "traditional", accent: "#8b2252", category: "henna", language: "bilingual" }),
  tpl({ id: "birth-classic", name: "Naissance", style: "Accueil du nouveau-né", subtheme: "tunisian-floral", copyId: "birth-classic", tone: "classic", accent: "#6b9bd1", category: "birth", language: "bilingual" }),
  tpl({ id: "circumcision-traditional", name: "Circoncision", style: "Thtil — célébration familiale", subtheme: "tunisian-traditional", copyId: "circumcision-traditional", tone: "traditional", accent: "#2d5016", category: "circumcision", language: "ar" }),
  tpl({ id: "graduation-modern", name: "Remise de diplôme", style: "Célébration académique", subtheme: "tunisian-modern-elegant", copyId: "graduation-modern", tone: "modern", accent: "#4a5568", category: "graduation", language: "fr", badge: "premium", featured: true }),
];

/** Catalogue complet : modèles artisanaux + génération automatique (140+) */
export const TEMPLATE_CATALOG: InvitationTemplate[] = [
  ...HANDCRAFTED.map((t) => ({ ...t, badge: t.badge ?? "premium" as const, featured: t.featured ?? true })),
  ...getGeneratedCatalog().filter((g) => !HANDCRAFTED_IDS.has(g.id)),
];

export function getTemplateById(id: string): InvitationTemplate | undefined {
  return TEMPLATE_CATALOG.find((t) => t.id === id);
}

export function listTemplates(category?: InvitationTemplate["category"]): InvitationTemplate[] {
  if (!category) return TEMPLATE_CATALOG;
  return TEMPLATE_CATALOG.filter((t) => t.category === category);
}

export { EVENT_CATEGORIES as TEMPLATE_CATEGORIES } from "./texts";

export function templateToJson(template: InvitationTemplate): TemplateJsonDefinition {
  const copy = getCopyById(template.copyId);
  const lang = template.language as TemplateLanguage;
  const texts = copy ? resolveCopy(copy, lang) : null;

  return {
    id: template.id,
    category: template.category,
    language: lang,
    tone: template.tone,
    copyId: template.copyId,
    title: template.name,
    description: template.description ?? template.style,
    theme: template.theme,
    subtheme: template.subtheme,
    name: template.name,
    style: template.style,
    tags: template.tags,
    defaultTexts: texts ? { ...texts } as Record<string, string> : {},
    fonts: template.fonts ?? {},
    colors: template.colors,
    eventDateOffsetDays: template.eventDateOffsetDays,
  };
}
