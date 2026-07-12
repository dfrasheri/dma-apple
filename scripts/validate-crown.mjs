// Standalone math validation of buildCrown (geometry.ts). NO three import.
// Re-implements the EXACT vertex+index generation as plain number[] arrays.

const LOD = "high";

// ---- helpers (copied verbatim from geometry.ts) ----
function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
function angDist(a, b) {
  const d = Math.abs(a - b) % (Math.PI * 2);
  return d > Math.PI ? Math.PI * 2 - d : d;
}
function superellipse(theta, a, b, n) {
  const ct = Math.cos(theta);
  const st = Math.sin(theta);
  const x = a * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n);
  const z = b * Math.sign(st) * Math.pow(Math.abs(st), 2 / n);
  return [x, z];
}
function sampleProfile(profile, t) {
  const seg = Math.min(1, Math.max(0, t)) * (profile.length - 1);
  const i = Math.min(profile.length - 2, Math.floor(seg));
  const f = seg - i;
  const fs = f * f * (3 - 2 * f);
  const [s0, y0] = profile[i];
  const [s1, y1] = profile[i + 1];
  return [s0 + (s1 - s0) * fs, y0 + (y1 - y0) * fs];
}
const CUSP_ANGLES = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
const GROOVE_ANGLES = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
function occlusalField(rho, theta) {
  const w = smoothstep(1.0, 0.86, rho);
  if (w <= 0) return 0;
  let cuspA = 0;
  for (const k of CUSP_ANGLES) cuspA = Math.max(cuspA, Math.exp(-(angDist(theta, k) ** 2) / (2 * 0.52 * 0.52)));
  const cusp = cuspA * Math.exp(-((rho - 0.6) ** 2) / (2 * 0.26 * 0.26)) * 1.35;
  const fossa = Math.exp(-(rho * rho) / (2 * 0.34 * 0.34)) * 0.55;
  let grooveA = 0;
  for (const k of GROOVE_ANGLES) grooveA = Math.max(grooveA, Math.exp(-(angDist(theta, k) ** 2) / (2 * 0.16 * 0.16)));
  const groove = grooveA * Math.exp(-((rho - 0.5) ** 2) / (2 * 0.3 * 0.3)) * 0.5;
  return w * (cusp - fossa - groove);
}

// orientOutward, but operating on plain arrays (mirrors geometry.ts logic).
function orientOutward(positions, idx) {
  const count = positions.length / 3;
  let cx = 0, cy = 0, cz = 0;
  for (let i = 0; i < count; i++) {
    cx += positions[i * 3];
    cy += positions[i * 3 + 1];
    cz += positions[i * 3 + 2];
  }
  cx /= count; cy /= count; cz /= count;
  for (let i = 0; i < idx.length; i += 3) {
    const ia = idx[i], ib = idx[i + 1], ic = idx[i + 2];
    const v0x = positions[ia * 3], v0y = positions[ia * 3 + 1], v0z = positions[ia * 3 + 2];
    const v1x = positions[ib * 3], v1y = positions[ib * 3 + 1], v1z = positions[ib * 3 + 2];
    const v2x = positions[ic * 3], v2y = positions[ic * 3 + 1], v2z = positions[ic * 3 + 2];
    const e1x = v1x - v0x, e1y = v1y - v0y, e1z = v1z - v0z;
    const e2x = v2x - v0x, e2y = v2y - v0y, e2z = v2z - v0z;
    // fn = e1 x e2
    const fnx = e1y * e2z - e1z * e2y;
    const fny = e1z * e2x - e1x * e2z;
    const fnz = e1x * e2y - e1y * e2x;
    const refx = (v0x + v1x + v2x) / 3 - cx;
    const refy = (v0y + v1y + v2y) / 3 - cy;
    const refz = (v0z + v1z + v2z) / 3 - cz;
    if (fnx * refx + fny * refy + fnz * refz < 0) {
      idx[i + 1] = ic;
      idx[i + 2] = ib;
    }
  }
}

// ---- buildCrown re-implementation ----
function buildCrown(lod) {
  const RT = lod === "high" ? 96 : 48;
  const RW = lod === "high" ? 34 : 18;
  const RC = lod === "high" ? 16 : 9;
  const A = 3.05, B = 2.78, N = 3.2;

  const profile = [
    [0.6, -4.0], [0.74, -3.4], [0.85, -2.8], [0.94, -2.0], [0.99, -1.1],
    [1.0, -0.3], [0.99, 0.5], [0.97, 1.3], [0.94, 2.0], [0.91, 2.6],
    [0.88, 3.0], [0.85, 3.3],
  ];
  const [rimScale, rimY] = profile[profile.length - 1];

  const positions = [];
  const addV = (x, y, z) => {
    positions.push(x, y, z);
    return positions.length / 3 - 1;
  };

  const wall = [];
  for (let r = 0; r <= RW; r++) {
    const [scale, y] = sampleProfile(profile, r / RW);
    const ring = [];
    for (let c = 0; c < RT; c++) {
      const th = (c / RT) * Math.PI * 2;
      const [ex, ez] = superellipse(th, A, B, N);
      ring.push(addV(ex * scale, y, ez * scale));
    }
    wall.push(ring);
  }

  const cap = [wall[RW]];
  for (let ic = 1; ic < RC; ic++) {
    const rho = 1 - ic / RC;
    const ring = [];
    for (let c = 0; c < RT; c++) {
      const th = (c / RT) * Math.PI * 2;
      const [ex, ez] = superellipse(th, A, B, N);
      ring.push(addV(ex * rimScale * rho, rimY + occlusalField(rho, th), ez * rimScale * rho));
    }
    cap.push(ring);
  }
  const centerIdx = addV(0, rimY + occlusalField(0, 0), 0);
  const neckIdx = addV(0, profile[0][1] - 0.15, 0);

  const idx = [];
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
  for (let c = 0; c < RT; c++) idx.push(wall[0][(c + 1) % RT], wall[0][c], neckIdx);

  orientOutward(positions, idx);
  return { positions, idx, RT, RW, RC };
}

