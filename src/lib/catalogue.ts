// Patient-facing treatment catalogue for Dental Med Austria.
// Source: clinic treatment menu. Internal pricing-strategy fields are intentionally
// excluded; copy here is patient-facing only. Prices are shown as "on consultation".
import { CATEGORIES_2026, SERVICES_2026 } from "./catalogue-2026";

export type CatalogueCategory = {
  slug: string;
  label: string;
  blurb: string;
  /** accent colour (hex) used for the category band + chips */
  accent: string;
  image: string;
};

export type CatalogueService = {
  category: string; // category slug
  name: string;
  slug: string;
  summary: string;
  brands: string[];
  /** flagship / most-requested */
  featured?: boolean;
  /**
   * Still image shown on the animated upper face of the card before/behind any
   * procedure clip. Falls back to the parent category image when omitted.
   */
  poster?: string;
  /**
   * Optional per-service override for the 3D hero on the detail page. When unset,
   * the category's default mapping is used. Lets services in non-3D categories
   * (e.g. tourism, diagnostics) reuse a fitting existing model.
   */
  model3d?: "implant" | "crown" | "tooth" | "aligner";
};

/**
 * Resolved media for a procedure card's animated upper face.
 * `video` is the Higgsfield (or any) clip we look for; when the file is absent
 * the card gracefully shows the `poster` with a slow "living" motion instead.
 * Convention: drop clips at `public/videos/procedures/<slug>.mp4` (+ optional .webm).
 */
export function procedureMedia(service: CatalogueService): {
  poster: string;
  videoMp4: string;
  videoWebm: string;
} {
  // Every catalogue service has its own generated card image at
  // /public/images/procedures/<slug>.jpg (a per-service `poster` still wins).
  return {
    poster: service.poster ?? `/images/procedures/${service.slug}.jpg`,
    videoMp4: `/videos/procedures/${service.slug}.mp4`,
    videoWebm: `/videos/procedures/${service.slug}.webm`,
  };
}

const BASE_CATEGORIES: CatalogueCategory[] = [
  {
    slug: "implants",
    label: "Dental Implants",
    blurb:
      "Titanium implants and full-arch solutions to replace one tooth or rebuild an entire smile - with more than 42,000 implants placed at a 98% success rate.",
    accent: "#0e4f5c",
    image: "/images/dma/clinic-xray.jpg",
  },
  {
    slug: "crowns-aesthetics",
    label: "Crowns & Aesthetics",
    blurb:
      "Hand-crafted crowns, veneers, and full smile makeovers in zirconia and Ivoclar IPS e.max ceramic for a natural, lasting result.",
    accent: "#9a7b3f",
    image: "/images/dma/blog-crowns.webp",
  },
  {
    slug: "whitening",
    label: "Aesthetic Whitening",
    blurb: "Professional in-clinic and take-home whitening for a brighter, confident smile.",
    accent: "#2b8a9e",
    image: "/images/dma/blog-porcelain-cost.webp",
  },
  {
    slug: "endodontics",
    label: "Endodontics",
    blurb: "Gentle, precise root canal treatment to save and protect your natural teeth.",
    accent: "#5b3a5b",
    image: "/images/dma/blog-prostheses.webp",
  },
  {
    slug: "periodontics",
    label: "Periodontics",
    blurb: "Gum health, professional cleaning, and tissue grafting to keep your smile healthy for life.",
    accent: "#5a7a52",
    image: "/images/dma/reception.jpeg",
  },
  {
    slug: "orthodontics",
    label: "Orthodontics",
    blurb: "Invisalign clear aligners and discreet braces to straighten your smile, delivered by our experienced orthodontic team.",
    accent: "#3b5577",
    image: "/images/dma/blog-orthodontics.webp",
  },
  {
    slug: "oral-surgery",
    label: "Oral Surgery",
    blurb: "Extractions, cyst removal, and IV sedation delivered safely and comfortably by our surgical team.",
    accent: "#9a5a45",
    image: "/images/dma/blog-surgeries.webp",
  },
  {
    slug: "diagnostics",
    label: "Diagnostics & Planning",
    blurb: "Free remote treatment plans and advanced 3D CBCT imaging for precise, predictable care.",
    accent: "#4a4f57",
    image: "/images/dma/hero-4.jpeg",
  },
  {
    slug: "tourism",
    label: "Dental Tourism Care",
    blurb: "Airport pickup, multilingual coordination, and hotel concierge - your whole trip, handled.",
    accent: "#4a7ba6",
    image: "/images/dma/tourism.jpg",
  },
];

