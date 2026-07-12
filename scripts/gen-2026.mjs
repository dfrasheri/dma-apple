// Generates src/lib/catalogue-2026.ts from the workflow content JSON + the
// structural skeleton below. Run: node scripts/gen-2026.mjs
// Input:  scripts/2026-content.json  ({ services: [ {slug,title,description,intro,benefits,idealFor,duration?,faqs} ] })
// Output: src/lib/catalogue-2026.ts
import { readFileSync, writeFileSync } from "node:fs";

// slug -> structural data (category drives the 3D model via MODEL_BY_CATEGORY)
const SKELETON = {
  // ---- Crowns (category crowns-aesthetics -> crown model) ----
  "chrome-cobalt-crown": { name: "Chrome Cobalt Crown", category: "crowns-aesthetics", brands: ["Chrome-cobalt alloy", "Feldspathic porcelain"], price: 180 },
  "multilayer-zirconia-crown": { name: "Multilayer Zirconia Crown", category: "crowns-aesthetics", brands: ["Multilayer zirconia"], price: 270 },
  "zirconia-emax-gisi-crown": { name: "Zirconia E-max GiSi Crown", category: "crowns-aesthetics", brands: ["Zirconia core", "GiSi E-max ceramic"], price: 300 },
  "zirconia-emax-ivoclar-crown": { name: "Zirconia E-max Ivoclar Crown", category: "crowns-aesthetics", brands: ["Zirconia core", "Ivoclar E-max"], price: 360 },
  "full-emax-gisi-crown": { name: "Full E-max GiSi II Crown", category: "crowns-aesthetics", brands: ["GiSi IPS E-max"], price: 400 },
  "full-emax-ivoclar-crown": { name: "Full E-max Ivoclar II Crown", category: "crowns-aesthetics", brands: ["Ivoclar IPS E-max"], price: 470 },
  "full-emax-premium-ivoclar-crown": { name: "Full E-max Premium Ivoclar Crown", category: "crowns-aesthetics", brands: ["Ivoclar IPS E-max Premium"], price: 590 },
  "top-line-gisi-emax-crown": { name: "Top Line GiSi E-max Premium Crown", category: "crowns-aesthetics", brands: ["GiSi E-max Premium"], price: 690 },
  "top-line-ivoclar-emax-crown": { name: "Top Line Ivoclar E-max Premium Crown", category: "crowns-aesthetics", brands: ["Ivoclar E-max Premium"], price: 750, featured: true },
  "temporary-crown": { name: "Temporary Crown", category: "crowns-aesthetics", brands: ["PMMA provisional"], price: 30 },
  // ---- Veneers (crowns-aesthetics -> crown model) ----
  "zirconia-veneer": { name: "Zirconia Veneer", category: "crowns-aesthetics", brands: ["Zirconia"], price: 280 },
  "zirconia-emax-gisi-veneer": { name: "Zirconia E-max GiSi Veneer", category: "crowns-aesthetics", brands: ["Zirconia", "GiSi E-max"], price: 300 },
  "zirconia-emax-ivoclar-veneer": { name: "Zirconia E-max Ivoclar Veneer", category: "crowns-aesthetics", brands: ["Zirconia", "Ivoclar E-max"], price: 370 },
  "zirconia-emax-gisi-ii-veneer": { name: "Zirconia E-max GiSi II Veneer", category: "crowns-aesthetics", brands: ["Zirconia", "GiSi E-max II"], price: 400 },
  "zirconia-emax-ivoclar-ii-veneer": { name: "Zirconia E-max Ivoclar II Veneer", category: "crowns-aesthetics", brands: ["Zirconia", "Ivoclar E-max II"], price: 470 },
  "full-emax-gisi-veneer": { name: "Full E-max GiSi Veneer", category: "crowns-aesthetics", brands: ["GiSi IPS E-max"], price: 590 },
  "full-emax-ivoclar-veneer": { name: "Full E-max Ivoclar Veneer", category: "crowns-aesthetics", brands: ["Ivoclar IPS E-max"], price: 690 },
  "full-emax-premium-veneer": { name: "Full E-max Premium Veneer", category: "crowns-aesthetics", brands: ["Ivoclar IPS E-max Premium"], price: 790, featured: true },
  // ---- Implants (implants -> implant model) ----
  "detech-implant": { name: "Detech Implant", category: "implants", brands: ["Detech"], price: 400 },
  "implant-swiss": { name: "Swiss Premium Implant", category: "implants", brands: ["Swiss-manufactured"], price: 800 },
  "straumann-blt-implant": { name: "Straumann BLT Implant", category: "implants", brands: ["Straumann (Switzerland)"], price: 1250, featured: true },
  // ---- Bone reconstruction (implants -> implant model) ----
  "homeostatic-sponge": { name: "Homeostatic Sponge", category: "implants", brands: ["Collagen sponge"], price: 220 },
  "prf-platelet-rich-fibrin": { name: "PRF (Platelet-Rich Fibrin)", category: "implants", brands: ["Autologous PRF"], price: 280 },
  "membrane": { name: "Collagen Membrane (GBR)", category: "implants", brands: ["Collagen membrane"], price: 320 },
  "osteotomy": { name: "Osteotomy", category: "implants", brands: ["Surgical kit"], price: 470 },
  "split-crest": { name: "Split Crest Ridge Expansion", category: "implants", brands: ["Ridge-expansion kit"], price: 750 },
  // ---- Restorative / general (NEW category restorative -> tooth model) ----
  "consultation": { name: "Consultation", category: "restorative", brands: [], price: null },
  "filling-evetric": { name: "Composite Filling (Evetric)", category: "restorative", brands: ["Ivoclar Evetric"], price: 80 },
  "filling-estelite": { name: "Composite Filling (Estelite)", category: "restorative", brands: ["Tokuyama Estelite"], price: 95 },
  "filling-asteria": { name: "Composite Filling (Asteria)", category: "restorative", brands: ["Tokuyama Estelite Asteria"], price: 135 },
  // ---- Hygiene (periodontics -> tooth model) ----
  "deep-cleaning-airflow": { name: "Deep Cleaning (Airflow)", category: "periodontics", brands: ["Airflow air-polishing"], price: 90 },
  // ---- Extractions (oral-surgery -> tooth model) ----
  "simple-extraction": { name: "Simple Tooth Extraction", category: "oral-surgery", brands: ["Surgical kit"], price: 40 },
  "retained-tooth-extraction": { name: "Retained Tooth Extraction", category: "oral-surgery", brands: ["Surgical kit", "Sutures"], price: 290 },
  // ---- Prosthetics (NEW category prosthetics -> aligner model) ----
  "peek-super-structure": { name: "PEEK Super-Structure", category: "prosthetics", brands: ["PEEK framework"], price: 750 },
  "titanium-bar": { name: "Titanium Bar Framework", category: "prosthetics", brands: ["Titanium bar"], price: 800 },
  "screw-system": { name: "Implant Screw System", category: "prosthetics", brands: ["Implant screw system"], price: 160 },
  "elastic-prosthesis": { name: "Flexible Denture", category: "prosthetics", brands: ["Flexible nylon"], price: 400 },
  "elastic-prosthesis-hooks": { name: "Flexible Denture with Clasps", category: "prosthetics", brands: ["Flexible nylon"], price: 500 },
  "prosthesis-buttons": { name: "Implant Overdenture (Locators)", category: "prosthetics", brands: ["Locator attachments"], price: 900 },
  // ---- Orthodontics (orthodontics -> aligner model) ----
  "metal-braces": { name: "Metal Braces", category: "orthodontics", brands: ["Metal brackets"], price: 1400 },
  "aesthetic-braces": { name: "Aesthetic (Ceramic) Braces", category: "orthodontics", brands: ["Ceramic brackets"], price: 2400 },
};

