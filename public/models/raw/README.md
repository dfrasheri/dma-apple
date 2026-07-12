# Drop real dental GLB models here

This is the **only step that needs you**. Download the models below, then put the
final `.glb` files where noted. I (Claude) handle everything after that:
optimize with `gltfjsx --transform`, wire them into the scenes, flip the
`present` flags in `src/components/implant3d/models.ts`, and confirm the explode.

Until a model's `present` flag is `true`, the site keeps using the current
procedural geometry — so nothing breaks while assets are missing.

> Sketchfab: click **Download 3D Model → glTF (or "Autoconverted glTF")**. You'll
> get a `.glb` or a zip with `.gltf/.bin/textures` — either is fine.

## Hero assets (these cover ~all 52 services)

| Save the optimized file as | Download | Cost | Covers |
|---|---|---|---|
| `public/models/implant-pack.glb` | [Dental Implant Pack 6-in-1](https://sketchfab.com/3d-models/dental-implant-pack-6-in-1-4df26718c8f74dcb86c5dbde3375ced2) — fixture+abutment+crown as separate parts (for the explode) | **$10** | all implants (Straumann BLX/BLT, Biodem, Detech, Swiss, single-implant, All-on-X, guided surgery) |
| `public/models/molar.glb` | [Maxillary First Molar — Univ. of Dundee](https://sketchfab.com/3d-models/maxillary-first-molar-e719a474ef7e4bd7abec508f85f1e984) (CC BY 4.0) | free | all 11 crowns + temporaries (recolored via `crownVariants`) |
| `public/models/incisor.glb` | [Maxillary Central Incisor — Dundee](https://sketchfab.com/3d-models/maxillary-left-central-incisor-c8a7c2d9280d4c92bc651cfa1459866a) (CC BY 4.0) | free | all veneers / front crowns |
| `public/models/tooth-root.glb` | [Human Teeth — Yasama](https://sketchfab.com/3d-models/human-teeth-ea6f6ebf18d4437798f20c70baf816fc) (CC BY 4.0) | free | natural tooth (endo, restorative, fillings) |
| `public/models/arch.glb` | [Human Gum and Teeth — CriisMora](https://sketchfab.com/3d-models/human-gum-and-teeth-8b3c0252a52d48e19e6e7aa08d78a443) | **~$13** | arch + gums (aligner, Hollywood smile, All-on-X, whitening) |

Total paid: **~$23**. CC BY models need a credit line — I'll add a small
`/attributions` page + footer link automatically.

## What to put here vs. /public/models
- Put **raw downloads** (zips, unoptimized `.glb`, `.gltf`+`.bin`+textures) in this
  `raw/` folder — keeps them for reference, not shipped.
- The **optimized, web-ready** `.glb` files go one level up in `/public/models/`
  with the exact names in the table above. I run the optimization step.

## After the files land (my job)
1. `npx gltfjsx <model>.glb --transform --types` → Draco-compressed, web-sized.
2. Read each GLB's node names; fill them into `models.ts` (`implantPack.nodes`).
3. Flip the matching `present: false` → `true`.
4. Verify the explode + materials on `localhost:9999`, screenshot proof.
