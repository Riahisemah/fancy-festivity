/** Rideaux élégants — ouverture théâtrale */
import { motion } from "framer-motion";
import type { OpenerConfig } from "@/lib/opener-config";
import type { ThemeConfig } from "@/lib/themes";
import type { Lang } from "@/lib/i18n";
import { OpenerShell, OpenerCard, OPENER_EASE } from "./OpenerShell";
import { FloatingParticles } from "./OpenerEffects";
import { useOpenerState } from "./useOpenerState";

export function CurtainOpener({
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
      effects={<FloatingParticles colors={palette.particle} count={Math.min(config.particleCount, 40)} />}
    >
      <div className="relative w-[min(92vw,480px)] aspect-[16/10] overflow-hidden rounded-sm">
        {/* Scène */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={opened ? { opacity: 1, scale: 1 } : { opacity: 0.85, scale: 0.95 }}
          transition={{ duration: 1.2, ease: OPENER_EASE, delay: opened ? 0.5 : 0 }}
          className="absolute inset-4 z-0 flex items-center justify-center"
        >
          <OpenerCard
            palette={palette}
            lang={lang}
            title={title}
            hosts={hosts}
            opened={opened}
            className="w-full max-w-sm rounded-xl shadow-2xl"
          />
        </motion.div>

        {/* Rideau gauche */}
        <motion.div
          initial={{ x: 0 }}
          animate={opened ? { x: "-105%" } : { x: 0 }}
          transition={{ duration: 1.6, ease: OPENER_EASE }}
          className="absolute inset-y-0 left-0 w-1/2 z-20 origin-left"
          style={{
            background: `linear-gradient(90deg, ${palette.primary}ee 0%, ${palette.primary}cc 70%, ${palette.accent}88 100%)`,
            boxShadow: `inset -8px 0 24px rgba(0,0,0,0.35), 4px 0 20px rgba(0,0,0,0.4)`,
          }}
        >
          <div className="absolute inset-y-0 right-0 w-3" style={{ background: `linear-gradient(90deg, transparent, ${palette.accent}66)` }} />
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px opacity-30"
              style={{ left: `${15 + i * 18}%`, background: palette.secondary }}
            />
          ))}
        </motion.div>

        {/* Rideau droit */}
        <motion.div
          initial={{ x: 0 }}
          animate={opened ? { x: "105%" } : { x: 0 }}
          transition={{ duration: 1.6, ease: OPENER_EASE }}
          className="absolute inset-y-0 right-0 w-1/2 z-20 origin-right"
          style={{
            background: `linear-gradient(-90deg, ${palette.primary}ee 0%, ${palette.primary}cc 70%, ${palette.accent}88 100%)`,
            boxShadow: `inset 8px 0 24px rgba(0,0,0,0.35), -4px 0 20px rgba(0,0,0,0.4)`,
          }}
        >
          <div className="absolute inset-y-0 left-0 w-3" style={{ background: `linear-gradient(-90deg, transparent, ${palette.accent}66)` }} />
        </motion.div>

        {/* Lambrequin */}
        <motion.div
          animate={opened ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute top-0 inset-x-0 h-6 z-30"
          style={{
            background: `linear-gradient(180deg, ${palette.accent}, ${palette.primary})`,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        />
      </div>
    </OpenerShell>
  );
}
