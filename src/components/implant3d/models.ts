// Central registry for the real GLB dental meshes that replace the
// math-generated geometry in `geometry.ts`. This is the ONE switchboard.
//
// Flow: download a model -> drop it in `public/models/` (see
// `public/models/raw/README.md`) -> flip its `present` to `true`.
// Until `present` is true, every scene keeps rendering the existing
// procedural mesh, so the live site is unchanged.
//
// Materials, lighting, the explode animation and `crownVariants` all stay as
// they are, only the geometry source swaps.

export type ImplantPart = "fixture" | "abutment" | "crown";

type ModelEntry = {
  /** Path under /public, served at the site root by Next. */
  path: string;
  /** Flip to true once the .glb exists in /public/models. */
  present: boolean;
};

type ImplantEntry = ModelEntry & {
  /**
   * Candidate node names inside the implant pack GLB for each explodable part.
   * Finalized after inspecting the downloaded file; positional fallback otherwise.
   */
  nodes: Record<ImplantPart, string[]>;
};

export const MODELS = {
  /** Dental Implant Pack 6-in-1, fixture + abutment + crown as SEPARATE parts (for the explode). */
  implantPack: {
    path: "/models/implant-pack.glb",
    present: false,
    nodes: {
      fixture: ["Fixture", "fixture", "Implant", "Screw", "Body"],
      abutment: ["Abutment", "abutment", "Connector"],
      crown: ["Crown", "crown", "Cap", "Tooth", "Prosthetic"],
    },
  } satisfies ImplantEntry,

  /** Realistic posterior crown, Dundee maxillary first molar. Covers all molar-shaped crowns. */
  molarCrown: { path: "/models/molar.glb", present: false } satisfies ModelEntry,

  /** Realistic anterior tooth, Dundee central incisor. Covers veneers / front crowns. */
  incisor: { path: "/models/incisor.glb", present: false } satisfies ModelEntry,

  /** Whole natural tooth WITH root, Yasama. Covers the "natural tooth" object (endo, restorative). */
  toothRoot: { path: "/models/tooth-root.glb", present: false } satisfies ModelEntry,

  /** Full arch with gums, CriisMora. Covers aligner / Hollywood smile / All-on-X. */
  arch: { path: "/models/arch.glb", present: false } satisfies ModelEntry,
} as const;

export type ModelKey = keyof typeof MODELS;
