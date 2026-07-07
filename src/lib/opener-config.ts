import type { ThemeConfig, ThemeKey } from "@/lib/themes";

export type OpenerVariant =
  | "wedding-envelope"
  | "tunisian-scroll"
  | "birthday-burst"
  | "business-fold"
  | "luxury-cinematic"
  | "graduation-scroll"
  | "minimal-fold"
  | "curtain";

export type OpenerPalette = {
  bg: string;
  bgGradient: string;
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  cardBg: string;
  cardText: string;
  particle: string[];
  vignette: string;
};

export type OpenerConfig = {
  variant: OpenerVariant;
  palette: OpenerPalette;
  durationMs: number;
  cameraZoom: number;
  particleCount: number;
};

const PALETTES: Record<ThemeKey, OpenerPalette> = {
  wedding: {
    bg: "#0a0806",
    bgGradient: "radial-gradient(ellipse at 50% 20%, rgba(201,168,106,0.22) 0%, transparent 55%), radial-gradient(ellipse at 50% 90%, rgba(244,194,194,0.12) 0%, transparent 50%), #0a0806",
    primary: "#a8884a",
    secondary: "#faf5ee",
    accent: "#d4b574",
    glow: "#f4d4a8",
    cardBg: "linear-gradient(180deg, #faf5ee 0%, #f0e6d2 100%)",
    cardText: "#2a1f14",
    particle: ["#f4d4a8", "#c9a86a", "#f4c2c2", "#e8d5b5"],
    vignette: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
  },
  tunisian: {
    bg: "#0f0a04",
    bgGradient: "radial-gradient(ellipse at 50% 15%, rgba(168,136,74,0.28) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(212,175,55,0.12) 0%, transparent 45%), #0f0a04",
    primary: "#a8884a",
    secondary: "#f8f2e6",
    accent: "#d4af37",
    glow: "#e8c547",
    cardBg: "linear-gradient(180deg, #f8f2e6 0%, #ede0c8 100%)",
    cardText: "#2a1f14",
    particle: ["#d4af37", "#a8884a", "#f5e9c8", "#c9956b"],
    vignette: "radial-gradient(ellipse at center, transparent 35%, rgba(15,10,4,0.85) 100%)",
  },
  birthday: {
    bg: "#1a0a2e",
    bgGradient: "radial-gradient(ellipse at 30% 20%, rgba(255,110,199,0.35) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(59,130,246,0.3) 0%, transparent 50%), linear-gradient(135deg, #1a0a2e, #2d1b4e)",
    primary: "#ff6ec7",
    secondary: "#ffffff",
    accent: "#fde047",
    glow: "#a855f7",
    cardBg: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(253,242,255,0.98) 100%)",
    cardText: "#4a1d6a",
    particle: ["#fde047", "#f472b6", "#60a5fa", "#a78bfa", "#34d399", "#fb923c"],
    vignette: "radial-gradient(ellipse at center, transparent 30%, rgba(26,10,46,0.8) 100%)",
  },
  business: {
    bg: "#0a0f1c",
    bgGradient: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.2) 0%, transparent 55%), linear-gradient(180deg, #0a0f1c 0%, #111827 100%)",
    primary: "#3b82f6",
    secondary: "#f1f5f9",
    accent: "#60a5fa",
    glow: "#93c5fd",
    cardBg: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
    cardText: "#e2e8f0",
    particle: ["#3b82f6", "#64748b", "#60a5fa", "#94a3b8"],
    vignette: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.75) 100%)",
  },
  luxury: {
    bg: "#000000",
    bgGradient: "radial-gradient(ellipse at 50% 25%, rgba(212,175,55,0.25) 0%, transparent 55%), #000000",
    primary: "#d4af37",
    secondary: "#f5e9c8",
    accent: "#f4d77a",
    glow: "#ffeaa7",
    cardBg: "linear-gradient(180deg, rgba(245,233,200,0.12) 0%, rgba(212,175,55,0.06) 100%)",
    cardText: "#f5e9c8",
    particle: ["#d4af37", "#f4d77a", "#ffffff", "#b8860b"],
    vignette: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.85) 100%)",
  },
  minimal: {
    bg: "#f5f5f5",
    bgGradient: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.9) 0%, #f5f5f5 70%)",
    primary: "#171717",
    secondary: "#ffffff",
    accent: "#737373",
    glow: "#e5e5e5",
    cardBg: "#ffffff",
    cardText: "#171717",
    particle: ["#d4d4d4", "#a3a3a3", "#e5e5e5"],
    vignette: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.08) 100%)",
  },
  graduation: {
    bg: "#1e1b3a",
    bgGradient: "radial-gradient(ellipse at 50% 10%, rgba(251,191,36,0.22) 0%, transparent 55%), linear-gradient(180deg, #1e1b3a 0%, #0f1830 100%)",
    primary: "#fbbf24",
    secondary: "#fef3c7",
    accent: "#f59e0b",
    glow: "#fde68a",
    cardBg: "linear-gradient(180deg, rgba(254,243,199,0.95) 0%, rgba(251,191,36,0.15) 100%)",
    cardText: "#1e1b3a",
    particle: ["#fbbf24", "#fde68a", "#ffffff", "#f59e0b"],
    vignette: "radial-gradient(ellipse at center, transparent 35%, rgba(15,24,48,0.85) 100%)",
  },
};

const VARIANT_MAP: Record<ThemeKey, OpenerVariant> = {
  wedding: "wedding-envelope",
  tunisian: "tunisian-scroll",
  birthday: "birthday-burst",
  business: "business-fold",
  luxury: "luxury-cinematic",
  minimal: "minimal-fold",
  graduation: "graduation-scroll",
};

export function getOpenerConfig(
  themeKey: ThemeKey,
  _theme?: ThemeConfig,
  variantOverride?: OpenerVariant,
): OpenerConfig {
  const palette = PALETTES[themeKey];
  const variant = variantOverride ?? VARIANT_MAP[themeKey];
  return {
    variant,
    palette,
    durationMs: variant === "luxury-cinematic" ? 2600 : 2200,
    cameraZoom: variant === "luxury-cinematic" ? 1.4 : 1,
    particleCount: themeKey === "birthday" ? 60 : themeKey === "luxury" ? 80 : 40,
  };
}

export { PALETTES as PALETTES_BY_THEME };
