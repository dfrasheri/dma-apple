import * as THREE from "three";

// 1 unit = 1 mm. Long axis = +Y. Pure geometry builders (no React) so the
// scene stays thin. Parts are returned as individual geometries and composed
// as separate meshes (avoids a fragile mergeGeometries dependency).

export type Lod = "high" | "low";

function lathe(profile: [number, number][], segments: number): THREE.LatheGeometry {
  const pts = profile.map(([r, y]) => new THREE.Vector2(r, y));
  return new THREE.LatheGeometry(pts, segments);
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function angDist(a: number, b: number): number {
  const d = Math.abs(a - b) % (Math.PI * 2);
  return d > Math.PI ? Math.PI * 2 - d : d;
}

/** Helical sweep path for the screw thread. */
class HelixCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private yStart: number,
    private yEnd: number,
    private turns: number,
    private rBottom: number,
    private rTop: number,
  ) {
    super();
  }
  getPoint(t: number, target = new THREE.Vector3()): THREE.Vector3 {
    const y = this.yStart + t * (this.yEnd - this.yStart);
    const ang = t * this.turns * Math.PI * 2;
    const r = THREE.MathUtils.lerp(this.rBottom, this.rTop, t);
    return target.set(Math.cos(ang) * r, y, Math.sin(ang) * r);
  }
}

// ---- Fixture (titanium screw), body + thread + seat ----
export function buildFixtureBody(lod: Lod): THREE.LatheGeometry {
  return lathe(
    [
      [0.0, -5.5], [0.55, -5.3], [0.95, -5.0], [1.18, -4.4], [1.3, -3.5], [1.45, -2.0],
      [1.62, 0.0], [1.78, 2.0], [1.9, 3.6], [1.98, 4.8], [2.0, 5.1], [2.0, 5.35], [1.55, 5.5],
    ],
    lod === "high" ? 128 : 72,
  );
}

export function buildThread(lod: Lod): THREE.TubeGeometry {
  const curve = new HelixCurve(-4.6, 2.2, 8.5, 1.3 + 0.32, 1.92 + 0.32);
  return new THREE.TubeGeometry(curve, lod === "high" ? 620 : 320, 0.26, lod === "high" ? 16 : 12, false);
}

export function buildSeat(): THREE.LatheGeometry {
  return lathe([[0, 5.5], [0.85, 5.5], [0.85, 4.7], [1.05, 4.55]], 64);
}

// ---- Abutment (titanium connector) ----
export function buildAbutment(lod: Lod): THREE.LatheGeometry {
  return lathe(
    [
      [0, -2.0], [0.8, -2.0], [0.82, -1.3], [0.82, -0.1], [1.95, 0.2], [2.05, 0.45],
      [1.95, 0.9], [1.7, 1.8], [1.45, 2.8], [1.2, 3.8], [1.0, 4.6], [0.78, 4.92], [0, 5.0],
    ],
    lod === "high" ? 96 : 64,
  );
}

// ---- Crown (ceramic molar), parametric loft, NOT a lathe ----
// A lathe revolves a 2D silhouette, so it can only produce radially-symmetric
// (round) shapes, which read as a bulb/lightbulb, never a tooth. A real molar
// has a rounded-square footprint and four cusps separated by a cross-shaped
// fissure, so we loft a superellipse cross-section up a cervical->occlusal
// profile and sculpt the occlusal table with a cusp / fossa / groove height field.

function superellipse(theta: number, a: number, b: number, n: number): [number, number] {
  const ct = Math.cos(theta);
  const st = Math.sin(theta);
  const x = a * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n);
  const z = b * Math.sign(st) * Math.pow(Math.abs(st), 2 / n);
  return [x, z];
}

function sampleProfile(profile: [number, number][], t: number): [number, number] {
  const seg = Math.min(1, Math.max(0, t)) * (profile.length - 1);
  const i = Math.min(profile.length - 2, Math.floor(seg));
  const f = seg - i;
  const fs = f * f * (3 - 2 * f);
  const [s0, y0] = profile[i];
  const [s1, y1] = profile[i + 1];
  return [s0 + (s1 - s0) * fs, y0 + (y1 - y0) * fs];
}

// Four molar cusps of UNEQUAL height/width (lingual taller than buccal, mesial
// taller than distal) placed off the pure diagonals, real molars are not 4-fold
// symmetric. {a: angle, h: height, s: angular width}.
const CUSPS = [
  { a: 0.82, h: 0.92, s: 0.46 }, // mesiobuccal
  { a: 2.32, h: 1.06, s: 0.5 }, // mesiolingual (tallest)
  { a: 3.98, h: 0.98, s: 0.5 }, // distolingual
  { a: 5.46, h: 0.82, s: 0.44 }, // distobuccal (lowest)
];
// Developmental grooves: the cross-shaped fissure between the cusps.
const GROOVE_ANGLES = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

