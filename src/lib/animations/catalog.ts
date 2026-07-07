import type {
  OpenerAnimationId,
  OpenerAnimationMeta,
  SectionTransitionId,
  SectionTransitionMeta,
  InvitationAnimationSettings,
} from "./types";
import { DEFAULT_ANIMATION_PARAMS, DEFAULT_ANIMATION_SETTINGS } from "./types";

export const OPENER_ANIMATIONS: OpenerAnimationMeta[] = [
  { id: "auto", name: "Auto (theme)", nameFr: "Automatique (thème)", description: "Animation recommandée selon le thème choisi.", category: "elegant", intensity: "medium", emoji: "✨", compatibleThemes: "all", variant: "wedding-envelope", tags: ["Défaut"] },
  { id: "envelope", name: "Envelope", nameFr: "Enveloppe", description: "L'enveloppe s'ouvre et révèle l'invitation avec un sceau de cire.", category: "elegant", intensity: "medium", emoji: "✉️", compatibleThemes: ["wedding", "tunisian", "luxury"], variant: "wedding-envelope", tags: ["Classique", "Romantique"] },
  { id: "book", name: "Book", nameFr: "Livre", description: "L'invitation s'ouvre comme les pages d'un livre précieux.", category: "elegant", intensity: "soft", emoji: "📖", compatibleThemes: ["wedding", "graduation", "minimal"], variant: "minimal-fold", tags: ["Élégant"] },
  { id: "parchment", name: "Parchment", nameFr: "Parchemin", description: "Le parchemin se déroule avec calligraphie et cadre doré.", category: "elegant", intensity: "medium", emoji: "📜", compatibleThemes: ["tunisian", "wedding", "luxury"], variant: "tunisian-scroll", tags: ["Traditionnel", "Orientale"] },
  { id: "curtain", name: "Curtain", nameFr: "Rideau", description: "Des rideaux élégants s'écartent pour dévoiler l'invitation.", category: "elegant", intensity: "intense", emoji: "🎭", compatibleThemes: ["luxury", "wedding", "tunisian"], variant: "curtain", tags: ["Spectaculaire"] },
  { id: "origami", name: "Origami", nameFr: "Origami", description: "L'invitation se déplie progressivement en origami.", category: "elegant", intensity: "soft", emoji: "🦢", compatibleThemes: ["minimal", "wedding", "business"], variant: "minimal-fold", tags: ["Minimal"] },
  { id: "luxury-reveal", name: "Luxury Reveal", nameFr: "Révélation luxe", description: "Lumière dorée et révélation progressive premium.", category: "elegant", intensity: "intense", emoji: "✨", compatibleThemes: ["luxury", "wedding", "tunisian"], variant: "luxury-cinematic", tags: ["Premium", "Or"] },
  { id: "royal-frame", name: "Royal Frame", nameFr: "Cadre royal", description: "Le cadre doré apparaît puis le contenu se révèle.", category: "elegant", intensity: "medium", emoji: "👑", compatibleThemes: ["tunisian", "luxury", "wedding"], variant: "tunisian-scroll", tags: ["Prestige"] },
  { id: "floral-reveal", name: "Floral Reveal", nameFr: "Révélation florale", description: "Pétales de roses et révélation romantique.", category: "elegant", intensity: "medium", emoji: "🌸", compatibleThemes: ["wedding", "tunisian"], variant: "wedding-envelope", tags: ["Romantique", "Fleurs"] },
  { id: "card-3d", name: "3D Card", nameFr: "Carte 3D", description: "Carte en verre qui arrive depuis la profondeur.", category: "modern", intensity: "intense", emoji: "🃏", compatibleThemes: ["luxury", "business"], variant: "luxury-cinematic", tags: ["3D", "WebGL"] },
  { id: "camera-zoom", name: "Camera Zoom", nameFr: "Zoom cinéma", description: "Travelling caméra avec zoom cinématographique.", category: "modern", intensity: "intense", emoji: "🎥", compatibleThemes: "all", variant: "luxury-cinematic", tags: ["Cinéma"] },
  { id: "portal", name: "Portal", nameFr: "Portail", description: "Ouverture via un portail lumineux iris.", category: "modern", intensity: "intense", emoji: "🌀", compatibleThemes: ["luxury", "graduation", "business"], variant: "business-fold", tags: ["Futuriste"] },
  { id: "floating-luxury", name: "Floating Luxury", nameFr: "Flottant luxe", description: "Carte flottante avec particules dorées.", category: "modern", intensity: "medium", emoji: "💫", compatibleThemes: ["luxury", "wedding"], variant: "luxury-cinematic", tags: ["Particules"] },
  { id: "glass-reveal", name: "Glass Reveal", nameFr: "Verre", description: "Effet glassmorphism animé premium.", category: "modern", intensity: "medium", emoji: "🔮", compatibleThemes: ["luxury", "minimal", "business"], variant: "luxury-cinematic", tags: ["Glass"] },
  { id: "infinite-depth", name: "Infinite Depth", nameFr: "Profondeur infinie", description: "Multiples couches de profondeur en parallax.", category: "modern", intensity: "intense", emoji: "♾️", compatibleThemes: ["business", "minimal", "luxury"], variant: "business-fold", tags: ["Profondeur"] },
  { id: "cinematic-intro", name: "Cinematic Intro", nameFr: "Intro cinéma", description: "Introduction type bande-annonce avec travelling.", category: "modern", intensity: "intense", emoji: "🎬", compatibleThemes: "all", variant: "luxury-cinematic", tags: ["Bande-annonce"] },
];

