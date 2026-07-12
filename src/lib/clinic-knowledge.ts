/**
 * Clinic knowledge layer, the single source of truth shared by the public
 * chatbot and the CRM.
 *
 * Everything here is DERIVED from the website's own content modules
 * (catalogue, treatment content, team/clinic pages, equipment, blog, site
 * contact). The website is therefore the basis of the whole system: edit the
 * site data and the bot + CRM knowledge update with it, there is no second,
 * drifting copy of the clinic's facts.
 *
 * Two things are exported:
 *   1. `CLINIC_PROFILE`, the structured at-a-glance facts (name, address,
 *      hours, languages, standards, aftercare, headline stats, doctor).
 *   2. `KNOWLEDGE` + `searchKnowledge()`, a flat, scored, retrievable index of
 *      every patient-facing fact, so the bot can ground an answer and cite it.
 */
import {
  CATALOGUE_CATEGORIES,
  CATALOGUE_SERVICES,
  type CatalogueService,
} from "./catalogue";
import { getTreatmentContent } from "./catalogue-content";
import { CLINIC_PAGES, DENTIST_BIOS, PROCEDURES } from "./pages";
import { EQUIPMENT, EQUIPMENT_CATEGORIES, TECH_BRANDS } from "./equipment";
import { CONTACT } from "./site";

// ── structured clinic profile ────────────────────────────────────────────────

// Owner directive: leadership is presented institutionally, NEVER by name.
// The founder & managing director is non-clinical; treatment is always
// attributed to the clinic's clinical team.
const FOUNDER_ROLE = "Founder & Managing Director";
const FOUNDER_BIO = [
  "Dental Med Austria is led by its founder and managing director, who guides the clinic's strategy and quality standards while day-to-day treatment is carried out by the clinic's experienced clinical team.",
  "Founded in 2009 in Tirana, the clinic is now recognised as one of Albania's leading dental clinics.",
  "The clinical team cares for local and international patients in German, English, French, and Italian, across implantology, All-on-4 and All-on-6, orthodontics, cosmetic dentistry and veneers.",
].join(" ");

export const CLINIC_PROFILE = {
  name: CONTACT.name,
  founded: 2009,
  email: CONTACT.email,
  address: `${CONTACT.address1}, ${CONTACT.address2}`,
  city: "Tiranë",
  country: "Albania",
  hours: CONTACT.hours,
  phone: CONTACT.phone || null,
  instagram: CONTACT.instagram,
  facebook: CONTACT.facebook,
  maps: CONTACT.maps,
  /** Languages the clinic serves patients in. */
  languages: ["English", "German", "Italian", "French", "Albanian"],
  /** Headline trust stats, sourced from the site copy. */
  stats: {
    patients: "24,000+ happy patients",
    implants: "42,000+ implants placed",
    successRate: "98% implant success rate",
    experience: "30+ years of clinical experience",
  },
  /** Verifiable aftercare & traceability facts (never warranty promises). */
  aftercare: [
    "Implant passport with verifiable serial numbers for every implant",
    "Documented implant systems with aftercare and follow-up",
  ],
  standards: [
    "ISO 9001 quality management",
    "European hygiene protocols",
    "Rigorous sterilisation protocols, every instrument sterilised after every patient",
  ],
  /** Premium partner brands used in the clinic (Straumann, Ivoclar, …). */
  brands: TECH_BRANDS,
  /** Leadership, institutional only, no personal names (owner directive). */
  doctor: {
    role: FOUNDER_ROLE,
    bio: FOUNDER_BIO,
  },
} as const;

// ── flat, retrievable knowledge index ────────────────────────────────────────

export type KnowledgeKind =
  | "service"
  | "category"
  | "doctor"
  | "clinic"
  | "faq"
  | "equipment"
  | "guarantee"
  | "safety"
  | "tourism"
  | "contact"
  | "blog";

export type KnowledgeEntry = {
  id: string;
  kind: KnowledgeKind;
  title: string;
  body: string;
  keywords: string[];
  /** Public site URL backing this fact, when one exists. */
  url?: string;
  /** Brands referenced (e.g. Straumann, Ivoclar), surfaced as proof. */
  brands?: string[];
  /**
   * Scannable list points (process steps, item lists). The page renders these
   * under the body; `knowledgeText()` folds them back into prose for the bot.
   */
  bullets?: string[];
  /** Render `bullets` as a numbered sequence on the page (ordered steps). */
  numbered?: boolean;
};

