import { motion } from "framer-motion";
import type { ThemeConfig } from "@/lib/themes";
import { ArabesqueDivider } from "@/components/immersive/TunisianOrnaments";
import { LuxuryDivider } from "@/components/immersive/LuxuryDivider";

const SEPARATOR_TYPES = ["wave", "organic", "gold", "gradient", "particles"] as const;
type SepType = (typeof SEPARATOR_TYPES)[number];

const THEME_SEPARATORS: Record<string, SepType[]> = {
  petals: ["wave", "organic", "gold", "wave", "gradient"],
  arabesque: ["gold", "organic", "gold", "particles", "wave"],
  particles: ["gold", "gradient", "particles", "gold", "gradient"],
  stars: ["gradient", "particles", "gold", "gradient"],
  balloons: ["wave", "organic", "wave", "gradient"],
  grid: ["gold", "gradient", "gold"],
  none: ["gradient", "gold", "gradient"],
};

const ACCENT: Record<string, string> = {
  petals: "#c9a86a",
  arabesque: "#a8884a",
  particles: "#d4af37",
  stars: "#fbbf24",
  balloons: "#a855f7",
  grid: "#3b82f6",
  none: "#d4d4d4",
};

/** Séparateur artistique entre scènes — adapté au thème */
export function ThemeSectionDivider({
  theme,
  index,
  preview = false,
}: {
  theme: ThemeConfig;
  index: number;
  preview?: boolean;
}) {
  const types = THEME_SEPARATORS[theme.decor] ?? THEME_SEPARATORS.none;
  const type = types[index % types.length];
  const accent = ACCENT[theme.decor] ?? "#d4af37";
  const enter = preview
    ? { initial: false as const, animate: { opacity: 1 } }
    : { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true, margin: "-20px" } };

  if (theme.decor === "arabesque" && type === "gold") {
    return <ArabesqueDivider />;
  }

  if (type === "gold" && (theme.decor === "petals" || theme.decor === "particles")) {
    return <LuxuryDivider variant={index} instant={preview} />;
  }

  return (
    <motion.div {...enter} transition={{ duration: 1 }} className="relative my-6 md:my-10 h-16 md:h-24 overflow-hidden">
      {type === "wave" && <WaveSeparator accent={accent} index={index} />}
      {type === "organic" && <OrganicSeparator accent={accent} index={index} />}
      {type === "gradient" && <GradientSeparator accent={accent} />}
      {type === "particles" && <ParticleSeparator accent={accent} index={index} />}
      {type === "gold" && <GoldLineSeparator accent={accent} />}
    </motion.div>
  );
}

function WaveSeparator({ accent, index }: { accent: string; index: number }) {
  const flip = index % 2 === 1;
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={`absolute inset-x-0 w-full h-full ${flip ? "rotate-180" : ""}`} aria-hidden>
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
        fill={`${accent}18`}
        stroke={accent}
        strokeWidth="0.5"
        strokeOpacity="0.4"
      />
    </svg>
  );
}

function OrganicSeparator({ accent, index }: { accent: string; index: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="h-24 w-[120%] origin-center opacity-30"
        style={{
          background: `radial-gradient(ellipse 50% 100% at 50% 50%, ${accent}44, transparent 70%)`,
          transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
        }}
      />
    </div>
  );
}

function GradientSeparator({ accent }: { accent: string }) {
  return (
    <div
      className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-px"
      style={{ background: `linear-gradient(90deg, transparent, ${accent}88, transparent)` }}
    />
  );
}

function GoldLineSeparator({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center gap-4 px-8">
      <span className="h-px flex-1 max-w-[40%]" style={{ background: `linear-gradient(to right, transparent, ${accent})` }} />
      <motion.span
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="size-1.5 rounded-full"
        style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
      />
      <span className="h-px flex-1 max-w-[40%]" style={{ background: `linear-gradient(to left, transparent, ${accent})` }} />
    </div>
  );
}

function ParticleSeparator({ accent, index }: { accent: string; index: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: [0, 0.8, 0], y: [-10, -30] }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: i * 0.08 + (index % 3) * 0.1, repeat: Infinity, repeatDelay: 4 }}
          className="absolute size-1 rounded-full top-1/2"
          style={{ left: `${8 + i * 7}%`, background: accent, boxShadow: `0 0 6px ${accent}` }}
        />
      ))}
    </div>
  );
}
