import { motion } from "framer-motion";

export function FallingPetals({ colors, count = 18 }: { colors: string[]; count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 73) % 100;
        const delay = (i % 7) * 0.6;
        const duration = 10 + ((i * 3) % 8);
        const size = 8 + (i % 4) * 5;
        const color = colors[i % colors.length];
        return (
          <motion.div
            key={i}
            initial={{ y: -40, x: 0, rotate: 0, opacity: 0 }}
            animate={{
              y: ["-5%", "105%"],
              x: [0, 30, -20, 10, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
            className="absolute"
            style={{ left: `${left}%`, width: size, height: size * 0.7 }}
          >
            <div
              className="size-full rounded-[50%_50%_50%_0] opacity-80 blur-[0.3px]"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}88)`, transform: "rotate(45deg)" }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export function FloatingParticles({ colors, count = 30 }: { colors: string[]; count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 53) % 100;
        const delay = (i % 9) * 0.35;
        const size = 1 + (i % 3);
        const color = colors[i % colors.length];
        return (
          <motion.span
            key={i}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: ["110%", "-10%"], opacity: [0, 0.9, 0] }}
            transition={{ duration: 8 + (i % 6), delay, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-full"
            style={{ left: `${left}%`, width: size, height: size, background: color, boxShadow: `0 0 8px ${color}99` }}
          />
        );
      })}
    </div>
  );
}

export function ConfettiBurst({ colors, active }: { colors: string[]; active: boolean }) {
  const pieces = Array.from({ length: 50 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const color = colors[i % colors.length];
        const angle = (i / pieces.length) * 360;
        const dist = 120 + (i % 5) * 40;
        const rad = (angle * Math.PI) / 180;
        const tx = Math.cos(rad) * dist;
        const ty = Math.sin(rad) * dist - 80;
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0 }}
            animate={active ? {
              x: tx,
              y: ty,
              opacity: [1, 1, 0],
              rotate: 360 + i * 20,
              scale: [0, 1, 0.5],
            } : { opacity: 0 }}
            transition={{ duration: 1.4, delay: i * 0.012, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-1/2"
            style={{
              width: 6 + (i % 4) * 2,
              height: 4 + (i % 3) * 2,
              background: color,
              borderRadius: i % 2 ? "50%" : "1px",
            }}
          />
        );
      })}
    </div>
  );
}

export function FloatingBalloons({ colors }: { colors: string[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {colors.slice(0, 6).map((c, i) => {
        const left = 8 + i * 16;
        return (
          <motion.div
            key={i}
            initial={{ y: "110%" }}
            animate={{ y: ["110%", "-15%"], x: [0, 20, -20, 0] }}
            transition={{ duration: 12 + i * 2, repeat: Infinity, delay: i * 1.2, ease: "linear" }}
            className="absolute"
            style={{ left: `${left}%` }}
          >
            <div
              className="size-10 md:size-12 rounded-full opacity-75 shadow-2xl"
              style={{ background: `radial-gradient(circle at 30% 30%, white, ${c} 65%)` }}
            />
            <div className="mx-auto h-12 w-px bg-white/30" />
          </motion.div>
        );
      })}
    </div>
  );
}

export function GeometricLines({ color }: { color: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: [0, 0.6, 0.3] }}
          transition={{ duration: 2, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute h-px origin-left"
          style={{
            top: `${15 + i * 14}%`,
            left: "5%",
            right: "5%",
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          }}
        />
      ))}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(${color}22 1px, transparent 1px), linear-gradient(90deg, ${color}22 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}

export function TwinklingStars({ color, count = 35 }: { color: string; count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: count }).map((_, i) => {
        const top = (i * 37) % 100;
        const left = (i * 53) % 100;
        const size = 1 + (i % 3);
        return (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 2 + (i % 5), repeat: Infinity, delay: (i % 9) * 0.3 }}
            className="absolute rounded-full"
            style={{ top: `${top}%`, left: `${left}%`, width: size, height: size, background: color }}
          />
        );
      })}
    </div>
  );
}
