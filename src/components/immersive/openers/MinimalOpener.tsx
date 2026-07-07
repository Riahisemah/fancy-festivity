/** Ouverture minimaliste — pliage origami épuré */
import { motion } from "framer-motion";
import type { OpenerConfig } from "@/lib/opener-config";
import type { ThemeConfig } from "@/lib/themes";
import type { Lang } from "@/lib/i18n";
import { OpenerShell, OpenerCard, OPENER_EASE } from "./OpenerShell";
import { useOpenerState } from "./useOpenerState";

export function MinimalOpener({
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
    >
      <motion.div
        className="relative w-[min(85vw,360px)]"
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        {/* Couverture pliée */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={opened ? { rotateX: -160, opacity: 0 } : { rotateX: 0, opacity: 1 }}
          transition={{ duration: 1.3, ease: OPENER_EASE }}
          className="absolute inset-x-0 top-0 h-1/2 origin-top z-20 rounded-t-2xl"
          style={{
            transformStyle: "preserve-3d",
            background: palette.secondary,
            boxShadow: `0 -2px 20px ${palette.primary}11`,
            borderBottom: `1px solid ${palette.primary}22`,
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={opened ? { opacity: 1, y: 0, scale: 1.02 } : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: OPENER_EASE }}
        >
          <OpenerCard
            palette={palette}
            lang={lang}
            title={title}
            hosts={hosts}
            opened={!visible || opened}
            className="rounded-2xl"
            style={{ boxShadow: `0 20px 60px ${palette.primary}18` }}
          />
        </motion.div>
      </motion.div>
    </OpenerShell>
  );
}