const NEW_CATEGORIES = [
  { slug: "restorative", label: "Fillings & General", blurb: "Tooth-coloured fillings, professional hygiene, and everyday dental care that keeps your smile healthy between visits.", accent: "#6b6f4a", image: "/images/dma/blog-porcelain-cost.webp" },
  { slug: "prosthetics", label: "Dentures & Prosthetics", blurb: "Comfortable removable dentures and fixed implant-supported prosthetics that restore a complete, confident smile.", accent: "#7a5a8a", image: "/images/dma/blog-prostheses.webp" },
];

const NEW_PROCESS = {
  restorative: [
    { title: "Gentle Check-up", text: "A careful exam and, where needed, a quick X-ray confirm exactly what your tooth needs." },
    { title: "Same-Visit Treatment", text: "Most fillings and cleanings are completed comfortably in a single appointment." },
    { title: "Polished Finish", text: "Your restoration is shaped, shade-matched, and polished to blend with your natural tooth." },
  ],
  prosthetics: [
    { title: "Impressions & Planning", text: "Precise impressions and planning capture your bite and smile for a prosthesis that truly fits." },
    { title: "Custom Fabrication", text: "Your denture or framework is crafted and refined in our lab to your exact anatomy." },
    { title: "Comfortable Fitting", text: "We fit and fine-tune your prosthesis so it feels secure, natural, and comfortable to wear." },
  ],
};

