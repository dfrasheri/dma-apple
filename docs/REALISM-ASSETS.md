# Dental 3D Realism — Asset Download Checklist

**Goal:** replace the math-generated teeth in `src/components/implant3d/geometry.ts` with
real, anatomically-correct GLB meshes (many from dental-school CT scans). Lighting,
materials and the scene scaffolding stay as-is.

**You download these → drop them in `public/models/raw/` → I wire them into the scenes.**
That is the only step blocked on you. Total paid cost: ~$23.

Sketchfab download tip: click **Download 3D Model** → in the format dialog pick
**glTF** (or "Autoconverted glTF"). You'll get a `.glb` or a zip with `.gltf/.bin/textures`.
Either is fine — I optimize them with `gltfjsx --transform` afterward.

---

## Hero pieces (do these first — matches your 3 catalogue pages)

### 1. Implant anatomy  → `/catalogue/single-implant-crown`  (THE key one)
- **Dental Implant Pack – 6 in 1** — **$10** — native GLB, fixture + abutment + crown as
  separate parts (perfect for your explode animation), 4K PBR, ~29k tris.
  https://sketchfab.com/3d-models/dental-implant-pack-6-in-1-4df26718c8f74dcb86c5dbde3375ced2
  - License: Royalty-Free (NoAI clause — fine, we only *display* it). No attribution required.
  - Save as: `public/models/raw/implant-pack/`

### 2. Crown  → `/catalogue/emax-crown`
- **Maxillary First Molar — University of Dundee School of Dentistry** — **FREE** (CC BY 4.0).
  Authoritative dental-school anatomy, zBrush-from-CT. This is your realistic crown.
  https://sketchfab.com/3d-models/maxillary-first-molar-e719a474ef7e4bd7abec508f85f1e984
- **3D Tooth Crown (vherried)** — FREE (CC BY 4.0) — real intra-oral scan of a prepped tooth +
  crown fit. Optional "before/after fit" visual. https://sketchfab.com/3d-models/3d-tooth-crown-c574f2231ac64fe5bae2d4c7e966b411

### 3. Arch / aligner / Hollywood smile  → `/catalogue/laser-whitening` + All-on-X + Invisalign
- **Human Gum and Teeth (CriisMora)** — **~$13** — full teeth + gums, native GLB, 4K PBR,
  ~64k tris (web-manageable). This is your realistic arch with gums.
  https://sketchfab.com/3d-models/human-gum-and-teeth-8b3c0252a52d48e19e6e7aa08d78a443
  - License: Royalty-Free (NoAI). No attribution required.

---

## Supporting free teeth (CC BY 4.0 — commercial OK *with credit*)

- **Human Teeth (Yasama)** — single tooth WITH root, crown/dentin/pulp, lightweight 4.7k tris.
  For the "natural tooth" object. https://sketchfab.com/3d-models/human-teeth-ea6f6ebf18d4437798f20c70baf816fc
- **Maxillary Left Central Incisor — Dundee** — front-tooth anatomy for the arch.
  https://sketchfab.com/3d-models/maxillary-left-central-incisor-c8a7c2d9280d4c92bc651cfa1459866a
- **Inside my Tooth (R-LAB)** — cross-section (tooth + gums + nerve/vessels as separate
  objects). For a root-canal / endodontics explainer.
  https://sketchfab.com/3d-models/inside-my-tooth-5ebeadf0b40940ca93a4ced5cfe0abb2
- **Molar Tooth (vikrama1998)** — backup molar, very high detail (140k tris, will decimate).
  https://sketchfab.com/3d-models/molar-tooth-54376b4e2c3b4091aedaa12d94e15076

> CC BY 4.0 requires crediting the author. I'll add a small `/attributions` page + footer link.
> The two PAID models need no public credit.

---

## DO NOT USE (research checked these — they fail)
- *Dental Mouth and Teeth (Oussema3D)* — view-only, no download.
- *#30 CVC Tooth preparation* — view-only, no license.
- *UWF2 Mandible Periodontal Disease* — **CC BY-NC** → non-commercial, illegal on a clinic site.
- *Gums Teeth and Tongue (Cheboksary)* — license/download unconfirmed.

---

## After files land (my job)
1. `npx gltfjsx model.glb --transform --types` → web-optimized, Draco-compressed typed component.
2. Swap `buildCrown/buildTooth/buildIncisorCrown` + `ArchModel` for `useGLTF` loaders.
3. Apply enamel material (MeshPhysicalMaterial: transmission ~0.9, ior 1.6, clearcoat, warm
   ivory attenuation) + pink gum material; keep your `<Environment>` + ContactShadows.
4. Keep the implant explode animation by driving the GLB's fixture/abutment/crown sub-nodes.
5. Test live on the dev server, screenshot proof.
