// Transitions cinématographiques entre sections : chaque section entre comme
// une scène différente avec parallax, 3D et effets de profondeur luxueux.
import { motion, useScroll, useTransform, useReducedMotion, useSpring, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Variant = "rise" | "tilt" | "zoom" | "book" | "portal" | "drift" | "reveal" | "cinema";

const VARIANTS: Variant[] = ["rise", "cinema", "tilt", "reveal", "zoom", "book", "portal", "drift"];

export function SectionShell({
  children,
  depth = 1,
  index = 0,
}: { children: ReactNode; depth?: number; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const variant = VARIANTS[index % VARIANTS.length];

  const { motionStyle, glowOpacity, curtain } = useVariantStyle(variant, smooth, depth);

  if (reduced) return <div ref={ref}>{children}</div>;

  return (
    <div
      ref={ref}
      className="relative my-6 md:my-10 [perspective:2000px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Radiance glow that follows the section */}
      <motion.div
        aria-hidden
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute -inset-x-20 -inset-y-16 -z-10"
      >
        <div
          className="w-full h-full blur-3xl"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 50%, rgba(212,175,55,0.22), rgba(212,175,55,0.05) 55%, transparent 75%)",
          }}
        />
      </motion.div>

      {/* Cinematic curtain sweep on enter */}
      <motion.div
        aria-hidden
        style={{ scaleX: curtain, transformOrigin: "left center" }}
        className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] overflow-hidden"
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent" />
      </motion.div>

      <motion.div
        style={{ ...motionStyle, willChange: "transform, filter, opacity" }}
        className="origin-center"
      >
        {children}
      </motion.div>
    </div>
  );
}

function useVariantStyle(variant: Variant, sp: MotionValue<number>, depth: number) {
  // Called unconditionally to keep hook order stable.
  const opacity = useTransform(sp, [0, 0.18, 0.82, 1], [0, 1, 1, 0.15]);
  const blur    = useTransform(sp, [0, 0.28, 0.72, 1], [14, 0, 0, 10]);
  const filter  = useTransform(blur, (v) => `blur(${v}px)`);
  const glowOpacity = useTransform(sp, [0, 0.35, 0.65, 1], [0, 0.9, 0.9, 0]);
  const curtain = useTransform(sp, [0, 0.35, 0.65, 1], [0, 1, 1, 0]);

  // rise
  const yRise = useTransform(sp, [0, 0.5, 1], [140 * depth, 0, -110 * depth]);
  const scaleRise = useTransform(sp, [0, 0.5, 1], [0.86, 1, 0.94]);
  // tilt
  const rotYTilt = useTransform(sp, [0, 0.5, 1], [-22, 0, 18]);
  const scaleTilt = useTransform(sp, [0, 0.5, 1], [0.82, 1, 0.9]);
  // zoom (dolly)
  const scaleZoom = useTransform(sp, [0, 0.5, 1], [1.35, 1, 0.72]);
  const zZoom = useTransform(sp, [0, 0.5, 1], [-320, 0, -220]);
  // book (page-turn)
  const rotYBook = useTransform(sp, [0, 0.5, 1], [82, 0, -70]);
  const xBook = useTransform(sp, [0, 0.5, 1], [-160, 0, 140]);
  // portal
  const rotXPortal = useTransform(sp, [0, 0.5, 1], [58, 0, -40]);
  const scalePortal = useTransform(sp, [0, 0.5, 1], [0.6, 1, 0.85]);
  // drift
  const xDrift = useTransform(sp, [0, 0.5, 1], [-100, 0, 100]);
  const rotZDrift = useTransform(sp, [0, 0.5, 1], [-6, 0, 5]);
  // reveal (curtain up + tilt back)
  const clipReveal = useTransform(sp, [0, 0.35, 1], ["inset(100% 0 0 0)", "inset(0% 0 0 0)", "inset(0% 0 20% 0)"]);
  const rotXReveal = useTransform(sp, [0, 0.5, 1], [-14, 0, 8]);
  const yReveal = useTransform(sp, [0, 0.5, 1], [60, 0, -60]);
  // cinema (letterbox + slight parallax scale)
  const scaleCine = useTransform(sp, [0, 0.5, 1], [1.15, 1, 0.95]);
  const yCine = useTransform(sp, [0, 0.5, 1], [80, 0, -80]);

  let motionStyle: Record<string, MotionValue<number> | MotionValue<string> | string> = { opacity, filter } as never;
  switch (variant) {
    case "tilt":
      motionStyle = { rotateY: rotYTilt, scale: scaleTilt, opacity, filter } as never; break;
    case "zoom":
      motionStyle = { scale: scaleZoom, z: zZoom, opacity, filter } as never; break;
    case "book":
      motionStyle = { rotateY: rotYBook, x: xBook, opacity, filter, transformOrigin: "left center" } as never; break;
    case "portal":
      motionStyle = { rotateX: rotXPortal, scale: scalePortal, opacity, filter } as never; break;
    case "drift":
      motionStyle = { x: xDrift, rotateZ: rotZDrift, opacity, filter } as never; break;
    case "reveal":
      motionStyle = { clipPath: clipReveal, rotateX: rotXReveal, y: yReveal, opacity, filter } as never; break;
    case "cinema":
      motionStyle = { scale: scaleCine, y: yCine, opacity, filter } as never; break;
    case "rise":
    default:
      motionStyle = { y: yRise, scale: scaleRise, opacity, filter } as never;
  }

  return { motionStyle, glowOpacity, curtain };
}