/**
 * Occlusal relief above the rim. Builds a believable molar chewing surface:
 * four unequal cusps, each with a triangular ridge sloping down to a deep central
 * fossa, a raised marginal ridge around the perimeter (cut where grooves cross),
 * and the cross-shaped developmental fissure carved between the cusps.
 */
function occlusalField(rho: number, theta: number): number {
  const w = smoothstep(1.0, 0.9, rho); // 0 at the rim; relief ramps in over a narrow margin band
  if (w <= 0) return 0;

  // cusps near the PERIPHERY (where a molar's cusps sit), each with a triangular
  // ridge sloping inward to the central fossa
  let cusp = 0;
  for (const c of CUSPS) {
    const ad = angDist(theta, c.a);
    const ang = Math.exp(-(ad * ad) / (2 * c.s * c.s));
    const tip = Math.exp(-((rho - 0.78) ** 2) / (2 * 0.2 * 0.2));
    // ridge fades out before the centre (was 0.16) so cusp ridges no longer pile
    // up into a pinched central fold, they slope down into a clean fossa instead.
    const ridge = Math.exp(-(ad * ad) / (2 * 0.34 * 0.34)) * smoothstep(0.88, 0.42, rho) * 0.48;
    cusp = Math.max(cusp, c.h * (ang * tip + ridge));
  }
  cusp *= 1.12;

  // groove proximity (used both to cut the marginal ridge and to carve the fissure)
  let grooveA = 0;
  for (const g of GROOVE_ANGLES) grooveA = Math.max(grooveA, Math.exp(-(angDist(theta, g) ** 2) / (2 * 0.14 * 0.14)));

  const rim = Math.exp(-((rho - 0.85) ** 2) / (2 * 0.09 * 0.09)) * (1 - grooveA) * 0.28; // marginal ridge
  const fossa = Math.exp(-(rho * rho) / (2 * 0.36 * 0.36)) * 0.6; // central fossa, wider, gentler bowl (not a pinch)
  const groove = grooveA * Math.exp(-((rho - 0.5) ** 2) / (2 * 0.26 * 0.26)) * 0.5; // developmental fissures

  return w * (cusp + rim - fossa - groove);
}

type ToothKind = "molar" | "incisor";

/** Gentle rounded incisal surface (no cusps) for a flat, blade-like anterior tooth. */
function incisalField(rho: number, theta: number): number {
  void theta;
  const w = smoothstep(1.0, 0.9, rho);
  if (w <= 0) return 0;
  return w * 0.32 * Math.cos((rho * Math.PI) / 2);
}

/** Flip any triangle whose winding faces inward (the crown is star-convex about its centroid). */
function orientOutward(geo: THREE.BufferGeometry): void {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const index = geo.index as THREE.BufferAttribute;
  const arr = index.array as Uint16Array | Uint32Array;
  let cx = 0, cy = 0, cz = 0;
  for (let i = 0; i < pos.count; i++) {
    cx += pos.getX(i);
    cy += pos.getY(i);
    cz += pos.getZ(i);
  }
  cx /= pos.count;
  cy /= pos.count;
  cz /= pos.count;
  const v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
  const e1 = new THREE.Vector3(), e2 = new THREE.Vector3(), fn = new THREE.Vector3(), ref = new THREE.Vector3();
  for (let i = 0; i < arr.length; i += 3) {
    const ia = arr[i], ib = arr[i + 1], ic = arr[i + 2];
    v0.fromBufferAttribute(pos, ia);
    v1.fromBufferAttribute(pos, ib);
    v2.fromBufferAttribute(pos, ic);
    e1.subVectors(v1, v0);
    e2.subVectors(v2, v0);
    fn.crossVectors(e1, e2);
    ref.set((v0.x + v1.x + v2.x) / 3 - cx, (v0.y + v1.y + v2.y) / 3 - cy, (v0.z + v1.z + v2.z) / 3 - cz);
    if (fn.dot(ref) < 0) {
      arr[i + 1] = ic;
      arr[i + 2] = ib;
    }
  }
  index.needsUpdate = true;
}

/**
 * Shared tooth-body builder. Lofts a superellipse cross-section up a profile and
 * sculpts a molar occlusal table on top. `withRoot` extends the profile below the
 * cervix into a tapered root (a whole natural tooth); otherwise the base is capped
 * at the cervical neck (a crown that seats on an implant abutment).
 */
