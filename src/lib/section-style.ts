import type { CSSProperties } from "react";
import { arabicFont, isRTL, type Lang } from "@/lib/i18n";

export type FontSizeKey =
  | "xs" | "sm" | "base" | "lg" | "xl"
  | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl";

export type FontFamilyKey =
  | "inherit"
  | "serif"
  | "sans"
  | "arabic"
  | "arabic-display"
  | "arabic-kufi";

export type SectionStyle = {
  textColor?: string;
  backgroundColor?: string;
  accentColor?: string;
  titleFontSize?: FontSizeKey;
  bodyFontSize?: FontSizeKey;
  fontFamily?: FontFamilyKey;
  textAlign?: "left" | "center" | "right";
};

export const FONT_SIZE_OPTIONS: { value: FontSizeKey; label: string }[] = [
  { value: "xs", label: "XS" },
  { value: "sm", label: "SM" },
  { value: "base", label: "Base" },
  { value: "lg", label: "LG" },
  { value: "xl", label: "XL" },
  { value: "2xl", label: "2XL" },
  { value: "3xl", label: "3XL" },
  { value: "4xl", label: "4XL" },
  { value: "5xl", label: "5XL" },
  { value: "6xl", label: "6XL" },
  { value: "7xl", label: "7XL" },
  { value: "8xl", label: "8XL" },
];

export const FONT_FAMILY_OPTIONS: { value: FontFamilyKey; label: string }[] = [
  { value: "inherit", label: "Thème" },
  { value: "serif", label: "Serif" },
  { value: "sans", label: "Sans-serif" },
  { value: "arabic", label: "Arabe moderne" },
  { value: "arabic-display", label: "Arabe élégant" },
  { value: "arabic-kufi", label: "Arabe Kufi" },
];

const TITLE_SIZE: Partial<Record<SectionKindDefault, FontSizeKey>> = {
  hero: "7xl",
  event: "5xl",
  card: "4xl",
  quote: "3xl",
};

type SectionKindDefault = "hero" | "event" | "card" | "quote";

const SIZE_CLASS: Record<FontSizeKey, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
  "8xl": "text-8xl",
};

/** Tailles responsives pour titres éditoriaux sur mobile */
const RESPONSIVE_TITLE: Partial<Record<FontSizeKey, string>> = {
  "8xl": "text-4xl sm:text-6xl md:text-8xl",
  "7xl": "text-4xl sm:text-5xl md:text-7xl",
  "6xl": "text-3xl sm:text-4xl md:text-6xl",
  "5xl": "text-3xl sm:text-4xl md:text-5xl",
  "4xl": "text-2xl sm:text-3xl md:text-4xl",
};

const FAMILY_CLASS: Record<FontFamilyKey, string> = {
  inherit: "",
  serif: "font-serif",
  sans: "font-sans",
  arabic: "font-arabic",
  "arabic-display": "font-arabic-display",
  "arabic-kufi": "font-arabic-kufi",
};

export function fontSizeClass(size?: FontSizeKey, fallback: FontSizeKey = "base"): string {
  return SIZE_CLASS[size ?? fallback] ?? SIZE_CLASS.base;
}

export function fontFamilyClass(family: FontFamilyKey | undefined, lang: Lang): string {
  if (family && family !== "inherit") return FAMILY_CLASS[family];
  if (isRTL(lang) || lang === "bilingual") return arabicFont(lang);
  return "";
}

export function sectionStyleVars(style?: SectionStyle): CSSProperties {
  if (!style) return {};
  return {
    ...(style.textColor ? { color: style.textColor } : {}),
    ...(style.backgroundColor ? { backgroundColor: style.backgroundColor } : {}),
    ...(style.textAlign ? { textAlign: style.textAlign } : {}),
    ...(style.accentColor ? { ["--section-accent" as string]: style.accentColor } : {}),
  };
}

export function titleSizeClass(style?: SectionStyle, kind?: string): string {
  const fallback = (kind && TITLE_SIZE[kind as SectionKindDefault]) || "3xl";
  const size = style?.titleFontSize ?? (fallback as FontSizeKey);
  return RESPONSIVE_TITLE[size] ?? fontSizeClass(size, fallback as FontSizeKey);
}

export function bodySizeClass(style?: SectionStyle): string {
  return fontSizeClass(style?.bodyFontSize, "base");
}

export function accentInlineStyle(style?: SectionStyle): CSSProperties | undefined {
  return style?.accentColor ? { color: style.accentColor } : undefined;
}

export function accentBgInlineStyle(style?: SectionStyle): CSSProperties | undefined {
  return style?.accentColor ? { backgroundColor: style.accentColor } : undefined;
}
