import type { ThemeKey, ThemeConfig } from "@/lib/themes";
import type { OpenerConfig, OpenerVariant } from "@/lib/opener-config";
import { getOpenerConfig } from "@/lib/opener-config";
import type {
  InvitationAnimationSettings,
  OpenerAnimationId,
  AnimationParams,
  SectionTransitionId,
} from "./types";
import { getOpenerAnimation } from "./catalog";

export type SectionShellVariant =
  | "rise" | "cinema" | "tilt" | "reveal" | "zoom" | "book" | "portal"
  | "drift" | "cube" | "origami" | "curtain" | "tunnel" | "iris" | "swing";

export const SECTION_TRANSITION_VARIANT: Record<SectionTransitionId, SectionShellVariant | "theme"> = {
  auto: "theme",
  "smooth-scroll": "rise",
  "page-flip": "book",
  "slide-3d": "tilt",
  "camera-travel": "cinema",
  "cube-rotation": "cube",
  "fade-luxury": "reveal",
  morphing: "origami",
  "parallax-story": "drift",
  "timeline-flow": "portal",
  "cinematic-scroll": "tunnel",
};

export function resolveOpenerVariant(
  settings: InvitationAnimationSettings,
  themeKey: ThemeKey,
): OpenerVariant {
  if (settings.openerId === "auto") {
    return getOpenerConfig(themeKey).variant;
  }
  return getOpenerAnimation(settings.openerId).variant;
}

export function resolveOpenerConfig(
  settings: InvitationAnimationSettings,
  themeKey: ThemeKey,
  theme?: ThemeConfig,
): OpenerConfig {
  const variant = resolveOpenerVariant(settings, themeKey);
  const base = getOpenerConfig(themeKey, theme, variant);
  const meta = getOpenerAnimation(settings.openerId);

  let config: OpenerConfig = {
    ...base,
    variant,
    durationMs: settings.params.durationMs,
    particleCount: computeParticleCount(settings.params, meta.id),
    cameraZoom: computeCameraZoom(settings.params, variant),
  };

  if (settings.openerId === "floral-reveal") {
    config = { ...config, particleCount: Math.max(config.particleCount, 35) };
  }
  if (settings.openerId === "camera-zoom" || settings.openerId === "cinematic-intro") {
    config = { ...config, cameraZoom: Math.max(config.cameraZoom, 1.6) };
  }

  return applySpeedMultiplier(config, settings.params);
}

function computeParticleCount(params: AnimationParams, openerId: OpenerAnimationId): number {
  const base = 20 + (params.particleLevel / 100) * 80;
  if (!params.lightEffects) return Math.round(base * 0.4);
  if (openerId === "floating-luxury" || openerId === "floral-reveal") return Math.round(base * 1.3);
  return Math.round(base);
}

function computeCameraZoom(params: AnimationParams, variant: OpenerVariant): number {
  let z = 1 + (params.depth3d / 100) * 0.8;
  if (params.cameraEffects) z *= 1.15;
  if (variant === "luxury-cinematic") z *= 1.1;
  return z;
}

function applySpeedMultiplier(config: OpenerConfig, params: AnimationParams): OpenerConfig {
  const speed = Math.max(0.5, Math.min(2, params.speed));
  const intensity = params.intensity / 100;
  return {
    ...config,
    durationMs: Math.round(config.durationMs / speed),
    particleCount: Math.round(config.particleCount * (0.6 + intensity * 0.8)),
  };
}

export function resolveSectionTransitionVariant(
  settings: InvitationAnimationSettings,
): SectionShellVariant | "theme" {
  return SECTION_TRANSITION_VARIANT[settings.sectionTransitionId] ?? "theme";
}
