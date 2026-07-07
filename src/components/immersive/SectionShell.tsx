// Transitions cinématographiques entre sections, thématisées.
// Chaque section entre comme une nouvelle scène : cube, origami, portail,
// rideau, tunnel, page-flip, dolly zoom, etc. La variante dépend du thème
// et de l'index pour ne jamais répéter deux fois le même effet à la suite.
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

type Variant =
  | "rise"
  | "cinema"
  | "tilt"
  | "reveal"
  | "zoom"
  | "book"
  | "portal"
  | "drift"
  | "cube"
  | "origami"
  | "curtain"
  | "tunnel"
  | "iris"
  | "swing";

// Palettes de transitions par famille de thème. Chaque thème pioche dans son
// set favori, avec fallback global.
const THEME_VARIANTS: Record<string, Variant[]> = {
  petals:     ["reveal", "book", "curtain", "swing", "rise", "origami"],       // Mariage
  arabesque:  ["origami", "iris", "cube", "reveal", "portal", "curtain"],      // Tunisien
  particles:  ["cinema", "portal", "tunnel", "zoom", "iris", "drift"],         // Luxury
  stars:      ["portal", "tunnel", "cinema", "reveal", "zoom", "drift"],       // Graduation
  balloons:   ["swing", "rise", "drift", "cube", "book", "cinema"],            // Anniversaire
  grid:       ["cinema", "cube", "tunnel", "iris", "zoom", "drift"],           // Business
  none:       ["reveal", "rise", "cinema", "drift", "tilt", "zoom"],           // Minimal
};

export function SectionShell({
  children,
  depth = 1,
  index = 0,
  themeDecor = "none",
  preview = false,
  variantOverride,
}: {
  children: ReactNode;
  depth?: number;
  index?: number;
  themeDecor?: string;
  /** Désactive les animations scroll-linked (aperçu éditeur / modale). */
  preview?: boolean;
  /** Force une variante de transition (choix utilisateur). */
  variantOverride?: Variant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  const set = THEME_VARIANTS[themeDecor] ?? THEME_VARIANTS.none;
  const variant = variantOverride ?? set[index % set.length];

  const { motionStyle, glowOpacity, curtainScale, sceneWipe } = useVariantStyle(
    variant,
    smooth,
    depth,
  );

  if (reduced || preview) return <div ref={ref}>{children}</div>;

  return (
    <div
      ref={ref}
      className="relative my-8 md:my-14 [perspective:2200px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Halo cinématographique qui suit la section */}
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

      {/* Rideau doré qui balaie à l'entrée */}
      <motion.div
        aria-hidden
        style={{ scaleX: curtainScale, transformOrigin: "left center" }}
        className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] overflow-hidden"
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-[#d4af37]/12 to-transparent" />
      </motion.div>

      {/* Scène : balayage lumineux en début de section (marque de changement de scène) */}
      <motion.div
        aria-hidden
        style={{
          x: sceneWipe,
          opacity: useTransform(sceneWipe, [-120, -60, 0, 60, 120], [0, 0.9, 0, 0.9, 0]),
        }}
        className="pointer-events-none absolute inset-y-0 -inset-x-4 -z-10"
      >
        <div
          className="w-32 h-full blur-2xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,240,200,0.6), transparent)",
          }}
        />
      </motion.div>

      <motion.div
        style={{ ...motionStyle, willChange: "transform, filter, opacity, clip-path" }}
        className="origin-center"
      >
        {children}
      </motion.div>
    </div>
  );
}

