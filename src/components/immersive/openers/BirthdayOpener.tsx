/** Ouverture festive — confettis, ballons, carte pop */
import { motion } from "framer-motion";
import type { OpenerConfig } from "@/lib/opener-config";
import type { ThemeConfig } from "@/lib/themes";
import type { Lang } from "@/lib/i18n";
import { OpenerShell, OpenerCard, OPENER_EASE } from "./OpenerShell";
import { ConfettiBurst, FloatingBalloons, FloatingParticles } from "./OpenerEffects";
import { useOpenerState } from "./useOpenerState";

export function BirthdayOpener({
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
          <FloatingBalloons colors={palette.particle} />
          <FloatingParticles colors={palette.particle} count={20} />
          <ConfettiBurst colors={palette.particle} active={opened} />
        </>
      }
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
        animate={opened
          ? { scale: 1.2, opacity: 0, y: -200, rotate: 5 }
          : { scale: 1, opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: opened ? 1.6 : 1, ease: OPENER_EASE, type: opened ? "spring" : "tween", stiffness: 200 }}
        className="w-[min(85vw,380px)]"
      >
        {/* Boîte cadeau */}
        <motion.div
          animate={opened ? { scaleY: 0.3, opacity: 0 } : { scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-[-20px] z-0 mx-auto w-[90%] h-8 rounded-t-lg"
          style={{ background: `linear-gradient(180deg, ${palette.primary}, ${palette.glow})` }}
        />
        <OpenerCard
          palette={palette}
          lang={lang}
          title={title}
          hosts={hosts}
          opened={!visible || opened}
          className="relative z-10"
          style={{ borderRadius: "1rem" }}
        />
        {/* Ruban */}
        <motion.div
          animate={opened ? { scale: 0 } : { scale: 1 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 size-16 rounded-full flex items-center justify-center text-2xl"
          style={{ background: palette.accent, boxShadow: `0 0 30px ${palette.accent}88` }}
        >
          🎉
        </motion.div>
      </motion.div>
    </OpenerShell>
  );
}
