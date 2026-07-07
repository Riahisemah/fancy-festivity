/** Langue du modèle / invitation */
export type TemplateLanguage = "ar" | "fr" | "bilingual";

export type InvitationTone =
  | "classic"
  | "modern"
  | "religious"
  | "elegant"
  | "luxury"
  | "minimal"
  | "oriental"
  | "traditional";

export type EventCategory =
  | "wedding"
  | "engagement"
  | "marriage_contract"
  | "henna"
  | "reception"
  | "dinner"
  | "birth"
  | "circumcision"
  | "birthday"
  | "graduation"
  | "business"
  | "ramadan"
  | "aid"
  | "mouled";

/** Textes structurés d'une invitation — format JSON réutilisable */
export type InvitationCopyTexts = {
  bismillah?: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  quote?: string;
  quoteAuthor?: string;
  civilTitle: string;
  civilDescription?: string;
  contractTitle: string;
  contractDescription?: string;
  hennaTitle?: string;
  hennaDescription?: string;
  receptionTitle: string;
  dinnerTitle: string;
  afterTitle?: string;
  programTitle: string;
  familiesTitle: string;
  familiesBody: string;
  thanksTitle: string;
  thanksBody: string;
  mapAddress: string;
  mapTitle?: string;
  countdownLabel?: string;
};

/** Entrée bilingue : textes AR + FR pour fusion ou affichage double */
export type InvitationCopyEntry = {
  id: string;
  category: EventCategory;
  tone: InvitationTone;
  label: string;
  labelAr?: string;
  description: string;
  ar: InvitationCopyTexts;
  fr: InvitationCopyTexts;
  hosts: { ar: string; fr: string };
  eventName: { ar: string; fr: string };
};

/** Schéma JSON exportable d'un modèle complet */
export type TemplateJsonSchema = {
  id: string;
  name: string;
  category: EventCategory;
  language: TemplateLanguage;
  tone: InvitationTone;
  title: string;
  description: string;
  theme: string;
  subtheme: string;
  defaultTexts: InvitationCopyTexts;
  defaultTextsSecondary?: InvitationCopyTexts;
  fonts: { heading?: string; body?: string };
  colors: { primary: string; accent: string; background: string; text: string };
  sections: unknown[];
};
