"use client";

// GLB loaders that drop in for the procedural builders in `geometry.ts`.
// Each component is only ever mounted when its model's `present` flag is true
// (see `models.ts`), so `useGLTF` never tries to fetch a file that isn't there.
// The surrounding scenes already provide <Suspense>, so loading is handled.

import { useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { MODELS, type ImplantPart } from "./models";

type LoadedGltf = { scene: THREE.Group; nodes: Record<string, THREE.Object3D> };

/** First mesh geometry found in a GLB scene (single-object models). */
function firstGeometry(scene: THREE.Group): THREE.BufferGeometry | null {
  let found: THREE.BufferGeometry | null = null;
  scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!found && m.isMesh && m.geometry) found = m.geometry as THREE.BufferGeometry;
  });
  return found;
}

/**
 * A single-mesh GLB (crown / tooth / arch), normalized to the scene's ~4.2-unit
 * object size and centered, matching how `ObjectScene` frames procedural meshes.
 * `children` supplies the material (so `crownVariants` keeps driving the look).
 */
export function GltfObject({
  modelKey,
  children,
}: {
  modelKey: "molarCrown" | "incisor" | "toothRoot" | "arch";
  children: ReactNode;
}) {
  const { scene } = useGLTF(MODELS[modelKey].path) as unknown as LoadedGltf;
  const norm = useMemo(() => {
    const geometry = firstGeometry(scene);
    if (!geometry) return null;
    const g = geometry.clone();
    g.computeBoundingBox();
    const bb = g.boundingBox!;
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bb.getSize(size);
    bb.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return { geometry: g, scale: 4.2 / maxDim, offset: center };
  }, [scene]);

  if (!norm) return null;
  return (
    <group scale={norm.scale}>
      <mesh geometry={norm.geometry} position={[-norm.offset.x, -norm.offset.y, -norm.offset.z]} castShadow>
        {children}
      </mesh>
    </group>
  );
}

/**
 * One explodable part of the implant pack, cloned out of the GLB by node name
 * (with a positional fallback). Rendered inside the existing fixture/abutment/
 * crown groups in `ImplantModel`, so the explode animation drives it unchanged.
 */
export function GltfImplantPart({ part }: { part: ImplantPart }) {
  const cfg = MODELS.implantPack;
  const { scene, nodes } = useGLTF(cfg.path) as unknown as LoadedGltf;
  // React Compiler isn't enabled as a build transform in this project (no
  // babel-plugin-react-compiler / experimental.reactCompiler in next.config),
  // so this hand-written memoization is the only memoization that runs --
  // keep it rather than remove it on the compiler's say-so.
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const object = useMemo(() => {
    for (const name of cfg.nodes[part]) {
      const n = nodes[name];
      if (n) return n.clone();
    }
    const meshes: THREE.Mesh[] = [];
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) meshes.push(m);
    });
    const order: ImplantPart[] = ["fixture", "abutment", "crown"];
    const fallback = meshes[order.indexOf(part)] ?? meshes[0];
    return fallback ? fallback.clone() : null;
  }, [cfg, nodes, scene, part]);

  if (!object) return null;
  return <primitive object={object} />;
}
