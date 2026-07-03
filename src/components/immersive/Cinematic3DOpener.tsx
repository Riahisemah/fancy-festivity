// Ouverture cinématographique 3D : scène R3F, carte qui arrive de la profondeur
// avec caméra travelling, lumière volumétrique et particules dorées.
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles, MeshTransmissionMaterial, PerspectiveCamera } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import type { ThemeConfig } from "@/lib/themes";
import { t, type Lang } from "@/lib/i18n";

export function Cinematic3DOpener({
  theme,
  title,
  hosts,
  lang = "fr",
  storageKey,
}: {
  theme: ThemeConfig;
  title: string;
  hosts?: string;
  lang?: Lang;
  storageKey: string;
}) {
  const [visible, setVisible] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!sessionStorage.getItem(storageKey)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [storageKey]);

  function open() {
    setOpened(true);
    try { sessionStorage.setItem(storageKey, "1"); } catch { /* ignore */ }
    window.setTimeout(() => setVisible(false), 2400);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] overflow-hidden bg-black"
        >
          <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: false }} className="!absolute inset-0">
            <color attach="background" args={["#050303"]} />
            <fog attach="fog" args={["#050303", 8, 22]} />
            <Suspense fallback={null}>
              <Scene opened={opened} title={title} hosts={hosts} />
              <Environment preset="night" />
            </Suspense>
          </Canvas>

          {/* Vignette + light beam overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 40% at 50% 30%, rgba(212,175,55,0.20), transparent 70%), radial-gradient(120% 80% at 50% 100%, rgba(0,0,0,0.85), transparent 60%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: opened ? 0 : 1, y: opened ? 20 : 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-4 z-10"
          >
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/60">
              {t(lang, "youAreInvited") || "You are invited"}
            </p>
            <button
              onClick={open}
              className={`group relative px-10 py-4 rounded-full text-sm font-medium tracking-[0.15em] uppercase overflow-hidden ${theme.ctaClass}`}
            >
              <span className="relative z-10">{t(lang, "open") || "Open"}</span>
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Scene({ opened, title, hosts }: { opened: boolean; title: string; hosts?: string }) {
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
        color="#f5d68a"
        castShadow
      />
      <pointLight position={[-4, -2, 3]} intensity={4} color="#7aa8ff" />
      <primitive object={targetRef.current} position={[0, 0, 0]} />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <group ref={cardRef}>
          <InvitationCard title={title} hosts={hosts} />
        </group>
      </Float>

      <Sparkles count={80} scale={[8, 5, 4]} size={2.5} speed={0.35} color="#f5d68a" opacity={0.9} />
      <Sparkles count={40} scale={[10, 6, 6]} size={1.2} speed={0.2} color="#ffffff" opacity={0.5} />
    </>
  );
}

function InvitationCard({ title, hosts }: { title: string; hosts?: string }) {
  return (
    <group>
      {/* Card body (glass / transmission) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.4, 3.4, 0.06]} />
        <MeshTransmissionMaterial
          thickness={0.4}
          roughness={0.15}
          transmission={0.9}
          ior={1.3}
          chromaticAberration={0.04}
          backside
          color="#f8ecc8"
          attenuationColor="#d4af37"
          attenuationDistance={1.2}
        />
      </mesh>

      {/* Gold frame */}
      <mesh position={[0, 0, 0.032]}>
        <ringGeometry args={[1.55, 1.62, 64]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} emissive="#d4af37" emissiveIntensity={0.15} />
      </mesh>

      {/* Inner border rectangle */}
      <lineSegments position={[0, 0, 0.034]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(2.1, 3.1)]} />
        <lineBasicMaterial color="#d4af37" transparent opacity={0.6} />
      </lineSegments>

      {/* Text on card via canvas texture */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[2.1, 3.1]} />
        <meshBasicMaterial map={useCardTexture(title, hosts)} transparent />
      </mesh>
    </group>
  );
}

function useCardTexture(title: string, hosts?: string) {
  const tex = useRef<THREE.CanvasTexture | null>(null);
  if (!tex.current) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, 512, 768);

    // Eyebrow
    ctx.fillStyle = "#a8884a";
    ctx.font = "500 18px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.letterSpacing = "6px";
    ctx.fillText("YOU ARE INVITED", 256, 200);

    // Divider
    ctx.strokeStyle = "#a8884a";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(216, 230); ctx.lineTo(296, 230); ctx.stroke();

    // Title (wrap)
    ctx.fillStyle = "#2a1f14";
    ctx.font = "italic 48px 'Georgia', serif";
    wrapText(ctx, title, 256, 340, 420, 56);

    // Hosts
    if (hosts) {
      ctx.fillStyle = "#5a4a30";
      ctx.font = "italic 22px 'Georgia', serif";
      wrapText(ctx, hosts, 256, 520, 400, 30);
    }

    // Bottom ornament
    ctx.strokeStyle = "#a8884a";
    ctx.beginPath(); ctx.moveTo(206, 620); ctx.lineTo(306, 620); ctx.stroke();
    ctx.fillStyle = "#a8884a";
    ctx.beginPath(); ctx.arc(256, 620, 3, 0, Math.PI * 2); ctx.fill();

    tex.current = new THREE.CanvasTexture(canvas);
    tex.current.anisotropy = 8;
  }
  return tex.current;
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
