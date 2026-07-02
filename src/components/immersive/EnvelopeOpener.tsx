// Animation d'ouverture cinématographique de l'invitation.
// Une enveloppe se pose, le rabat s'ouvre, une carte s'envole, la scène cède la place au contenu.
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import type { ThemeConfig } from "@/lib/themes";
import { t, type Lang } from "@/lib/i18n";

const EASE = [0.16, 1, 0.3, 1] as const;

export function EnvelopeOpener({
  theme,
  title,
  hosts,
  lang = "fr",
  storageKey,
}: {
  theme: ThemeConfig;
  title: string;
  hosts?: string;
  lang?: Lang;
  storageKey: string;
}) {
  const [visible, setVisible] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const seen = sessionStorage.getItem(storageKey);
      if (!seen) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [storageKey]);

  function open() {
    setOpened(true);
    try { sessionStorage.setItem(storageKey, "1"); } catch { /* ignore */ }
    setTimeout(() => setVisible(false), 1800);
  }

  const cta = t(lang, "open") || "Ouvrir";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ perspective: 1400 }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-xl"
          />
          {/* Ambient light beams */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: opened ? 1 : 0.6 }}
            transition={{ duration: 1.2 }}
            style={{
              background:
                "radial-gradient(60% 40% at 50% 30%, rgba(212,175,55,0.28), transparent 70%), radial-gradient(50% 40% at 50% 80%, rgba(255,255,255,0.06), transparent 70%)",
            }}
          />

          {/* Envelope */}
          <motion.div
            initial={{ y: 60, scale: 0.9, opacity: 0, rotateX: 15 }}
            animate={
              opened
                ? { y: -120, scale: 1.08, opacity: 0, rotateX: 25 }
                : { y: 0, scale: 1, opacity: 1, rotateX: 0 }
            }
            transition={{ duration: opened ? 1.6 : 1, ease: EASE }}
            className="relative w-[min(88vw,440px)] aspect-[7/5]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Envelope back */}
            <div
              className="absolute inset-0 rounded-xl shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
              style={{
                background: "linear-gradient(160deg, #1a120a 0%, #2a1f14 45%, #1a120a 100%)",
                border: "1px solid rgba(212,175,55,0.35)",
              }}
            />
            {/* Wax seal center (only before open) */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: opened ? 0 : 1, opacity: opened ? 0 : 1 }}
              transition={{ duration: 0.4 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
            >
              <div
                className="grid place-items-center size-14 rounded-full text-[#f5e9c8] shadow-xl"
                style={{
                  background: "radial-gradient(circle at 30% 30%, #d4af37, #7a5a1a)",
                  boxShadow: "0 0 0 2px rgba(212,175,55,0.35), 0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                <Sparkles className="size-6" />
              </div>
            </motion.div>

            {/* Card sliding out */}
            <motion.div
              initial={{ y: 0, opacity: 0, rotate: 0 }}
              animate={opened ? { y: -260, opacity: 1, rotate: -2 } : { y: 0, opacity: 0, rotate: 0 }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
              className="absolute inset-x-6 top-6 bottom-10 rounded-lg z-20 flex flex-col items-center justify-center text-center px-6"
              style={{
                background: "linear-gradient(180deg, #faf5ee, #f0e6d2)",
                boxShadow: "0 30px 60px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(168,136,74,0.25)",
                color: "#2a1f14",
              }}
            >
              <div className="text-[9px] uppercase tracking-[0.45em] text-[#a8884a]">
                {t(lang, "youAreInvited") || "You're invited"}
              </div>
              <div className="mt-3 font-serif italic text-2xl md:text-3xl leading-tight">
                {title}
              </div>
              {hosts && (
                <div className="mt-2 text-xs opacity-70 font-serif italic">{hosts}</div>
              )}
              <div className="mt-4 h-px w-10 bg-[#a8884a]/50" />
            </motion.div>

            {/* Envelope flap */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: opened ? -180 : 0 }}
              transition={{ duration: 1, ease: EASE }}
              className="absolute inset-x-0 top-0 h-1/2 origin-top z-40"
              style={{
                transformStyle: "preserve-3d",
                background:
                  "linear-gradient(180deg, #2a1f14 0%, #1a120a 100%)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                borderTop: "1px solid rgba(212,175,55,0.4)",
              }}
            />
            {/* Envelope front pocket */}
            <div
              className="absolute inset-x-0 bottom-0 h-1/2 z-40"
              style={{
                background: "linear-gradient(180deg, #22190f 0%, #120c07 100%)",
                clipPath: "polygon(0 100%, 100% 100%, 100% 0, 50% 85%, 0 0)",
                borderBottom: "1px solid rgba(212,175,55,0.35)",
              }}
            />
          </motion.div>

          {/* CTA */}
          <motion.button
            onClick={open}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: opened ? 0 : 1, y: opened ? 20 : 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className={`absolute bottom-[10%] px-8 py-3.5 rounded-full text-sm font-medium tracking-wide ${theme.ctaClass}`}
          >
            {cta}
          </motion.button>

          {/* Floating dust */}
          <FloatingDust />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FloatingDust() {
  const items = Array.from({ length: 26 });
  return (
    <div className="absolute inset-0 pointer-events-none">
      {items.map((_, i) => {
        const left = (i * 53) % 100;
        const delay = (i % 9) * 0.4;
        const size = 1 + (i % 3);
        return (
          <motion.span
            key={i}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: ["110%", "-10%"], opacity: [0, 0.9, 0] }}
            transition={{ duration: 8 + (i % 6), delay, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-full bg-[#d4af37]"
            style={{ left: `${left}%`, width: size, height: size, boxShadow: "0 0 8px rgba(212,175,55,0.9)" }}
          />
        );
      })}
    </div>
  );
}
