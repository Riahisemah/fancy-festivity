// Ambient thématique : couche visuelle permanente selon le thème.
// - wedding/petals : pétales de roses + halo doré rose
// - birthday/balloons : confettis multicolores + éclats
// - luxury/particles : poussière dorée + rayons de lumière
// - graduation/stars : étincelles + comètes
// - business/grid : lignes lumineuses + scanlines
// - arabesque : motifs orbitants + poussière d'or
// - none/minimal : discret vignette
import { motion } from "framer-motion";
import type { ThemeConfig } from "@/lib/themes";

export function ThemedAmbient({ theme }: { theme: ThemeConfig }) {
  const d = theme.decor;
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      {d === "petals" && <RosePetals />}
      {d === "balloons" && <Confetti />}
      {d === "particles" && <GoldDust />}
      {d === "stars" && <ShootingStars />}
      {d === "grid" && <TechLines />}
      {d === "arabesque" && <ArabesqueOrbit />}
      <LightRays intensity={d === "particles" || d === "arabesque" || d === "stars" ? 0.55 : 0.25} />
    </div>
  );
}

/* -------- Wedding: pétales + halo -------- */
function RosePetals() {
  const petals = Array.from({ length: 22 });
  return (
    <>
      {petals.map((_, i) => {
        const left = (i * 41) % 100;
        const delay = (i % 8) * 1.2;
        const dur = 16 + (i % 6) * 3;
        const size = 10 + (i % 5) * 5;
        const drift = 40 + (i % 5) * 20;
        const hue = i % 3 === 0 ? "#f4c2c2" : i % 3 === 1 ? "#e8a7b3" : "#c9a86a";
        return (
          <motion.div
            key={i}
            initial={{ y: "-10%", x: 0, rotate: 0, opacity: 0 }}
            animate={{
              y: ["-10%", "110%"],
              x: [0, drift, -drift, drift / 2, 0],
              rotate: [0, 180, 360, 540],
              opacity: [0, 0.85, 0.85, 0],
            }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "linear" }}
            className="absolute"
            style={{ left: `${left}%`, width: size, height: size }}
          >
            <div
              className="w-full h-full"
              style={{
                background: `radial-gradient(circle at 30% 30%, #fff, ${hue} 55%, transparent 75%)`,
                borderRadius: "60% 40% 60% 40% / 50% 60% 40% 50%",
                filter: "blur(0.3px)",
                boxShadow: `0 0 12px ${hue}55`,
              }}
            />
          </motion.div>
        );
      })}
    </>
  );
}

/* -------- Birthday: confettis multicolores -------- */
function Confetti() {
  const colors = ["#ff6ec7", "#fbbf24", "#60a5fa", "#34d399", "#a78bfa", "#f472b6", "#facc15"];
  const items = Array.from({ length: 40 });
  return (
    <>
      {items.map((_, i) => {
        const left = (i * 29) % 100;
        const delay = (i % 10) * 0.5;
        const dur = 8 + (i % 5) * 2;
        const c = colors[i % colors.length];
        const w = 5 + (i % 4);
        const h = 8 + (i % 3) * 3;
        return (
          <motion.div
            key={i}
            initial={{ y: "-10%", opacity: 0, rotate: 0 }}
            animate={{
              y: ["-10%", "110%"],
              rotate: [0, 360 + (i % 4) * 180],
              x: [0, 20, -20, 10, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "linear" }}
            className="absolute"
            style={{
              left: `${left}%`,
              width: w,
              height: h,
              background: c,
              boxShadow: `0 0 6px ${c}88`,
              borderRadius: i % 2 ? "2px" : "50%",
            }}
          />
        );
      })}
    </>
  );
}

/* -------- Luxury: poussière dorée -------- */
function GoldDust() {
  const items = Array.from({ length: 60 });
  return (
    <>
      {items.map((_, i) => {
        const left = (i * 17) % 100;
        const top = (i * 31) % 100;
        const size = 1 + (i % 3);
        const dur = 3 + (i % 5);
        return (
          <motion.span
            key={i}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.4, 0.5],
              y: [0, -20 - (i % 4) * 8],
            }}
            transition={{ duration: dur, delay: (i % 12) * 0.3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full bg-[#f4d77a]"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: size,
              height: size,
              boxShadow: "0 0 8px rgba(244,215,122,0.9), 0 0 16px rgba(212,175,55,0.4)",
            }}
          />
        );
      })}
    </>
  );
}

/* -------- Graduation: étoiles filantes -------- */
function ShootingStars() {
  const stars = Array.from({ length: 40 });
  const comets = Array.from({ length: 4 });
  return (
    <>
      {stars.map((_, i) => {
        const left = (i * 53) % 100;
        const top = (i * 37) % 100;
        return (
          <motion.span
            key={`s${i}`}
            animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.3, 0.7] }}
            transition={{ duration: 2 + (i % 4), delay: (i % 9) * 0.4, repeat: Infinity }}
            className="absolute rounded-full bg-amber-100"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: 2,
              height: 2,
              boxShadow: "0 0 6px rgba(253,230,138,0.9)",
            }}
          />
        );
      })}
      {comets.map((_, i) => (
        <motion.div
          key={`c${i}`}
          initial={{ x: "-20%", y: `${10 + i * 20}%`, opacity: 0 }}
          animate={{ x: ["-20%", "120%"], opacity: [0, 1, 0] }}
          transition={{
            duration: 4 + i,
            delay: i * 3.5,
            repeat: Infinity,
            repeatDelay: 6,
            ease: "easeIn",
          }}
          className="absolute h-px w-40"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(253,230,138,0.9), rgba(253,230,138,0))",
            filter: "drop-shadow(0 0 6px rgba(253,230,138,0.7))",
            transform: "rotate(-15deg)",
          }}
        />
      ))}
    </>
  );
}

/* -------- Business: scanlines & lignes lumineuses -------- */
function TechLines() {
  const lines = Array.from({ length: 6 });
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(96,165,250,0.5) 1px, transparent 1px)",
          backgroundSize: "100% 4px",
        }}
      />
      {lines.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "-10%" }}
          animate={{ y: ["-10%", "110%"] }}
          transition={{
            duration: 5 + i,
            delay: i * 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute h-24 w-full"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(96,165,250,0.18), transparent)",
          }}
        />
      ))}
    </>
  );
}

/* -------- Arabesque: motifs orbitants -------- */
function ArabesqueOrbit() {
  const orbs = Array.from({ length: 6 });
  return (
    <>
      {orbs.map((_, i) => {
        const size = 240 + i * 80;
        const dir = i % 2 ? 1 : -1;
        const dur = 40 + i * 8;
        return (
          <motion.div
            key={i}
            animate={{ rotate: 360 * dir }}
            transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-full border border-[#a8884a]/15"
            style={{
              width: size,
              height: size,
              left: "50%",
              top: "50%",
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderStyle: i % 2 ? "dashed" : "dotted",
            }}
          />
        );
      })}
      <GoldDust />
    </>
  );
}

/* -------- Rayons de lumière (partagés) -------- */
function LightRays({ intensity = 0.4 }: { intensity?: number }) {
  return (
    <motion.div
      aria-hidden
      animate={{ opacity: [intensity * 0.6, intensity, intensity * 0.6] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0"
      style={{
        background:
          "conic-gradient(from 210deg at 50% -10%, transparent 0deg, rgba(255,240,200,0.10) 20deg, transparent 40deg, rgba(255,240,200,0.06) 60deg, transparent 90deg)",
        maskImage:
          "radial-gradient(ellipse at 50% 0%, black 0%, transparent 70%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