const J = (v) => JSON.stringify(v);

const content = JSON.parse(readFileSync("scripts/2026-content.json", "utf8"));
const services = content.services || content; // tolerate either shape
const bySlug = new Map(services.map((s) => [s.slug, s]));

// coverage report
const missingContent = Object.keys(SKELETON).filter((s) => !bySlug.has(s));
const missingSkeleton = [...bySlug.keys()].filter((s) => !SKELETON[s]);
if (missingContent.length) console.error("WARN no content for:", missingContent.join(", "));
if (missingSkeleton.length) console.error("WARN no skeleton for:", missingSkeleton.join(", "));

const slugs = Object.keys(SKELETON).filter((s) => bySlug.has(s));

const servicesTs = slugs.map((slug) => {
  const sk = SKELETON[slug];
  const c = bySlug.get(slug);
  const summary = (c.intro.split(/(?<=\.)\s/)[0] || c.description).trim();
  return `  { category: ${J(sk.category)}, name: ${J(sk.name)}, slug: ${J(slug)}, summary: ${J(summary)}, brands: ${J(sk.brands)}${sk.featured ? ", featured: true" : ""} },`;
}).join("\n");

const contentTs = slugs.map((slug) => {
  const c = bySlug.get(slug);
  const faqs = c.faqs.map((f) => `      { q: ${J(f.q)}, a: ${J(f.a)} },`).join("\n");
  return `  ${J(slug)}: {
    title: ${J(c.title)},
    description: ${J(c.description)},
    intro: ${J(c.intro)},
    benefits: ${J(c.benefits)},
    idealFor: ${J(c.idealFor)},${c.duration ? `\n    duration: ${J(c.duration)},` : ""}
    faqs: [
${faqs}
    ],
  },`;
}).join("\n");

const pricesTs = slugs.map((slug) => `  ${J(slug)}: ${SKELETON[slug].price === null ? "null" : SKELETON[slug].price},`).join("\n");
const processTs = Object.entries(NEW_PROCESS).map(([k, steps]) =>
  `  ${J(k)}: [\n${steps.map((s) => `    { title: ${J(s.title)}, text: ${J(s.text)} },`).join("\n")}\n  ],`).join("\n");
const catsTs = NEW_CATEGORIES.map((c) => `  { slug: ${J(c.slug)}, label: ${J(c.label)}, blurb: ${J(c.blurb)}, accent: ${J(c.accent)}, image: ${J(c.image)} },`).join("\n");

const out = `// AUTO-GENERATED by scripts/gen-2026.mjs from the real DMA 2026 price list.
// Real 2026 services, merged into the catalogue. Prices are CONFIDENTIAL collaborator
// rates kept here for internal reference only — they are NOT displayed on the site.
import type { CatalogueCategory, CatalogueService } from "./catalogue";
import type { TreatmentContent } from "./catalogue-content";

export const CATEGORIES_2026: CatalogueCategory[] = [
${catsTs}
];

export const SERVICES_2026: CatalogueService[] = [
${servicesTs}
];

export const PROCESS_2026: Record<string, { title: string; text: string }[]> = {
${processTs}
};

export const CONTENT_2026: Record<string, TreatmentContent> = {
${contentTs}
};

/** Confidential B2B collaborator prices (EUR). Internal only — never rendered. */
export const PRICES_2026: Record<string, number | null> = {
${pricesTs}
};
`;

writeFileSync("src/lib/catalogue-2026.ts", out);
console.log(`OK wrote src/lib/catalogue-2026.ts — ${slugs.length} services, ${NEW_CATEGORIES.length} new categories`);
