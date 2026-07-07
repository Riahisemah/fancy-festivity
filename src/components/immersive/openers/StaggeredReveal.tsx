import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Révélation progressive du contenu après l'ouverture */
export function StaggeredReveal({
  ready,
  children,
  className = "",
}: {
  ready: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 1, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredSection({
  index,
  ready,
  children,
}: {
  index: number;
  ready: boolean;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
      animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 40, filter: "blur(6px)" }}
      transition={{ duration: 0.9, delay: ready ? 0.15 + index * 0.12 : 0, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
