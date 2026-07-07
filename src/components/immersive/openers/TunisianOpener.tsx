/** Parchemin tunisien — motifs orientaux, cadre doré qui se dessine, révélation calligraphique */
import { motion } from "framer-motion";
import type { OpenerConfig } from "@/lib/opener-config";
import type { ThemeConfig } from "@/lib/themes";
import type { Lang } from "@/lib/i18n";
import { isRTL, t } from "@/lib/i18n";
import { OpenerShell, OPENER_EASE } from "./OpenerShell";
import { FloatingParticles } from "./OpenerEffects";
import { useOpenerState } from "./useOpenerState";

export function TunisianOpener({
  config, theme, title, hosts, lang, storageKey, onReady,
}: {
  config: OpenerConfig;
  theme: ThemeConfig;
  title: string;
  hosts?: string;
  lang: Lang;
  storageKey: string;
  onReady?: () => void;
}) {
  const { visible, opened, open } = useOpenerState(storageKey);
  const { palette } = config;
  const rtl = isRTL(lang);

  function handleOpen() {
    open(config.durationMs);
    window.setTimeout(() => onReady?.(), config.durationMs);
  }

  return (
    <OpenerShell
      visible={visible}
      opened={opened}
      palette={palette}
      themeCtaClass={theme.ctaClass}
      lang={lang}
      onOpen={handleOpen}
      perspective={1600}
      effects={
        <>
          <FloatingParticles colors={palette.particle} count={35} />
          <ArabesqueBackground color={palette.primary} />
        </>
      }
    >
      <motion.div
        initial={{ scaleY: 0.08, scaleX: 0.6, opacity: 0 }}
        animate={opened
          ? { scaleY: 1.15, scaleX: 1.05, opacity: 0, y: -100 }
          : { scaleY: 1, scaleX: 1, opacity: 1, y: 0 }}
        transition={{ duration: opened ? 1.8 : 1.4, ease: OPENER_EASE }}
        className="relative w-[min(90vw,420px)] origin-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Rouleau haut */}
        <motion.div
          animate={{ scaleY: opened ? 0 : 1, opacity: opened ? 0 : 1 }}
          transition={{ duration: 0.8, ease: OPENER_EASE }}
          className="mx-auto h-4 w-[105%] -ml-[2.5%] rounded-full mb-1"
          style={{ background: `linear-gradient(180deg, ${palette.primary}, ${palette.accent})`, boxShadow: `0 4px 20px ${palette.glow}44` }}
        />

        {/* Parchemin */}
        <div
          className="relative rounded-sm px-8 py-12 md:py-14 text-center overflow-hidden"
          style={{
            background: palette.cardBg,
            color: palette.cardText,
            boxShadow: `0 50px 100px rgba(0,0,0,0.55), inset 0 0 0 1px ${palette.primary}33`,
            minHeight: 320,
          }}
        >
          {/* Texture papier */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Cadre SVG animé */}
          <svg className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] pointer-events-none" viewBox="0 0 400 500" fill="none">
            <motion.rect
              x="4" y="4" width="392" height="492" rx="4"
              stroke={palette.primary}
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 2, ease: OPENER_EASE }}
            />
            <motion.path
              d="M20 20 L60 20 L60 60 M340 20 L380 20 L380 60 M20 480 L60 480 L60 440 M340 480 L380 480 L380 440"
              stroke={palette.primary}
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, delay: 0.3, ease: OPENER_EASE }}
            />
            {/* Motif central */}
            <motion.circle
              cx="200" cy="250" r="40"
              stroke={palette.primary}
              strokeWidth="0.8"
              strokeDasharray="2 4"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              transition={{ duration: 1.2, delay: 0.8, ease: OPENER_EASE }}
            />
          </svg>

          {/* Contenu révélé */}
          <motion.p
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1.2, delay: 0.5, ease: OPENER_EASE }}
            className={`relative z-10 ${rtl ? "font-arabic text-sm" : "text-[9px] uppercase tracking-[0.4em]"}`}
            style={{ color: palette.primary }}
          >
            {t(lang, "youAreInvited")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: OPENER_EASE }}
            className="relative z-10 mx-auto my-5 h-px w-16 origin-center"
            style={{ background: palette.primary }}
          />

          <motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 1.1, ease: OPENER_EASE }}
            className={`relative z-10 ${rtl ? "font-arabic-display text-2xl md:text-3xl leading-[1.45]" : "font-serif italic text-2xl md:text-3xl"}`}
            dir={rtl ? "rtl" : "ltr"}
          >
            {title}
          </motion.h2>

          {hosts && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ duration: 1, delay: 1.5 }}
              className={`relative z-10 mt-4 text-xs ${rtl ? "font-arabic" : "font-serif italic"}`}
              dir={rtl ? "rtl" : "ltr"}
            >
              {hosts}
            </motion.p>
          )}

          {/* Lumière dorée */}
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: [0, 0.4, 0], x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, delay: 1, ease: "easeInOut" }}
            className="absolute inset-y-0 w-1/3 pointer-events-none"
            style={{ background: `linear-gradient(90deg, transparent, ${palette.glow}55, transparent)` }}
          />
        </div>

        {/* Rouleau bas */}
        <motion.div
          animate={{ scaleY: opened ? 0 : 1, opacity: opened ? 0 : 1 }}
          transition={{ duration: 0.8, ease: OPENER_EASE }}
          className="mx-auto h-4 w-[105%] -ml-[2.5%] rounded-full mt-1"
          style={{ background: `linear-gradient(180deg, ${palette.accent}, ${palette.primary})`, boxShadow: `0 -4px 20px ${palette.glow}44` }}
        />
      </motion.div>
    </OpenerShell>
  );
}

function ArabesqueBackground({ color }: { color: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.svg
          key={i}
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: [0, 0.3, 0.2], rotate: 360 }}
          transition={{ duration: 60, delay: i * 2, repeat: Infinity, ease: "linear" }}
          className="absolute"
          style={{ left: `${(i * 30) % 80}%`, top: `${(i * 40) % 70}%`, width: 120, height: 120 }}
          viewBox="0 0 120 120"
          fill="none"
          stroke={color}
          strokeWidth="0.6"
        >
          <circle cx="60" cy="60" r="50" strokeDasharray="1 3" />
          <path d="M60 10 L68 45 L110 60 L68 75 L60 110 L52 75 L10 60 L52 45 Z" />
        </motion.svg>
      ))}
    </div>
  );
}
