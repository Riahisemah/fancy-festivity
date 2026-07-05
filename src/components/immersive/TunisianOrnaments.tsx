// Ornements tunisiens : coins décoratifs dorés, bordure arabesque, cachet de cire,
// texture papier & effet dorure. Purement décoratif (pointer-events: none).
import { motion } from "framer-motion";

/**
 * Four decorative gold corners + subtle border frame that overlays the page.
 * Use inside a positioned parent (invitation shell) with `pointer-events: none`.
 */
export function TunisianFrame({ intensity = 1 }: { intensity?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5]">
      {/* Paper vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(60,40,15,0.18) 100%)",
          opacity: intensity,
        }}
      />
      {/* Fine gold frame */}
      <div
        className="absolute inset-3 md:inset-6 rounded-[28px]"
        style={{
          border: "1px solid rgba(168,136,74,0.35)",
          boxShadow: "inset 0 0 0 1px rgba(212,175,55,0.15), 0 0 60px rgba(212,175,55,0.05)",
          opacity: 0.9 * intensity,
        }}
      />
      {/* Corners */}
      <Corner className="top-3 left-3 md:top-6 md:left-6" />
      <Corner className="top-3 right-3 md:top-6 md:right-6 rtl-mirror-x" flipX />
      <Corner className="bottom-3 left-3 md:bottom-6 md:left-6" flipY />
      <Corner className="bottom-3 right-3 md:bottom-6 md:right-6" flipX flipY />

      {/* Slow gold shimmer sweeping across the frame */}
      <div className="absolute inset-3 md:inset-6 overflow-hidden rounded-[28px]">
        <div
          className="absolute -inset-y-4 -inset-x-1/3 animate-shimmer"
          style={{
            background:
              "linear-gradient(115deg, transparent 40%, rgba(255,235,180,0.10) 50%, transparent 60%)",
          }}
        />
      </div>
    </div>
  );
}

function Corner({ className, flipX, flipY }: { className?: string; flipX?: boolean; flipY?: boolean }) {
  const scale = `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`;
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 0.85, scale: 1 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      viewBox="0 0 120 120"
      className={`absolute size-24 md:size-32 ${className ?? ""}`}
      style={{ transform: scale }}
      fill="none"
      stroke="url(#gold-grad)"
      strokeWidth={1.1}
    >
      <defs>
        <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a6a1e" />
          <stop offset="45%" stopColor="#f0d67a" />
          <stop offset="60%" stopColor="#fff4c6" />
          <stop offset="100%" stopColor="#a8884a" />
        </linearGradient>
      </defs>
      {/* Outer curved arch */}
      <path d="M4 60 Q4 4 60 4" />
      {/* Inner arabesque swirl */}
      <path d="M10 40 Q22 10 40 10 Q30 20 30 34 Q30 50 14 50 Q22 44 22 34" />
      {/* Small mandala accent */}
      <g transform="translate(20 20)">
        <circle cx="0" cy="0" r="3.2" />
        <path d="M0 -8 L0 8 M-8 0 L8 0 M-5.6 -5.6 L5.6 5.6 M-5.6 5.6 L5.6 -5.6" />
        <circle cx="0" cy="0" r="8" strokeDasharray="1.5 2" />
      </g>
      {/* Little floral cluster */}
      <g stroke="url(#gold-grad)" strokeWidth={0.9}>
        <path d="M45 45 q10 -5 20 0" />
        <path d="M50 42 q5 -8 15 -6" />
        <circle cx="65" cy="42" r="1.6" fill="url(#gold-grad)" stroke="none" />
        <circle cx="55" cy="38" r="1.1" fill="url(#gold-grad)" stroke="none" />
      </g>
    </motion.svg>
  );
}

/**
 * Rich arabesque mandala used as an inline divider between sections.
 */
export function ArabesqueDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 my-10 ${className}`}>
      <span className="h-px flex-1 max-w-[140px] bg-gradient-to-r from-transparent to-[#a8884a]/60" />
      <motion.svg
        viewBox="0 0 60 60"
        className="size-8 text-[#a8884a]"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.8}
      >
        <circle cx="30" cy="30" r="4" />
        <circle cx="30" cy="30" r="12" strokeDasharray="2 2" />
        <path d="M30 4 L34 26 L56 30 L34 34 L30 56 L26 34 L4 30 L26 26 Z" />
      </motion.svg>
      <span className="h-px flex-1 max-w-[140px] bg-gradient-to-l from-transparent to-[#a8884a]/60" />
    </div>
  );
}

/**
 * Elegant wax seal, positioned typically at the bottom of the invitation.
 */
export function WaxSeal({ label = "V" }: { label?: string }) {
  return (
    <motion.div
      initial={{ scale: 0.5, rotate: -30, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.6 }}
      className="mx-auto grid place-items-center size-16 rounded-full"
      style={{
        background: "radial-gradient(circle at 32% 30%, #b91c1c, #6b0f0f 70%, #3a0808)",
        boxShadow:
          "0 12px 30px rgba(0,0,0,0.35), inset 0 -6px 12px rgba(0,0,0,0.4), inset 0 3px 6px rgba(255,180,180,0.35)",
      }}
    >
      <span
        className="font-serif italic text-2xl"
        style={{ color: "#f5e4c0", textShadow: "0 1px 0 rgba(0,0,0,0.5)" }}
      >
        {label}
      </span>
    </motion.div>
  );
}
