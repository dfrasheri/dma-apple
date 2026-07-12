// Resolves the rich landing-page sections for a treatment page. Per-service
// content (catalogue-content-rich.ts) always wins; where a service leaves a
// section unset, sensible CATEGORY-LEVEL defaults fill it in, so EVERY procedure
// page gets the same full structure (spec strip → steps → who-it's-for →
// recovery → stats → good-to-know → maintenance → cost) without hand-authoring
// all 80+ pages. Non-clinical categories (tourism, diagnostics)
// intentionally skip the clinical blocks.
import type { CatalogueCategory, CatalogueService } from "./catalogue";
import type {
  CompareItem,
  NamedPoint,
  SpecItem,
  StatItem,
  TreatmentContent,
} from "./catalogue-content";

export type ProcedureSections = {
  specs: SpecItem[];
  steps: NamedPoint[];
  candidates: NamedPoint[];
  recovery: NamedPoint[];
  stats: StatItem[];
  comparisons: CompareItem[];
  maintenance: NamedPoint[];
  costNote: string;
};

const PLAN_TURNAROUND = "Free written plan in 24–48h";

// Categories that describe an actual clinical procedure (get the full body).
const CLINICAL = new Set([
  "implants",
  "crowns-aesthetics",
  "whitening",
  "endodontics",
  "periodontics",
  "orthodontics",
  "oral-surgery",
  "restorative",
  "prosthetics",
]);

// Categories where a documentation spec makes sense, and which kind.
function documentationFor(category: string): string | null {
  if (category === "implants") return "Implant passport · serial numbers";
  if (category === "crowns-aesthetics" || category === "prosthetics" || category === "restorative")
    return "In-house lab · documented materials";
  return null;
}

// ── Category default specs (the scannable "at a glance" strip) ───────────────
function defaultSpecs(service: CatalogueService, content: TreatmentContent): SpecItem[] {
  const specs: SpecItem[] = [];
  if (content.duration) specs.push({ label: "Typical session", value: content.duration });
  if (CLINICAL.has(service.category)) {
    specs.push({ label: "Anaesthesia", value: "Local (sedation available)" });
  }
  const d = documentationFor(service.category);
  if (d) specs.push({ label: "Documentation", value: d });
  specs.push({ label: "Standards", value: "ISO 9001 · European protocols" });
  specs.push({ label: "For travellers", value: PLAN_TURNAROUND });
  return specs;
}

// ── Category default "who is this for" ──────────────────────────────────────
const DEFAULT_CANDIDATES: Record<string, NamedPoint[]> = {
  "crowns-aesthetics": [
    { title: "You want to improve how your smile looks", text: "Crowns and veneers correct colour, shape, chips, gaps and worn edges for a natural, harmonious result designed around your face." },
    { title: "You have a weakened or heavily filled tooth", text: "A crown protects and rebuilds a tooth that is cracked, root-treated or too broken down for a simple filling." },
    { title: "Your teeth and gums are healthy underneath", text: "We treat any decay or gum issues first, so your new restorations sit on a sound, lasting foundation." },
  ],
  whitening: [
    { title: "Your teeth have dulled or stained over time", text: "Professional whitening lifts years of coffee, tea, wine and tobacco staining that everyday brushing cannot shift." },
    { title: "You want a safe, even, professional result", text: "In-clinic whitening is supervised with gum protection, brighter and more even than any over-the-counter kit." },
    { title: "Your teeth and gums are healthy", text: "Whitening works best on natural teeth free of decay and active gum problems, which we confirm first." },
  ],
  endodontics: [
    { title: "You have tooth pain or a deep infection", text: "Root canal treatment relieves the pain of an inflamed or infected nerve and lets you keep your natural tooth." },
    { title: "You'd rather save the tooth than extract it", text: "Modern root canal treatment saves teeth that would once have been removed, almost always the better long-term choice." },
    { title: "The tooth is restorable", text: "Where enough healthy structure remains, a treated tooth is sealed and usually crowned to full strength." },
  ],
  periodontics: [
    { title: "Your gums bleed, recede or feel sore", text: "Bleeding, swelling and recession are early signs of gum disease, the leading cause of tooth loss, and very treatable when caught." },
    { title: "You want to protect the teeth you have", text: "Healthy gums and bone are the foundation of every tooth; treatment stabilises them before problems progress." },
    { title: "You're preparing for implants or veneers", text: "Healthy gums are essential for a lasting aesthetic or implant result, so gum care often comes first." },
  ],
  orthodontics: [
    { title: "Your teeth are crowded, spaced or misaligned", text: "Aligners and braces straighten teeth for a healthier bite and a more even, confident smile." },
    { title: "You want a discreet option", text: "Clear aligners and hidden braces straighten teeth without the look of traditional metal." },
    { title: "You're an adult or a teen", text: "Orthodontics works at almost any age once the teeth and gums are healthy." },
  ],
  "oral-surgery": [
    { title: "You have a painful, impacted or damaged tooth", text: "Surgical care resolves impacted wisdom teeth, cysts and teeth that cannot be saved, gently and safely." },
    { title: "You want it done comfortably", text: "Procedures are carried out under local anaesthetic, with anaesthesiologist-monitored IV sedation available for anxious patients." },
    { title: "You need it planned around your travel", text: "We plan surgery from 3D imaging and time it so your recovery fits your trip." },
  ],
};

