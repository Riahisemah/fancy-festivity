// Transition cinématographique inter-section : chaque section entre comme une nouvelle
// "scène" avec un travelling caméra différent (rotation 3D, page-turn, zoom, etc.).
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Variant = "tilt" | "book" | "zoom" | "portal" | "drift" | "rise";

const VARIANTS: Variant[] = ["rise", "tilt", "zoom", "book", "portal", "drift"];

export function SectionShell({
  children,
  depth = 1,
  index = 0,
}: { children: ReactNode; depth?: number; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const variant = VARIANTS[index % VARIANTS.length];

  const style = useVariantStyle(variant, scrollYProgress, depth);

  if (reduced) return <div ref={ref}>{children}</div>;

  return (
    <div ref={ref} className="[perspective:1600px]" style={{ transformStyle: "preserve-3d" }}>
      <motion.div
        style={{ ...style, willChange: "transform, filter, opacity" }}
        className="origin-center"
      >
        {children}
      </motion.div>
    </div>
  );
}

function useVariantStyle(variant: Variant, sp: MotionValue<number>, depth: number) {
  // Every hook is called unconditionally to keep hook order stable.
  const opacity = useTransform(sp, [0, 0.22, 0.78, 1], [0.15, 1, 1, 0.35]);
  const blur    = useTransform(sp, [0, 0.3, 0.7, 1], [8, 0, 0, 6]);
  const filter  = useTransform(blur, (v) => `blur(${v}px)`);

  // rise
  const yRise = useTransform(sp, [0, 0.5, 1], [80 * depth, 0, -60 * depth]);
  // tilt
  const rotYTilt = useTransform(sp, [0, 0.5, 1], [-14, 0, 12]);
  const scaleTilt = useTransform(sp, [0, 0.5, 1], [0.9, 1, 0.94]);
  // zoom
  const scaleZoom = useTransform(sp, [0, 0.5, 1], [1.25, 1, 0.82]);
  const zZoom = useTransform(sp, [0, 0.5, 1], [-200, 0, -150]);
  // book (page-turn)
  const rotYBook = useTransform(sp, [0, 0.5, 1], [70, 0, -55]);
  const xBook = useTransform(sp, [0, 0.5, 1], [-120, 0, 100]);
  // portal
  const rotXPortal = useTransform(sp, [0, 0.5, 1], [45, 0, -30]);
  const scalePortal = useTransform(sp, [0, 0.5, 1], [0.7, 1, 0.9]);
  // drift
  const xDrift = useTransform(sp, [0, 0.5, 1], [-60, 0, 60]);
  const rotZDrift = useTransform(sp, [0, 0.5, 1], [-4, 0, 3]);

  switch (variant) {
    case "tilt":
      return { rotateY: rotYTilt, scale: scaleTilt, opacity, filter };
    case "zoom":
      return { scale: scaleZoom, z: zZoom, opacity, filter };
    case "book":
      return { rotateY: rotYBook, x: xBook, opacity, filter, transformOrigin: "left center" };
    case "portal":
      return { rotateX: rotXPortal, scale: scalePortal, opacity, filter };
    case "drift":
      return { x: xDrift, rotateZ: rotZDrift, opacity, filter };
    case "rise":
    default:
      return { y: yRise, opacity, filter };
  }
}
