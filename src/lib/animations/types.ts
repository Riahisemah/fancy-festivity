import type { ThemeKey } from "@/lib/themes";
import type { OpenerVariant } from "@/lib/opener-config";

export type OpenerAnimationId =
  | "auto"
  | "envelope"
  | "book"
  | "parchment"
  | "curtain"
  | "origami"
  | "luxury-reveal"
  | "royal-frame"
  | "floral-reveal"
  | "card-3d"
  | "camera-zoom"
  | "portal"
  | "floating-luxury"
  | "glass-reveal"
  | "infinite-depth"
  | "cinematic-intro";

export type SectionTransitionId =
  | "auto"
  | "smooth-scroll"
  | "page-flip"
  | "slide-3d"
  | "camera-travel"
  | "cube-rotation"
  | "fade-luxury"
  | "morphing"
  | "parallax-story"
  | "timeline-flow"
  | "cinematic-scroll";

export type AnimationIntensity = "soft" | "medium" | "intense";

export type AnimationParams = {
  speed: number;
  intensity: number;
  durationMs: number;
  particleLevel: number;
  depth3d: number;
  lightEffects: boolean;
  cameraEffects: boolean;
};

export type InvitationAnimationSettings = {
  openerId: OpenerAnimationId;
  sectionTransitionId: SectionTransitionId;
  params: AnimationParams;
  /** Musique de fond optionnelle */
  music?: { enabled: boolean; preset: "romantic" | "oriental" | "tunisian" | "classic" | "modern" | "none" };
  /** Mode story plein écran (mobile) */
  storyMode?: boolean;
  /** Message d'accueil avant l'opener (ex: "Bienvenue...") */
  welcomeMessage?: string;
};

export type OpenerAnimationMeta = {
  id: OpenerAnimationId;
  name: string;
  nameFr: string;
  description: string;
  category: "elegant" | "modern";
  intensity: AnimationIntensity;
  emoji: string;
  compatibleThemes: ThemeKey[] | "all";
  variant: OpenerVariant;
  tags: string[];
};

export type SectionTransitionMeta = {
  id: SectionTransitionId;
  name: string;
  description: string;
  emoji: string;
};

export const DEFAULT_ANIMATION_PARAMS: AnimationParams = {
  speed: 1,
  intensity: 65,
  durationMs: 2400,
  particleLevel: 60,
  depth3d: 55,
  lightEffects: true,
  cameraEffects: true,
};

export const DEFAULT_ANIMATION_SETTINGS: InvitationAnimationSettings = {
  openerId: "auto",
  sectionTransitionId: "auto",
  params: { ...DEFAULT_ANIMATION_PARAMS },
};
