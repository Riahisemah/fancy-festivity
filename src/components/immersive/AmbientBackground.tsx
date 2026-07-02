// Arrière-plan vivant : gradient qui suit la souris + orbes qui respirent.
// Se superpose au ThemeDecor existant pour renforcer la profondeur.
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import type { ThemeConfig } from "@/lib/themes";

export function AmbientBackground({ theme }: { theme: ThemeConfig }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.3);
  const sx = useSpring(mx, { stiffness: 40, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 40, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    function onMove(e: PointerEvent) {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  const light1X = useTransform(sx, (v) => `${v * 100}%`);
  const light1Y = useTransform(sy, (v) => `${v * 100}%`);
  const light2X = useTransform(sx, (v) => `${(1 - v) * 100}%`);
  const light2Y = useTransform(sy, (v) => `${(1 - v) * 100}%`);

  // Accent color extracted from theme's accentBg (best-effort) — falls back to gold
  const accent = extractHexFromAccent(theme.accentBg) ?? "#d4af37";
  const accent2 = shift(accent, 40);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Mouse-follow light */}
      <motion.div
        className="absolute -inset-40 opacity-70 mix-blend-screen"
        style={{
          background: `radial-gradient(400px 400px at ${light1X.get()} ${light1Y.get()}, ${withAlpha(accent, 0.18)}, transparent 70%)`,
        }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: useTransform([light1X, light1Y], ([x, y]) =>
            `radial-gradient(420px 420px at ${x} ${y}, ${withAlpha(accent, 0.22)}, transparent 70%)`,
          ),
        }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: useTransform([light2X, light2Y], ([x, y]) =>
            `radial-gradient(520px 520px at ${x} ${y}, ${withAlpha(accent2, 0.14)}, transparent 70%)`,
          ),
        }}
      />

      {/* Breathing orbs */}
      <BreathingOrb color={accent} className="left-[-10%] top-[-10%] size-[38vw]" delay={0} />
      <BreathingOrb color={accent2} className="right-[-15%] bottom-[-15%] size-[46vw]" delay={2.5} />

      {/* Soft grain */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
    </div>
  );
}

function BreathingOrb({ color, className, delay }: { color: string; className: string; delay: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
      style={{ background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)` }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.22, 0.36, 0.22] }}
      transition={{ duration: 10, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function extractHexFromAccent(cls: string | undefined): string | null {
  if (!cls) return null;
  const m = cls.match(/#([0-9a-fA-F]{3,8})/);
  if (m) return `#${m[1]}`;
  // Tailwind default palettes → approx
  const map: Record<string, string> = {
    "bg-blue-500": "#3b82f6",
    "bg-blue-400": "#60a5fa",
    "bg-cyan-400": "#22d3ee",
    "bg-amber-400": "#fbbf24",
    "bg-amber-300": "#fcd34d",
    "bg-pink-400": "#f472b6",
    "bg-indigo-400": "#818cf8",
    "bg-yellow-300": "#fde047",
    "bg-neutral-900": "#171717",
    "bg-white": "#ffffff",
  };
  for (const k of Object.keys(map)) if (cls.includes(k)) return map[k];
  return null;
}

function withAlpha(hex: string, a: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function shift(hex: string, deg: number) {
  const { r, g, b } = hexToRgb(hex);
  // simple hue rotation via HSL
  const [h, s, l] = rgbToHsl(r, g, b);
  const nh = (h + deg / 360) % 1;
  const { r: r2, g: g2, b: b2 } = hslToRgb(nh, s, l);
  return `#${[r2, g2, b2].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number) {
  let r: number, g: number, b: number;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}
