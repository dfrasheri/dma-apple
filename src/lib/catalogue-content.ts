// Rich, unique per-treatment content for the /catalogue/[slug] SEO landing pages.
// Each entry is hand-written so every page has substantive, non-duplicate content
// (thin/templated pages are treated as doorway pages and hurt rankings).
// "What to expect" steps are shared per category - the rest is unique per treatment.

import { CONTENT_2026, PROCESS_2026 } from "./catalogue-2026";
import { DEEP_CONTENT } from "./catalogue-content-deep";
import { RICH_CONTENT } from "./catalogue-content-rich";

export type Faq = { q: string; a: string };

/** A titled step/phase/point used by the step-by-step, recovery, candidate and maintenance sections. */
export type NamedPoint = { title: string; text: string };
/** One key/value fact for the "at a glance" spec strip. */
export type SpecItem = { label: string; value: string };
/** A cited stat for the success/longevity band. */
export type StatItem = { value: string; label: string; source?: string };
/** A "good to know" comparison / decision block (e.g. All-on-4 vs All-on-6). */
export type CompareItem = { heading: string; body: string };

export type TreatmentContent = {
  /** SEO <title> */
  title: string;
  /** meta description (~150-160 chars) */
  description: string;
  /** lead paragraph under the H1 */
  intro: string;
  /** expanded body paragraphs (deepened content), shown under the intro */
  details?: string[];
  benefits: string[];
  idealFor: string;
  /** aftercare / recovery / what-happens-next note */
  aftercare?: string;
  faqs: Faq[];
  duration?: string;

  // ── Rich landing-page sections (all optional; category defaults fill gaps) ──
  /** "At a glance" spec strip (duration, brand, documentation, trips, anaesthesia…). */
  specs?: SpecItem[];
  /** Per-service step-by-step; overrides the shared CATEGORY_PROCESS when present. */
  steps?: NamedPoint[];
  /** "Who is this treatment for", ideal-candidate list. */
  candidates?: NamedPoint[];
  /** Recovery / healing timeline (day-of, first week, months…). */
  recovery?: NamedPoint[];
  /** Cited success-rate / longevity figures. */
  stats?: StatItem[];
  /** "Good to know" decision blocks (upper vs lower, this-vs-that…). */
  comparisons?: CompareItem[];
  /** How to care for / maintain the result. */
  maintenance?: NamedPoint[];
  /** Cost & transparency paragraph (never a fixed price, always the free-plan route). */
  costNote?: string;
};

const BASE_CATEGORY_PROCESS: Record<string, { title: string; text: string }[]> = {
  implants: [
    { title: "3D Planning", text: "A free consultation and CBCT scan map your bone and nerves so placement is precise and predictable." },
    { title: "Gentle Placement", text: "Your implant is placed - often with computer-guided surgery - using calm, painless techniques." },
    { title: "Your Final Teeth", text: "After healing, your custom crown, bridge, or full arch is fitted for a natural, lasting result." },
  ],
  "crowns-aesthetics": [
    { title: "Smile Design", text: "We plan shape, shade, and proportion together, often with a digital preview before we begin." },
    { title: "Gentle Preparation", text: "Minimal, careful preparation and a digital impression capture every detail of your smile." },
    { title: "Hand-Finished Fit", text: "Our in-house ceramists craft and refine your restoration before a precise, comfortable fitting." },
  ],
  whitening: [
    { title: "Shade Assessment", text: "A quick check-up confirms your teeth are healthy and records your starting shade." },
    { title: "Professional Whitening", text: "Your treatment is applied safely in-clinic or with custom take-home trays." },
    { title: "Lasting Aftercare", text: "We share simple aftercare so your brighter smile stays its best for longer." },
  ],
  endodontics: [
    { title: "Precise Diagnosis", text: "3D imaging and magnification reveal the exact anatomy of your tooth." },
    { title: "Gentle Treatment", text: "The infected tissue is removed comfortably under local anaesthetic and microscope vision." },
    { title: "Seal & Restore", text: "The canal is sealed and the tooth restored - often with a crown - to full strength." },
  ],
  periodontics: [
    { title: "Gum Assessment", text: "We chart your gum health to understand exactly what your gums need." },
    { title: "Targeted Treatment", text: "Deep cleaning or surgery removes infection and protects your teeth and bone." },
    { title: "Maintenance Plan", text: "A simple care routine keeps your gums healthy for the long term." },
  ],
  orthodontics: [
    { title: "Digital Preview", text: "A 3D scan lets you see your future smile before treatment starts." },
    { title: "Aligners or Braces", text: "Your custom appliance is fitted and gently guides your teeth into place." },
    { title: "Retention", text: "Custom retainers protect your beautiful new alignment for years to come." },
  ],
  "oral-surgery": [
    { title: "Consultation & Planning", text: "3D imaging and careful planning make your procedure safe and predictable." },
    { title: "Comfortable Surgery", text: "Gentle techniques - with IV sedation available - keep you completely at ease." },
    { title: "Guided Aftercare", text: "Clear instructions and a review appointment support a smooth recovery." },
  ],
  diagnostics: [
    { title: "Share Your Images", text: "Capture them at the clinic, or send an X-ray and photos from home." },
    { title: "Expert Review", text: "Our clinical team reviews everything in detail." },
    { title: "Clear Plan", text: "You receive a personalised written treatment plan, in your language." },
  ],
  tourism: [
    { title: "Plan Your Trip", text: "Your coordinator arranges timing, travel, and accommodation around your treatment." },
    { title: "Warm Welcome", text: "We meet you in Tirana and take care of the details so you can relax." },
    { title: "Treat & Recover", text: "Enjoy your treatment and recovery, with support throughout your stay." },
  ],
};

export const CATEGORY_PROCESS: Record<string, { title: string; text: string }[]> = {
  ...BASE_CATEGORY_PROCESS,
  ...PROCESS_2026,
};

const cta =
  "send a panoramic X-ray and a few photos for a free written treatment plan within 24-48 hours.";