function serviceEntry(s: CatalogueService): KnowledgeEntry {
  const content = getTreatmentContent(s.slug);
  const parts = [s.summary];
  if (content) {
    parts.push(content.intro);
    if (content.benefits?.length) parts.push("Benefits: " + content.benefits.join("; ") + ".");
    if (content.idealFor) parts.push("Ideal for: " + content.idealFor);
  }
  return {
    id: `service:${s.slug}`,
    kind: "service",
    title: s.name,
    body: parts.filter(Boolean).join(" "),
    keywords: [s.name, s.category, ...s.brands],
    url: `/catalogue/${s.slug}`,
    brands: s.brands?.length ? s.brands : undefined,
  };
}

function buildKnowledge(): KnowledgeEntry[] {
  const entries: KnowledgeEntry[] = [];

  // Treatment categories (high-level overview of each area of care).
  for (const c of CATALOGUE_CATEGORIES) {
    entries.push({
      id: `category:${c.slug}`,
      kind: "category",
      title: c.label,
      body: c.blurb,
      keywords: [c.label, c.slug],
      url: `/catalogue`,
    });
  }

  // Every treatment in the catalogue, enriched with its landing-page content.
  for (const s of CATALOGUE_SERVICES) entries.push(serviceEntry(s));

  // The five featured procedure overviews (implants, crowns, veneers, …).
  for (const p of PROCEDURES) {
    entries.push({
      id: `procedure:${p.slug}`,
      kind: "service",
      title: p.name,
      body: [p.intro, ...p.body, ...p.treatments.map((t) => `${t.title}: ${t.text}`)].join(" "),
      keywords: [p.name, p.eyebrow, ...p.treatments.map((t) => t.title)],
      url: `/care/${p.slug}`,
    });
  }

  // Leadership, institutional, never by name (owner directive). Keywords stay
  // broad so "who is the doctor/founder/surgeon?" still retrieves this honest
  // answer, phrased around the clinical team.
  entries.push({
    id: "doctor:leadership",
    kind: "doctor",
    title: `Clinic leadership: ${FOUNDER_ROLE}`,
    body: FOUNDER_BIO,
    keywords: [FOUNDER_ROLE, "dentist", "doctor", "surgeon", "founder", "team", "who is"],
    url: "/team",
  });
  for (const d of DENTIST_BIOS) {
    if (d.slug === "dr-mentor-zeqja") continue; // never presented by name (owner directive)
    entries.push({
      id: `doctor:${d.slug}`,
      kind: "doctor",
      title: `${d.name} · ${d.role}`,
      body: `${d.credentials}. ${d.paragraphs.join(" ")}`,
      keywords: [d.name, d.role, "dentist", "doctor", "surgeon"],
      url: `/team/${d.slug}`,
    });
  }

  // Clinic pages → each section is its own entry; the FAQ page Q&As become faqs.
  for (const page of CLINIC_PAGES) {
    const isFaq = page.slug === "faqs";
    const isTourism = page.slug === "dental-tourism";
    const url = `/clinic/${page.slug}`;
    entries.push({
      id: `clinic:${page.slug}`,
      kind: isTourism ? "tourism" : "clinic",
      title: page.title,
      body: page.intro,
      keywords: [page.title, page.eyebrow, page.slug.replace(/-/g, " ")],
      url,
    });
    for (const sec of page.sections) {
      entries.push({
        id: `clinic:${page.slug}:${sec.heading.slice(0, 24)}`,
        kind: isFaq ? "faq" : isTourism ? "tourism" : "clinic",
        title: sec.heading,
        body: sec.paragraphs.join(" "),
        keywords: [page.title, sec.heading],
        url,
      });
    }
  }

  // Per-treatment FAQs from the catalogue content (e.g. "Why choose Straumann?").
  for (const s of CATALOGUE_SERVICES) {
    const content = getTreatmentContent(s.slug);
    if (!content?.faqs?.length) continue;
    for (const f of content.faqs) {
      entries.push({
        id: `faq:${s.slug}:${f.q.slice(0, 24)}`,
        kind: "faq",
        title: f.q,
        body: f.a,
        keywords: [s.name, s.category, ...s.brands],
        url: `/catalogue/${s.slug}`,
        brands: s.brands?.length ? s.brands : undefined,
      });
    }
  }

  // Equipment & technology, grouped by category, with the brand wall.
  for (const cat of EQUIPMENT_CATEGORIES) {
    const items = EQUIPMENT.filter((e) => e.category === cat.slug);
    entries.push({
      id: `equipment:${cat.slug}`,
      kind: "equipment",
      title: cat.label,
      body: `${cat.blurb} ${items.map((e) => `${e.brand} ${e.model}, ${e.summary}`).join(" ")}`,
      keywords: [cat.label, "technology", "equipment", ...items.map((e) => e.brand)],
      url: `/technology`,
      brands: Array.from(new Set(items.map((e) => e.brand))),
    });
  }
  entries.push({
    id: `equipment:brands`,
    kind: "equipment",
    title: "Partner brands & materials",
    body: `We work exclusively with premium partners trusted across Europe: ${TECH_BRANDS.join(", ")}. The implants, ceramics and materials placed in your mouth are the very best available, the same brands used by top clinics in Switzerland, Germany and the UK, and independently verifiable with each manufacturer.`,
    keywords: ["brands", "materials", "straumann", "ivoclar", "quality", "verify", ...TECH_BRANDS],
    url: `/technology`,
    brands: TECH_BRANDS,
  });

  // Safety, hygiene & infection control, the vetted knowledge behind /safety.
  // Wording rule: sterilisation is presented as rigorous, gold-standard
  // practice, never name an autoclave/sterilisation class.
  const SAFETY_ENTRIES: KnowledgeEntry[] = [
    {
      id: "safety:overview",
      kind: "safety",
      title: "Safety, hygiene & infection control at Dental Med Austria",
      keywords: [
        "safety", "safe", "hygiene", "infection control", "cross infection",
        "cross contamination", "sterilisation", "sterilization", "clean",
        "iso 9001", "protocol", "is it safe", "separation",
      ],
      body: "Patient safety is never left to chance. Dental Med Austria works under ISO 9001 quality management and European infection-control protocols, with rigorous sterilisation that meets the standards patients expect from leading clinics in Switzerland, Germany and the UK. For more than 30 years our team has delivered safe, predictable treatment for 24,000+ patients, supported by documented protocols, premium CE-marked materials and a 98% implant success rate. Cross-infection control - the principle that nothing passes from one patient to the next - runs through everything below: every instrument, every surface, every appointment.",
      url: "/safety",
    },
    {
      id: "safety:instrument-reprocessing",
      kind: "safety",
      title: "Every instrument is sterilised after every patient",
      keywords: [
        "sterilisation", "sterilization", "autoclave", "instruments",
        "reprocessing", "ultrasonic", "vacuum steam", "pouch", "traceability",
        "what sterilisation do you use",
      ],
      body: "Every reusable instrument follows the same documented reprocessing cycle before it reaches your treatment room. Nothing is reused without completing all of it, and each cycle is logged so the instruments used in your treatment can be traced back to a specific batch.",
      bullets: [
        "Pre-cleaning to stop debris drying on",
        "Ultrasonic cleaning of every surface",
        "Rinse, dry and visual inspection",
        "Sealing into an individual sterilisation pouch",
        "Vacuum steam autoclave sterilisation",
        "Batch logging for full traceability",
        "Sterile storage until the pouch is opened in front of you",
      ],
      numbered: true,
      url: "/safety",
    },
    {
      id: "safety:surface-unit-disinfection",
      kind: "safety",
      title: "Every treatment room is fully reset",
      keywords: [
        "disinfection", "surfaces", "clean between patients", "cross infection",
        "dental chair", "operatory", "wipe down", "barriers", "hygiene",
      ],
      body: "Between every appointment the room is disinfected and reset, so nothing that touched the previous patient carries over to you. Sterile instruments and fresh disposables are opened only once you are seated.",
      bullets: [
        "Dental chair, operating light and delivery unit",
        "Control panels and work surfaces",
        "All clinical contact equipment",
        "Single-use barrier protection on high-touch points",
      ],
      url: "/safety",
    },
    {
      id: "safety:single-use-disposables",
      kind: "safety",
      title: "Single-use means single use",
      keywords: [
        "single use", "disposable", "one time", "needles", "gloves", "syringe",
        "sterile", "waste", "hygiene", "clinical waste", "sharps", "biohazard",
        "disposal", "safe disposal",
      ],
      body: "Wherever an item can be used once and discarded, it is - opened fresh for your appointment and never reused between patients. Afterwards, sharps go straight into sealed, puncture-resistant containers and clinical waste is separated from general waste for correct disposal.",
      bullets: [
        "Needles and anaesthetic cartridges",
        "Suction tips and cups",
        "Gloves, masks and protective eyewear",
        "Barrier protection and surgical consumables",
      ],
      url: "/safety",
    },
    {
      id: "safety:water-line-hygiene",
      kind: "safety",
      title: "Clean water, clean air",
      keywords: [
        "water lines", "waterline", "dental unit water", "biofilm", "clean water",
        "hygiene", "handpiece", "irrigation", "air", "suction",
      ],
      body: "The water that cools instruments and rinses your mouth is kept clean under European water-line hygiene protocols that control biofilm. The air delivered to the treatment chair is clean, dry and oil-free, and suction is maintained the same way.",
      url: "/safety",
    },
    {
      id: "safety:hand-hygiene-ppe",
      kind: "safety",
      title: "Hand hygiene & protective equipment",
      keywords: [
        "hand hygiene", "ppe", "gloves", "mask", "protective", "hand washing",
        "clean hands", "clinician", "hygiene",
      ],
      body: "Our clinical team follows strict hand-hygiene and PPE practice throughout every appointment: hands are cleaned before and after treatment, and fresh gloves, masks and eye protection are used for every patient and changed between patients. Simple, disciplined hand hygiene is among the most effective infection-control measures in any clinic.",
      url: "/safety",
    },
    {
      id: "safety:sterile-implant-surgery",
      kind: "safety",
      title: "Sterile implant surgery",
      keywords: [
        "implant surgery", "sterile", "surgical", "aseptic", "operating",
        "safe surgery", "straumann", "guided surgery", "hygiene",
        "implant passport", "serial number", "traceability", "warranty", "verify",
      ],
      body: "Implant placement is carried out as a dedicated sterile surgical procedure, planned digitally for precision. Every implant is supplied with an Implant Passport recording its brand and serial numbers, so the exact component placed in your jaw is documented and can be verified with the manufacturer - by you, or by any dentist, anywhere in the world.",
      bullets: [
        "Sterile surgical drapes and gloves",
        "Sterilised surgical instruments",
        "Single-use surgical consumables",
        "Digitally planned positioning from a Vatech CBCT scan",
        "Navident guided surgery, where indicated",
      ],
      url: "/safety",
      brands: ["Straumann", "Biodem", "Vatech", "Navident"],
    },
    {
      id: "safety:iso-9001",
      kind: "safety",
      title: "Why ISO 9001 matters",
      keywords: [
        "iso 9001", "quality management", "standards", "audit", "consistency",
        "documented", "process", "hygiene", "quality",
      ],
      body: "ISO 9001 isn't simply a certificate. It means every critical clinical process - from sterilisation to infection control - is defined, documented and monitored, and performed the same way every time rather than left to memory. That consistency is what turns careful protocols into dependable patient safety.",
      url: "/safety",
    },
    {
      id: "safety:materials-provenance",
      kind: "safety",
      title: "Verified materials you can trust",
      keywords: [
        "materials", "ce marked", "provenance", "verify", "quality", "implants",
        "ceramic", "straumann", "ivoclar", "biodem", "safe materials",
        "genuine",
      ],
      body: "The implants, ceramics and biomaterials placed in your mouth are premium, CE-marked products from manufacturers trusted across Europe. Each can be verified independently through your treatment documentation and serial numbers - genuine, traceable materials are a safety matter as much as a quality one.",
      bullets: ["Straumann", "Ivoclar", "Biodem"],
      url: "/safety",
      brands: ["Straumann", "Biodem", "Ivoclar Vivadent"],
    },
  ];
  const SAFETY_FAQS: KnowledgeEntry[] = [
    {
      id: "faq:safety:is-it-safe",
      kind: "faq",
      title: "Is dental treatment at your clinic safe?",
      keywords: [
        "is it safe", "safe", "safety", "risk", "hygiene", "clean", "worried",
        "infection",
      ],
      body: "Yes. Every reusable instrument is cleaned, inspected, pouched and sterilised in a vacuum autoclave before use; treatment surfaces are disinfected between every patient; and single-use items are used once and discarded. We work under ISO 9001 quality management and European infection-control protocols - the same standards used by leading clinics in Western Europe, applied to every appointment.",
      url: "/safety",
    },
    {
      id: "faq:safety:what-sterilisation",
      kind: "faq",
      title: "How are your instruments sterilised?",
      keywords: [
        "what sterilisation", "what sterilization", "autoclave", "how sterilised",
        "sterilise instruments", "clean instruments", "steriliser",
      ],
      body: "Every reusable instrument is ultrasonically cleaned, inspected, sealed in an individual sterilisation pouch and processed in a vacuum steam autoclave, which draws air out of hollow and wrapped instruments so steam penetrates completely. Each cycle is logged for traceability, and instruments stay sealed and sterile until they are opened at the chair, in front of you.",
      url: "/safety",
    },
    {
      id: "faq:safety:albania-hygienic",
      kind: "faq",
      title: "Is dental treatment safe in Albania?",
      keywords: [
        "albania hygienic", "is albania safe", "safe in albania", "abroad",
        "dental tourism safe", "hygiene albania", "tirana safe", "quality abroad",
        "worried",
      ],
      body: "Safety depends on the clinic, not the country. Dental Med Austria follows the same internationally recognised infection-control protocols and ISO 9001 quality management used by leading clinics across Western Europe: sealed sterile instruments, between-patient disinfection, single-use disposables and documented processes, applied to every appointment - backed by 30+ years of experience and a 98% implant success rate.",
      url: "/safety",
    },
    {
      id: "faq:safety:materials-genuine",
      kind: "faq",
      title: "Are your implant materials genuine?",
      keywords: [
        "genuine", "authentic", "real materials", "fake", "implant passport",
        "serial number", "verify implant", "ce marked", "traceable", "straumann",
      ],
      body: "Yes. Every implant is supplied with an Implant Passport recording its brand and serial numbers, so the exact component placed in your jaw is documented and can be verified independently with the manufacturer. The ceramics and biomaterials we use are premium, CE-marked products, traceable through your treatment records.",
      url: "/safety",
    },
  ];
  entries.push(...SAFETY_ENTRIES, ...SAFETY_FAQS);

  // The trust answer to "is there a guarantee / will quality be bad?", the
  // "guarantee"/"warranty" keywords stay so the question is still retrieved,
  // but the answer describes documented standards, traceability and aftercare
  // rather than promising a warranty.
  entries.push({
    id: `guarantee:standards`,
    kind: "guarantee",
    title: "Quality standards, documentation & aftercare",
    body: `All work is carried out to ISO 9001 standards and European hygiene protocols, with rigorous sterilisation, every instrument sterilised after every patient. Every implant comes with an implant passport and serial numbers you can register with the manufacturer, so the exact system placed is documented and independently verifiable, and our team follows up with structured aftercare once your treatment is complete.`,
    keywords: [
      "guarantee",
      "warranty",
      "safe",
      "safety",
      "quality",
      "sterilisation",
      "sterilization",
      "hygiene",
      "iso",
      "standards",
      "implant passport",
      "aftercare",
      "traceability",
    ],
    url: `/clinic/faqs`,
  });

  // Contact & visiting.
  entries.push({
    id: `contact:clinic`,
    kind: "contact",
    title: "Contact & location",
    body: `${CLINIC_PROFILE.name} is at ${CLINIC_PROFILE.address}, open ${CLINIC_PROFILE.hours}. Email ${CLINIC_PROFILE.email}. We care for patients in ${CLINIC_PROFILE.languages.join(", ")}.`,
    keywords: ["contact", "address", "location", "where", "hours", "open", "email", "phone", "tirana", "albania"],
    url: `/contact`,
  });

  return entries;
}

