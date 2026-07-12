# Behaviors — motion & interaction bible

1. **Hero carousel** — Owl Carousel, 7 image slides, auto-advancing (~5s), fade/slide between slides, 8 pagination dots (clickable). Overlay text stays fixed; only background image changes. Ken-Burns-style subtle zoom optional.
2. **Nav scroll transition** — over hero: `background: transparent`, white logo + links. After scrolling past hero: `background:#e6e6e6`, dark (#343434) logo + links. `transition: 0.3s`. Fixed at top, height 94px. (Trigger ~ when scrollY passes hero / ~100px.)
3. **Sticky bottom CTA bar** — hidden at top, slides/fades in after scrolling down. Dark bar, full width, fixed bottom. Left: "REQUEST AN APPOINTMENT →" with small icon. Right: Instagram + Google icons.
4. **Procedures carousel** ("Explore Dental Treatments") — Owl, drag + prev/next chevrons, thin progress bar reflecting position. Cards: darkened photo, centered Bodoni serif white label. Hover: subtle zoom/brighten.
5. **Office tour carousel** ("Tour Our Office") — full-width Owl image carousel, chevrons, serif overlay title bottom-left.
6. **Feature cards** (Advanced Technology / Gentle Experience) — image with dark bottom gradient, eyebrow + serif title. Hover: image zoom.
7. **Smile gallery banner** — full-bleed image, centered overlay, button with hover (bg/opacity shift).
8. **Instagram strip** — horizontal scroll of post thumbnails, right chevron, hover zoom.
9. **Footer reveal** — `footer-fade` class: fade/slide-up on enter viewport.
10. **Buttons / links** — hover: background/opacity transition (~0.3s ease). Chevron arrows translate on hover.

## Iteration 2 — exact motion engine (extracted live)

Site libs: **jQuery 3.5.1, GSAP + ScrollTrigger, Owl Carousel** (3 instances). No Lenis/Locomotive smooth-scroll (native scroll).

- **GSAP ScrollTrigger reveals** drive everything. Patterns observed (inline GSAP state):
  - Header nav items (`menu-trigger`, `menu-locations`, `menu-phone`): start `opacity:0; translateY(50px)` → fade-up **on load** (staggered).
  - Procedure cards (`area-each`): start `opacity:0; translateY(20px)` → fade-up, **staggered** on scroll-in.
  - Section headings/blocks: `opacity:0; translateY(...)` → settle to `translate(0,0)`.
  - Use GSAP easing (`power2.out`/`power3.out`, ~0.8–1.1s) — NOT CSS `ease` (that's the stiffness).
- **Hero** = Owl slide carousel: `animateIn:customSlideInRight`, `animateOut:customSlideOut`, `smartSpeed:900`, `autoplayTimeout:5000`, `loop`, `dots`. Header carousel CSS shows `animation: 1.5s ease slideOut`. → incoming slide translates in from right, outgoing slides out; ~900ms; 5s auto. (Replace the fade.)
- **Procedures carousel**: Owl, `smartSpeed:700`, dots, `margin:14`, no loop, responsive items.
- **Office/tour carousel**: Owl, `smartSpeed:250`, `loop`, `center`, `nav`, `dots`.

## Nav (mega-menu) — top-level bar
Home · Team(mega: Dentists, Hygienists, Meet Our Team) · Clinic(mega: Our Story, New Patient Experience, Patient Resources, Technology, Blog) · Care(mega: Comprehensive, Reconstructive, Cosmetic, Orthodontics) · Smiles · Contact.
Team mega also lists each dentist (Copp, Seppelt, Rosa, Lee, Lang, Law) + hygienists (Medin, Mears).

Implementation in clone: **GSAP** for reveals/nav-load (matches original easing), CSS transform slide carousel for hero, scroll-state nav + sticky CTA as before.
</content>
