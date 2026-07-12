# Procedure clips — drop-in animation layer for the catalogue cards

Each treatment card's **upper face** auto-plays a looping clip from this folder.
If a file is missing, the card gracefully falls back to its procedure image with a
slow "living" zoom/drift — so the page always looks finished. Drop a clip in and it
lights up automatically, **no code changes required**.

## File convention

For a service with slug `<slug>`, the card looks for (in order):

```
public/videos/procedures/<slug>.webm   ← preferred (smaller)
public/videos/procedures/<slug>.mp4    ← fallback
```

The matching still image (the fallback / poster) comes from the service's `poster`
field in `src/lib/catalogue.ts`, or the parent category image if none is set.

## Higgsfield recipe (keeps every clip in ONE colour family)

Generate **image-to-video** from each procedure's still, then apply the SAME base
style so the whole grid feels unified while each clip still shows its real procedure:

- **Duration:** 4–6 s, **seamless loop** (first frame ≈ last frame).
- **Motion:** very subtle — slow push-in / gentle orbit / soft parallax only. No cuts,
  no people walking. Think "a living photograph," macro, shallow depth of field.
- **Grade (the unifier):** cool clinical base, brand navy `#071522` in the shadows,
  soft neutral studio key light, light teal rim. Low saturation, clean whites.
- **Export:** 1080×1350 (4:5) or 1280×720, H.264 `.mp4` **and/or** VP9 `.webm`,
  muted, < ~2.5 MB each for fast load.
- **Base prompt suffix to append to every clip:**
  > "cinematic dental macro, shallow depth of field, slow subtle motion, seamless
  > loop, cool clinical color grade, deep navy shadows, soft studio lighting,
  > pristine whites, premium medical aesthetic, no text, no logos"

## Clips to generate (one per slug)

### Dental Implants
- [ ] `straumann-blx-implant` — titanium implant screw rotating slowly in soft studio light
- [ ] `biodem-implant` — German implant + passport, macro on the threaded surface
- [ ] `single-implant-crown` — implant → abutment → crown assembling on one tooth
- [ ] `all-on-4-single` — full upper arch on 4 implants, slow orbit
- [ ] `all-on-4-both` — both arches on 4+4 implants, slow reveal
- [ ] `all-on-6-single` — single arch on 6 implants, slight push-in
- [ ] `all-on-6-both` — full-mouth on 12 implants, slow orbit
- [ ] `bone-augmentation` — graft + collagen membrane over jawbone, soft motion
- [ ] `sinus-lift` — upper-jaw sinus area, subtle anatomical reveal
- [ ] `guided-implant-surgery` — 3D-printed surgical guide over the arch, CBCT glow
- [ ] `orthognathic-surgery` — jaw realignment, clean anatomical animation

### Crowns & Aesthetics
- [ ] `zirconia-emax-layered-crown` — layered crown catching light, slow rotation
- [ ] `zirconia-crown` — monolithic zirconia crown milling/settling on a tooth
- [ ] `emax-crown` — translucent glass-ceramic crown, light passing through
- [ ] `metal-ceramic-crown` — porcelain-fused-to-metal crown seating on a back tooth
- [ ] `porcelain-veneer` — thin veneer shell bonding to a front tooth
- [ ] `emax-veneer` — pressed-ceramic veneer, glossy macro
- [ ] `composite-veneer` — direct composite sculpted onto a tooth
- [ ] `hollywood-smile-16` — full smile-zone of 16 veneers, slow reveal
- [ ] `hollywood-smile-20` — premium 20-veneer full-mouth makeover
- [ ] `smile-design` — digital smile mock-up overlay morphing onto a face/arch
- [ ] `gingival-contouring` — diode laser reshaping a gum line, soft glow
- [ ] `full-mouth-rehab` — combined veneers/crowns/implants, slow full-arch orbit

### Aesthetic Whitening
- [ ] `laser-whitening` — LED/laser whitening light over teeth, glowing gel
- [ ] `take-home-whitening` — custom tray + gel, gentle clinical macro

### Endodontics
- [ ] `root-canal-single` — single canal cleaned + sealed, cross-section glow
- [ ] `root-canal-molar` — multi-canal molar, rotary file motion

### Periodontics
- [ ] `teeth-cleaning` — ultrasonic scaler polishing a tooth, water mist
- [ ] `gum-disease-treatment` — deep cleaning along the gum line
- [ ] `gum-graft` — gum tissue restored over a receding root

### Orthodontics
- [ ] `invisalign` — clear aligner sliding onto an arch, near-invisible shimmer
- [ ] `self-ligating-braces` — modern brackets on an arch, subtle highlight
- [ ] `lingual-braces` — braces behind the teeth, hidden-from-front reveal

### Oral Surgery
- [ ] `wisdom-tooth-removal` — impacted wisdom tooth sectioned, clean animation
- [ ] `cyst-removal` — jaw cyst area, careful surgical reveal
- [ ] `iv-sedation` — calm monitored sedation, soft vitals glow (no faces needed)

### Diagnostics & Planning
- [ ] `remote-treatment-plan` — X-ray + plan document, soft data overlay
- [ ] `cbct-scan` — rotating 3D CBCT jaw reconstruction, blue volumetric glow

### Dental Tourism Care
- [ ] `airport-transfer` — Tirana arrival → private car, warm cinematic (still on brand grade)
- [ ] `multilingual-coordinator` — coordinator at clinic desk, soft focus
- [ ] `hotel-concierge` — partner hotel exterior/lobby, calm luxury

### Guarantees
- [ ] `lifetime-implant-warranty` — implant + warranty seal, slow shine
- [ ] `crown-warranty` — crown + 5-year guarantee mark, gentle highlight
