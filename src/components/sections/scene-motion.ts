/** Variants Framer Motion pour révélation interne des scènes */
export const SCENE_EASE = [0.16, 1, 0.3, 1] as const;

export const sceneContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
};

export const sceneItem = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: SCENE_EASE },
  },
};

export const sceneItemScale = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: SCENE_EASE },
  },
};

export function sceneStaggerDelay(index: number, preview: boolean) {
  return preview ? 0 : index * 0.12;
}
