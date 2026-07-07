// Ouverture cinématographique 3D : scène R3F, carte qui arrive de la profondeur
// avec caméra travelling, lumière volumétrique et particules thématiques.
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles, MeshTransmissionMaterial, PerspectiveCamera } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import type { ThemeConfig } from "@/lib/themes";
import type { OpenerConfig, OpenerPalette } from "@/lib/opener-config";
import { t, isRTL, type Lang } from "@/lib/i18n";
import { useOpenerState } from "./openers/useOpenerState";

export function LuxuryOpener({
  config,
  theme,
  title,
  hosts,
  lang = "fr",
  storageKey,
  onReady,
}: {
  config: OpenerConfig;
  theme: ThemeConfig;
  title: string;
  hosts?: string;
  lang?: Lang;
  storageKey: string;
  onReady?: () => void;
}) {
  const { visible, opened, open } = useOpenerState(storageKey);
  const { palette } = config;
  const rtl = isRTL(lang);

  function handleOpen() {
    open(config.durationMs);
    window.setTimeout(() => onReady?.(), config.durationMs);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{ background: palette.bgGradient }}
        >
          <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: false }} className="!absolute inset-0">
            <color attach="background" args={[palette.bg]} />
            <fog attach="fog" args={[palette.bg, 8, 22]} />
            <Suspense fallback={null}>
              <Scene opened={opened} title={title} hosts={hosts} lang={lang} palette={palette} />
              <Environment preset="night" />
            </Suspense>
          </Canvas>

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(60% 40% at 50% 30%, ${palette.glow}33, transparent 70%), ${palette.vignette}`,
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: opened ? 0 : 1, y: opened ? 20 : 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-4 z-10 ${rtl ? "font-arabic" : ""}`}
          >
            <p className={`${rtl ? "text-sm tracking-normal normal-case" : "text-[10px] uppercase tracking-[0.5em]"} text-white/60`}>
              {t(lang, "youAreInvited")}
            </p>
            <button
              onClick={handleOpen}
              className={`group relative px-10 py-4 rounded-full text-sm font-medium overflow-hidden ${theme.ctaClass} ${rtl ? "tracking-normal normal-case" : "tracking-[0.15em] uppercase"}`}
            >
              <span className="relative z-10">{t(lang, "open")}</span>
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** @deprecated Utiliser LuxuryOpener via ThemeInvitationOpener */
export const Cinematic3DOpener = LuxuryOpener;

