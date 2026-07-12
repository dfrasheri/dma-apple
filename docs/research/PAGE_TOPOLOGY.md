# Page Topology — The Paddington Dental Surgery (home)

Source: https://www.thepaddingtondentalsurgery.com.au/
Platform: WordPress (AIOSEO), jQuery 3.5, Owl Carousel. Doc height ~6633px @1440.

Top-to-bottom layout (body children):
1. **`.nav-bar.nav-fixed`** (fixed, h94) — logo left, center menu (Team / Clinic / Care / Smiles / Contact), right icons (location pin, mobile phone). Team has a dropdown (Dr. Duncan R. Copp, Dr. Joanna Seppelt, Dr. Joao (John) Marcos Pedro Rosa Jun...). **Scroll behavior:** transparent bg + white text over hero → solid near-white bg (#ececec-ish) + dark text once scrolled past hero. Transition 0.3s.
2. **`header.site-header`** (hero, h945) — full-bleed Owl image carousel (7 slides), dark scrim, centered overlay: eyebrow `GENERAL | COSMETIC | RESTORATIVE`, title `Sydney's Home of Dentistry` (Bodoni serif, white). 8 pagination dots bottom-center. Auto-rotating.
3. **`main#skiptomaincontent`** (h4435):
   - **Intro / About** (`.mod-basic`) — centered Bodoni H2 "Over 20 Years of Excellence in Cosmetic and Family Dentistry", short rule, 3 Roboto paragraphs, Bodoni blockquote "The Paddington Dental Surgery is one of the most beautiful dental clinics in Australia…" + "— THE DENTAL ARCHITECT", two buttons: ABOUT OUR CLINIC, MEET THE TEAM.
   - **Explore Dental Treatments** (`.mod-procedures`) — Bodoni H2 left, Owl carousel of category cards (Comprehensive / Reconstructive / Cosmetic / Orthodontic), each = darkened photo with centered serif white label; prev/next chevrons; thin progress bar under it.
   - **Tour Our Office** (`.mod-pagebuilder`, h1795) — (a) full-width Owl image carousel of the clinic (office-tour-4..12) with serif "Tour Our Office" overlaid bottom-left + chevrons; (b) two side-by-side overlay image cards: "STATE-OF-THE-ART EQUIPMENT / Advanced Technology" and "COMFORTABLE DENTISTRY / Gentle Experience" (eyebrow Roboto + Bodoni title, dark bottom gradient).
   - **Smile Gallery banner** (`.mod-basic`, h945) — full-bleed photo (3 women), centered overlay: eyebrow "LIFE-CHANGING DENTAL MAKEOVERS", Bodoni title "Unveiling Beautiful Smiles", button "VIEW SMILE GALLERY".
   - **Instagram** (`.mod-basic`, h292) — Bodoni "Latest on Instagram" left + "THEPADDINGTONDENTALSURGERY" pill (IG icon) right; horizontal strip of 5 post images (Elfsight).
4. **`footer.site-footer`** (h790) — logo, phone "(02) 9331-2555", address "263 Glenmore Road, Paddington, Sydney", "GET DIRECTIONS →", IG + Google icons; right: contact form (First/Last/Email/Phone/New-or-Existing/Comments + disclaimer + SUBMIT). Accreditation logo row (ALD, King's College London, NYU, RateMDs, Best in AU, ThreeBest, ADA, AACD, IDEA). Copyright bar.
5. **Sticky bottom CTA bar** (appears on scroll) — dark bar: "REQUEST AN APPOINTMENT →" left, IG + Google icons right.

Interaction models: Hero = time-driven Owl. Procedures + Office tour = drag/arrow Owl. Nav = scroll-driven state change. Bottom CTA = scroll-driven appearance. Cards = hover. Footer = `footer-fade` reveal.
</content>
