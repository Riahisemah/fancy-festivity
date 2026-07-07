import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import type { ThemeConfig } from "@/lib/themes";
import {
  resolveSceneLayout,
  layoutContainerClass,
  layoutContentClass,
  layoutAccentSideClass,
  type SceneLayout,
} from "@/lib/section-layouts";
import type { SectionKind } from "@/lib/sections";
import { sceneContainer, sceneItem } from "./scene-motion";

const ACCENT_BY_DECOR: Record<string, string> = {
  petals: "#c9a86a",
  arabesque: "#a8884a",
  particles: "#d4af37",
  stars: "#fbbf24",
  balloons: "#a855f7",
  grid: "#3b82f6",
  none: "#a3a3a3",
};

type SceneSectionProps = {
  kind: SectionKind;
  index: number;
  theme: ThemeConfig;
  preview?: boolean;
  children: ReactNode;
  layout?: SceneLayout;
};

/** Chaque section = une scène immersive avec profondeur parallax et layout unique */
export function SceneSection({
  kind,
  index,
  theme,
  preview = false,
  children,
  layout: layoutOverride,
}: SceneSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const layout = layoutOverride ?? resolveSceneLayout(kind, index);
  const accent = ACCENT_BY_DECOR[theme.decor] ?? "#d4af37";

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const decorY = useTransform(scrollYProgress, [0, 1], ["-4%", "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["-2%", "4%"]);
  const fgY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  const disableMotion = preview || reduced;
  const accentSide = layoutAccentSideClass(layout, index);

  return (
    <section
      ref={ref}
      data-scene={layout}
      className={`relative w-full ${layout === "diagonal" ? "" : "overflow-hidden"}`}
      aria-label={`Section ${index + 1}`}
    >
      {!disableMotion && (
        <motion.div aria-hidden style={{ y: bgY }} className="pointer-events-none absolute inset-0 -z-30">
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              background: `radial-gradient(ellipse 80% 60% at ${index % 2 === 0 ? "30%" : "70%"} 40%, ${accent}22, transparent 70%)`,
            }}
          />
          {layout === "diagonal" && (
            <div
              className="absolute -inset-[20%] rotate-[-4deg] opacity-[0.06]"
              style={{
                background: `linear-gradient(135deg, ${accent} 0%, transparent 50%, ${accent}88 100%)`,
              }}
            />
          )}
        </motion.div>
      )}

      {!disableMotion && (
        <motion.div aria-hidden style={{ y: decorY }} className="pointer-events-none absolute inset-0 -z-20">
          <SceneDecoration decor={theme.decor} accent={accent} index={index} />
        </motion.div>
      )}

      <motion.div style={disableMotion ? undefined : { y: contentY }} className={layoutContainerClass(layout)}>
        {accentSide && (
          <div className={accentSide}>
            <AccentPanel decor={theme.decor} accent={accent} index={index} />
          </div>
        )}

        <motion.div
          variants={disableMotion ? undefined : sceneContainer}
          initial={disableMotion ? false : "hidden"}
          whileInView={disableMotion ? undefined : "show"}
          viewport={{ once: true, margin: "-60px" }}
          className={`${layoutContentClass(layout)} ${layout === "floating-glass" ? `${theme.surface} ${theme.border}` : ""}`}
        >
          <motion.div variants={disableMotion ? undefined : sceneItem} className="relative z-10">
            {children}
          </motion.div>
        </motion.div>

        {layout === "split-screen" && (
          <div className="hidden md:flex flex-col justify-center items-center p-12 border-l border-white/5 relative overflow-hidden">
            <SplitScreenArt accent={accent} index={index} decor={theme.decor} />
          </div>
        )}
      </motion.div>

      {!disableMotion && (
        <motion.div aria-hidden style={{ y: fgY }} className="pointer-events-none absolute inset-x-0 bottom-0 h-32 -z-10">
          <div className="w-full h-full" style={{ background: `linear-gradient(to top, ${accent}08, transparent)` }} />
        </motion.div>
      )}
    </section>
  );
}

function SceneDecoration({ decor, accent, index }: { decor: string; accent: string; index: number }) {
  const left = (index * 37) % 80 + 10;
  return (
    <>
      {decor === "petals" && (
        <div className="absolute size-32 rounded-full blur-3xl opacity-30" style={{ top: "10%", left: `${left}%`, background: accent }} />
      )}
      {decor === "arabesque" && (
        <svg className="absolute opacity-[0.08]" style={{ top: "15%", right: "8%", width: 140, height: 140 }} viewBox="0 0 120 120" fill="none" stroke={accent} strokeWidth="0.8">
          <circle cx="60" cy="60" r="50" strokeDasharray="2 4" />
          <path d="M60 10 L68 45 L110 60 L68 75 L60 110 L52 75 L10 60 L52 45 Z" />
        </svg>
      )}
      {decor === "particles" && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          }}
        />
      )}
      {decor === "grid" && (
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(${accent}44 1px, transparent 1px), linear-gradient(90deg, ${accent}44 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      )}
    </>
  );
}

function AccentPanel({ decor, accent, index }: { decor: string; accent: string; index: number }) {
  return (
    <div className="relative w-full max-w-xs aspect-square flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40 + index * 5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full opacity-20"
        style={{ border: `1px dashed ${accent}` }}
      />
      <div className="text-6xl md:text-7xl opacity-30 select-none" style={{ filter: `drop-shadow(0 0 20px ${accent}66)` }}>
        {decor === "petals" && "🌸"}
        {decor === "arabesque" && "✦"}
        {decor === "balloons" && "🎈"}
        {decor === "stars" && "⭐"}
        {decor === "grid" && "◈"}
        {decor === "particles" && "✧"}
        {decor === "none" && "—"}
      </div>
    </div>
  );
}

function SplitScreenArt({ accent, index, decor }: { accent: string; index: number; decor: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: 0.2 }}
      className="relative"
    >
      <div className="size-48 md:size-56 rounded-full blur-2xl absolute inset-0 m-auto opacity-40" style={{ background: accent }} />
      <div className="relative font-serif text-8xl opacity-20" style={{ color: accent }}>
        {index % 3 === 0 ? "∞" : index % 3 === 1 ? "♡" : "✦"}
      </div>
      {decor === "arabesque" && (
        <svg className="absolute -inset-8 opacity-30" viewBox="0 0 200 200" fill="none" stroke={accent}>
          <circle cx="100" cy="100" r="80" strokeDasharray="4 6" />
        </svg>
      )}
    </motion.div>
  );
}
