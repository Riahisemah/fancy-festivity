import { motion } from "framer-motion";
import type { ThemeConfig } from "@/lib/themes";

/**
 * Floating decorative elements rendered behind invitation content.
 * Purely visual, pointer-events: none.
 */
export function ThemeDecor({ theme }: { theme: ThemeConfig }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {theme.overlay && (
        <div className="absolute inset-0" style={{ backgroundImage: theme.overlay }} />
      )}
      {theme.decor === "petals" && <Petals />}
      {theme.decor === "balloons" && <Balloons />}
      {theme.decor === "stars" && <Stars />}
      {theme.decor === "particles" && <Particles />}
      {theme.decor === "grid" && <Grid />}
    </div>
  );
}

function Petals() {
  const items = Array.from({ length: 14 });
  return (
    <>
      {items.map((_, i) => {
        const left = (i * 73) % 100;
        const delay = (i % 7) * 0.8;
        const duration = 12 + ((i * 3) % 8);
        const size = 10 + (i % 4) * 4;
        return (
          <motion.div
            key={i}
            initial={{ y: -40, x: 0, rotate: 0, opacity: 0 }}
            animate={{
              y: ["-5%", "105%"],
              x: [0, 30, -20, 10, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
            className="absolute"
            style={{ left: `${left}%`, width: size, height: size }}
          >
            <div className="size-full rounded-full bg-gradient-to-br from-[#f4d4a8] to-[#c9a86a] opacity-70 blur-[0.5px]" />
          </motion.div>
        );
      })}
    </>
  );
}

function Balloons() {
  const colors = ["#fde047", "#f472b6", "#60a5fa", "#a78bfa", "#34d399", "#fb923c"];
  return (
    <>
      {colors.map((c, i) => {
        const left = 8 + i * 15;
        return (
          <motion.div
            key={i}
            initial={{ y: "110%" }}
            animate={{ y: ["110%", "-20%"], x: [0, 20, -20, 0] }}
            transition={{ duration: 14 + i * 2, repeat: Infinity, delay: i * 1.5, ease: "linear" }}
            className="absolute"
            style={{ left: `${left}%` }}
          >
            <div
              className="size-12 rounded-full opacity-80 shadow-2xl"
              style={{ background: `radial-gradient(circle at 30% 30%, white, ${c} 60%)` }}
            />
            <div className="mx-auto h-16 w-px bg-white/40" />
          </motion.div>
        );
      })}
    </>
  );
}

function Stars() {
  const items = Array.from({ length: 40 });
  return (
    <>
      {items.map((_, i) => {
        const top = (i * 37) % 100;
        const left = (i * 53) % 100;
        const size = 1 + (i % 3);
        return (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2 + (i % 5), repeat: Infinity, delay: (i % 9) * 0.3 }}
            className="absolute rounded-full bg-amber-200"
            style={{ top: `${top}%`, left: `${left}%`, width: size, height: size }}
          />
        );
      })}
    </>
  );
}

function Particles() {
  const items = Array.from({ length: 22 });
  return (
    <>
      {items.map((_, i) => {
        const left = (i * 47) % 100;
        const delay = (i % 8) * 1.1;
        const duration = 18 + (i % 6) * 2;
        return (
          <motion.div
            key={i}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: ["110%", "-10%"], opacity: [0, 0.7, 0] }}
            transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
            className="absolute size-1 rounded-full bg-[#d4af37]"
            style={{ left: `${left}%`, boxShadow: "0 0 8px rgba(212,175,55,0.8)" }}
          />
        );
      })}
    </>
  );
}

function Grid() {
  return (
    <div
      className="absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage:
          "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
      }}
    />
  );
}