const BASE_SERVICES: CatalogueService[] = [
  // ---- Implants ----
  {
    category: "implants",
    name: "Straumann BLX Premium Implant",
    slug: "straumann-blx-implant",
    model3d: "implant",
    summary:
      "The Swiss-made gold-standard implant - a fully tapered design optimised for immediate placement and loading, from the world's most clinically documented system. Our choice for patients who want the very best.",
    brands: ["Straumann (Swiss-made)"],
    featured: true,
  },
  {
    category: "implants",
    name: "Straumann BLT Implant",
    slug: "straumann-blt-implant",
    model3d: "implant",
    summary:
      "The Straumann BLT is the Swiss-made gold-standard bone-level tapered implant, designed for excellent primary stability and predictable results even in softer bone.",
    brands: ["Straumann (Swiss-made)"],
    featured: true,
  },
  {
    category: "implants",
    name: "ETK Premium Implant",
    slug: "etk-premium-implant",
    model3d: "implant",
    summary:
      "ETK Premium is the top tier of the French ETK line - advanced surface technology and prosthetic precision built for demanding, digitally guided cases.",
    brands: ["ETK (France)"],
  },
  {
    category: "implants",
    name: "ETK Implant",
    slug: "etk-implant",
    model3d: "implant",
    summary:
      "ETK is a fully documented French implant system with standardised components - a dependable European choice for guided, predictable placement.",
    brands: ["ETK (France)"],
  },
  {
    category: "implants",
    name: "Alpha-Bio Implant",
    slug: "alpha-bio-implant",
    model3d: "implant",
    summary:
      "Alpha-Bio is an internationally established, widely documented implant system with a versatile prosthetic range - a proven option that delivers excellent value.",
    brands: ["Alpha-Bio"],
  },
  {
    category: "implants",
    name: "Biodem German Implant",
    slug: "biodem-implant",
    model3d: "implant",
    summary:
      "German-engineered, CE-marked implant with a personal implant passport recording verifiable serial numbers - a refined mid-premium option that reflects our European-quality promise.",
    brands: ["Biodem (Germany)"],
  },
  {
    category: "implants",
    name: "Detech Implant",
    slug: "detech-implant",
    model3d: "implant",
    summary:
      "Detech is a dependable titanium implant with a microtextured surface for reliable osseointegration - our accessible entry tier, placed under the same sterile protocols as every premium line.",
    brands: ["Detech"],
  },
  {
    category: "implants",
    name: "Single Implant, Abutment & Crown",
    slug: "single-implant-crown",
    model3d: "implant",
    summary:
      "A complete fixed single-tooth solution: implant, custom abutment, and a zirconia or E-max crown - the most popular single-tooth restoration.",
    brands: ["Straumann", "Biodem", "zirconia", "Ivoclar E-max"],
    featured: true,
  },
  {
    category: "implants",
    name: "All-on-4 (Single Arch)",
    slug: "all-on-4-single",
    model3d: "implant",
    summary:
      "Four implants supporting a fixed full-arch bridge, with same-day temporary teeth via 3D-guided surgery - a complete new smile in one visit.",
    brands: ["Straumann", "Biodem", "ETK"],
    featured: true,
  },
  {
    category: "implants",
    name: "All-on-4 (Both Arches)",
    slug: "all-on-4-both",
    model3d: "implant",
    summary: "Both upper and lower jaws restored with the All-on-4 technique for a complete, fixed full-mouth smile.",
    brands: ["Straumann", "Biodem", "ETK"],
  },
  {
    category: "implants",
    name: "All-on-6 (Single Arch)",
    slug: "all-on-6-single",
    model3d: "implant",
    summary: "Six implants for a stiffer, higher-strength full-arch restoration with excellent long-term stability.",
    brands: ["Multi-unit abutments", "Zirconia bridge"],
  },
  {
    category: "implants",
    name: "All-on-6 (Both Arches)",
    slug: "all-on-6-both",
    model3d: "implant",
    summary: "Six implants per jaw for a top-tier, full-mouth fixed reconstruction built for strength and longevity.",
    brands: ["12 implants", "2 final bridges"],
  },
  {
    category: "implants",
    name: "Bone Augmentation / GBR",
    slug: "bone-augmentation",
    summary:
      "Guided bone regeneration that rebuilds lost bone with a graft and collagen membrane, creating a solid foundation before implant placement.",
    brands: ["Botiss Cerabone", "Botiss Jason membrane"],
  },
  {
    category: "implants",
    name: "Sinus Lift",
    slug: "sinus-lift",
    summary: "A lateral-window sinus lift that restores height in the upper jaw so implants can be placed with confidence.",
    brands: ["Botiss Cerabone"],
  },
  {
    category: "implants",
    name: "3D Computer-Guided Implant Surgery",
    slug: "guided-implant-surgery",
    model3d: "implant",
    summary:
      "CBCT planning and a 3D-printed surgical guide control every step of placement, dramatically improving precision and comfort.",
    brands: ["Vatech CBCT", "3D-printed guide"],
    featured: true,
  },
  {
    category: "implants",
    name: "Corrective Jaw Surgery",
    slug: "orthognathic-surgery",
    summary:
      "Advanced jaw-repositioning surgery, performed to hospital standards by our surgical team, to correct bite and alignment concerns.",
    brands: ["Sedation", "Anaesthesiology team"],
  },

  // ---- Crowns & Aesthetics ----
  {
    category: "crowns-aesthetics",
    name: "Zirconia E-max Layered Crown",
    slug: "zirconia-emax-layered-crown",
    summary:
      "Our signature crown: a strong zirconia core hand-layered with Ivoclar IPS e.max ceramic for the most lifelike, light-reflective finish.",
    brands: ["zirconia", "Ivoclar E-max", "Layered ceramic"],
    featured: true,
  },
  {
    category: "crowns-aesthetics",
    name: "Full-Contour Zirconia Crown",
    slug: "zirconia-crown",
    summary: "A strong, metal-free monolithic zirconia crown milled in-house - the modern standard for durable restorations.",
    brands: ["Bio ZX2 zirconia"],
  },
  {
    category: "crowns-aesthetics",
    name: "E-max Crown",
    slug: "emax-crown",
    summary: "A glass-ceramic crown with superior translucency - the gold standard for natural-looking front teeth.",
    brands: ["Ivoclar IPS E-max"],
  },
  {
    category: "crowns-aesthetics",
    name: "Metal-Ceramic Crown",
    slug: "metal-ceramic-crown",
    summary: "Metal-ceramic - a time-proven, hard-wearing restoration for back teeth.",
    brands: ["Layered ceramic"],
  },
  {
    category: "crowns-aesthetics",
    name: "Ceramic Veneer",
    slug: "porcelain-veneer",
    summary: "A thin ceramic shell bonded to the tooth - the classic premium way to perfect shape, colour, and harmony.",
    brands: ["Layered ceramic"],
  },
  {
    category: "crowns-aesthetics",
    name: "E-max Veneer",
    slug: "emax-veneer",
    summary: "A pressed-ceramic veneer combining superior strength with flawless aesthetics - our premium veneer standard.",
    brands: ["Ivoclar IPS E-max"],
  },
  {
    category: "crowns-aesthetics",
    name: "Composite Veneer",
    slug: "composite-veneer",
    summary: "A direct, same-visit composite veneer that refreshes your smile with a reversible, minimally invasive approach.",
    brands: ["Premium composite resin"],
  },
  {
    category: "crowns-aesthetics",
    name: "Hollywood Smile (16 Veneers)",
    slug: "hollywood-smile-16",
    summary: "A full-arch transformation with 16 veneers across the smile zone for a radiant, perfectly balanced result.",
    brands: ["e.max / layered ceramic"],
    featured: true,
  },
  {
    category: "crowns-aesthetics",
    name: "Hollywood Smile (20 Veneers)",
    slug: "hollywood-smile-20",
    summary: "A premium full-mouth makeover extending to the premolars for the most complete smile transformation.",
    brands: ["20 premium veneers"],
  },
  {
    category: "crowns-aesthetics",
    name: "Digital Smile Design",
    slug: "smile-design",
    summary: "A photo protocol and digital mock-up that lets you preview and shape your new smile before treatment begins.",
    brands: ["DSD App", "SmileCloud"],
  },
  {
    category: "crowns-aesthetics",
    name: "Gummy Smile Correction",
    slug: "gingival-contouring",
    summary: "Gentle diode-laser reshaping of the gum line to bring balance and harmony to your smile.",
    brands: ["Diode laser"],
  },
  {
    category: "crowns-aesthetics",
    name: "Full-Mouth Aesthetic Rehabilitation",
    slug: "full-mouth-rehab",
    summary: "A combined plan of veneers, crowns, and implants for complex, end-stage aesthetic and functional cases.",
    brands: ["Veneers", "Zirconia/E-max", "Implants"],
  },

  // ---- Whitening ----
  {
    category: "whitening",
    name: "Laser Teeth Whitening",
    slug: "laser-whitening",
    summary: "An in-clinic whitening session activated by laser/LED light, with visible results in 60-90 minutes.",
    brands: ["Professional peroxide gel", "Diode laser / LED"],
    featured: true,
  },
  {
    category: "whitening",
    name: "Take-Home Whitening Kit",
    slug: "take-home-whitening",
    summary: "Custom-fitted trays and professional gel to gently brighten your smile over two weeks at home.",
    brands: ["Custom trays", "10% peroxide gel"],
  },

  // ---- Endodontics ----
  {
    category: "endodontics",
    name: "Root Canal - Single Canal",
    slug: "root-canal-single",
    summary: "Careful removal of infected pulp from a single-rooted tooth, then sealing to protect and preserve it.",
    brands: ["Gutta percha", "Endodontic sealer"],
  },
  {
    category: "endodontics",
    name: "Root Canal - Molar (3+ Canals)",
    slug: "root-canal-molar",
    summary: "Multi-canal molar root canal treatment using rotary systems to navigate complex anatomy with precision.",
    brands: ["Rotary endo system"],
  },

  // ---- Periodontics ----
  {
    category: "periodontics",
    name: "Professional Teeth Cleaning",
    slug: "teeth-cleaning",
    summary: "A thorough ultrasonic scale and polish - the foundation of a healthy mouth and a brighter smile.",
    brands: ["Ultrasonic scaler"],
    featured: true,
  },
  {
    category: "periodontics",
    name: "Gum Disease Treatment",
    slug: "gum-disease-treatment",
    summary: "A multi-session programme of deep cleaning, root planing, and maintenance to treat and control periodontitis.",
    brands: ["Ultrasonic", "Adjunctive therapy"],
  },
  {
    category: "periodontics",
    name: "Gum Recession Graft",
    slug: "gum-graft",
    summary: "Surgical correction of receding gums using donor or regenerative tissue to protect roots and restore the gum line.",
    brands: ["Botiss Mucoderm"],
  },

  // ---- Orthodontics ----
  {
    category: "orthodontics",
    name: "Invisalign Clear Aligners",
    slug: "invisalign",
    summary: "Virtually invisible, removable aligners that straighten your smile discreetly - for mild to severe cases.",
    brands: ["Invisalign"],
    featured: true,
  },
  {
    category: "orthodontics",
    name: "Self-Ligating Braces",
    slug: "self-ligating-braces",
    summary: "Modern brackets without elastic ties - often meaning faster treatment with less friction and fewer visits.",
    brands: ["Self-ligating system"],
  },
  {
    category: "orthodontics",
    name: "Lingual Braces",
    slug: "lingual-braces",
    summary: "Braces bonded behind the teeth - completely invisible from the front for the most discreet correction.",
    brands: ["Custom lingual appliance"],
  },

  // ---- Oral Surgery ----
  {
    category: "oral-surgery",
    name: "Surgical Wisdom Tooth Removal",
    slug: "wisdom-tooth-removal",
    summary: "Gentle sectioning and removal of impacted wisdom teeth, with careful aftercare for a smooth recovery.",
    brands: ["Surgical kit", "Sutures"],
  },
  {
    category: "oral-surgery",
    name: "Cyst Removal / Apical Surgery",
    slug: "cyst-removal",
    summary: "Precise removal of jaw cysts, with bone grafting where needed - a key surgical specialty of our team.",
    brands: ["Botiss graft"],
  },
  {
    category: "oral-surgery",
    name: "IV Sedation Dentistry",
    slug: "iv-sedation",
    summary: "Anaesthesiologist-administered IV sedation so anxious patients and longer surgeries are completely comfortable.",
    brands: ["Monitored sedation"],
  },

  // ---- Diagnostics ----
  {
    category: "diagnostics",
    name: "Free Remote Treatment Plan",
    slug: "remote-treatment-plan",
    summary:
      "Send us your X-ray and photos and we'll return a personalised treatment plan within 24-48 hours - in your language, free of charge.",
    brands: ["Email / WhatsApp"],
    featured: true,
    model3d: "tooth",
  },
  {
    category: "diagnostics",
    name: "CBCT 3D Scan",
    slug: "cbct-scan",
    summary: "Cone-beam 3D imaging of the jaw for precise diagnosis and planning of implants and complex cases.",
    brands: ["Vatech A9 CBCT"],
    model3d: "aligner",
  },

  // ---- Tourism ----
  {
    category: "tourism",
    name: "Airport Pickup & Drop-off",
    slug: "airport-transfer",
    summary: "A private driver between Tirana airport and the clinic - included with major treatment packages.",
    brands: ["Private transfer"],
  },
  {
    category: "tourism",
    name: "Multilingual Coordinator",
    slug: "multilingual-coordinator",
    summary: "A dedicated coordinator throughout your visit, with support in English, Italian, German, French, and Albanian.",
    brands: ["EN · IT · DE · FR · AL"],
  },
  {
    category: "tourism",
    name: "Hotel Concierge",
    slug: "hotel-concierge",
    summary: "Pre-negotiated rates at comfortable partner hotels near the clinic - sometimes included in your package.",
    brands: ["Partner hotels"],
  },
];

