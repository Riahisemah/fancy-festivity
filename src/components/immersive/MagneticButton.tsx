// Bouton magnétique : le contenu suit légèrement le curseur.
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";

export function MagneticButton({
  children,
  className = "",
  onClick,
  strength = 18,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  function onMove(e: PointerEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  }
  function onLeave() { x.set(0); y.set(0); }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileTap={{ scale: 0.95 }}
      style={{ x: sx, y: sy }}
      className={className}
    >
      <motion.span style={{ x: sx, y: sy }} className="inline-flex items-center gap-2">
        {children}
      </motion.span>
    </motion.button>
  );
}