function useVariantStyle(variant: Variant, sp: MotionValue<number>, depth: number) {
  // Appelés inconditionnellement pour garder un ordre stable de hooks.
  const opacity = useTransform(sp, [0, 0.18, 0.82, 1], [0, 1, 1, 0.15]);
  const blur    = useTransform(sp, [0, 0.28, 0.72, 1], [16, 0, 0, 12]);
  const filter  = useTransform(blur, (v) => `blur(${v}px)`);
  const glowOpacity = useTransform(sp, [0, 0.35, 0.65, 1], [0, 0.9, 0.9, 0]);
  const curtainScale = useTransform(sp, [0, 0.35, 0.65, 1], [0, 1, 1, 0]);
  const sceneWipe = useTransform(sp, [0, 0.5, 1], [-120, 0, 120]);

  // Transforms de base
  const yRise = useTransform(sp, [0, 0.5, 1], [160 * depth, 0, -120 * depth]);
  const scaleRise = useTransform(sp, [0, 0.5, 1], [0.84, 1, 0.94]);
  const rotYTilt = useTransform(sp, [0, 0.5, 1], [-24, 0, 20]);
  const scaleTilt = useTransform(sp, [0, 0.5, 1], [0.82, 1, 0.9]);
  const scaleZoom = useTransform(sp, [0, 0.5, 1], [1.4, 1, 0.7]);
  const zZoom = useTransform(sp, [0, 0.5, 1], [-360, 0, -240]);
  const rotYBook = useTransform(sp, [0, 0.5, 1], [90, 0, -75]);
  const xBook = useTransform(sp, [0, 0.5, 1], [-180, 0, 160]);
  const rotXPortal = useTransform(sp, [0, 0.5, 1], [65, 0, -45]);
  const scalePortal = useTransform(sp, [0, 0.5, 1], [0.55, 1, 0.85]);
  const xDrift = useTransform(sp, [0, 0.5, 1], [-120, 0, 120]);
  const rotZDrift = useTransform(sp, [0, 0.5, 1], [-7, 0, 6]);
  const clipReveal = useTransform(sp, [0, 0.35, 1], [
    "inset(100% 0 0 0)",
    "inset(0% 0 0 0)",
    "inset(0% 0 20% 0)",
  ]);
  const rotXReveal = useTransform(sp, [0, 0.5, 1], [-16, 0, 10]);
  const yReveal = useTransform(sp, [0, 0.5, 1], [80, 0, -60]);
  const scaleCine = useTransform(sp, [0, 0.5, 1], [1.18, 1, 0.94]);
  const yCine = useTransform(sp, [0, 0.5, 1], [90, 0, -80]);

  // Cube : rotation Y importante avec profondeur (face qui pivote)
  const rotYCube = useTransform(sp, [0, 0.5, 1], [-95, 0, 80]);
  const zCube = useTransform(sp, [0, 0.5, 1], [-420, 0, -300]);
  // Origami : pliage vertical via rotateX + clip
  const rotXOrigami = useTransform(sp, [0, 0.5, 1], [80, 0, -70]);
  const clipOrigami = useTransform(sp, [0, 0.5, 1], [
    "inset(45% 0 45% 0)",
    "inset(0% 0 0 0)",
    "inset(20% 0 20% 0)",
  ]);
  // Curtain : ouverture latérale symétrique
  const clipCurtain = useTransform(sp, [0, 0.5, 1], [
    "inset(0 50% 0 50%)",
    "inset(0 0% 0 0%)",
    "inset(0 15% 0 15%)",
  ]);
  const yCurtain = useTransform(sp, [0, 0.5, 1], [40, 0, -40]);
  // Tunnel : dolly zoom fort avec léger roulis
  const scaleTunnel = useTransform(sp, [0, 0.5, 1], [2.2, 1, 0.55]);
  const zTunnel = useTransform(sp, [0, 0.5, 1], [-800, 0, -600]);
  const rotZTunnel = useTransform(sp, [0, 0.5, 1], [-4, 0, 6]);
  // Iris : cercle qui s'ouvre depuis le centre (portail lumineux)
  const clipIris = useTransform(sp, [0, 0.5, 1], [
    "circle(0% at 50% 50%)",
    "circle(80% at 50% 50%)",
    "circle(60% at 50% 50%)",
  ]);
  const scaleIris = useTransform(sp, [0, 0.5, 1], [1.1, 1, 0.92]);
  // Swing : pendule 3D (rotateZ + rotateX)
  const rotZSwing = useTransform(sp, [0, 0.5, 1], [-14, 0, 10]);
  const rotXSwing = useTransform(sp, [0, 0.5, 1], [22, 0, -18]);
  const ySwing = useTransform(sp, [0, 0.5, 1], [-40, 0, 40]);

  let motionStyle: Record<string, MotionValue<number> | MotionValue<string> | string> = {
    opacity,
    filter,
  } as never;

  switch (variant) {
    case "tilt":
      motionStyle = { rotateY: rotYTilt, scale: scaleTilt, opacity, filter } as never; break;
    case "zoom":
      motionStyle = { scale: scaleZoom, z: zZoom, opacity, filter } as never; break;
    case "book":
      motionStyle = {
        rotateY: rotYBook, x: xBook, opacity, filter,
        transformOrigin: "left center",
      } as never; break;
    case "portal":
      motionStyle = { rotateX: rotXPortal, scale: scalePortal, opacity, filter } as never; break;
    case "drift":
      motionStyle = { x: xDrift, rotateZ: rotZDrift, opacity, filter } as never; break;
    case "reveal":
      motionStyle = {
        clipPath: clipReveal, rotateX: rotXReveal, y: yReveal, opacity, filter,
      } as never; break;
    case "cinema":
      motionStyle = { scale: scaleCine, y: yCine, opacity, filter } as never; break;
    case "cube":
      motionStyle = {
        rotateY: rotYCube, z: zCube, opacity, filter,
        transformOrigin: "center center -240px",
      } as never; break;
    case "origami":
      motionStyle = {
        rotateX: rotXOrigami, clipPath: clipOrigami, opacity, filter,
        transformOrigin: "center top",
      } as never; break;
    case "curtain":
      motionStyle = { clipPath: clipCurtain, y: yCurtain, opacity, filter } as never; break;
    case "tunnel":
      motionStyle = {
        scale: scaleTunnel, z: zTunnel, rotateZ: rotZTunnel, opacity, filter,
      } as never; break;
    case "iris":
      motionStyle = { clipPath: clipIris, scale: scaleIris, opacity, filter } as never; break;
    case "swing":
      motionStyle = {
        rotateZ: rotZSwing, rotateX: rotXSwing, y: ySwing, opacity, filter,
        transformOrigin: "center top",
      } as never; break;
    case "rise":
    default:
      motionStyle = { y: yRise, scale: scaleRise, opacity, filter } as never;
  }

  return { motionStyle, glowOpacity, curtainScale, sceneWipe };
}
