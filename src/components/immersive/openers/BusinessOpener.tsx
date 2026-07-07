/** Ouverture corporate — lignes géométriques, pliage tech */
import { motion } from "framer-motion";
import type { OpenerConfig } from "@/lib/opener-config";
import type { ThemeConfig } from "@/lib/themes";
import type { Lang } from "@/lib/i18n";
import { OpenerShell, OpenerCard, OPENER_EASE } from "./OpenerShell";
import { GeometricLines } from "./OpenerEffects";
import { useOpenerState } from "./useOpenerState";

export function BusinessOpener({
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
      effects={<GeometricLines color={palette.primary} />}
    >
      <motion.div
        className="relative w-[min(88vw,400px)]"
        style={{ transformStyle: "preserve-3d", perspective: 1200 }}
      >
        {/* Panneau gauche */}
        <motion.div
          initial={{ rotateY: 0 }}
          animate={opened ? { rotateY: -120, opacity: 0.3 } : { rotateY: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: OPENER_EASE }}
          className="absolute inset-y-0 left-0 w-1/2 origin-left z-10 rounded-l-xl backdrop-blur-xl border border-white/10"
          style={{ background: `${palette.primary}18`, transformStyle: "preserve-3d" }}
        />
        {/* Panneau droit */}
        <motion.div
          initial={{ rotateY: 0 }}
          animate={opened ? { rotateY: 120, opacity: 0.3 } : { rotateY: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: OPENER_EASE }}
          className="absolute inset-y-0 right-0 w-1/2 origin-right z-10 rounded-r-xl backdrop-blur-xl border border-white/10"
          style={{ background: `${palette.primary}18`, transformStyle: "preserve-3d" }}
        />

        {/* Carte centrale */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, z: -50 }}
          animate={opened
            ? { scale: 1.05, opacity: 0, y: -80, z: 100 }
            : { scale: 1, opacity: 1, y: 0, z: 0 }}
          transition={{ duration: opened ? 1.4 : 1, ease: OPENER_EASE, delay: opened ? 0.3 : 0.2 }}
          className="relative z-20"
        >
          <OpenerCard
            palette={palette}
            lang={lang}
            title={title}
            hosts={hosts}
            opened={!visible || opened}
            style={{ backdropFilter: "blur(20px)", border: `1px solid ${palette.primary}33` }}
          />
        </motion.div>

        {/* Scan line */}
        <motion.div
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute inset-x-0 h-px z-30 opacity-40"
          style={{ background: `linear-gradient(90deg, transparent, ${palette.accent}, transparent)` }}
        />
      </motion.div>
    </OpenerShell>
  );
}