function Scene({ opened, title, hosts, lang, palette }: { opened: boolean; title: string; hosts?: string; lang: Lang; palette: OpenerPalette }) {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const cardRef = useRef<THREE.Group>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Intro: card arrives from depth
  useEffect(() => {
    if (!cardRef.current || !camRef.current) return;
    const card = cardRef.current;
    const cam = camRef.current;
    card.position.set(0, -0.5, -8);
    card.rotation.set(0.6, 0.9, -0.2);
    cam.position.set(0, 0, 6);

    const tl = gsap.timeline();
    tl.to(card.position, { z: 0, y: 0, duration: 2.2, ease: "power3.out" }, 0)
      .to(card.rotation, { x: 0, y: 0, z: 0, duration: 2.2, ease: "power3.out" }, 0)
      .to(cam.position, { z: 4.2, duration: 2.4, ease: "power2.out" }, 0);
  }, []);

  // Open transition: camera dives, card lifts
  useEffect(() => {
    if (!opened || !camRef.current || !cardRef.current) return;
    const cam = camRef.current;
    const card = cardRef.current;
    gsap.to(cam.position, { z: 0.6, y: 0.4, duration: 1.8, ease: "power3.inOut" });
    gsap.to(card.rotation, { x: -0.4, y: 0.15, duration: 1.6, ease: "power2.inOut" });
    gsap.to(card.position, { y: 0.4, duration: 1.6, ease: "power2.inOut" });
  }, [opened]);

  useFrame((_, delta) => {
    if (cardRef.current && !opened) {
      // gentle drift toward mouse
      const tx = mouse.current.x * 0.25;
      const ty = mouse.current.y * 0.18;
      cardRef.current.rotation.y += (tx - cardRef.current.rotation.y) * delta * 1.6;
      cardRef.current.rotation.x += (-ty - cardRef.current.rotation.x) * delta * 1.6;
    }
    if (spotRef.current) {
      spotRef.current.target = targetRef.current;
      spotRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <PerspectiveCamera ref={camRef} makeDefault fov={38} position={[0, 0, 6]} />
      <ambientLight intensity={0.25} />
      <spotLight
        ref={spotRef}
        position={[3, 6, 4]}
        angle={0.4}
        penumbra={0.9}
        intensity={40}
        color={palette.glow}
        castShadow
      />
      <pointLight position={[-4, -2, 3]} intensity={4} color={palette.accent} />
      <primitive object={targetRef.current} position={[0, 0, 0]} />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <group ref={cardRef}>
          <InvitationCard title={title} hosts={hosts} lang={lang} palette={palette} />
        </group>
      </Float>

      <Sparkles count={80} scale={[8, 5, 4]} size={2.5} speed={0.35} color={palette.primary} opacity={0.9} />
      <Sparkles count={40} scale={[10, 6, 6]} size={1.2} speed={0.2} color={palette.secondary} opacity={0.5} />
    </>
  );
}

function InvitationCard({ title, hosts, lang, palette }: { title: string; hosts?: string; lang: Lang; palette: OpenerPalette }) {
  const texture = useCardTexture(title, hosts, lang, palette);
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.4, 3.4, 0.06]} />
        <MeshTransmissionMaterial
          thickness={0.4}
          roughness={0.15}
          transmission={0.9}
          ior={1.3}
          chromaticAberration={0.04}
          backside
          color={palette.secondary}
          attenuationColor={palette.primary}
          attenuationDistance={1.2}
        />
      </mesh>

      <mesh position={[0, 0, 0.032]}>
        <ringGeometry args={[1.55, 1.62, 64]} />
        <meshStandardMaterial color={palette.primary} metalness={1} roughness={0.2} emissive={palette.primary} emissiveIntensity={0.15} />
      </mesh>

      <lineSegments position={[0, 0, 0.034]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(2.1, 3.1)]} />
        <lineBasicMaterial color={palette.primary} transparent opacity={0.6} />
      </lineSegments>

      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[2.1, 3.1]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
    </group>
  );
}

function useCardTexture(title: string, hosts: string | undefined, lang: Lang, palette: OpenerPalette) {
  return useMemo(() => {
    const rtl = isRTL(lang);
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, 512, 768);
    ctx.direction = rtl ? "rtl" : "ltr";
    ctx.textAlign = "center";

    // Eyebrow
    ctx.fillStyle = palette.primary;
    ctx.font = rtl
      ? "600 22px 'Cairo', 'Amiri', 'Noto Kufi Arabic', sans-serif"
      : "500 18px 'Georgia', serif";
    if (!rtl) ctx.letterSpacing = "6px";
    ctx.fillText(t(lang, "youAreInvited"), 256, 200);

    // Divider
    ctx.strokeStyle = palette.primary;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(216, 230); ctx.lineTo(296, 230); ctx.stroke();

    // Title (wrap)
    ctx.fillStyle = palette.cardText;
    ctx.font = rtl
      ? "700 42px 'Amiri', 'Scheherazade New', 'Cairo', serif"
      : "italic 48px 'Georgia', serif";
    wrapText(ctx, title, 256, 340, 420, rtl ? 52 : 56);

    // Hosts
    if (hosts) {
      ctx.fillStyle = "#5a4a30";
      ctx.font = rtl
        ? "500 24px 'Cairo', 'Amiri', sans-serif"
        : "italic 22px 'Georgia', serif";
      wrapText(ctx, hosts, 256, 520, 400, rtl ? 34 : 30);
    }

    // Bottom ornament
    ctx.strokeStyle = palette.primary;
    ctx.beginPath(); ctx.moveTo(206, 620); ctx.lineTo(306, 620); ctx.stroke();
    ctx.fillStyle = "#a8884a";
    ctx.beginPath(); ctx.arc(256, 620, 3, 0, Math.PI * 2); ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }, [title, hosts, lang, palette]);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = w;
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, cy);
}
