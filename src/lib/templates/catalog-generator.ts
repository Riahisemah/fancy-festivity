/**
 * Génère le catalogue étendu à partir des combinaisons sous-thème × langue × catégorie.
 * Objectif commercial : 140+ modèles tunisiens sans duplication manuelle.
 */
import type { Lang } from "@/lib/i18n";
import type { InvitationTemplate } from "./types";
import type { TemplateBadge } from "./types";
import type { EventCategory, InvitationTone } from "./texts/types";
import { buildInvitationSections } from "./presets";
import { getCopyById, resolveCopy } from "./texts";
import type { TemplateLanguage } from "./texts/types";

type SubthemeSpec = {
  key: string;
  label: string;
  accent: string;
  text?: string;
  layout?: "full" | "minimal" | "royal" | "modern";
};

const TUNISIAN_SUBTHEMES: SubthemeSpec[] = [
  { key: "tunisian-classic", label: "Classique", accent: "#a8884a" },
  { key: "tunisian-luxury-gold", label: "Or luxe", accent: "#d4af37", text: "#f5e9c8", layout: "royal" },
  { key: "tunisian-prestige", label: "Prestige", accent: "#b8860b", layout: "royal" },
  { key: "tunisian-arabic-luxury", label: "Calligraphie", accent: "#c9a227", layout: "royal" },
  { key: "tunisian-modern-elegant", label: "Moderne", accent: "#8a7350", layout: "modern" },
  { key: "tunisian-minimal", label: "Minimal", accent: "#a8884a", layout: "minimal" },
  { key: "tunisian-white-gold", label: "Blanc & Or", accent: "#c9a86a", layout: "minimal" },
  { key: "tunisian-floral", label: "Floral", accent: "#c47a7a" },
  { key: "tunisian-royal", label: "Royal", accent: "#8a1e1e", layout: "royal" },
  { key: "tunisian-elegant", label: "Élégant", accent: "#9a7b4f" },
  { key: "tunisian-oriental", label: "Oriental", accent: "#b56576" },
  { key: "tunisian-traditional", label: "Traditionnel", accent: "#8b4513" },
  { key: "tunisian-ivory", label: "Ivoire", accent: "#b8956a", layout: "minimal" },
  { key: "tunisian-golden-roses", label: "Roses dorées", accent: "#c9956b" },
];

const LANGS: { code: Lang; suffix: string; nameAr?: string }[] = [
  { code: "fr", suffix: "FR" },
  { code: "ar", suffix: "AR", nameAr: "عربي" },
  { code: "bilingual", suffix: "Bilingue", nameAr: "ثنائي" },
];

type CategoryRecipe = {
  category: EventCategory;
  copyIds: string[];
  subthemeCount: number;
  collection: string;
};

const RECIPES: CategoryRecipe[] = [
  { category: "wedding", copyIds: ["wedding-classic", "wedding-luxury", "wedding-modern", "wedding-minimal", "wedding-religious"], subthemeCount: 14, collection: "mariage-tunisien" },
  { category: "engagement", copyIds: ["engagement-classic", "wedding-classic", "wedding-modern"], subthemeCount: 7, collection: "fiancailles" },
  { category: "henna", copyIds: ["henna-traditional", "wedding-classic"], subthemeCount: 7, collection: "henne" },
  { category: "birth", copyIds: ["birth-classic", "wedding-minimal"], subthemeCount: 7, collection: "naissance" },
  { category: "birthday", copyIds: ["wedding-modern", "wedding-classic"], subthemeCount: 7, collection: "anniversaire" },
  { category: "graduation", copyIds: ["graduation-modern", "wedding-modern"], subthemeCount: 7, collection: "diplome" },
  { category: "circumcision", copyIds: ["circumcision-traditional", "wedding-religious"], subthemeCount: 7, collection: "circoncision" },
  { category: "marriage_contract", copyIds: ["wedding-religious", "wedding-classic"], subthemeCount: 5, collection: "contrat" },
  { category: "reception", copyIds: ["wedding-luxury", "wedding-classic"], subthemeCount: 5, collection: "reception" },
  { category: "ramadan", copyIds: ["wedding-religious"], subthemeCount: 5, collection: "ramadan" },
  { category: "aid", copyIds: ["wedding-religious", "wedding-classic"], subthemeCount: 5, collection: "aid" },
  { category: "mouled", copyIds: ["wedding-religious"], subthemeCount: 4, collection: "mouled" },
  { category: "business", copyIds: ["graduation-modern", "wedding-modern"], subthemeCount: 7, collection: "professionnel" },
];

