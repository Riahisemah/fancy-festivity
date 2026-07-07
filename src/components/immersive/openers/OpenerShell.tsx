import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import type { OpenerPalette } from "@/lib/opener-config";
import { isRTL, t, type Lang } from "@/lib/i18n";

const EASE = [0.16, 1, 0.3, 1] as const;

export function OpenerShell({
  visible,
  opened,
  palette,
  themeCtaClass,
  lang,
  onOpen,
  children,
  effects,
  perspective = 1400,
}: {
  visible: boolean;
  opened: boolean;
  palette: OpenerPalette;
  themeCtaClass: string;
  lang: Lang;
  onOpen: () => void;
  children: ReactNode;
  effects?: ReactNode;
  perspective?: number;
}) {
  const rtl = isRTL(lang);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1, ease: EASE }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden min-h-dvh"
          style={{ perspective, background: palette.bgGradient }}
        >
          {/* Vignette cinématique */}
          <div className="pointer-events-none absolute inset-0" style={{ background: palette.vignette }} />

          {/* Effets thématiques (pétales, confettis, etc.) */}
          {effects}

          {/* Scène principale (carte, enveloppe, parchemin…) */}
          <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
            {children}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: opened ? 0 : 1, y: opened ? 24 : 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
            className={`absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:bottom-[10%] flex flex-col items-center gap-3 z-20 px-4 ${rtl ? "font-arabic" : ""}`}
          >
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className={`${rtl ? "text-sm tracking-normal normal-case" : "text-[10px] uppercase tracking-[0.5em]"} text-white/50`}
            >
              {t(lang, "youAreInvited")}
            </motion.p>
            <motion.button
              data-opener-cta
              onClick={onOpen}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`group relative min-h-12 px-10 py-4 rounded-full text-sm font-medium overflow-hidden touch-target ${themeCtaClass} ${rtl ? "tracking-normal normal-case" : "tracking-[0.15em] uppercase"}`}
            >
              <span className="relative z-10">{t(lang, "open")}</span>
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </motion.button>
          </motion.div>

          {/* Flash lumineux à l'ouverture */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: opened ? [0, 0.6, 0] : 0 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="pointer-events-none absolute inset-0 z-30"
            style={{ background: `radial-gradient(circle at 50% 45%, ${palette.glow}88, transparent 60%)` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Carte d'invitation réutilisable avec révélation staggered */
export function OpenerCard({
  palette,
  lang,
  title,
  hosts,
  opened,
  className = "",
  style,
}: {
  palette: OpenerPalette;
  lang: Lang;
  title: string;
  hosts?: string;
  opened: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const rtl = isRTL(lang);
  const items = [
    { key: "eyebrow", delay: 0.3 },
    { key: "divider", delay: 0.5 },
    { key: "title", delay: 0.65 },
    { key: "hosts", delay: 0.85 },
    { key: "footer", delay: 1.0 },
  ];

  return (
    <motion.div
      className={`relative rounded-xl shadow-2xl overflow-hidden text-center px-8 py-10 ${className}`}
      style={{
        background: palette.cardBg,
        color: palette.cardText,
        boxShadow: `0 40px 100px rgba(0,0,0,0.5), inset 0 0 0 1px ${palette.primary}44`,
        ...style,
      }}
    >
      {/* Bordure dorée animée */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 0.8 : [0.3, 0.7, 0.3] }}
        transition={{ duration: opened ? 0.6 : 2.5, repeat: opened ? 0 : Infinity }}
        style={{ boxShadow: `inset 0 0 0 2px ${palette.primary}, inset 0 0 30px ${palette.glow}33` }}
      />

      {items.map(({ key, delay }) => {
        if (key === "hosts" && !hosts) return null;
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay, ease: EASE }}
          >
            {key === "eyebrow" && (
              <p className={`${rtl ? "font-arabic text-sm" : "text-[9px] uppercase tracking-[0.45em]"}`} style={{ color: palette.primary }}>
                {t(lang, "youAreInvited")}
              </p>
            )}
            {key === "divider" && (
              <div className="mx-auto my-4 h-px w-12" style={{ background: `${palette.primary}66` }} />
            )}
            {key === "title" && (
              <h2 className={`${rtl ? "font-arabic-display text-2xl md:text-3xl leading-[1.4]" : "font-serif italic text-2xl md:text-3xl leading-tight"}`}>
                {title}
              </h2>
            )}
            {key === "hosts" && hosts && (
              <p className={`mt-3 text-xs opacity-70 ${rtl ? "font-arabic" : "font-serif italic"}`}>{hosts}</p>
            )}
            {key === "footer" && (
              <div className="mt-5 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                    className="size-1 rounded-full"
                    style={{ background: palette.primary }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export { EASE as OPENER_EASE };
