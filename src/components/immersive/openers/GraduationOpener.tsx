/** Diplôme — parchemin académique + étoiles */
import { motion } from "framer-motion";
import type { OpenerConfig } from "@/lib/opener-config";
import type { ThemeConfig } from "@/lib/themes";
import type { Lang } from "@/lib/i18n";
import { OpenerShell, OpenerCard, OPENER_EASE } from "./OpenerShell";
import { TwinklingStars, FloatingParticles } from "./OpenerEffects";
import { useOpenerState } from "./useOpenerState";

export function GraduationOpener({
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
      effects={
        <>
          <TwinklingStars color={palette.primary} />
          <FloatingParticles colors={palette.particle} count={20} />
        </>
      }
    >
      <motion.div
        initial={{ rotateX: 90, opacity: 0, y: 40 }}
        animate={opened
          ? { rotateX: -20, opacity: 0, y: -120, scale: 1.1 }
          : { rotateX: 0, opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: opened ? 1.6 : 1.2, ease: OPENER_EASE }}
        className="relative w-[min(88vw,400px)]"
        style={{ transformStyle: "preserve-3d", perspective: 1200 }}
      >
        {/* Ruban diploma */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 px-6 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{ background: palette.primary, color: palette.cardText }}
        >
          🎓
        </motion.div>

        <OpenerCard
          palette={palette}
          lang={lang}
          title={title}
          hosts={hosts}
          opened={!visible || opened}
          style={{
            borderTop: `4px solid ${palette.primary}`,
            boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 40px ${palette.glow}22`,
          }}
        />

        {/* Seal */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 1.2, type: "spring" }}
          className="absolute -bottom-4 right-8 size-12 rounded-full flex items-center justify-center text-lg z-20"
          style={{
            background: `radial-gradient(circle, ${palette.accent}, ${palette.primary})`,
            boxShadow: `0 4px 20px ${palette.primary}66`,
          }}
        >
          ✦
        </motion.div>
      </motion.div>
    </OpenerShell>
  );
}
