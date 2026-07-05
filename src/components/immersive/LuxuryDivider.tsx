// Séparateur luxueux animé entre sections : ligne fine dorée qui se dessine,
// diamant central pulsant et lueur cinématographique.
import { motion } from "framer-motion";

export function LuxuryDivider({ variant = 0 }: { variant?: number }) {
  const v = variant % 4;
  return (
    <div className="relative my-10 md:my-14 flex items-center justify-center select-none">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1 }}
        className="absolute inset-x-0 h-24 -z-10 blur-2xl"
        style={{
          background:
            "radial-gradient(50% 100% at 50% 50%, rgba(212,175,55,0.18), transparent 70%)",
        }}
      />

      {/* Left line */}
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="h-px flex-1 max-w-[36%] origin-right"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212,175,55,0.55) 60%, rgba(212,175,55,0.9))",
        }}
      />

      {/* Ornament */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4, rotate: -180 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-4 md:mx-6 relative"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity }}
          className="text-[#d4af37]"
          style={{ filter: "drop-shadow(0 0 8px rgba(212,175,55,0.6))" }}
        >
          <Ornament variant={v} />
        </motion.div>
      </motion.div>

      {/* Right line */}
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="h-px flex-1 max-w-[36%] origin-left"
        style={{
          background:
            "linear-gradient(to left, transparent, rgba(212,175,55,0.55) 60%, rgba(212,175,55,0.9))",
        }}
      />
    </div>
  );
}

function Ornament({ variant }: { variant: number }) {
  if (variant === 0) {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <path d="M17 2l3.2 11.8L32 17l-11.8 3.2L17 32l-3.2-11.8L2 17l11.8-3.2L17 2z" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="17" cy="17" r="2.2" fill="currentColor" />
      </svg>
    );
  }
  if (variant === 1) {
    return (
      <svg width="38" height="18" viewBox="0 0 38 18" fill="none">
        <path d="M2 9c4-6 8-6 12 0s8 6 12 0 8-6 10 0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="19" cy="9" r="1.8" fill="currentColor" />
      </svg>
    );
  }
  if (variant === 2) {
    return (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <rect x="6" y="6" width="18" height="18" transform="rotate(45 15 15)" stroke="currentColor" strokeWidth="1.1" />
        <rect x="10" y="10" width="10" height="10" transform="rotate(45 15 15)" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="15" cy="15" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="42" height="20" viewBox="0 0 42 20" fill="none">
      <path d="M2 10c6 0 6-6 12-6s6 12 12 12 6-6 14-6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="21" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}
