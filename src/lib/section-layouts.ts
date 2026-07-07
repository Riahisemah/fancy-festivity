import type { SectionKind } from "@/lib/sections";

/** Mises en page scéniques — alternent automatiquement pour éviter la monotonie */
export type SceneLayout =
  | "immersive-hero"
  | "centered-editorial"
  | "split-left"
  | "split-right"
  | "floating-glass"
  | "timeline-vertical"
  | "split-screen"
  | "magazine-luxe"
  | "masonry"
  | "diagonal";

export const SCENE_LAYOUTS: SceneLayout[] = [
  "immersive-hero",
  "centered-editorial",
  "split-left",
  "split-right",
  "floating-glass",
  "timeline-vertical",
  "split-screen",
  "magazine-luxe",
  "masonry",
  "diagonal",
];

const KIND_PREFERRED: Partial<Record<SectionKind, SceneLayout[]>> = {
  hero: ["immersive-hero"],
  timeline: ["timeline-vertical", "split-screen", "floating-glass"],
  program: ["timeline-vertical", "floating-glass", "centered-editorial"],
  gallery: ["masonry", "magazine-luxe", "split-screen"],
  map: ["floating-glass", "split-left", "centered-editorial"],
  quote: ["centered-editorial", "diagonal", "immersive-hero"],
  countdown: ["split-screen", "floating-glass", "centered-editorial"],
  event: ["floating-glass", "magazine-luxe", "split-left"],
  card: ["centered-editorial", "floating-glass", "magazine-luxe"],
  "image-text": ["split-left", "split-right", "magazine-luxe"],
  contact: ["floating-glass", "split-screen"],
  faq: ["centered-editorial", "floating-glass"],
};

/** Résout la mise en page — priorité au type de section, puis alternance par index */
export function resolveSceneLayout(kind: SectionKind, index: number): SceneLayout {
  const preferred = KIND_PREFERRED[kind];
  if (preferred?.length === 1) return preferred[0];
  if (preferred && preferred.length > 1) {
    return preferred[index % preferred.length];
  }
  const rotating = SCENE_LAYOUTS.filter((l) => l !== "immersive-hero");
  return rotating[index % rotating.length];
}

export function layoutContainerClass(layout: SceneLayout): string {
  switch (layout) {
    case "immersive-hero":
      return "min-h-[75vh] md:min-h-[85vh] flex flex-col items-center justify-center py-16 md:py-24";
    case "centered-editorial":
      return "min-h-[50vh] flex flex-col items-center justify-center py-14 md:py-20 max-w-2xl mx-auto text-center";
    case "split-left":
      return "min-h-[55vh] py-14 md:py-20 md:grid md:grid-cols-12 md:gap-10 md:items-center";
    case "split-right":
      return "min-h-[55vh] py-14 md:py-20 md:grid md:grid-cols-12 md:gap-10 md:items-center";
    case "floating-glass":
      return "min-h-[50vh] flex items-center justify-center py-14 md:py-20 px-2";
    case "timeline-vertical":
      return "min-h-[45vh] py-14 md:py-20 max-w-xl mx-auto";
    case "split-screen":
      return "min-h-[55vh] py-14 md:py-20 md:grid md:grid-cols-2 md:gap-0 md:items-stretch";
    case "magazine-luxe":
      return "min-h-[55vh] py-14 md:py-20 md:grid md:grid-cols-12 md:gap-8 md:items-center";
    case "masonry":
      return "min-h-[45vh] py-14 md:py-20 w-full";
    case "diagonal":
      return "min-h-[50vh] py-16 md:py-24 relative overflow-hidden";
    default:
      return "py-14 md:py-20";
  }
}

export function layoutContentClass(layout: SceneLayout): string {
  switch (layout) {
    case "split-left":
      return "md:col-span-7 md:col-start-1";
    case "split-right":
      return "md:col-span-7 md:col-start-6 md:order-2";
    case "magazine-luxe":
      return "md:col-span-7";
    case "floating-glass":
      return "w-full max-w-2xl mx-auto rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl shadow-2xl p-6 md:p-10";
    case "split-screen":
      return "flex flex-col justify-center p-8 md:p-12 h-full";
    case "diagonal":
      return "relative z-10 max-w-3xl mx-auto px-4";
    default:
      return "w-full";
  }
}

export function layoutAccentSideClass(layout: SceneLayout, index: number): string {
  if (layout === "split-left" || layout === "split-right") {
    const side = layout === "split-left" ? "md:col-span-5 md:col-start-8" : "md:col-span-5 md:col-start-1 md:order-1";
    return `${side} hidden md:flex items-center justify-center opacity-40`;
  }
  if (layout === "magazine-luxe") {
    return "md:col-span-5 hidden md:flex items-center justify-center";
  }
  if (layout === "split-screen") {
    return index % 2 === 0
      ? "hidden md:flex items-center justify-center bg-gradient-to-br from-white/[0.04] to-transparent border-l border-white/10"
      : "hidden md:block bg-gradient-to-bl from-white/[0.03] to-transparent";
  }
  return "hidden";
}
