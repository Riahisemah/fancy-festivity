// Champ de particules 3D en fond de page, très léger, en R3F.
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export function ParticleField({ color = "#d4af37", count = 350 }: { color?: string; count?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] opacity-70">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Particles color={color} count={count} />
      </Canvas>
    </div>
  );
}

function Particles({ color, count }: { color: string; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.03;
    ref.current.rotation.x += delta * 0.01;
    const mx = state.pointer.x * 0.3;
    const my = state.pointer.y * 0.3;
    ref.current.position.x += (mx - ref.current.position.x) * 0.03;
    ref.current.position.y += (my - ref.current.position.y) * 0.03;
    mouse.current.x = mx;
    mouse.current.y = my;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={color}
        transparent
        opacity={0.75}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
