"use client";

import { Bounds, Center, ContactShadows, Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return (
    <Bounds fit clip observe margin={1.2}>
      <Center>
        <primitive object={scene} />
      </Center>
    </Bounds>
  );
}

/** Stand-in until the client uploads a .glb: a glossy knot in the accent tones. */
function Placeholder() {
  return (
    <mesh scale={0.62}>
      <torusKnotGeometry args={[0.8, 0.28, 220, 32]} />
      <meshPhysicalMaterial color="#ff5a1f" roughness={0.22} metalness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
    </mesh>
  );
}

/** Real-time turntable. Renders only while on screen. */
export default function ModelViewer({ url }: { url?: string | null }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "200px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="relative aspect-video cursor-grab overflow-hidden rounded-sm bg-canvas-2 active:cursor-grabbing" data-lenis-prevent>
      <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 2]} camera={{ position: [0, 0.4, 4.2], fov: 35 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 2]} intensity={1.6} />
        <Suspense fallback={null}>
          {url ? <Model url={url} /> : <Placeholder />}
          <Environment resolution={256}>
            <Lightformer intensity={2} position={[0, 3, 2]} scale={[6, 2, 1]} />
            <Lightformer intensity={1} position={[-4, 0, -2]} rotation-y={Math.PI / 2} scale={[4, 4, 1]} />
            <Lightformer intensity={1.4} position={[4, 1, 0]} rotation-y={-Math.PI / 2} scale={[3, 3, 1]} color="#ffd9b0" />
          </Environment>
        </Suspense>
        <ContactShadows position={[0, -1.25, 0]} opacity={0.35} blur={2.4} scale={8} far={3} />
        <OrbitControls autoRotate autoRotateSpeed={1.2} enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
    </div>
  );
}