// ── Category default recovery timelines ─────────────────────────────────────
const RECOVERY_GENERIC: NamedPoint[] = [
  { title: "First 24–48 hours", text: "Any tenderness is normal and managed with simple pain relief and the written aftercare we give you. Stick to softer foods and keep the area clean." },
  { title: "First week", text: "Most patients return to normal activities quickly. Follow the care instructions and reach out to your coordinator with any questions." },
  { title: "Settling in", text: "Your treatment settles over the following weeks; we stay reachable remotely and arrange any review your case needs." },
];
const DEFAULT_RECOVERY: Record<string, NamedPoint[]> = {
  "oral-surgery": [
    { title: "Day of surgery", text: "Rest, apply a cold compress and take any prescribed medication. Light bleeding is normal; avoid rinsing vigorously." },
    { title: "Days 1–3", text: "Swelling peaks and settles. Keep to soft, lukewarm foods and gentle hygiene around the site." },
    { title: "First week", text: "Discomfort eases steadily; sutures dissolve or are removed. Most patients are comfortable to travel within this window." },
  ],
  endodontics: [
    { title: "First 24 hours", text: "Mild tenderness when biting is normal after the nerve is treated and settles with simple pain relief." },
    { title: "First week", text: "The tooth calms down quickly; you use it gently until any final crown protects it." },
    { title: "Restoration", text: "A treated tooth is usually crowned to restore full strength and prevent fracture, we plan this with you." },
  ],
};

// ── Category default maintenance ────────────────────────────────────────────
const DEFAULT_MAINTENANCE: Record<string, NamedPoint[]> = {
  "crowns-aesthetics": [
    { title: "Brush and floss daily", text: "Care for crowns and veneers exactly like natural teeth, keeping the gum margins clean and healthy." },
    { title: "Wear a nightguard if you grind", text: "A nightguard is the single best protection for ceramic restorations against clenching and grinding." },
    { title: "Regular hygiene visits", text: "Six-monthly professional cleaning keeps both your restorations and gums in top condition." },
  ],
  whitening: [
    { title: "Mind staining foods early on", text: "For the first couple of days, ease off coffee, tea, red wine and other strong colours while the effect settles." },
    { title: "Maintain with good hygiene", text: "Brushing, flossing and regular cleaning keep your brighter shade looking its best for longer." },
    { title: "Top up when needed", text: "A custom take-home kit lets you refresh your result occasionally without repeating the full treatment." },
  ],
  orthodontics: [
    { title: "Wear your retainer", text: "Retainers hold your new alignment, wearing them as advised is what keeps your results for life." },
    { title: "Keep appliances clean", text: "Clean aligners or braces carefully to protect both the appliance and the enamel underneath." },
    { title: "Regular check-ups", text: "Periodic reviews keep treatment on track and your teeth and gums healthy throughout." },
  ],
  periodontics: [
    { title: "Impeccable daily hygiene", text: "Brushing and interdental cleaning are the core of keeping gum disease controlled long term." },
    { title: "Maintenance cleanings", text: "Regular professional maintenance is essential after gum treatment to keep the disease from returning." },
    { title: "Don't smoke", text: "Smoking is a major driver of gum disease; stopping dramatically improves gum health and healing." },
  ],
};

// ── Category default stats (only where honest, general figures exist) ────────
const DEFAULT_STATS: Record<string, StatItem[]> = {
  implants: [
    { value: "95–98%", label: "Reported dental-implant survival at 10 years in the clinical literature" },
    { value: "20+ yrs", label: "Typical lifespan of well-integrated, well-maintained implants" },
    { value: "42,000+", label: "Implants placed by our surgical team, at a 98% success rate" },
  ],
};

// ── Category default cost note ──────────────────────────────────────────────
function defaultCostNote(category: string): string {
  const base =
    "Treatment in Tirana is delivered with the same premium materials and European clinical standards patients travel from across Europe for. ";
  const detail = CLINICAL.has(category)
    ? "Every plan depends on your individual case and the materials you choose, so we tailor it to you rather than a one-size-fits-all approach. "
    : "";
  return (
    base +
    detail +
    "You receive a single, clear written treatment plan up front, in your language, with nothing hidden, send a panoramic X-ray or CBCT and a few photos for a free, no-obligation plan within 24–48 hours."
  );
}

/**
 * Resolve every rich section for a treatment page. Per-service `content` wins;
 * category defaults fill the gaps. Category `process` supplies the step-by-step
 * when the service has no bespoke `steps`.
 */
export function resolveProcedureSections(
  service: CatalogueService,
  _category: CatalogueCategory | undefined,
  content: TreatmentContent,
  categoryProcess: NamedPoint[],
): ProcedureSections {
  const cat = service.category;
  return {
    specs: content.specs ?? defaultSpecs(service, content),
    steps: content.steps ?? categoryProcess ?? [],
    candidates: content.candidates ?? DEFAULT_CANDIDATES[cat] ?? [],
    recovery:
      content.recovery ?? DEFAULT_RECOVERY[cat] ?? (CLINICAL.has(cat) ? RECOVERY_GENERIC : []),
    stats: content.stats ?? DEFAULT_STATS[cat] ?? [],
    comparisons: content.comparisons ?? [],
    maintenance: content.maintenance ?? DEFAULT_MAINTENANCE[cat] ?? [],
    costNote: content.costNote ?? defaultCostNote(cat),
  };
}
