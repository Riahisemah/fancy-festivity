// Enveloppe cinématographique de section : parallax + fade + blur + scale au scroll.
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

export function SectionShell({
  children,
  depth = 1,
}: { children: ReactNode; depth?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y      = useTransform(scrollYProgress, [0, 0.5, 1], [40 * depth, 0, -30 * depth]);
  const scale  = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98]);
  const blur   = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [6, 0, 0, 4]);
  const opacity = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [0.2, 1, 1, 0.5]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  if (reduced) {
    return <div ref={ref}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ y, scale, opacity, filter, willChange: "transform, filter, opacity" }}
      className="[perspective:1200px]"
    >
      {children}
    </motion.div>
  );
}
