// Multilingual support — fr / ar / en.
export type Lang = "fr" | "ar" | "en";

export const LANGUAGES: { code: Lang; label: string; flag: string; native: string }[] = [
  { code: "fr", label: "Français",  flag: "🇫🇷", native: "Français" },
  { code: "ar", label: "العربية",   flag: "🇹🇳", native: "العربية" },
  { code: "en", label: "English",   flag: "🇬🇧", native: "English" },
];

export const isRTL = (l: Lang) => l === "ar";
export const dirFor = (l: Lang): "ltr" | "rtl" => (isRTL(l) ? "rtl" : "ltr");
export const localeFor = (l: Lang) => (l === "ar" ? "ar-TN" : l === "en" ? "en-US" : "fr-FR");

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
};

export function t(lang: Lang, key: keyof Dict): string {
  return D[lang]?.[key] ?? D.fr[key];
}

export function formatDateLong(d: string, lang: Lang): string {
  try {
    return new Date(d).toLocaleDateString(localeFor(lang), {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  } catch {
    return d;
  }
}
