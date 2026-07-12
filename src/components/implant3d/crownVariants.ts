// Per-service material differentiation for the crown/veneer 3D hero.
// In reality these restorations share a tooth shape, what tells them apart is the
// MATERIAL: opacity/translucency, shade, and surface. This maps each catalogue slug
// to physically-meaningful material params so the tiers look genuinely different
// (opaque metal-ceramic -> glass-like premium E-max) and veneers read as front teeth.

export type CrownVariant = {
  color: string;
  /** 0 = fully opaque (metal/zirconia) ... 1 = glass-like (premium E-max) */
  transmission: number;
  thickness: number;
  roughness: number;
  metalness: number;
  clearcoat: number;
  attenuationColor: string;
  /** molar crown vs thin anterior (veneer) shape */
  shape: "molar" | "incisor";
  /** short material descriptor shown under the 3D model */
  label: string;
};

const P = {
  metalCeramic: { color: "#e7e3da", transmission: 0, thickness: 0.4, roughness: 0.3, metalness: 0.15, clearcoat: 0.55, attenuationColor: "#cfc9bb", label: "Opaque · ceramic over metal" },
  chromeCobalt: { color: "#e4e1d8", transmission: 0, thickness: 0.4, roughness: 0.32, metalness: 0.25, clearcoat: 0.5, attenuationColor: "#c9c4b6", label: "Opaque · chrome-cobalt core" },
  fullZirconia: { color: "#f4f1ea", transmission: 0.06, thickness: 0.5, roughness: 0.22, metalness: 0, clearcoat: 0.7, attenuationColor: "#e9e3d6", label: "Bright white · monolithic zirconia" },
  multilayerZirconia: { color: "#f1ece1", transmission: 0.2, thickness: 0.55, roughness: 0.2, metalness: 0, clearcoat: 0.8, attenuationColor: "#e6dcc7", label: "Soft shade gradient · multilayer zirconia" },
  zirEmaxGisi: { color: "#f4efe6", transmission: 0.36, thickness: 0.55, roughness: 0.16, metalness: 0, clearcoat: 0.9, attenuationColor: "#ecdfc8", label: "Zirconia core + GiSi E-max layer" },
  zirEmaxIvoclar: { color: "#f6f0e7", transmission: 0.46, thickness: 0.6, roughness: 0.15, metalness: 0, clearcoat: 0.95, attenuationColor: "#eaddc4", label: "Zirconia core + Ivoclar E-max layer" },
  fullEmaxGisi: { color: "#f6f2ea", transmission: 0.7, thickness: 0.6, roughness: 0.13, metalness: 0, clearcoat: 1, attenuationColor: "#efe2c8", label: "Translucent · monolithic E-max" },
  fullEmaxIvoclar: { color: "#f7f2e9", transmission: 0.82, thickness: 0.62, roughness: 0.12, metalness: 0, clearcoat: 1, attenuationColor: "#efe0c4", label: "Highly translucent · Ivoclar E-max" },
  premiumEmax: { color: "#f8f3ea", transmission: 0.95, thickness: 0.65, roughness: 0.1, metalness: 0, clearcoat: 1, attenuationColor: "#eddcbf", label: "Glass-like · premium hand-layered E-max" },
  composite: { color: "#efe9dc", transmission: 0.12, thickness: 0.4, roughness: 0.35, metalness: 0, clearcoat: 0.4, attenuationColor: "#ded3bd", label: "Direct composite resin" },
  temporary: { color: "#ece6da", transmission: 0, thickness: 0.4, roughness: 0.45, metalness: 0, clearcoat: 0.2, attenuationColor: "#d8cfbd", label: "Provisional · matte acrylic" },
} as const;

type Preset = Omit<CrownVariant, "shape">;

function molar(p: Preset): CrownVariant { return { ...p, shape: "molar" }; }
function veneer(p: Preset): CrownVariant {
  // veneers sit on front teeth and read whiter/brighter than a back crown
  return { ...p, shape: "incisor", color: "#f8f4ed" };
}

const MAP: Record<string, CrownVariant> = {
  // ---- Crowns (molar shape) ----
  "metal-ceramic-crown": molar(P.metalCeramic),
  "chrome-cobalt-crown": molar(P.chromeCobalt),
  "zirconia-crown": molar(P.fullZirconia),
  "multilayer-zirconia-crown": molar(P.multilayerZirconia),
  "zirconia-emax-gisi-crown": molar(P.zirEmaxGisi),
  "zirconia-emax-ivoclar-crown": molar(P.zirEmaxIvoclar),
  "zirconia-emax-layered-crown": molar(P.zirEmaxIvoclar),
  "emax-crown": molar(P.fullEmaxGisi),
  "full-emax-gisi-crown": molar(P.fullEmaxGisi),
  "full-emax-ivoclar-crown": molar(P.fullEmaxIvoclar),
  "full-emax-premium-ivoclar-crown": molar(P.premiumEmax),
  "top-line-gisi-emax-crown": molar({ ...P.premiumEmax, transmission: 0.9, label: "Glass-like · GiSi premium E-max" }),
  "top-line-ivoclar-emax-crown": molar(P.premiumEmax),
  "temporary-crown": molar(P.temporary),
  // ---- Veneers (incisor / front-tooth shape) ----
  "porcelain-veneer": veneer(P.fullEmaxGisi),
  "emax-veneer": veneer(P.fullEmaxIvoclar),
  "composite-veneer": veneer(P.composite),
  "zirconia-veneer": veneer(P.fullZirconia),
  "zirconia-emax-gisi-veneer": veneer(P.zirEmaxGisi),
  "zirconia-emax-ivoclar-veneer": veneer(P.zirEmaxIvoclar),
  "zirconia-emax-gisi-ii-veneer": veneer({ ...P.zirEmaxGisi, transmission: 0.55, label: "Zirconia + GiSi E-max II" }),
  "zirconia-emax-ivoclar-ii-veneer": veneer({ ...P.zirEmaxIvoclar, transmission: 0.65, label: "Zirconia + Ivoclar E-max II" }),
  "full-emax-gisi-veneer": veneer(P.fullEmaxGisi),
  "full-emax-ivoclar-veneer": veneer(P.fullEmaxIvoclar),
  "full-emax-premium-veneer": veneer(P.premiumEmax),
  "hollywood-smile-16": veneer(P.premiumEmax),
  "hollywood-smile-20": veneer(P.premiumEmax),
  "full-mouth-rehab": veneer(P.fullEmaxIvoclar),
};

const DEFAULT: CrownVariant = molar(P.fullEmaxGisi);

export function getCrownVariant(slug: string): CrownVariant {
  return MAP[slug] ?? DEFAULT;
}