function assignBadge(globalIndex: number, tone: InvitationTone, copyId: string): TemplateBadge {
  if (tone === "luxury" || copyId.includes("luxury")) return "premium";
  if (globalIndex < 12) return "new";
  if (globalIndex % 17 === 0) return "exclusive";
  return "classic";
}

function buildGeneratedTemplate(
  category: EventCategory,
  copyId: string,
  sub: SubthemeSpec,
  lang: (typeof LANGS)[number],
  globalIndex: number,
  collection: string,
): InvitationTemplate | null {
  const copy = getCopyById(copyId);
  if (!copy) return null;

  const language = lang.code as TemplateLanguage;
  const texts = resolveCopy(copy, language);
  const tone = copy.tone;
  const layout = sub.layout ?? (tone === "luxury" ? "royal" : tone === "minimal" ? "minimal" : tone === "modern" ? "modern" : "full");
  const id = `gen-${category}-${sub.key}-${copyId}-${lang.code}`;

  const categoryLabel = category.replace("_", "-");
  const name = `${sub.label} — ${copy.label}${lang.code !== "fr" ? ` (${lang.suffix})` : ""}`;
  const nameAr = lang.nameAr ? `${sub.label} — ${copy.labelAr ?? copy.label}` : undefined;

  return {
    id,
    name,
    nameAr,
    category,
    style: `${sub.label} · ${copy.label}`,
    tags: [copy.label, sub.label, lang.suffix, tone],
    theme: "tunisian",
    subtheme: sub.key,
    language: lang.code,
    copyId,
    tone,
    badge: assignBadge(globalIndex, tone, copyId),
    collection,
    featured: globalIndex < 8,
    colors: {
      primary: sub.accent,
      accent: sub.accent,
      background: sub.text ? "#f8f2e6" : "#0f0a04",
      text: sub.text ?? "#2a1f14",
    },
    fonts: {
      heading: language === "fr" ? "serif" : "arabic-display",
      body: language === "fr" ? "inherit" : "arabic",
    },
    event_name: texts.eventName,
    hosts: texts.hosts,
    location: texts.mapAddress.split("\n")[0],
    eventDateOffsetDays: 45,
    description: copy.description,
    sections: buildInvitationSections(texts, {
      accent: sub.accent,
      text: sub.text,
      language,
      layout,
      headingFont: language === "fr" ? "serif" : "arabic-display",
      bodyFont: language === "fr" ? "inherit" : "arabic",
      eventDateOffsetDays: 45,
    }),
  };
}

let _generated: InvitationTemplate[] | null = null;

export function getGeneratedCatalog(): InvitationTemplate[] {
  if (_generated) return _generated;

  const out: InvitationTemplate[] = [];
  let globalIndex = 0;

  for (const recipe of RECIPES) {
    const subs = TUNISIAN_SUBTHEMES.slice(0, recipe.subthemeCount);
    let i = 0;
    for (const sub of subs) {
      for (const lang of LANGS) {
        const copyId = recipe.copyIds[i % recipe.copyIds.length];
        const tpl = buildGeneratedTemplate(recipe.category, copyId, sub, lang, globalIndex, recipe.collection);
        if (tpl) {
          out.push(tpl);
          globalIndex++;
        }
        i++;
      }
    }
  }

  _generated = out;
  return out;
}

export function getCatalogStats() {
  const catalog = getGeneratedCatalog();
  const byCategory = new Map<string, number>();
  const byBadge = new Map<string, number>();
  for (const t of catalog) {
    byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + 1);
    const b = t.badge ?? "classic";
    byBadge.set(b, (byBadge.get(b) ?? 0) + 1);
  }
  return { total: catalog.length, byCategory, byBadge };
}
