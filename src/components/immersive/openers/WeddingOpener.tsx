/** Enveloppe romantique — pétales, sceau de cire, carte dorée */
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { OpenerConfig } from "@/lib/opener-config";
import type { ThemeConfig } from "@/lib/themes";
import type { Lang } from "@/lib/i18n";
import { OpenerShell, OpenerCard, OPENER_EASE } from "./OpenerShell";
import { FallingPetals, FloatingParticles } from "./OpenerEffects";
import { useOpenerState } from "./useOpenerState";

export function WeddingOpener({
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
          <FallingPetals colors={palette.particle} count={20} />
          <FloatingParticles colors={palette.particle} count={25} />
        </>
      }
    >
      <motion.div
        initial={{ y: 80, scale: 0.85, opacity: 0, rotateX: 18 }}
        animate={opened
          ? { y: -180, scale: 1.05, opacity: 0, rotateX: 30 }
          : { y: 0, scale: 1, opacity: 1, rotateX: 0 }}
        transition={{ duration: opened ? 1.8 : 1.2, ease: OPENER_EASE }}
        className="relative w-[min(88vw,440px)] aspect-[7/5]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Enveloppe */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: "linear-gradient(160deg, #1a120a 0%, #2a1f14 45%, #1a120a 100%)",
            border: `1px solid ${palette.primary}55`,
            boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 40px ${palette.glow}22`,
          }}
        />

        {/* Sceau */}
        <motion.div
          animate={{ scale: opened ? 0 : 1, opacity: opened ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
        >
          <div
            className="grid place-items-center size-14 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${palette.accent}, ${palette.primary})`,
              boxShadow: `0 0 0 2px ${palette.primary}55, 0 10px 30px rgba(0,0,0,0.5)`,
              color: palette.secondary,
            }}
          >
            <Sparkles className="size-6" />
          </div>
        </motion.div>

        {/* Carte intérieure */}
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={opened ? { y: -280, opacity: 1, rotate: -2 } : { y: 0, opacity: 0 }}
          transition={{ duration: 1.5, ease: OPENER_EASE, delay: 0.12 }}
          className="absolute inset-x-5 top-5 bottom-12 z-20"
        >
          <OpenerCard palette={palette} lang={lang} title={title} hosts={hosts} opened={opened || !visible} className="h-full flex flex-col justify-center" />
        </motion.div>

        {/* Rabat */}
        <motion.div
          animate={{ rotateX: opened ? -180 : 0 }}
          transition={{ duration: 1.1, ease: OPENER_EASE }}
          className="absolute inset-x-0 top-0 h-1/2 origin-top z-40"
          style={{
            transformStyle: "preserve-3d",
            background: "linear-gradient(180deg, #2a1f14 0%, #1a120a 100%)",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            borderTop: `1px solid ${palette.primary}66`,
          }}
        />

        {/* Poche avant */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 z-40"
          style={{
            background: "linear-gradient(180deg, #22190f 0%, #120c07 100%)",
            clipPath: "polygon(0 100%, 100% 100%, 100% 0, 50% 85%, 0 0)",
            borderBottom: `1px solid ${palette.primary}55`,
          }}
        />
      </motion.div>
    </OpenerShell>
  );
}