// ---- validation ----
const { positions, idx, RT, RW, RC } = buildCrown(LOD);
const vertexCount = positions.length / 3;
const triangleCount = idx.length / 3;

// NaN / Infinity in positions
let hasNaNorInf = false;
for (const p of positions) {
  if (Number.isNaN(p) || !Number.isFinite(p)) { hasNaNorInf = true; break; }
}

// index range
let indexOutOfRange = false;
for (const i of idx) {
  if (i < 0 || i >= vertexCount || !Number.isInteger(i)) { indexOutOfRange = true; break; }
}

// degenerate triangles (zero-area) + edge map for manifoldness
let degenerateTriangles = 0;
const edgeCount = new Map();
const addEdge = (u, v) => {
  const key = u < v ? `${u}_${v}` : `${v}_${u}`;
  edgeCount.set(key, (edgeCount.get(key) || 0) + 1);
};
for (let i = 0; i < idx.length; i += 3) {
  const ia = idx[i], ib = idx[i + 1], ic = idx[i + 2];
  // area via cross product magnitude
  const ax = positions[ia * 3], ay = positions[ia * 3 + 1], az = positions[ia * 3 + 2];
  const bx = positions[ib * 3], by = positions[ib * 3 + 1], bz = positions[ib * 3 + 2];
  const cx = positions[ic * 3], cy = positions[ic * 3 + 1], cz = positions[ic * 3 + 2];
  const e1x = bx - ax, e1y = by - ay, e1z = bz - az;
  const e2x = cx - ax, e2y = cy - ay, e2z = cz - az;
  const nx = e1y * e2z - e1z * e2y;
  const ny = e1z * e2x - e1x * e2z;
  const nz = e1x * e2y - e1y * e2x;
  const area2 = Math.sqrt(nx * nx + ny * ny + nz * nz); // = 2*area
  if (ia === ib || ib === ic || ia === ic || area2 < 1e-9) degenerateTriangles++;
  addEdge(ia, ib);
  addEdge(ib, ic);
  addEdge(ic, ia);
}

let nonManifoldEdges = 0;
let boundaryEdges = 0;
for (const [, n] of edgeCount) {
  if (n === 1) boundaryEdges++;
  else if (n !== 2) nonManifoldEdges++;
}
const closedManifold = nonManifoldEdges === 0 && boundaryEdges === 0;

// bounding box
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
for (let i = 0; i < vertexCount; i++) {
  const x = positions[i * 3], y = positions[i * 3 + 1], z = positions[i * 3 + 2];
  if (x < minX) minX = x; if (x > maxX) maxX = x;
  if (y < minY) minY = y; if (y > maxY) maxY = y;
  if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
}
const widthX = maxX - minX;
const depthZ = maxZ - minZ;
const budgetOkUnder12k = triangleCount < 12000;

// expected counts (sanity)
const expectedVerts = (RW + 1) * RT + (RC - 1) * RT + 2;
const expectedTris = RW * RT * 2 + (RC - 1) * RT * 2 + RT + RT;

const issues = [];
if (hasNaNorInf) issues.push("positions contain NaN or Infinity");
if (indexOutOfRange) issues.push("index out of [0,vertexCount) or non-integer");
if (degenerateTriangles > 0) issues.push(`${degenerateTriangles} degenerate (zero-area) triangles`);
if (nonManifoldEdges > 0) issues.push(`${nonManifoldEdges} non-manifold edges (shared by !=2 triangles)`);
if (boundaryEdges > 0) issues.push(`${boundaryEdges} boundary edges (shared by 1 triangle)`);
if (!budgetOkUnder12k) issues.push(`triangleCount ${triangleCount} >= 12000 budget`);
if (vertexCount !== expectedVerts) issues.push(`vertexCount ${vertexCount} != expected ${expectedVerts}`);
if (triangleCount !== expectedTris) issues.push(`triangleCount ${triangleCount} != expected ${expectedTris}`);

const result = {
  lod: LOD,
  RT, RW, RC,
  vertexCount,
  triangleCount,
  expectedVerts,
  expectedTris,
  hasNaNorInf,
  indexOutOfRange,
  degenerateTriangles,
  nonManifoldEdges,
  boundaryEdges,
  closedManifold,
  minY, maxY, widthX, depthZ,
  minX, maxX, minZ, maxZ,
  budgetOkUnder12k,
  uniqueEdges: edgeCount.size,
  issues,
  verdict: issues.length === 0 ? "pass" : (closedManifold && !hasNaNorInf && !indexOutOfRange ? "warn" : "fail"),
};

console.log(JSON.stringify(result, null, 2));
