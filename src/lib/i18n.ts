// Multilingual support — fr / ar / en / bilingual (ar+fr sur la même carte).
export type Lang = "fr" | "ar" | "en" | "bilingual";

export const LANGUAGES: { code: Lang; label: string; flag: string; native: string }[] = [
  { code: "fr", label: "Français",  flag: "🇫🇷", native: "Français" },
  { code: "ar", label: "العربية",   flag: "🇹🇳", native: "العربية" },
  { code: "bilingual", label: "Bilingue", flag: "🇹🇳🇫🇷", native: "عربي + Français" },
  { code: "en", label: "English",   flag: "🇬🇧", native: "English" },
];

export const isBilingual = (l: Lang) => l === "bilingual";
export const isRTL = (l: Lang) => l === "ar";
/** Direction du conteneur — bilingue reste LTR pour équilibrer les deux blocs */
export const dirFor = (l: Lang): "ltr" | "rtl" => (l === "ar" ? "rtl" : "ltr");
export const localeFor = (l: Lang) => (l === "ar" || l === "bilingual" ? "ar-TN" : l === "en" ? "en-US" : "fr-FR");
/** Locale secondaire pour dates / libellés FR en mode bilingue */
export const localeSecondary = (l: Lang) => (l === "bilingual" ? "fr-FR" : localeFor(l));

/** Arabic script detection — useful when mixed-language content is entered manually. */
export function hasArabicText(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

export function arabicFont(lang: Lang, variant: "body" | "display" = "body"): string {
  if (!isRTL(lang) && !isBilingual(lang)) return "";
  return variant === "display" ? "font-arabic-display" : "font-arabic";
}

/** Labels/eyebrows: uppercase + wide tracking breaks Arabic glyphs. */
export function labelClass(lang: Lang, accent = ""): string {
  if (isRTL(lang) || isBilingual(lang)) return `font-arabic text-sm tracking-normal normal-case ${accent}`.trim();
  return `text-[10px] uppercase tracking-[0.35em] ${accent}`.trim();
}

type Dict = {
  share: string; copy: string; whatsapp: string; qrcode: string; scanToOpen: string; close: string; linkCopied: string;
  program: string; countdown: string; days: string; hours: string; minutes: string; seconds: string;
  invitedBy: string; untilTheDay: string; footerBrand: string;
  language: string; open: string; youAreInvited: string;
};

const D: Record<Lang, Dict> = {
  fr: {
    share: "Partager", copy: "Copier", whatsapp: "WhatsApp", qrcode: "QR Code",
    scanToOpen: "Scannez pour ouvrir", close: "Fermer", linkCopied: "Lien copié",
    program: "Programme", countdown: "Compte à rebours",
    days: "Jours", hours: "Heures", minutes: "Minutes", seconds: "Secondes",
    invitedBy: "Vous êtes invité·e", untilTheDay: "Jusqu'au grand jour",
    footerBrand: "Vélon", language: "Langue",
    open: "Ouvrir l'invitation", youAreInvited: "Vous êtes invité·e",
  },
  ar: {
    share: "مشاركة", copy: "نسخ", whatsapp: "واتساب", qrcode: "رمز QR",
    scanToOpen: "امسح لفتح الدعوة", close: "إغلاق", linkCopied: "تم نسخ الرابط",
    program: "البرنامج", countdown: "العد التنازلي",
    days: "أيام", hours: "ساعات", minutes: "دقائق", seconds: "ثوان",
    invitedBy: "أنتم مدعوون", untilTheDay: "حتى اليوم الكبير",
    footerBrand: "Vélon", language: "اللغة",
    open: "افتح الدعوة", youAreInvited: "أنتم مدعوون",
  },
  en: {
    share: "Share", copy: "Copy", whatsapp: "WhatsApp", qrcode: "QR Code",
    scanToOpen: "Scan to open", close: "Close", linkCopied: "Link copied",
    program: "Program", countdown: "Countdown",
    days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds",
    invitedBy: "You are invited", untilTheDay: "Until the big day",
    footerBrand: "Vélon", language: "Language",
    open: "Open the invitation", youAreInvited: "You're invited",
  },
  bilingual: {
    share: "Partager / مشاركة", copy: "Copier / نسخ", whatsapp: "WhatsApp", qrcode: "QR Code",
    scanToOpen: "Scannez / امسح", close: "Fermer / إغلاق", linkCopied: "Lien copié",
    program: "Programme / البرنامج", countdown: "Compte à rebours",
    days: "Jours / أيام", hours: "Heures / ساعات", minutes: "Minutes / دقائق", seconds: "Secondes / ثوان",
    invitedBy: "Vous êtes invité·e · أنتم مدعوون", untilTheDay: "Jusqu'au grand jour",
    footerBrand: "Vélon", language: "Langue / اللغة",
    open: "Ouvrir l'invitation", youAreInvited: "Vous êtes invité·e",
  },
};

export function t(lang: Lang, key: keyof Dict): string {
  return D[lang]?.[key] ?? D.fr[key];
}

export function formatDateLong(d: string, lang: Lang): string {
  try {
    const date = new Date(d);
    const primary = date.toLocaleDateString(localeFor(lang), {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    if (lang === "bilingual") {
      const secondary = date.toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });
      return `${primary} · ${secondary}`;
    }
    return primary;
  } catch {
    return d;
  }
}