const BASE_CATALOGUE_CONTENT: Record<string, TreatmentContent> = {
  // ---------------- IMPLANTS ----------------
  "straumann-blx-implant": {
    title: "Straumann BLX Implants in Tirana, Albania | Dental Med Austria",
    description:
      "Premium Swiss Straumann BLX implants in Tirana with an immediate-loading design. premium-quality care for international patients. Free plan in 24-48h.",
    intro:
      "The Straumann BLX is the Swiss gold-standard implant - fully tapered for excellent stability and, in suitable cases, immediate placement and loading. For patients who simply want the best, it is the most trusted name in implantology, backed by decades of clinical documentation.",
    benefits: [
      "Market-leading stability for predictable, long-lasting results",
      "Often suitable for same-day, immediate-loading protocols",
      "The world's most clinically documented implant system",
    ],
    idealFor: "Patients who want the most established premium implant brand available.",
    faqs: [
      { q: "Why choose Straumann over other implants?", a: "Straumann is the most clinically documented implant system in the world, with decades of research behind it - the reassurance many patients want for a lifelong investment." },
      { q: "How is a Straumann BLX implant treatment planned in Albania?", a: `Your plan depends on your case and any grafting needed. The simplest way to know is to ${cta}` },
    ],
  },
  "biodem-implant": {
    title: "Biodem German Implants in Tirana, Albania | Dental Med Austria",
    description:
      "German-engineered Biodem dental implants in Tirana - CE-marked, with a personal implant passport. Premium quality and dependable results. Free remote plan in 24-48h.",
    intro:
      "Biodem is a German-manufactured implant offered with a personal implant passport recording verifiable serial numbers. It sits in the refined mid-premium tier - true European engineering, perfectly aligned with our quality promise.",
    benefits: [
      "German manufacturing and CE certification",
      "A personal implant passport with verifiable serial numbers",
      "Dependable results without compromising on quality",
    ],
    idealFor: "Patients who want genuine European-quality implants.",
    faqs: [
      { q: "Is Biodem a good implant brand?", a: "Yes - Biodem is German-made and CE-marked, and every implant is recorded in a personal implant passport, making it a dependable choice that reflects our European-quality standards." },
      { q: "Can I get a treatment plan before travelling?", a: `Absolutely. Just ${cta}` },
    ],
  },
  "single-implant-crown": {
    title: "Single Dental Implant & Crown in Tirana | Dental Med Austria",
    description:
      "Replace one missing tooth with a complete implant, abutment, and zirconia or E-max crown in Tirana, Albania. Natural, fixed, and built to last. Free plan in 24-48h.",
    intro:
      "Our most popular single-tooth solution replaces a missing tooth from the root up: a titanium implant, a custom abutment, and a lifelike zirconia or Ivoclar E-max crown. The result is fixed, natural-looking, and cared for just like your own tooth.",
    benefits: [
      "A complete, fixed replacement - nothing to remove",
      "Protects neighbouring teeth, unlike a traditional bridge",
      "A crown matched precisely to your natural smile",
    ],
    idealFor: "Anyone missing a single tooth who wants a permanent, natural result.",
    faqs: [
      { q: "How long does a single implant take?", a: "Placement is usually a single short appointment; the final crown is fitted after a healing period of a few months. International patients often split this into two trips." },
      { q: "Will the crown look natural?", a: "Yes - it's individually shade-matched and hand-finished in our lab to blend seamlessly with your surrounding teeth." },
    ],
  },
  "all-on-4-single": {
    title: "All-on-4 Dental Implants in Tirana, Albania | Dental Med Austria",
    description:
      "Fixed full-arch All-on-4 implants in Tirana with same-day temporary teeth via 3D-guided surgery. A complete new smile in one visit. Free remote plan in 24-48h.",
    intro:
      "All-on-4 restores a complete arch of teeth on just four implants, with same-day temporary teeth made possible by 3D-guided surgery. It is our flagship full-arch solution - a fixed, confident smile without a single tooth left missing.",
    benefits: [
      "A full fixed arch on only four implants",
      "Same-day temporary teeth in suitable cases",
      "Often avoids the need for bone grafting",
    ],
    idealFor: "Patients missing most or all teeth in one jaw, or facing full dentures.",
    faqs: [
      { q: "Can I get teeth on the same day?", a: "In most cases, yes - a fixed temporary bridge is placed the same day, with your final bridge fitted after healing." },
      { q: "How many trips to Albania will I need?", a: `Typically two: placement with temporaries, then the final bridge. We'll map your exact plan when you ${cta}` },
    ],
  },
  "all-on-4-both": {
    title: "Full-Mouth All-on-4 (Both Arches) in Tirana | Dental Med Austria",
    description:
      "Full-mouth reconstruction with All-on-4 on both upper and lower jaws in Tirana, Albania. Fixed, natural teeth and a complete new smile. Free plan in 24-48h.",
    intro:
      "When both jaws need restoring, All-on-4 on both arches rebuilds your entire smile on eight implants - the most common full-mouth medical-tourism case. You leave with fixed, natural-looking teeth top and bottom.",
    benefits: [
      "A complete full-mouth transformation",
      "Fixed teeth in both jaws - no removable dentures",
      "Streamlined into as few trips as possible",
    ],
    idealFor: "Patients needing both arches restored who want one coordinated plan.",
    faqs: [
      { q: "Is full-mouth treatment done in one go?", a: "Both arches are usually treated together for efficiency, with same-day temporaries and final bridges after healing." },
      { q: "How do I get an accurate plan?", a: `Send your CBCT or panoramic X-ray and photos - we'll return a written full-mouth plan within 24-48 hours.` },
    ],
  },
  "all-on-6-single": {
    title: "All-on-6 Dental Implants in Tirana, Albania | Dental Med Austria",
    description:
      "All-on-6 full-arch implants in Tirana for extra strength and stability. Fixed, natural teeth on six implants to ISO 9001 standards. Free remote plan in 24-48h.",
    intro:
      "All-on-6 restores a full arch on six implants, distributing bite forces for extra strength and long-term stability. It is an excellent choice where bone quality allows, giving a rock-solid foundation for your new fixed smile.",
    benefits: [
      "Six implants for superior strength and stability",
      "A fixed, full-arch bridge that feels secure",
      "Ideal for stronger bite forces and larger arches",
    ],
    idealFor: "Patients who want maximum stability for a full-arch restoration.",
    faqs: [
      { q: "Is All-on-6 better than All-on-4?", a: "Neither is universally 'better' - All-on-6 adds stability where bone allows, while All-on-4 suits cases with less bone. We recommend the right option for your anatomy." },
      { q: "How do I find out which I need?", a: `A CBCT scan tells us. ${cta.charAt(0).toUpperCase() + cta.slice(1)}` },
    ],
  },
  "all-on-6-both": {
    title: "Full-Mouth All-on-6 (Both Arches) in Tirana | Dental Med Austria",
    description:
      "Top-tier full-mouth reconstruction with All-on-6 on both jaws in Tirana, Albania. Twelve implants, fixed bridges, lasting strength. Free plan in 24-48h.",
    intro:
      "Our top-tier full-mouth restoration places six implants in each jaw - twelve in total - for the strongest, most stable fixed reconstruction we offer. It rebuilds a complete, confident smile designed to last.",
    benefits: [
      "Maximum support across both jaws",
      "Exceptional strength for demanding cases",
      "A complete, fixed, full-mouth smile",
    ],
    idealFor: "Patients wanting the most robust full-mouth implant solution.",
    faqs: [
      { q: "Who is All-on-6 on both arches for?", a: "It suits patients restoring both jaws who have sufficient bone and want the highest stability for heavy bite forces." },
      { q: "Can you plan this remotely?", a: `Yes - ${cta}` },
    ],
  },
  "bone-augmentation": {
    title: "Bone Grafting & GBR in Tirana, Albania | Dental Med Austria",
    description:
      "Guided bone regeneration in Tirana rebuilds lost jawbone with premium Botiss biomaterials so implants can be placed with confidence. Free plan in 24-48h.",
    intro:
      "When the jaw has lost bone over time, guided bone regeneration (GBR) rebuilds a solid foundation using a graft and a protective collagen membrane. It makes implant treatment possible - and predictable - even where bone was once insufficient.",
    benefits: [
      "Rebuilds lost bone for secure implant placement",
      "Premium Botiss Cerabone graft and Jason membrane",
      "Expands who can benefit from implants",
    ],
    idealFor: "Patients told they lack enough bone for implants.",
    faqs: [
      { q: "Does bone grafting hurt?", a: "It's carried out under local anaesthetic (with sedation available) and most patients find recovery very manageable." },
      { q: "How long before I can have an implant?", a: "Grafted sites typically heal over a few months before implant placement; we'll time your trips around this." },
    ],
  },
  "sinus-lift": {
    title: "Sinus Lift for Implants in Tirana | Dental Med Austria",
    description:
      "Lateral-window sinus lift in Tirana, Albania restores upper-jaw bone height for secure implants in the back teeth. Premium biomaterials. Free plan in 24-48h.",
    intro:
      "A sinus lift restores bone height in the upper back jaw, where the sinus often limits implant placement. Using a gentle lateral-window technique and premium graft material, we create the foundation needed for stable, long-lasting implants.",
    benefits: [
      "Makes implants possible in the upper back jaw",
      "Predictable, well-established surgical technique",
      "Premium Botiss grafting materials",
    ],
    idealFor: "Patients needing upper back-tooth implants with limited bone height.",
    faqs: [
      { q: "Is a sinus lift safe?", a: "Yes - it's a routine, well-documented procedure performed under careful 3D planning and sterile, ISO-standard conditions." },
      { q: "Will it be done with my implants?", a: "Sometimes simultaneously, sometimes as a staged step - your CBCT scan determines the safest approach." },
    ],
  },
  "guided-implant-surgery": {
    title: "Computer-Guided Implant Surgery in Tirana | Dental Med Austria",
    description:
      "3D computer-guided implant surgery in Tirana, Albania for sub-millimetre precision, comfort, and faster healing. Navident navigation. Free plan in 24-48h.",
    intro:
      "Computer-guided implant surgery plans every detail from your CBCT scan, then places your implant through a 3D-printed guide or live Navident navigation. The result is dramatically improved precision, smaller incisions, and a more comfortable recovery.",
    benefits: [
      "Sub-millimetre placement accuracy",
      "Less invasive, often faster healing",
      "Safer planning around nerves and sinuses",
    ],
    idealFor: "Anyone wanting the most precise, modern implant placement.",
    faqs: [
      { q: "What is guided implant surgery?", a: "It uses your 3D scan to plan the exact position of each implant, then guides placement digitally - improving accuracy and reducing complications." },
      { q: "Is it more comfortable?", a: "Often yes - guided, minimally invasive techniques typically mean less swelling and a smoother recovery." },
    ],
  },
  "orthognathic-surgery": {
    title: "Corrective Jaw Surgery in Tirana | Dental Med Austria",
    description:
      "Corrective jaw (orthognathic) surgery in Tirana, Albania to improve bite, function, and facial balance - performed to hospital standards. Free consultation plan.",
    intro:
      "Corrective jaw surgery repositions the upper or lower jaw to resolve bite problems, breathing concerns, and facial imbalance. Performed to hospital standards by our surgical team, it can be life-changing for both function and confidence.",
    benefits: [
      "Corrects significant bite and alignment issues",
      "Improves facial balance and function",
      "Carried out to hospital-grade surgical standards",
    ],
    idealFor: "Patients with jaw discrepancies that braces alone cannot correct.",
    faqs: [
      { q: "Is jaw surgery a major procedure?", a: "It's an advanced surgery planned meticulously with 3D imaging and an anaesthesiology team; we'll explain every step and the recovery in detail." },
      { q: "How do I start?", a: `Begin with a remote review - ${cta}` },
    ],
  },

  // ---------------- CROWNS & AESTHETICS ----------------
  "zirconia-emax-layered-crown": {
    title: "Zirconia E-max Layered Crowns in Tirana | Dental Med Austria",
    description:
      "Our signature zirconia core hand-layered with Ivoclar IPS e.max ceramic in Tirana, Albania - the most lifelike, durable crown. Made in-house. Free plan in 24-48h.",
    intro:
      "Our signature crown pairs a strong zirconia core with a facial layer of hand-applied Ivoclar IPS e.max ceramic. The strength of zirconia meets the lifelike translucency of premium ceramic - the most beautiful, durable crown we make.",
    benefits: [
      "Strength of zirconia with the beauty of layered ceramic",
      "Hand-finished in our in-house lab for a lifelike result",
      "Crafted from documented premium materials to European standards",
    ],
    idealFor: "Front teeth and smile-zone restorations where aesthetics matter most.",
    faqs: [
      { q: "What makes a layered crown better?", a: "Hand-layered ceramic captures the subtle translucency and colour gradients of a natural tooth, which a single-material crown can't fully match." },
      { q: "How long do these crowns last?", a: "With good care they routinely last many years - every crown is crafted in our in-house lab from documented premium materials." },
    ],
  },
  "zirconia-crown": {
    title: "Zirconia Crowns in Tirana, Albania | Dental Med Austria",
    description:
      "Strong, metal-free monolithic zirconia crowns milled in-house in Tirana. Durable, biocompatible, natural-looking. Premium German zirconia. Free plan in 24-48h.",
    intro:
      "A full-contour zirconia crown is milled in-house from premium German zirconia. Metal-free, biocompatible, and extremely strong, it is the modern standard for durable restorations - especially on back teeth that take heavy load.",
    benefits: [
      "Exceptional strength with no metal core",
      "Milled in-house for a fast, precise fit",
      "Biocompatible and gum-friendly",
    ],
    idealFor: "Back teeth and anyone wanting a strong, metal-free crown.",
    faqs: [
      { q: "Are zirconia crowns strong?", a: "Very - zirconia is one of the toughest dental materials available, ideal for chewing surfaces and long-term durability." },
      { q: "Do they look natural?", a: "Yes; modern zirconia is tooth-coloured and, for front teeth, can be layered for extra translucency." },
    ],
  },
  "emax-crown": {
    title: "E-max Crowns in Tirana, Albania | Dental Med Austria",
    description:
      "Ivoclar E-max lithium-disilicate crowns in Tirana for superior translucency and natural front-tooth aesthetics. Premium materials. Free remote plan in 24-48h.",
    intro:
      "The E-max crown is a glass-ceramic restoration prized for its superb translucency - the industry gold standard for natural-looking front teeth. Made from Ivoclar IPS E-max, it captures the light exactly like natural enamel.",
    benefits: [
      "Outstanding translucency for the smile zone",
      "Premium Ivoclar IPS E-max ceramic",
      "Minimal, tooth-preserving preparation",
    ],
    idealFor: "Front teeth where lifelike aesthetics are the priority.",
    faqs: [
      { q: "E-max or zirconia for front teeth?", a: "E-max usually wins on translucency for single front teeth; zirconia is favoured where extra strength is needed. We'll advise per tooth." },
      { q: "Is E-max durable?", a: "Yes - it combines excellent aesthetics with strength suited to front and many premolar restorations, crafted from premium Ivoclar ceramic in our in-house lab." },
    ],
  },
  "metal-ceramic-crown": {
    title: "Metal-Ceramic (PFM) Crowns in Tirana | Dental Med Austria",
    description:
      "Hard-wearing metal-ceramic crowns in Tirana, Albania - a proven, dependable restoration for back teeth. European standards. Free plan in 24-48h.",
    intro:
      "The metal-ceramic (PFM) crown bonds a ceramic surface to a strong metal substructure. It is a time-proven, hard-wearing restoration and a dependable choice, particularly for back teeth.",
    benefits: [
      "Decades-proven strength and reliability",
      "A practical, dependable restoration option",
      "Well-suited to high-load back teeth",
    ],
    idealFor: "Back teeth and everyday restorations.",
    faqs: [
      { q: "Is metal-ceramic outdated?", a: "Not at all - while metal-free options lead on aesthetics, PFM remains a robust, dependable choice in many situations." },
      { q: "Will the metal show?", a: "Modern preparation and ceramic placement keep PFM crowns natural-looking; for the smile zone we often suggest E-max or layered zirconia." },
    ],
  },
  "porcelain-veneer": {
    title: "Ceramic Veneers in Tirana, Albania | Dental Med Austria",
    description:
      "Hand-crafted ceramic veneers in Tirana to perfect the shape, colour, and harmony of your smile. Natural, durable, premium. Free smile plan in 24-48h.",
    intro:
      "A ceramic veneer is a thin, custom shell bonded to the front of a tooth - the classic premium way to refine shape, colour, and alignment. Hand-crafted from premium ceramic, veneers transform a smile while preserving healthy tooth structure.",
    benefits: [
      "Corrects colour, chips, gaps, and shape",
      "Durable, stain-resistant premium ceramic",
      "Natural, light-reflective finish",
    ],
    idealFor: "Anyone wanting a refined, natural smile makeover.",
    faqs: [
      { q: "Do veneers damage my teeth?", a: "Preparation is minimal and conservative; veneers are designed to enhance your smile while preserving as much natural enamel as possible." },
      { q: "How many veneers will I need?", a: `It depends on your smile line - typically 6-10 for a full makeover. ${cta.charAt(0).toUpperCase() + cta.slice(1)}` },
    ],
  },
  "emax-veneer": {
    title: "E-max Veneers in Tirana, Albania | Dental Med Austria",
    description:
      "Pressed Ivoclar E-max veneers in Tirana combining superior strength and flawless aesthetics - our premium veneer standard. Free smile plan in 24-48h.",
    intro:
      "The E-max veneer is a pressed-ceramic shell that combines superior strength with flawless aesthetics. Made from Ivoclar IPS E-max, it is our premium veneer standard - beautiful, thin, and remarkably durable.",
    benefits: [
      "Premium pressed Ivoclar E-max ceramic",
      "Stronger than traditional feldspathic veneers",
      "Exceptional, lifelike translucency",
    ],
    idealFor: "Patients wanting the most durable premium veneer.",
    faqs: [
      { q: "E-max vs layered-ceramic veneers - which is best?", a: "E-max offers extra strength and consistency; hand-layered ceramic can offer artistic nuance. Both are premium - we'll match the choice to your goals." },
      { q: "Are E-max veneers stain-resistant?", a: "Yes - the glass-ceramic surface resists staining and keeps its shade beautifully over time." },
    ],
  },
  "composite-veneer": {
    title: "Composite Veneers in Tirana, Albania | Dental Med Austria",
    description:
      "Same-visit composite veneers in Tirana - a minimally invasive, reversible way to refresh your smile in a single appointment. Free smile plan in 24-48h.",
    intro:
      "A composite veneer is sculpted directly onto your tooth in a single visit, refreshing shape and colour with a minimally invasive, reversible approach. It is the same-day route to a brighter, more even smile.",
    benefits: [
      "Completed in a single visit",
      "Minimally invasive and reversible",
      "A quick, single-visit smile refresh",
    ],
    idealFor: "Patients wanting a same-day improvement.",
    faqs: [
      { q: "How long do composite veneers last?", a: "Typically several years with good care; they can be polished and maintained, and later upgraded to ceramic if you wish." },
      { q: "Can it be done on one trip?", a: "Yes - composite veneers are usually completed in a single appointment, ideal for shorter visits." },
    ],
  },
  "hollywood-smile-16": {
    title: "Hollywood Smile (16 Veneers) in Tirana | Dental Med Austria",
    description:
      "Full smile-zone transformation with 16 premium veneers in Tirana, Albania. A radiant, balanced Hollywood smile designed around you. Free smile plan in 24-48h.",
    intro:
      "The Hollywood Smile transforms your entire smile zone with 16 veneers - eight upper and eight lower. Every tooth is designed for balance, brightness, and natural harmony, creating the radiant, camera-ready smile the treatment is famous for.",
    benefits: [
      "A complete, balanced smile transformation",
      "Designed digitally before treatment begins",
      "Premium E-max or layered-ceramic veneers",
    ],
    idealFor: "Patients wanting a complete, dramatic smile makeover.",
    faqs: [
      { q: "How long does a Hollywood Smile take?", a: "Usually one to two trips: design and preparation, then fitting. We coordinate the timeline around your travel." },
      { q: "Will it look natural?", a: "Yes - we design proportion, shade, and texture for a result that's striking yet authentically yours, previewed before we start." },
    ],
  },
  "hollywood-smile-20": {
    title: "Hollywood Smile (20 Veneers) in Tirana | Dental Med Austria",
    description:
      "Premium full-mouth makeover with 20 veneers in Tirana, Albania, extending to the premolars for the most complete smile transformation. Free plan in 24-48h.",
    intro:
      "Our most complete veneer makeover places 20 veneers - extending to the premolars - so your smile looks flawless even in the widest, most expressive moments. It is the premium choice for a truly full smile transformation.",
    benefits: [
      "The widest, most complete veneer makeover",
      "Flawless even on a broad, full smile",
      "Fully personalised digital smile design",
    ],
    idealFor: "Patients with a wide smile wanting complete coverage.",
    faqs: [
      { q: "Do I need 16 or 20 veneers?", a: "It depends on how many teeth show when you smile broadly. A smile-design consultation makes the right number clear." },
      { q: "Can you preview my result?", a: "Yes - digital smile design (and often a mock-up) lets you see and shape the outcome first." },
    ],
  },
  "smile-design": {
    title: "Digital Smile Design (DSD) in Tirana | Dental Med Austria",
    description:
      "Digital Smile Design in Tirana, Albania - preview and shape your new smile with a photo protocol and 3D mock-up before any treatment. Free smile plan in 24-48h.",
    intro:
      "Digital Smile Design uses a precise photo protocol and a digital mock-up to plan your new smile before treatment begins. You see and refine the proportions, shape, and shade up front - so the final result matches the smile you imagined.",
    benefits: [
      "Preview your smile before committing",
      "Collaborative - your input shapes the design",
      "Predictable, expectation-aligned results",
    ],
    idealFor: "Anyone considering veneers or a smile makeover.",
    faqs: [
      { q: "Is smile design worth it?", a: "Yes - it turns a smile makeover from guesswork into a planned, previewed outcome, reducing surprises and improving satisfaction." },
      { q: "Can it be done remotely?", a: "We can begin with photos you send from home and refine the design in person before treatment." },
    ],
  },
  "gingival-contouring": {
    title: "Gummy Smile Correction in Tirana | Dental Med Austria",
    description:
      "Laser gum contouring in Tirana, Albania to correct a gummy smile and balance your gum line - quick, precise, and minimally invasive. Free smile plan in 24-48h.",
    intro:
      "Gum contouring gently reshapes the gum line with a diode laser to bring balance and harmony to your smile. Often used before veneers, it corrects a 'gummy' smile or uneven gums quickly, precisely, and with minimal discomfort.",
    benefits: [
      "Corrects a gummy or uneven smile line",
      "Precise, minimally invasive laser technique",
      "Fast healing with little discomfort",
    ],
    idealFor: "Patients who show excess gum or have an uneven gum line.",
    faqs: [
      { q: "Does laser gum contouring hurt?", a: "It's done under local anaesthetic and the laser minimises bleeding and speeds healing, so discomfort is typically minimal." },
      { q: "Is it permanent?", a: "Results are long-lasting; we plan the new gum line carefully, often as part of a wider smile design." },
    ],
  },
  "full-mouth-rehab": {
    title: "Full-Mouth Rehabilitation in Tirana | Dental Med Austria",
    description:
      "Comprehensive full-mouth rehabilitation in Tirana, Albania combining veneers, crowns, and implants for complex aesthetic and functional cases. Free plan in 24-48h.",
    intro:
      "Full-mouth rehabilitation combines veneers, crowns, and implants into one coordinated plan for complex, end-stage cases. It restores not just appearance but bite, function, and comfort - a complete reset for your oral health and confidence.",
    benefits: [
      "Restores function, comfort, and aesthetics together",
      "One coordinated plan across multiple disciplines",
      "Tailored to even the most complex cases",
    ],
    idealFor: "Patients needing extensive restoration across the whole mouth.",
    faqs: [
      { q: "How is a full-mouth plan organised?", a: "We sequence implants, crowns, and veneers into the fewest, most comfortable visits, planned in detail from your 3D scan." },
      { q: "Where do I start?", a: `Start with a free remote review - ${cta}` },
    ],
  },

  // ---------------- WHITENING ----------------
  "laser-whitening": {
    title: "Laser Teeth Whitening in Tirana | Dental Med Austria",
    description:
      "Professional in-clinic laser teeth whitening in Tirana, Albania - visible results in 60-90 minutes, safely and comfortably. Book alongside your visit.",
    intro:
      "Laser teeth whitening brightens your smile in a single in-clinic session, activated by laser or LED light for fast, even results in just 60-90 minutes. It is the quickest, safest way to a noticeably brighter smile.",
    benefits: [
      "Visible results in a single 60-90 minute session",
      "Professional-strength, safely supervised",
      "Even, natural-looking brightness",
    ],
    idealFor: "Anyone wanting a fast, dramatic brightening before an event or makeover.",
    faqs: [
      { q: "Is laser whitening safe?", a: "Yes - it's professionally applied with gum protection and supervised throughout, making it both effective and gentle on your teeth." },
      { q: "How long do results last?", a: "Many months to a year or more with good habits; a take-home kit can help you top up between visits." },
    ],
    duration: "60-90 minutes",
  },
  "take-home-whitening": {
    title: "Take-Home Teeth Whitening in Tirana | Dental Med Austria",
    description:
      "Custom take-home whitening trays and professional gel in Tirana, Albania - gently brighten your smile over two weeks at your own pace. Free smile plan available.",
    intro:
      "Our take-home kit pairs custom-fitted trays with professional-grade gel, so you can gently brighten your smile over about two weeks at your own pace. It is the convenient way to whiten - and to maintain results from in-clinic treatment.",
    benefits: [
      "Custom trays for even, comfortable whitening",
      "Whiten gradually at your own pace",
      "Perfect for maintaining a brighter smile",
    ],
    idealFor: "Patients who prefer to whiten gradually at home.",
    faqs: [
      { q: "Is take-home whitening as effective as in-clinic?", a: "It achieves excellent results over a couple of weeks; many patients combine it with an in-clinic session for the best of both." },
      { q: "Will it cause sensitivity?", a: "Custom trays and professional gel minimise sensitivity; we'll guide you on comfortable use." },
    ],
  },

  // ---------------- ENDODONTICS ----------------
  "root-canal-single": {
    title: "Root Canal Treatment (Single Canal) in Tirana | Dental Med Austria",
    description:
      "Gentle single-canal root canal treatment in Tirana, Albania under magnification - saves your natural tooth comfortably. Free remote assessment available.",
    intro:
      "Root canal treatment removes infected pulp from a single-rooted tooth and seals it, relieving pain and saving your natural tooth. Carried out under magnification with modern techniques, it is far more comfortable than its reputation suggests.",
    benefits: [
      "Saves your natural tooth",
      "Relieves pain and infection",
      "Performed gently under magnification",
    ],
    idealFor: "Teeth with infected or inflamed nerves that can be preserved.",
    faqs: [
      { q: "Is a root canal painful?", a: "Modern root canals are done under local anaesthetic and are typically no more uncomfortable than a filling; they relieve the pain that brought you in." },
      { q: "Will I need a crown afterwards?", a: "Often yes - a crown protects a treated tooth from fracture, and we can plan both together." },
    ],
  },
  "root-canal-molar": {
    title: "Molar Root Canal (3+ Canals) in Tirana | Dental Med Austria",
    description:
      "Complex multi-canal molar root canal treatment in Tirana, Albania using rotary systems and microscope precision. Save your tooth comfortably. Free assessment.",
    intro:
      "Molars have complex anatomy with three or more canals. Using rotary instrumentation and microscope vision, we treat them thoroughly and comfortably - clearing infection and preserving a tooth that might otherwise be lost.",
    benefits: [
      "Thorough treatment of complex canal anatomy",
      "Rotary systems and microscope precision",
      "Preserves an important chewing tooth",
    ],
    idealFor: "Back molars with infected nerves and multiple canals.",
    faqs: [
      { q: "Why are molar root canals more complex?", a: "Molars have more canals and curved anatomy, so they require advanced instruments and magnification - both standard in our clinic." },
      { q: "How many visits will it take?", a: "Often one to two visits depending on the infection; we'll outline your plan after assessment." },
    ],
  },

  // ---------------- PERIODONTICS ----------------
  "teeth-cleaning": {
    title: "Professional Teeth Cleaning in Tirana | Dental Med Austria",
    description:
      "Professional ultrasonic teeth cleaning and polishing in Tirana, Albania - the foundation of healthy gums and a brighter smile. Book with your visit.",
    intro:
      "A professional clean removes plaque and tartar with a gentle ultrasonic scaler, then polishes your teeth to a smooth, bright finish. It is the simple foundation of healthy gums, fresh breath, and a great-looking smile.",
    benefits: [
      "Removes tartar that brushing can't",
      "Healthier gums and fresher breath",
      "A brighter, smoother smile",
    ],
    idealFor: "Everyone - recommended regularly for lifelong oral health.",
    faqs: [
      { q: "How often should I have a cleaning?", a: "Most people benefit from a professional clean every six months, though some gum conditions call for more frequent visits." },
      { q: "Does scaling hurt?", a: "It's generally painless; we can use numbing for sensitive patients and always work gently." },
    ],
  },
  "gum-disease-treatment": {
    title: "Gum Disease Treatment in Tirana | Dental Med Austria",
    description:
      "Comprehensive gum disease (periodontitis) treatment in Tirana, Albania - deep cleaning, root planing, and maintenance to protect your teeth. Free assessment.",
    intro:
      "Gum disease is the leading cause of tooth loss, but it is treatable. Our multi-session programme combines deep cleaning, root planing, and a tailored maintenance plan to halt the disease and protect your teeth and bone.",
    benefits: [
      "Stops the leading cause of tooth loss",
      "Protects the bone that supports your teeth",
      "A clear, lasting maintenance plan",
    ],
    idealFor: "Patients with bleeding, receding, or unstable gums.",
    faqs: [
      { q: "Can gum disease be reversed?", a: "Early gum disease can be reversed; advanced periodontitis can be controlled and stabilised with treatment and ongoing maintenance." },
      { q: "Is treatment uncomfortable?", a: "Deep cleaning is done with anaesthetic for comfort, and most patients notice healthier gums within weeks." },
    ],
  },
  "gum-graft": {
    title: "Gum Recession Graft in Tirana | Dental Med Austria",
    description:
      "Gum recession treatment and connective-tissue grafting in Tirana, Albania to cover exposed roots and restore your gum line. Premium biomaterials. Free assessment.",
    intro:
      "When gums recede, roots become exposed and sensitive. A gum graft - using your own tissue or a regenerative matrix like Botiss Mucoderm - restores the gum line, protects the roots, and improves both comfort and appearance.",
    benefits: [
      "Covers exposed, sensitive roots",
      "Restores a healthy, even gum line",
      "Option to avoid a second surgical site",
    ],
    idealFor: "Patients with receding gums or exposed, sensitive roots.",
    faqs: [
      { q: "Why treat gum recession?", a: "Beyond aesthetics, recession exposes roots to decay and sensitivity and can threaten the tooth - grafting protects long-term health." },
      { q: "Is there a graft option without palate surgery?", a: "Yes - regenerative matrices such as Botiss Mucoderm can avoid taking tissue from your palate in suitable cases." },
    ],
  },

  // ---------------- ORTHODONTICS ----------------
  invisalign: {
    title: "Invisalign Clear Aligners in Tirana | Dental Med Austria",
    description:
      "Invisalign clear aligners in Tirana, Albania - straighten your teeth discreetly with removable, virtually invisible aligners. Expert orthodontic team. Free assessment.",
    intro:
      "Invisalign straightens your teeth with a series of clear, removable aligners - virtually invisible and tailored to mild, moderate, or severe cases. Delivered by our experienced orthodontic team, your treatment is planned digitally so you can preview your new smile.",
    benefits: [
      "Virtually invisible and removable",
      "Eat and clean normally throughout treatment",
      "Digitally planned with a smile preview",
    ],
    idealFor: "Teens and adults wanting discreet teeth straightening.",
    faqs: [
      { q: "How long does Invisalign take?", a: "Most cases take 6-18 months depending on complexity; we'll estimate your timeline from a digital scan." },
      { q: "Can international patients do Invisalign here?", a: "Yes - we plan the case in Tirana and coordinate aligner stages and remote check-ins around your travel." },
    ],
  },
  "self-ligating-braces": {
    title: "Self-Ligating Braces in Tirana | Dental Med Austria",
    description:
      "Self-ligating braces in Tirana, Albania - modern brackets with less friction, often meaning faster treatment and fewer visits. Free orthodontic assessment.",
    intro:
      "Self-ligating braces use brackets that hold the wire without elastic ties, reducing friction. The result is often a more comfortable experience with fewer adjustments and, in many cases, a faster path to a straight smile.",
    benefits: [
      "Less friction, often faster treatment",
      "Fewer adjustment visits",
      "Easier to keep clean than traditional braces",
    ],
    idealFor: "Patients wanting efficient fixed-brace treatment.",
    faqs: [
      { q: "Are self-ligating braces better?", a: "They can reduce friction and visit frequency; whether they're right for you depends on your case, which we'll assess with a scan." },
      { q: "Do they hurt less?", a: "Many patients report comfortable treatment with fewer tightening appointments." },
    ],
  },
  "lingual-braces": {
    title: "Lingual (Hidden) Braces in Tirana | Dental Med Austria",
    description:
      "Lingual braces in Tirana, Albania - bonded behind your teeth and completely invisible from the front. The most discreet fixed orthodontic option. Free assessment.",
    intro:
      "Lingual braces are bonded to the back of your teeth, so they're completely invisible from the front. For patients who want fixed-brace precision without anyone seeing the appliance, they are the most discreet option available.",
    benefits: [
      "Completely hidden from the front",
      "Fixed-brace precision and control",
      "Ideal for image-conscious adults",
    ],
    idealFor: "Adults wanting invisible braces with full fixed control.",
    faqs: [
      { q: "Are lingual braces hard to get used to?", a: "There's a short adjustment period for speech and the tongue, after which most patients adapt comfortably." },
      { q: "Who are lingual braces best for?", a: "They suit patients who want total discretion and aren't candidates for, or prefer not to use, clear aligners." },
    ],
  },

  // ---------------- ORAL SURGERY ----------------
  "wisdom-tooth-removal": {
    title: "Wisdom Tooth Removal in Tirana | Dental Med Austria",
    description:
      "Surgical removal of impacted wisdom teeth in Tirana, Albania - gentle, 3D-planned, with sedation available and careful aftercare. Free remote assessment.",
    intro:
      "Impacted wisdom teeth can cause pain, infection, and crowding. Our surgical removal is planned from 3D imaging and carried out gently - with IV sedation available - followed by clear aftercare for a smooth, comfortable recovery.",
    benefits: [
      "Relieves pain, infection, and crowding",
      "3D-planned for safety around nerves",
      "Sedation available for anxious patients",
    ],
    idealFor: "Patients with impacted, painful, or problematic wisdom teeth.",
    faqs: [
      { q: "Is wisdom tooth removal painful?", a: "It's done under anaesthetic (with sedation available) and most patients manage recovery comfortably with simple aftercare." },
      { q: "How long is recovery?", a: "Initial healing is usually a few days; we provide detailed aftercare and a review to keep things on track." },
    ],
  },
  "cyst-removal": {
    title: "Jaw Cyst Removal & Apical Surgery in Tirana | Dental Med Austria",
    description:
      "Precise jaw cyst removal and apical surgery in Tirana, Albania, with bone grafting where needed - a key surgical specialty. Free remote assessment.",
    intro:
      "Jaw cysts and persistent root-tip infections sometimes need surgical removal. Using careful 3D planning and grafting where needed, our surgical team removes the lesion and preserves the surrounding bone and teeth - a key specialty of the clinic.",
    benefits: [
      "Removes cysts and persistent infections",
      "Bone grafting to preserve the jaw where needed",
      "Carried out by our experienced surgical team",
    ],
    idealFor: "Patients with a diagnosed jaw cyst or failed previous root treatment.",
    faqs: [
      { q: "Is cyst removal serious?", a: "Most are routine day procedures under local anaesthetic or sedation, planned carefully from 3D imaging." },
      { q: "Will the tooth be saved?", a: "Often yes - apical surgery can save a tooth that hasn't responded to conventional root canal treatment." },
    ],
  },
  "iv-sedation": {
    title: "IV Sedation Dentistry in Tirana | Dental Med Austria",
    description:
      "Anaesthesiologist-administered IV sedation in Tirana, Albania for anxious patients and longer surgeries - completely comfortable, fully monitored. Free assessment.",
    intro:
      "IV sedation, administered by an anaesthesiologist, lets anxious patients and those facing longer surgery stay completely relaxed and comfortable. You remain safe and monitored throughout, often with little memory of the procedure.",
    benefits: [
      "Complete comfort for anxious patients",
      "Ideal for longer or complex surgery",
      "Administered and monitored by an anaesthesiologist",
    ],
    idealFor: "Nervous patients and anyone having longer surgical treatment.",
    faqs: [
      { q: "Is IV sedation safe?", a: "Yes - it's delivered and continuously monitored by a qualified anaesthesiology team, with your safety the first priority." },
      { q: "Will I be unconscious?", a: "You'll be deeply relaxed and responsive rather than under general anaesthetic, and usually remember little of the procedure." },
    ],
  },

  // ---------------- DIAGNOSTICS ----------------
  "remote-treatment-plan": {
    title: "Free Remote Treatment Plan | Dental Med Austria, Tirana",
    description:
      "Send a panoramic X-ray and photos and get a free written dental treatment plan from Tirana, Albania within 24-48 hours, in your language.",
    intro:
      "Planning treatment abroad starts here. Send us a panoramic X-ray and a few photos, and our clinical team will return a personalised written treatment plan within 24-48 hours - in your language, completely free, with no obligation.",
    benefits: [
      "A personalised written plan in 24-48 hours",
      "Completely free, with no obligation",
      "In English, Italian, German, French, or Albanian",
    ],
    idealFor: "Anyone considering treatment in Albania who wants clarity first.",
    faqs: [
      { q: "How do I send my X-ray?", a: "Simply email it with a few photos, or message us - our coordinator will guide you and reply within 24-48 hours." },
      { q: "Does a remote plan cost anything?", a: "No - the remote treatment plan is free and carries no obligation." },
    ],
  },
  "cbct-scan": {
    title: "CBCT 3D Dental Scan in Tirana | Dental Med Austria",
    description:
      "Low-dose CBCT 3D dental imaging in Tirana, Albania with Vatech technology - essential for precise implant and surgical planning. Book with your consultation.",
    intro:
      "A CBCT scan captures detailed 3D images of your jaw, teeth, nerves, and sinuses using low-dose Vatech technology. It is essential for planning implants, All-on-X, and complex surgery with precision and safety.",
    benefits: [
      "Detailed 3D view for precise planning",
      "Low-dose Vatech imaging",
      "Essential for safe implant and surgical care",
    ],
    idealFor: "Patients planning implants or complex treatment.",
    faqs: [
      { q: "Is a CBCT scan safe?", a: "Yes - modern CBCT uses a low radiation dose and provides information impossible to see on a standard X-ray, improving safety and accuracy." },
      { q: "Do I need a CBCT for implants?", a: "For implant and full-arch planning it's strongly recommended, as it reveals bone volume and the position of nerves and sinuses." },
    ],
  },

  // ---------------- TOURISM ----------------
  "airport-transfer": {
    title: "Tirana Airport Transfer for Dental Patients | Dental Med Austria",
    description:
      "Private airport pickup and drop-off between Tirana International Airport and Dental Med Austria - included with major treatment packages. Travel with ease.",
    intro:
      "Your care begins the moment you land. We arrange a private driver between Tirana International Airport and the clinic, so there's no stress about transport - and it's included with major treatment packages.",
    benefits: [
      "Private transfer to and from Tirana airport",
      "A warm welcome on arrival",
      "Included with major treatment packages",
    ],
    idealFor: "International patients travelling to Tirana for treatment.",
    faqs: [
      { q: "Is airport pickup included?", a: "It's included with major treatment packages; for other visits we're happy to arrange it - just ask your coordinator." },
      { q: "Who will meet me?", a: "A driver will meet you at Tirana airport and bring you to the clinic or your hotel." },
    ],
  },
  "multilingual-coordinator": {
    title: "Multilingual Patient Coordinator | Dental Med Austria, Tirana",
    description:
      "A dedicated multilingual coordinator at Dental Med Austria in Tirana - support in English, Italian, German, French, and Albanian throughout your visit.",
    intro:
      "From your first question to your final review, a dedicated coordinator supports you in English, Italian, German, French, or Albanian. They handle scheduling, travel, and every detail - so your whole experience feels effortless.",
    benefits: [
      "Support in five languages",
      "One point of contact for everything",
      "Help with scheduling, travel, and questions",
    ],
    idealFor: "International patients who want clear, personal support.",
    faqs: [
      { q: "What languages do you speak?", a: "Our team speaks English, Italian, German, French, and Albanian, so you can communicate comfortably throughout." },
      { q: "Will I have one contact person?", a: "Yes - a dedicated coordinator guides you from planning through to follow-up." },
    ],
  },
  "hotel-concierge": {
    title: "Hotel & Accommodation Concierge | Dental Med Austria, Tirana",
    description:
      "Pre-negotiated partner-hotel rates near Dental Med Austria in Tirana - comfortable accommodation arranged around your treatment, sometimes included in packages.",
    intro:
      "Stay comfortably and conveniently. We arrange pre-negotiated rates at trusted partner hotels near the clinic, with modern comforts and free WiFi - and for many treatment packages, accommodation is included.",
    benefits: [
      "Comfortable partner hotels near the clinic",
      "Pre-negotiated rates",
      "Sometimes included in your package",
    ],
    idealFor: "International patients who want accommodation handled for them.",
    faqs: [
      { q: "Do you arrange accommodation?", a: "Yes - we offer pre-negotiated partner-hotel rates near the clinic, and accommodation is sometimes included in treatment packages." },
      { q: "How close are the hotels?", a: "Our partner hotels are conveniently located near the clinic for short, easy transfers during your treatment." },
    ],
  },
};

export const CATALOGUE_CONTENT: Record<string, TreatmentContent> = {
  ...BASE_CATALOGUE_CONTENT,
  ...CONTENT_2026,
};

export function getTreatmentContent(slug: string): TreatmentContent | undefined {
  const base = CATALOGUE_CONTENT[slug];
  if (!base) return undefined;
  const deep = DEEP_CONTENT[slug];
  const rich = RICH_CONTENT[slug];
  // Three layers, each winning over the last: base (SEO title + seed copy) →
  // deep (auto-generated longer body/benefits/FAQs) → rich (hand-authored
  // landing-page sections: specs, steps, candidates, recovery, stats…).
  return { ...base, ...(deep ?? {}), ...(rich ?? {}) };
}
