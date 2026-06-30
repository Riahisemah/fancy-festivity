// Système de sections dynamiques — chaque invitation est composée d'une liste ordonnée.
import {
  Calendar, Clock, MapPin, Image as ImageIcon, Quote as QuoteIcon, ListChecks,
  Phone, HelpCircle, Layout, Type, Map as MapIcon, Hourglass,
} from "lucide-react";

export type SectionKind =
  | "hero"
  | "event"
  | "timeline"
  | "card"
  | "gallery"
  | "image-text"
  | "map"
  | "program"
  | "quote"
  | "countdown"
  | "contact"
  | "faq";

export type HeroSection      = { id: string; kind: "hero"; eyebrow?: string; title: string; subtitle?: string; date?: string; location?: string; imageUrl?: string };
export type EventSection     = { id: string; kind: "event"; icon?: string; title: string; date?: string; time?: string; location?: string; description?: string };
export type TimelineSection  = { id: string; kind: "timeline"; title?: string; items: { time: string; label: string; description?: string }[] };
export type CardSection      = { id: string; kind: "card"; title: string; body: string };
export type GallerySection   = { id: string; kind: "gallery"; title?: string; images: string[] };
export type ImageTextSection = { id: string; kind: "image-text"; title: string; body: string; imageUrl: string; reverse?: boolean };
export type MapSection       = { id: string; kind: "map"; title?: string; address: string; embedUrl?: string };
export type ProgramSection   = { id: string; kind: "program"; title?: string; items: { time: string; label: string }[] };
export type QuoteSection     = { id: string; kind: "quote"; text: string; author?: string };
export type CountdownSection = { id: string; kind: "countdown"; targetDate: string; label?: string };
export type ContactSection   = { id: string; kind: "contact"; title?: string; items: { label: string; value: string; type?: "phone" | "email" | "link" }[] };
export type FaqSection       = { id: string; kind: "faq"; title?: string; items: { q: string; a: string }[] };

export type Section =
  | HeroSection | EventSection | TimelineSection | CardSection | GallerySection
  | ImageTextSection | MapSection | ProgramSection | QuoteSection | CountdownSection
  | ContactSection | FaqSection;

export type SectionMeta = {
  kind: SectionKind;
  label: string;
  description: string;
  icon: typeof Calendar;
  emoji: string;
};

export const SECTION_TYPES: SectionMeta[] = [
  { kind: "hero",       label: "Hero",        description: "Section d'accueil grand format", icon: Layout,      emoji: "✨" },
  { kind: "event",      label: "Événement",   description: "Une étape : cérémonie, dîner…",   icon: Calendar,    emoji: "💍" },
  { kind: "timeline",   label: "Timeline",    description: "Déroulé chronologique",            icon: Clock,       emoji: "🕰️" },
  { kind: "program",    label: "Programme",   description: "Liste horaire simple",             icon: ListChecks,  emoji: "📋" },
  { kind: "card",       label: "Carte texte", description: "Un titre + un paragraphe",          icon: Type,        emoji: "📝" },
  { kind: "image-text", label: "Image + Texte", description: "Visuel et description côte à côte", icon: ImageIcon, emoji: "🖼️" },
  { kind: "gallery",    label: "Galerie",     description: "Mosaïque d'images",                 icon: ImageIcon,   emoji: "🌅" },
  { kind: "map",        label: "Plan",        description: "Adresse + carte Google Maps",       icon: MapIcon,     emoji: "📍" },
  { kind: "countdown",  label: "Countdown",   description: "Compte à rebours animé",             icon: Hourglass,   emoji: "⏳" },
  { kind: "quote",      label: "Citation",    description: "Citation mise en avant",             icon: QuoteIcon,   emoji: "💬" },
  { kind: "contact",    label: "Contact",     description: "Coordonnées des organisateurs",       icon: Phone,       emoji: "📞" },
  { kind: "faq",        label: "FAQ",         description: "Questions fréquentes",               icon: HelpCircle,  emoji: "❓" },
];

const uid = () => Math.random().toString(36).slice(2, 10);

export function createSection(kind: SectionKind): Section {
  switch (kind) {
    case "hero":       return { id: uid(), kind, eyebrow: "Vous êtes invité·e", title: "Notre événement", subtitle: "", date: "", location: "" };
    case "event":      return { id: uid(), kind, icon: "💍", title: "Cérémonie", date: "", time: "", location: "", description: "" };
    case "timeline":   return { id: uid(), kind, title: "Déroulé", items: [{ time: "15:00", label: "Cérémonie", description: "" }, { time: "19:00", label: "Dîner", description: "" }] };
    case "card":       return { id: uid(), kind, title: "Un mot pour vous", body: "Votre présence est notre plus beau cadeau." };
    case "gallery":    return { id: uid(), kind, title: "Galerie", images: [] };
    case "image-text": return { id: uid(), kind, title: "Une histoire", body: "Racontez votre histoire ici.", imageUrl: "", reverse: false };
    case "map":        return { id: uid(), kind, title: "Plan d'accès", address: "" };
    case "program":    return { id: uid(), kind, title: "Programme", items: [{ time: "16:00", label: "Accueil" }, { time: "17:00", label: "Cérémonie" }] };
    case "quote":      return { id: uid(), kind, text: "L'amour ne se voit pas avec les yeux, mais avec l'âme.", author: "Shakespeare" };
    case "countdown":  return { id: uid(), kind, targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), label: "Jusqu'au grand jour" };
    case "contact":    return { id: uid(), kind, title: "Contact", items: [{ label: "Organisateur", value: "+33 6 12 34 56 78", type: "phone" }] };
    case "faq":        return { id: uid(), kind, title: "Questions fréquentes", items: [{ q: "Dress code ?", a: "Tenue élégante." }] };
  }
}

export function newId() { return uid(); }