export const KNOWLEDGE: KnowledgeEntry[] = buildKnowledge();

/**
 * The full text of an entry for the chatbot: body plus any scannable `bullets`
 * folded back into a simple list, so nothing the page shows is lost to the bot.
 */
export function knowledgeText(e: KnowledgeEntry): string {
  return e.bullets?.length ? `${e.body}\n- ${e.bullets.join("\n- ")}` : e.body;
}

// ── retrieval (keyword scoring) ──────────────────────────────────────────────

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "do", "does", "for",
  "from", "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "the",
  "to", "we", "what", "when", "where", "which", "who", "will", "with", "you",
  "your", "about", "have", "has", "get", "any", "much",
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/** Pre-tokenised search fields per entry, weighted by where the term appears. */
const INDEX = KNOWLEDGE.map((entry) => ({
  entry,
  title: new Set(tokenize(entry.title)),
  keywords: new Set(entry.keywords.flatMap(tokenize)),
  body: new Set(tokenize([entry.body, ...(entry.bullets ?? [])].join(" "))),
}));

export type ScoredEntry = { entry: KnowledgeEntry; score: number };

/**
 * Score every knowledge entry against the query and return the best matches.
 * Title hits weigh most, then keywords, then body, so "Straumann" surfaces the
 * Straumann entry, and "is it safe" surfaces standards/sterilisation.
 */
export function searchKnowledge(query: string, limit = 5): ScoredEntry[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const scored: ScoredEntry[] = [];
  for (const row of INDEX) {
    let score = 0;
    for (const term of terms) {
      if (row.title.has(term)) score += 3;
      if (row.keywords.has(term)) score += 2;
      if (row.body.has(term)) score += 1;
    }
    if (score > 0) scored.push({ entry: row.entry, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/** Convenience: just the top services matching a free-text query. */
export function findServices(query: string, limit = 4): KnowledgeEntry[] {
  return searchKnowledge(query, 20)
    .map((s) => s.entry)
    .filter((e) => e.kind === "service")
    .slice(0, limit);
}