export const SECTION_TRANSITIONS: SectionTransitionMeta[] = [
  { id: "auto", name: "Automatique (thème)", description: "Transitions variées selon le thème.", emoji: "✨" },
  { id: "smooth-scroll", name: "Smooth Scroll", description: "Montée fluide et élégante.", emoji: "〰️" },
  { id: "page-flip", name: "Page Flip", description: "Tourne-page comme un livre.", emoji: "📖" },
  { id: "slide-3d", name: "Slide 3D", description: "Glissement avec perspective 3D.", emoji: "↔️" },
  { id: "camera-travel", name: "Camera Travel", description: "Travelling cinématographique.", emoji: "🎥" },
  { id: "cube-rotation", name: "Cube Rotation", description: "Rotation de cube 3D.", emoji: "🎲" },
  { id: "fade-luxury", name: "Fade Luxury", description: "Révélation douce avec blur.", emoji: "✨" },
  { id: "morphing", name: "Morphing", description: "Pliage origami fluide.", emoji: "🦋" },
  { id: "parallax-story", name: "Parallax Story", description: "Dérive narrative parallax.", emoji: "📖" },
  { id: "timeline-flow", name: "Timeline Flow", description: "Portail entre chaque scène.", emoji: "⏳" },
  { id: "cinematic-scroll", name: "Cinematic Scroll", description: "Tunnel de profondeur immersif.", emoji: "🎬" },
];

export function getOpenerAnimation(id: OpenerAnimationId): OpenerAnimationMeta {
  return OPENER_ANIMATIONS.find((a) => a.id === id) ?? OPENER_ANIMATIONS[0];
}

export function getSectionTransition(id: SectionTransitionId): SectionTransitionMeta {
  return SECTION_TRANSITIONS.find((t) => t.id === id) ?? SECTION_TRANSITIONS[0];
}

export function parseAnimationSettings(raw: unknown): InvitationAnimationSettings {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_ANIMATION_SETTINGS, params: { ...DEFAULT_ANIMATION_PARAMS } };
  }
  const o = raw as Partial<InvitationAnimationSettings>;
  const validOpeners = OPENER_ANIMATIONS.map((a) => a.id);
  const validTransitions = SECTION_TRANSITIONS.map((t) => t.id);
  const musicPresets = ["romantic", "oriental", "tunisian", "classic", "modern", "none"] as const;
  const music = o.music && typeof o.music === "object"
    ? {
        enabled: Boolean(o.music.enabled),
        preset: musicPresets.includes(o.music.preset as typeof musicPresets[number]) ? o.music.preset! : "none" as const,
      }
    : undefined;
  return {
    openerId: validOpeners.includes(o.openerId as OpenerAnimationId) ? o.openerId! : "auto",
    sectionTransitionId: validTransitions.includes(o.sectionTransitionId as SectionTransitionId) ? o.sectionTransitionId! : "auto",
    params: {
      ...DEFAULT_ANIMATION_PARAMS,
      ...(typeof o.params === "object" && o.params ? o.params : {}),
    },
    ...(music ? { music } : {}),
    ...(typeof o.storyMode === "boolean" ? { storyMode: o.storyMode } : {}),
    ...(typeof o.welcomeMessage === "string" ? { welcomeMessage: o.welcomeMessage } : {}),
  };
}

export function isOpenerCompatibleWithTheme(meta: OpenerAnimationMeta, theme: string): boolean {
  if (meta.id === "auto" || meta.compatibleThemes === "all") return true;
  return meta.compatibleThemes.includes(theme as never);
}
