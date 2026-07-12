import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { buildFixtureBody, buildThread, buildSeat, buildAbutment, buildCrown, type Lod } from "./geometry";
import { PartLabel } from "./PartLabel";
import { MODELS } from "./models";
import { GltfImplantPart } from "./GltfParts";

export type PartLabels = {
  fixture: string;
  fixtureSub: string;
  abutment: string;
  abutmentSub: string;
  crown: string;
  crownSub: string;
};

function Titanium({ roughness, clearcoat }: { roughness: number; clearcoat: number }) {
  return (
    <meshPhysicalMaterial
      color="#c9ccd1"
      metalness={1}
      roughness={roughness}
      envMapIntensity={1}
      clearcoat={clearcoat}
      clearcoatRoughness={0.25}
      anisotropy={0.4}
      anisotropyRotation={Math.PI / 2}
    />
  );
}

export function ImplantModel({
  lod,
  explodeTarget,
  reducedMotion,
  labels,
}: {
  lod: Lod;
  explodeTarget: RefObject<number>;
  reducedMotion: boolean;
  labels: PartLabels;
}) {
  const fixtureRef = useRef<THREE.Group>(null);
  const abutRef = useRef<THREE.Group>(null);
  const crownRef = useRef<THREE.Group>(null);
  const cur = useRef(reducedMotion ? 1 : 0);

  const geo = useMemo(
    () => ({
      body: buildFixtureBody(lod),
      thread: buildThread(lod),
      seat: buildSeat(),
      abut: buildAbutment(lod),
      crown: buildCrown(lod),
    }),
    [lod],
  );

  // Seconds for a full explode or reassemble. Higher = slower. This is the one knob.
  const DURATION = 3.4;

  useFrame((_, dt) => {
    const target = explodeTarget.current ?? 0;
    // Advance a LINEAR 0..1 progress at constant speed (cur = uneased progress).
    // A fixed-duration linear march + ease curve gives a smooth, predictable glide
    // that actually completes, unlike damp(), which lurches then crawls forever.
    if (reducedMotion) {
      cur.current = target;
    } else {
      const step = Math.min(dt, 0.05) / DURATION;
      cur.current =
        cur.current < target ? Math.min(target, cur.current + step) : Math.max(target, cur.current - step);
    }
    // easeInOutCubic: gentle acceleration out of rest, gentle settle into place.
    const x = cur.current;
    const p = x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

    // Exploded offsets tuned so all THREE parts float with even gaps (~3 units):
    // crown lifts well clear of the abutment, the fixture drops into the "bone",
    // the abutment stays mid-stack. Assembled (p=0) keeps 0 / 5.3 / 9.6 so the
    // parts still seat together.
    if (fixtureRef.current) fixtureRef.current.position.y = -4.0 * p;
    if (abutRef.current) abutRef.current.position.y = 5.3 + 1.2 * p;
    if (crownRef.current) crownRef.current.position.y = 9.6 + 9.0 * p;
  });

  const ceramicHigh = lod === "high" && !reducedMotion;
  // When the real implant pack GLB is present, swap each procedural part for the
  // matching GLB sub-mesh, the explode (above) drives the same three groups.
  const usePack = MODELS.implantPack.present;

  return (
    <group scale={0.2}>
      <group position={[0, -4.1, 0]}>
        {/* Fixture */}
        <group ref={fixtureRef}>
          {usePack ? (
            <GltfImplantPart part="fixture" />
          ) : (
            <>
              <mesh geometry={geo.body} castShadow receiveShadow>
                <Titanium roughness={0.34} clearcoat={0.18} />
              </mesh>
              <mesh geometry={geo.thread} castShadow>
                <Titanium roughness={0.34} clearcoat={0.18} />
              </mesh>
              <mesh geometry={geo.seat}>
                <Titanium roughness={0.4} clearcoat={0.1} />
              </mesh>
            </>
          )}
          <PartLabel position={[2.1, -0.4, 0]} index={1} name={labels.fixture} sub={labels.fixtureSub} />
        </group>

        {/* Abutment */}
        <group ref={abutRef}>
          {usePack ? (
            <GltfImplantPart part="abutment" />
          ) : (
            <mesh geometry={geo.abut} castShadow receiveShadow>
              <Titanium roughness={0.3} clearcoat={0.25} />
            </mesh>
          )}
          <PartLabel position={[2.1, 0.6, 0]} index={2} name={labels.abutment} sub={labels.abutmentSub} />
        </group>

        {/* Crown */}
        <group ref={crownRef}>
          {usePack ? (
            <GltfImplantPart part="crown" />
          ) : (
            <mesh geometry={geo.crown} castShadow>
              {ceramicHigh ? (
                <MeshTransmissionMaterial
                  transmission={1}
                  thickness={0.85}
                  roughness={0.12}
                  ior={1.52}
                  chromaticAberration={0.035}
                  distortion={0.15}
                  distortionScale={0.25}
                  temporalDistortion={0}
                  attenuationDistance={1.6}
                  attenuationColor="#f4f1ec"
                  color="#f6f3ee"
                  background={new THREE.Color("#0b1c30")}
                  samples={10}
                  resolution={1024}
                  clearcoat={1}
                  clearcoatRoughness={0.1}
                />
              ) : (
                <meshPhysicalMaterial
                  color="#f3efe7"
                  transmission={0.85}
                  thickness={0.6}
                  ior={1.5}
                  roughness={0.15}
                  metalness={0}
                  clearcoat={1}
                  clearcoatRoughness={0.12}
                  envMapIntensity={1}
                />
              )}
            </mesh>
          )}
          <PartLabel position={[3.3, -0.2, 0]} index={3} name={labels.crown} sub={labels.crownSub} />
        </group>
      </group>
    </group>
  );
}
