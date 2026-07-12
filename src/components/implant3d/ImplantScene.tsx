"use client";

import { Suspense, type RefObject } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { ImplantModel, type PartLabels } from "./ImplantModel";
import type { Lod } from "./geometry";

export default function ImplantScene({
  lod,
  explodeTarget,
  reducedMotion,
  labels,
  frameloop,
}: {
  lod: Lod;
  explodeTarget: RefObject<number>;
  reducedMotion: boolean;
  labels: PartLabels;
  frameloop: "always" | "never";
}) {
  const high = lod === "high";

  return (
    <Canvas
      dpr={[1, high ? 2 : 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
      shadows
      camera={{ position: [2.8, 1.6, 12.8], fov: 34, near: 0.1, far: 60 }}
      frameloop={frameloop}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.15} color="#0b1c30" />
        <directionalLight position={[-3, 5, 4]} intensity={0.8} color="#eef3fb" />

        <Environment resolution={256} environmentIntensity={0.55}>
          <Lightformer intensity={2.2} color="#ffffff" position={[-4, 4, 4]} rotation={[0.2, 0.4, 0]} scale={[6, 8, 1]} form="rect" />
          <Lightformer intensity={3.0} color="#dfe8f5" position={[5, 1, -4]} rotation={[0, -1.2, 0]} scale={[2, 6, 1]} form="rect" />
          <Lightformer intensity={0.6} color="#1a3a5c" position={[-3, -3, 2]} scale={[5, 5, 1]} form="rect" />
          <Lightformer intensity={1.4} color="#ffffff" position={[2, 3, 3]} scale={[1.5, 1.5, 1]} form="circle" />
        </Environment>

        <ImplantModel lod={lod} explodeTarget={explodeTarget} reducedMotion={reducedMotion} labels={labels} />

        {high && (
          <ContactShadows
            position={[0, -1.95, 0]}
            opacity={0.45}
            scale={9}
            blur={2.6}
            far={5}
            resolution={1024}
            color="#06121f"
            frames={1}
          />
        )}

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.01}
          rotateSpeed={0.9}
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.08}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.72}
          target={[0, 0.3, 0]}
        />

        {high && !reducedMotion && (
          <EffectComposer>
            <Bloom intensity={0.35} luminanceThreshold={0.85} luminanceSmoothing={0.3} mipmapBlur />
            <Vignette eskil={false} offset={0.35} darkness={0.5} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
