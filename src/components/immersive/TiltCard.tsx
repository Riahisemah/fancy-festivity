// Tilt 3D suivant la souris. Passif sur mobile.
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";

export function TiltCard({
  children,
  className = "",
  intensity = 8,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 180, damping: 18 });
  const sy = useSpring(py, { stiffness: 180, damping: 18 });
  const rotY = useTransform(sx, (v) => (v - 0.5) * intensity * 2);
  const rotX = useTransform(sy, (v) => -(v - 0.5) * intensity * 2);
  const glareX = useTransform(sx, (v) => `${v * 100}%`);
  const glareY = useTransform(sy, (v) => `${v * 100}%`);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function onLeave() { px.set(0.5); py.set(0.5); }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ perspective: 1000 }}
      className={className}
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative will-change-transform"
      >
        {children}
        {glare && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40 mix-blend-overlay"
            style={{
              background: useTransform([glareX, glareY], ([x, y]) =>
                `radial-gradient(300px 200px at ${x} ${y}, rgba(255,255,255,0.35), transparent 60%)`,
              ),
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
