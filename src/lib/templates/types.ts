import type { Lang } from "@/lib/i18n";
import type { Section } from "@/lib/sections";
import type { SectionStyle } from "@/lib/section-style";
import type { ThemeKey } from "@/lib/themes";
import type { EventCategory, InvitationTone, TemplateLanguage } from "./texts/types";

export type TemplateCategory = EventCategory;

export type TemplateColors = {
  primary: string;
  accent: string;
  background: string;
  text: string;
};

/** Read-only blueprint — never mutated; cloned on use. */
export type InvitationTemplate = {
  id: string;
  name: string;
  nameAr?: string;
  category: TemplateCategory;
  style: string;
  tags: string[];
  theme: ThemeKey;
  subtheme: string;
  language: Lang;
  copyId: string;
  tone: InvitationTone;
  colors: TemplateColors;
  event_name: string;
  hosts: string;
  location: string;
  eventDateOffsetDays: number;
  sections: TemplateSection[];
  description?: string;
  fonts?: { heading?: SectionStyle["fontFamily"]; body?: SectionStyle["fontFamily"] };
};

/** Section without runtime id — ids assigned when cloning */
export type TemplateSection = Omit<Section, "id">;

export type TemplateFonts = {
  heading?: SectionStyle["fontFamily"];
  body?: SectionStyle["fontFamily"];
};

/** Format JSON pour stockage extensible de modèles */
export type TemplateJsonDefinition = {
  id: string;
  category: EventCategory;
  language: TemplateLanguage;
  tone: InvitationTone;
  copyId: string;
  title: string;
  description: string;
  theme: ThemeKey;
  subtheme: string;
  name: string;
  style: string;
  tags: string[];
  defaultTexts: Record<string, string>;
  fonts: { heading?: string; body?: string };
  colors: TemplateColors;
  layout?: "full" | "minimal" | "royal" | "modern";
  eventDateOffsetDays?: number;
};