function buildToothMesh(lod: Lod, withRoot: boolean, kind: ToothKind = "molar"): THREE.BufferGeometry {
  const incisor = kind === "incisor";
  const RT = lod === "high" ? 96 : 48; // angular segments (multiple of 4 aligns cusps/grooves)
  const RW = (lod === "high" ? 30 : 16) + (withRoot ? (lod === "high" ? 16 : 9) : 0); // wall rings
  const RC = lod === "high" ? 16 : 9; // occlusal cap rings: rim -> center
  // Incisors are thin labiolingually, wide mesiodistally, and tall; molars are squat & square.
  const A = incisor ? 1.85 : 4.2; // buccolingual half-width
  const B = incisor ? 4.0 : 4.6; //  mesiodistal half-width
  const N = incisor ? 2.2 : 2.6; //  cross-section squareness (lower = rounder)

  // crown silhouette [widthScale, y]: cervix -> height of contour -> occlusal/incisal edge
  const crown: [number, number][] = incisor
    ? [
        [0.55, -4.0], [0.68, -3.1], [0.79, -2.1], [0.88, -1.0], [0.95, 0.2],
        [1.0, 1.3], [1.0, 2.1], [0.98, 2.8], [0.94, 3.4], [0.87, 3.9], [0.78, 4.3],
      ]
    : [
        [0.62, -4.0], [0.74, -3.3], [0.85, -2.5], [0.93, -1.6], [0.98, -0.7],
        [1.0, 0.3], [1.0, 1.1], [0.99, 1.8], [0.97, 2.3], [0.93, 2.7], [0.89, 3.0],
      ];
  // root silhouette below the cervix (rounded tip -> just under the neck)
  const root: [number, number][] = [
    [0.09, -10.0], [0.2, -9.0], [0.32, -7.6], [0.44, -6.2], [0.55, -5.0],
  ];
  const profile: [number, number][] = withRoot ? [...root, ...crown] : crown;
  const [rimScale, rimY] = profile[profile.length - 1];

  const positions: number[] = [];
  const addV = (x: number, y: number, z: number): number => {
    positions.push(x, y, z);
    return positions.length / 3 - 1;
  };

  // axial walls (root + crown body)
  const wall: number[][] = [];
  for (let r = 0; r <= RW; r++) {
    const [scale, y] = sampleProfile(profile, r / RW);
    const ring: number[] = [];
    for (let c = 0; c < RT; c++) {
      const th = (c / RT) * Math.PI * 2;
      const [ex, ez] = superellipse(th, A, B, N);
      ring.push(addV(ex * scale, y, ez * scale));
    }
    wall.push(ring);
  }

  // occlusal cap, rim ring reused from the wall top so the seam shares vertices
  const cap: number[][] = [wall[RW]];
  for (let ic = 1; ic < RC; ic++) {
    const rho = 1 - ic / RC;
    const ring: number[] = [];
    for (let c = 0; c < RT; c++) {
      const th = (c / RT) * Math.PI * 2;
      const [ex, ez] = superellipse(th, A, B, N);
      const relief = incisor ? incisalField(rho, th) : occlusalField(rho, th);
      ring.push(addV(ex * rimScale * rho, rimY + relief, ez * rimScale * rho));
    }
    cap.push(ring);
  }
  const centerIdx = addV(0, rimY + (incisor ? incisalField(0, 0) : occlusalField(0, 0)), 0);
  const baseIdx = addV(0, profile[0][1] - (withRoot ? 0.4 : 0.15), 0); // rounded root tip / neck-cap apex

  const idx: number[] = [];
  for (let r = 0; r < RW; r++) {
    for (let c = 0; c < RT; c++) {
      const c1 = (c + 1) % RT;
      const a0 = wall[r][c], b0 = wall[r][c1], c0 = wall[r + 1][c1], d0 = wall[r + 1][c];
      idx.push(a0, d0, c0, a0, c0, b0);
    }
  }
  for (let k = 0; k < cap.length - 1; k++) {
    const o = cap[k], inn = cap[k + 1];
    for (let c = 0; c < RT; c++) {
      const c1 = (c + 1) % RT;
      idx.push(o[c], o[c1], inn[c1], o[c], inn[c1], inn[c]);
    }
  }
  const innermost = cap[cap.length - 1];
  for (let c = 0; c < RT; c++) idx.push(innermost[c], innermost[(c + 1) % RT], centerIdx);
  for (let c = 0; c < RT; c++) idx.push(wall[0][(c + 1) % RT], wall[0][c], baseIdx);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(idx);
  orientOutward(geo);
  geo.computeVertexNormals();
  return geo;
}

/** Ceramic molar crown that seats on an implant abutment (no root). */
export function buildCrown(lod: Lod): THREE.BufferGeometry {
  return buildToothMesh(lod, false);
}

/** Whole natural tooth: the same molar crown with a tapered root below. */
export function buildTooth(lod: Lod): THREE.BufferGeometry {
  return buildToothMesh(lod, true);
}

/** Flat anterior (incisor) crown, for the front of the dental arch. */
export function buildIncisorCrown(lod: Lod): THREE.BufferGeometry {
  return buildToothMesh(lod, false, "incisor");
}
