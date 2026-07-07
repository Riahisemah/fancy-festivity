export type {
  TemplateLanguage,
  InvitationTone,
  EventCategory,
  InvitationCopyTexts,
  InvitationCopyEntry,
  TemplateJsonSchema,
} from "./types";
export { COPY_LIBRARY, getCopyById, listCopyByCategory, listCopyByTone } from "./copy-library";
export { resolveCopy, type ResolvedCopy } from "./resolve";

export const EVENT_CATEGORIES = [
  { id: "wedding" as const, label: "Mariage", labelAr: "زفاف", emoji: "💍" },
  { id: "engagement" as const, label: "Fiançailles", labelAr: "خطوبة", emoji: "💎" },
  { id: "marriage_contract" as const, label: "Contrat", labelAr: "عقد", emoji: "📜" },
  { id: "henna" as const, label: "Henné", labelAr: "حنة", emoji: "🌿" },
  { id: "reception" as const, label: "Réception", labelAr: "استقبال", emoji: "🥂" },
  { id: "dinner" as const, label: "Dîner", labelAr: "عشاء", emoji: "🍽️" },
  { id: "birth" as const, label: "Naissance", labelAr: "ولادة", emoji: "👶" },
  { id: "circumcision" as const, label: "Circoncision", labelAr: "ختان", emoji: "🕌" },
  { id: "birthday" as const, label: "Anniversaire", labelAr: "عيد ميلاد", emoji: "🎂" },
  { id: "graduation" as const, label: "Diplôme", labelAr: "تخرّج", emoji: "🎓" },
  { id: "business" as const, label: "Professionnel", labelAr: "احترافي", emoji: "💼" },
  { id: "ramadan" as const, label: "Ramadan", labelAr: "رمضان", emoji: "🌙" },
  { id: "aid" as const, label: "Aïd", labelAr: "عيد", emoji: "🕌" },
  { id: "mouled" as const, label: "Mouled", labelAr: "مولد", emoji: "✨" },
] as const;

export const INVITATION_TONES = [
  { id: "classic" as const, label: "Classique", labelAr: "كلاسيكي" },
  { id: "modern" as const, label: "Moderne", labelAr: "عصري" },
  { id: "religious" as const, label: "Religieux", labelAr: "ديني" },
  { id: "elegant" as const, label: "Élégant", labelAr: "أنيق" },
  { id: "luxury" as const, label: "Luxe", labelAr: "فاخر" },
  { id: "minimal" as const, label: "Minimal", labelAr: "بسيط" },
  { id: "oriental" as const, label: "Oriental", labelAr: "شرقي" },
  { id: "traditional" as const, label: "Traditionnel", labelAr: "تقليدي" },
] as const;

export const TEMPLATE_LANGUAGES = [
  { code: "ar" as const, label: "Arabe", flag: "🇹🇳", native: "العربية" },
  { code: "fr" as const, label: "Français", flag: "🇫🇷", native: "Français" },
  { code: "bilingual" as const, label: "Bilingue", flag: "🇹🇳🇫🇷", native: "عربي + Français" },
] as const;
