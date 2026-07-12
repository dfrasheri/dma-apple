"use client";

import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { buildCrown, buildTooth, buildIncisorCrown, type Lod } from "./geometry";
import type { CrownVariant } from "./crownVariants";
import { MODELS } from "./models";
import { GltfObject } from "./GltfParts";

export type ObjectKind = "crown" | "tooth" | "aligner";

/** A small dental arch, flat incisors in front, molars in back, wrapped in a translucent clear-aligner shell. */
function ArchModel({ lod, reducedMotion }: { lod: Lod; reducedMotion: boolean }) {
  void reducedMotion;
  const molar = useMemo(() => buildCrown(lod), [lod]);
  const incisor = useMemo(() => buildIncisorCrown(lod), [lod]);
  const teeth = useMemo(() => {
    const arr: { x: number; z: number; ry: number; s: number; kind: "incisor" | "molar" }[] = [];
    const spacing = 2.55; // center-to-center; tuned so neighbours just touch, not overlap
    for (let i = 0; i < 7; i++) {
      const k = i - 3; // -3..3 from the midline
      const t = k / 3; // -1..1
      const kind = Math.abs(k) <= 1 ? "incisor" : "molar"; // front three are incisors
      arr.push({ x: k * spacing, z: t * t * 2.3, ry: -t * 0.5, s: 0.32 - Math.abs(t) * 0.025, kind });
    }
    return arr;
  }, []);

  // Real arch+gums GLB replaces the procedural arch once dropped in (see models.ts).
  if (MODELS.arch.present) {
    return (
      <group scale={0.5} rotation={[0.2, 0, 0]} position={[0, 0.3, -0.6]}>
        <GltfObject modelKey="arch">
          <meshPhysicalMaterial color="#f1ece1" roughness={0.22} metalness={0} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1} />
        </GltfObject>
      </group>
    );
  }

  return (
    <group scale={0.5} rotation={[0.2, 0, 0]} position={[0, 0.3, -0.6]}>
      {teeth.map((p, i) => {
        const geom = p.kind === "incisor" ? incisor : molar;
        return (
          <group key={i} position={[p.x, 0, p.z]} rotation={[0, p.ry + Math.PI / 2, 0]}>
            <group scale={p.s}>
              <mesh geometry={geom} castShadow>
                <meshPhysicalMaterial color="#f1ece1" roughness={0.22} metalness={0} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1} />
              </mesh>
              {/* clear aligner shell */}
              <mesh geometry={geom} scale={1.08}>
                <meshPhysicalMaterial color="#ffffff" transparent opacity={0.18} transmission={0.9} roughness={0.05} metalness={0} ior={1.42} clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1.2} depthWrite={false} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}

function ObjectModel({ kind, lod, variant }: { kind: ObjectKind; lod: Lod; variant?: CrownVariant }) {
  const isIncisor = kind === "crown" && variant?.shape === "incisor";
  const { geometry, scale, offset } = useMemo(() => {
    const g =
      kind === "crown"
        ? isIncisor
          ? buildIncisorCrown(lod)
          : buildCrown(lod)
        : buildTooth(lod);
    g.computeBoundingBox();
    const bb = g.boundingBox!;
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bb.getSize(size);
    bb.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    return { geometry: g, scale: 4.2 / maxDim, offset: center };
  }, [kind, lod, isIncisor]);

  // Material is what actually distinguishes the restoration tiers in real life:
  // opaque metal-ceramic/zirconia -> glass-like translucent premium E-max. It is
  // shared by the procedural and the GLB geometry paths.
  const material =
    kind === "crown" ? (
      <meshPhysicalMaterial
        color={variant?.color ?? "#f3efe7"}
        transmission={variant?.transmission ?? 0.7}
        thickness={variant?.thickness ?? 0.6}
        ior={1.6}
        roughness={variant?.roughness ?? 0.14}
        metalness={variant?.metalness ?? 0}
        clearcoat={variant?.clearcoat ?? 1}
        clearcoatRoughness={0.12}
        attenuationColor={new THREE.Color(variant?.attenuationColor ?? "#efe2c8")}
        attenuationDistance={1.5}
        envMapIntensity={1}
      />
    ) : (
      <meshPhysicalMaterial color="#f1ece1" roughness={0.25} metalness={0} clearcoat={1} clearcoatRoughness={0.1} transmission={0.18} thickness={0.5} ior={1.5} envMapIntensity={1} />
    );

  // Real GLB meshes replace the procedural ones once dropped in (see models.ts).
  const glbKey = kind === "crown" ? (isIncisor ? "incisor" : "molarCrown") : "toothRoot";
  if (MODELS[glbKey].present) {
    return <GltfObject modelKey={glbKey}>{material}</GltfObject>;
  }

  return (
    <group scale={scale}>
      <mesh geometry={geometry} position={[-offset.x, -offset.y, -offset.z]} castShadow>
        {material}
      </mesh>
    </group>
  );
}

export default function ObjectScene({
  kind,
  lod,
  reducedMotion,
  frameloop,
  variant,
}: {
  kind: ObjectKind;
  lod: Lod;
  reducedMotion: boolean;
  frameloop: "always" | "never";
  variant?: CrownVariant;
}) {
  const high = lod === "high";
  return (
    <Canvas
      dpr={[1, high ? 2 : 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
      shadows
      camera={{ position: [2.3, 4.6, 7.6], fov: 32, near: 0.1, far: 50 }}
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
          <Lightformer intensity={1.4} color="#ffffff" position={[2, 3, 3]} scale={[1.5, 1.5, 1]} form="circle" />
        </Environment>

        {kind === "aligner" ? (
          <ArchModel lod={lod} reducedMotion={reducedMotion} />
        ) : (
          <ObjectModel kind={kind} lod={lod} variant={variant} />
        )}

        {high && (
          <ContactShadows position={[0, -2.2, 0]} opacity={0.4} scale={8} blur={2.6} far={5} resolution={1024} color="#06121f" frames={1} />
        )}

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.6}
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.7}
          minPolarAngle={Math.PI * 0.28}
          maxPolarAngle={Math.PI * 0.72}
          target={[0, 0, 0]}
        />

        {high && !reducedMotion && (
          <EffectComposer>
            <Bloom intensity={0.32} luminanceThreshold={0.86} luminanceSmoothing={0.3} mipmapBlur />
            <Vignette eskil={false} offset={0.35} darkness={0.5} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