export const CATALOGUE_CATEGORIES: CatalogueCategory[] = [...BASE_CATEGORIES, ...CATEGORIES_2026];
export const CATALOGUE_SERVICES: CatalogueService[] = [...BASE_SERVICES, ...SERVICES_2026];

export function servicesByCategory(slug: string): CatalogueService[] {
  return CATALOGUE_SERVICES.filter((s) => s.category === slug);
}

// ── The official 2026 service list ──────────────────────────────────────────
// The public /catalogue LISTING shows strictly the treatments on the clinic's
// official 2026 service list (never prices). Legacy services keep their detail
// pages, sitemap entries and internal links, nothing already published is
// lost, they are simply not part of the official catalogue grid.

/**
 * The official list == exactly the clinic's printed price sheet (OFERTA
 * FINANCIARE): implants, crowns, veneers and bone-reconstruction only. Anything
 * on the older/broader collaborator sheet that is NOT on the printed offer
 * (cleanings, fillings, extractions, whitening, orthodontics, removable
 * prostheses, consultation, PEEK/screw components, Implant Swiss…) is
 * deliberately excluded from the public grid. Those services keep their detail
 * pages, sitemap entries and internal links, so nothing published is lost.
 */
const OFFICIAL_SLUGS = new Set<string>([
  // ── Implants ──
  "detech-implant",
  "biodem-implant",
  "alpha-bio-implant", // ALPHA BIO — on the offer; needs a service definition to appear
  "etk-implant", // ETK — on the offer; needs a service definition to appear
  "etk-premium-implant", // ETK PREMIUM — on the offer; needs a service definition to appear
  "straumann-blt-implant",
  "straumann-blx-implant",
  // ── Crowns ──
  "metal-ceramic-crown",
  "chrome-cobalt-crown",
  "zirconia-crown", // FULL ZIRCONIA
  "multilayer-zirconia-crown",
  "zirconia-emax-gisi-crown",
  "zirconia-emax-ivoclar-crown",
  "full-emax-gisi-crown",
  "full-emax-ivoclar-crown",
  "full-emax-premium-ivoclar-crown",
  "top-line-gisi-emax-crown",
  "top-line-ivoclar-emax-crown",
  "temporary-crown",
  // ── Veneers ──
  "zirconia-veneer",
  "zirconia-emax-gisi-veneer",
  "zirconia-emax-ivoclar-veneer",
  "zirconia-emax-gisi-ii-veneer",
  "zirconia-emax-ivoclar-ii-veneer",
  "full-emax-gisi-veneer",
  "full-emax-ivoclar-veneer",
  "full-emax-premium-veneer",
  // ── Bone reconstruction ──
  "homeostatic-sponge",
  "prf-platelet-rich-fibrin",
  "bone-augmentation", // BONE GRAFT / Shtim kocke
  "sinus-lift",
  "membrane",
  "osteotomy",
  "split-crest",
  "titanium-bar", // Bar Titanium
]);

export function isOfficialService(s: Pick<CatalogueService, "slug">): boolean {
  return OFFICIAL_SLUGS.has(s.slug);
}

/** Strictly the official 2026 treatments, in catalogue order. */
export const OFFICIAL_SERVICES: CatalogueService[] = CATALOGUE_SERVICES.filter(isOfficialService);

export function officialServicesByCategory(slug: string): CatalogueService[] {
  return OFFICIAL_SERVICES.filter((s) => s.category === slug);
}

/** Categories that contain at least one official treatment (for the listing). */
export const OFFICIAL_CATEGORIES: CatalogueCategory[] = CATALOGUE_CATEGORIES.filter(
  (c) => OFFICIAL_SERVICES.some((s) => s.category === c.slug),
);
