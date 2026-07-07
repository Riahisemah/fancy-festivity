import type { InvitationTemplate, TemplateBadge } from "./types";
import type { EventCategory } from "./texts/types";

export const BADGE_META: Record<TemplateBadge, { label: string; emoji: string; className: string }> = {
  premium: { label: "Premium", emoji: "⭐", className: "bg-amber-100 text-amber-800 border-amber-200" },
  classic: { label: "Classique", emoji: "✨", className: "bg-muted text-muted-foreground border-border" },
  new: { label: "Nouveau", emoji: "🔥", className: "bg-orange-100 text-orange-800 border-orange-200" },
  exclusive: { label: "Exclusif", emoji: "👑", className: "bg-violet-100 text-violet-800 border-violet-200" },
};

export const COLLECTIONS = [
  { id: "all", label: "Toute la collection", emoji: "✨" },
  { id: "featured", label: "Sélection", emoji: "👑" },
  { id: "mariage-tunisien", label: "Mariage tunisien", emoji: "💍" },
  { id: "fiancailles", label: "Fiançailles", emoji: "💎" },
  { id: "henne", label: "Henné", emoji: "🌿" },
  { id: "naissance", label: "Naissance & Sbou3", emoji: "👶" },
  { id: "ramadan", label: "Ramadan & Aïd", emoji: "🌙" },
] as const;

export type TemplateFilters = {
  category?: EventCategory | "all";
  collection?: string;
  badge?: TemplateBadge | "all";
  search?: string;
  language?: string;
};

export function filterTemplates(catalog: InvitationTemplate[], filters: TemplateFilters): InvitationTemplate[] {
  let list = [...catalog];

  if (filters.collection === "featured") {
    list = list.filter((t) => t.featured);
  } else if (filters.collection && filters.collection !== "all") {
    list = list.filter((t) => t.collection === filters.collection);
  }

  if (filters.category && filters.category !== "all") {
    list = list.filter((t) => t.category === filters.category);
  }

  if (filters.badge && filters.badge !== "all") {
    list = list.filter((t) => (t.badge ?? "classic") === filters.badge);
  }

  if (filters.language && filters.language !== "all") {
    list = list.filter((t) => t.language === filters.language);
  }

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.style.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        (t.nameAr?.includes(q) ?? false),
    );
  }

  return list;
}

export const COMMERCIAL_PACKS = {
  bronze: {
    name: "Basic",
    invitations: 5,
    templates: 10,
    features: ["Templates classiques", "QR Code", "Partage WhatsApp"],
  },
  silver: {
    name: "Premium",
    invitations: 20,
    templates: "Tous",
    features: ["Tous les templates", "Animations premium", "Musique", "Galerie"],
  },
  gold: {
    name: "Pro",
    invitations: 50,
    templates: "Tous + exclusifs",
    features: ["Templates exclusifs", "Support prioritaire", "Nouveautés incluses"],
  },
  unlimited: {
    name: "Pro Illimité",
    invitations: "∞",
    templates: "Marketplace complet",
    features: ["Invitations illimitées", "Toutes les collections", "Accès anticipé"],
  },
} as const;
