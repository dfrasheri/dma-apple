// Hand-authored RICH landing-page sections for flagship procedures.
// Merged LAST in getTreatmentContent (over base + auto-generated deep), so these
// win. Only the fields set here are overridden; everything else falls back to the
// deep/base copy, and any section left unset is filled by category defaults at
// render time (see catalogue-sections.ts). Voice: premium, honest, patient-first.
// NB: never state a fixed price (always the free written plan); never invent
// reviews; stats are phrased as general clinical-literature ranges, not claims
// about a specific patient.
import type { NamedPoint, StatItem, TreatmentContent } from "./catalogue-content";

const PLAN_CTA =
  "The honest answer is that it depends on your jaw, your bone and the materials you choose, so we give you a clear, personalised written treatment plan within 24–48 hours, with no obligation, once you send a panoramic X-ray or CBCT and a few photos.";

// ── Shared implant building blocks (full-arch cases reuse these) ─────────────
const IMPLANT_RECOVERY: NamedPoint[] = [
  { title: "Day of surgery", text: "You rest for a short while after placement, then leave, in suitable cases, with a fixed temporary bridge already in place. Expect some numbness that wears off, and follow the simple bite, cold-compress and medication instructions we hand you in writing." },
  { title: "Days 1–3", text: "Swelling and mild bruising peak around day two or three and are completely normal. You keep to a soft, lukewarm diet, avoid the surgical area when brushing, and take any prescribed anti-inflammatories and antibiotics exactly as directed." },
  { title: "Days 4–7", text: "Swelling begins to settle and most patients feel noticeably more themselves. You can usually fly home in this window; your coordinator times your return flight so you travel comfortably rather than the day after surgery." },
  { title: "Weeks 2–4", text: "The gum tissue heals over the implants and any sutures are removed or dissolve. You gradually reintroduce a wider range of soft foods while still protecting the temporary bridge from hard or sticky items." },
  { title: "Months 2–3", text: "Osseointegration is well underway, the bone is bonding directly to the implant surfaces. There is little to feel day to day; you simply keep the area impeccably clean and attend or send in any check we ask for." },
  { title: "Months 3–6", text: "The implants reach full integration and are ready to carry your definitive bridge. This is the biological reason full-arch treatment is normally split into two trips rather than rushed." },
  { title: "Month 6+, final teeth", text: "You return for the design and fitting of your permanent bridge in premium zirconia or layered ceramic, the strong, lifelike teeth you keep for the long term, fully documented in your treatment records." },
];

const FULLARCH_MAINTENANCE: NamedPoint[] = [
  { title: "Brush twice daily", text: "Clean your fixed bridge morning and night with a soft brush, exactly as you would natural teeth, paying attention to where the bridge meets the gum." },
  { title: "Clean underneath the bridge", text: "A water flosser and super-floss are your most important tools, they clear food and plaque from beneath the bridge, which a normal brush cannot reach. We show you the technique before you leave." },
  { title: "Antimicrobial rinse", text: "A short course of an antibacterial mouthrinse after surgery, and occasional use afterwards, helps keep the gum tissue around your implants healthy." },
  { title: "Professional maintenance", text: "Have your bridge and implants professionally checked and cleaned at least once a year. We can coordinate this with a dentist near your home between visits to us." },
  { title: "Protect against overload", text: "Avoid biting genuinely hard objects (ice, pens, bottle tops). If you grind or clench at night, we make a protective nightguard, the single best way to extend the life of the work." },
  { title: "Watch for warning signs", text: "Bleeding, persistent soreness, a loose feeling or an unusual smell are all reasons to contact us promptly. Caught early, almost every issue is simple to resolve." },
];

const FULLARCH_CANDIDATES: NamedPoint[] = [
  { title: "You've lost, or are about to lose, a full arch", text: "If most or all of the teeth in a jaw are missing, failing or unrestorable, a full-arch implant bridge rebuilds the whole arch on a fixed foundation rather than replacing teeth one by one." },
  { title: "You wear, or dread, a denture", text: "If you have a removable denture that moves, clicks or affects your taste and confidence, a fixed implant bridge is the definitive way to have teeth that stay put." },
  { title: "You have enough bone, or can be grafted", text: "Six well-distributed implants need adequate bone. Your CBCT scan tells us precisely; where volume is short, a graft or sinus lift, or angled placement, often makes treatment possible anyway." },
  { title: "You're generally healthy enough for oral surgery", text: "Most adults are suitable. Well-controlled conditions such as diabetes are usually fine; we simply review your medical history and medications carefully during planning." },
  { title: "You want a permanent result, not a temporary fix", text: "Full-arch implants are for patients who want to invest once in fixed, natural-feeling teeth that last for many years, rather than repeatedly adjusting or remaking a denture." },
];

const IMPLANT_STATS: StatItem[] = [
  { value: "95–98%", label: "Reported dental-implant survival at 10 years in the clinical literature", source: "Systematic reviews of long-term implant studies" },
  { value: "20+ yrs", label: "Typical lifespan of well-integrated, well-maintained implants" },
  { value: "10–15 yrs", label: "Typical service life of the prosthetic bridge before refurbishment" },
  { value: "42,000+", label: "Implants placed by our surgical team, at a 98% success rate" },
];

const COST_FULLARCH =
  "Full-arch implant treatment is planned around your needs, the plan depends on the number of implants, whether any extractions or grafting are needed, and the material of your final bridge (premium zirconia versus layered ceramic). What never changes is our transparency: you receive a single, clear written treatment plan up front, in your language, with nothing hidden or added later. " +
  PLAN_CTA;

export const RICH_CONTENT: Record<string, Partial<TreatmentContent>> = {
  // ─────────────────────────────────────────────────────────────────────────
  // PROFESSIONAL TEETH CLEANING (scale & polish) — human-rewritten sections
  // ─────────────────────────────────────────────────────────────────────────
  "teeth-cleaning": {
    steps: [
      { title: "Oral Examination", text: "We examine your teeth and gums, checking for plaque, tartar, gum health, and any early signs of dental disease." },
      { title: "Professional Cleaning", text: "Plaque, tartar, and stains are removed using ultrasonic technology before every tooth is polished to a smooth finish." },
      { title: "Prevention & Advice", text: "Before you leave, we explain how to maintain your results and recommend the right cleaning schedule based on your oral health." },
    ],
    candidates: [
      { title: "You have plaque, tartar, or staining", text: "Professional cleaning removes hardened deposits and stains that cannot be removed with brushing alone." },
      { title: "Your gums bleed or feel sensitive", text: "Bleeding or swollen gums are often early signs of gum disease. Early treatment helps prevent more serious problems." },
      { title: "You want fresher breath", text: "Removing plaque and bacteria improves oral hygiene and helps eliminate bad breath." },
      { title: "You're planning cosmetic or restorative treatment", text: "Healthy gums provide the best foundation for veneers, implants, crowns, and orthodontic treatment." },
    ],
    recovery: [
      { title: "Immediately After Treatment", text: "You can return to your normal routine straight after your appointment. Your mouth will feel cleaner and your teeth smoother." },
      { title: "First 24–48 hours", text: "Some patients notice mild sensitivity, especially around exposed roots. This usually settles within a day or two. For the best cosmetic result, avoid coffee, tea, red wine, tobacco, and other strongly coloured foods or drinks for a few hours after polishing." },
      { title: "Long-term", text: "Brushing, flossing, and regular professional cleanings will help maintain healthy gums and reduce future plaque build-up." },
    ],
    maintenance: [
      { title: "Brush twice a day", text: "Use a fluoride toothpaste and a soft-bristled toothbrush." },
      { title: "Clean between your teeth", text: "Floss or use interdental brushes every day to remove plaque between the teeth." },
      { title: "Attend regular cleanings", text: "Most patients benefit from a professional cleaning every six months. Some conditions may require more frequent maintenance." },
      { title: "Reduce smoking", text: "Smoking increases staining and the risk of gum disease while slowing healing. Quitting or reducing smoking improves both oral health and long-term results." },
    ],
    costNote:
      "Every treatment plan is tailored to your oral health and goals. If you are travelling from abroad, send us a panoramic X-ray (OPG) or CBCT scan together with a few photos of your teeth. Within 24–48 hours, our dentists will prepare a detailed written treatment plan free of charge so you can understand your treatment options before travelling.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ALL-ON-6 (SINGLE ARCH), the flagship, fully elaborated
  // ─────────────────────────────────────────────────────────────────────────
  "all-on-6-single": {
    intro:
      "All-on-6 rebuilds a complete arch of teeth on six dental implants, giving you a fixed, natural-looking smile that never comes out. The two extra implants, six instead of four, spread your bite force more evenly and add strength, which is why All-on-6 is our preferred full-arch solution wherever your bone allows it. In suitable cases you leave surgery the very same day with a fixed set of temporary teeth.",
    details: [
      "With All-on-6, six titanium implants are positioned in the jaw to act as the roots for a single fixed bridge that replaces every tooth in that arch. Because the load is shared across six anchor points rather than four, the restoration is exceptionally stable and better able to withstand strong chewing forces, a meaningful advantage for the upper jaw, for larger arches, and for anyone who grinds or clenches. It is the difference between teeth that simply work and teeth you stop thinking about.",
      "At Dental Med Austria the entire case is planned in three dimensions from a CBCT scan before we ever pick up an instrument. That digital plan lets our surgeons place each implant in the strongest available bone, safely around the nerves and sinuses, and, in most cases, fit a fixed temporary bridge on the same day as surgery, so you are never without teeth. After a healing period of three to six months, during which the implants fuse to your bone, you return for the definitive bridge in premium zirconia or hand-layered ceramic.",
      "Every All-on-6 case is carried out to ISO-9001, European-standard protocols by a team that has placed more than 42,000 implants. For our international patients the whole journey is handled end to end, a free remote plan before you travel, airport pickup, a multilingual coordinator, partner-hotel accommodation, and written treatment documentation you take home. The result is a permanent, confident smile delivered with premium-quality care.",
    ],
    benefits: [
      "Replaces a full arch of teeth on just six implants, fixed, never removable",
      "Six anchor points spread bite force for superior strength and long-term stability",
      "Fixed temporary teeth the same day as surgery in suitable cases, you're never without a smile",
      "Often avoids extensive grafting thanks to strategic, 3D-planned implant angles",
      "Premium zirconia or layered-ceramic final bridge, matched to your face and shade",
      "An implant passport with verifiable serial numbers and aftercare support after you return home",
    ],
    idealFor:
      "Patients missing most or all teeth in one jaw, or facing a denture, who have enough bone (or can be grafted) and want the strongest, most stable fixed full-arch restoration available.",
    specs: [
      { label: "Implants placed", value: "6 per arch" },
      { label: "Temporary teeth", value: "Same day (suitable cases)" },
      { label: "Final bridge", value: "After 3–6 months healing" },
      { label: "Typical trips to Tirana", value: "2" },
      { label: "Implant systems", value: "Straumann · Biodem · ETK" },
      { label: "Anaesthesia", value: "Local, with optional IV sedation" },
      { label: "Documentation", value: "Implant passport · serial numbers" },
      { label: "Standards", value: "ISO 9001 · European protocols" },
    ],
    steps: [
      { title: "Free consultation & 3D imaging", text: "It starts remotely: you send a panoramic X-ray or CBCT and photos, and we return a written plan. On arrival, an in-clinic CBCT captures your bone, nerves and sinuses in three dimensions." },
      { title: "Digital treatment planning", text: "Your surgeon plans the exact position and angle of all six implants on-screen, choosing the strongest bone and, where useful, tilting the back implants to avoid grafting." },
      { title: "Pre-surgical assessment", text: "We confirm your medical history, medications and bite, take a shade and design your temporary bridge, so everything is ready before surgery day." },
      { title: "Comfort & anaesthesia", text: "Treatment is carried out under local anaesthetic; anxious patients and longer cases can add anaesthesiologist-monitored IV sedation for complete comfort." },
      { title: "Extractions, if needed", text: "Any remaining hopeless teeth are removed gently in the same session, so you don't need a separate procedure or trip." },
      { title: "Strategic six-implant placement", text: "The six implants are placed precisely to the digital plan, distributing future bite forces evenly across the arch for maximum stability." },
      { title: "Multi-unit abutments", text: "Special connectors are fitted to the implants to carry the bridge at the correct angle and height, the engineering that lets a fixed bridge sit passively and last." },
      { title: "Same-day temporary bridge", text: "In suitable cases a fixed provisional bridge is secured the same day, so you leave with teeth you can smile with immediately while the implants heal beneath." },
      { title: "Healing & osseointegration", text: "Over three to six months the implants fuse with your bone. You go home with your temporaries and detailed aftercare, in touch with your coordinator throughout." },
      { title: "Final bridge design", text: "On your second trip we design your definitive bridge, shape, shade and proportion, in premium zirconia or hand-layered ceramic, for a result that looks and feels like your own teeth." },
      { title: "Fitting & bite refinement", text: "The final bridge is fitted and your bite meticulously adjusted so it feels balanced and natural, then secured to the multi-unit abutments." },
      { title: "Follow-up & documentation", text: "You leave with cleaning tools, a written aftercare plan and your full treatment documentation, plus remote support whenever you need us." },
    ],
    candidates: FULLARCH_CANDIDATES,
    recovery: IMPLANT_RECOVERY,
    stats: IMPLANT_STATS,
    comparisons: [
      { heading: "All-on-6 vs All-on-4, which is right for you?", body: "Neither is universally 'better'. All-on-4 restores a full arch on four implants and is ideal where bone is limited, often avoiding grafting. All-on-6 adds two implants for greater strength and a more even spread of bite force, our preference for the upper jaw, larger arches and heavy bite forces, provided you have the bone to support it. Your CBCT scan makes the recommendation clear, and we always advise the option that genuinely fits your anatomy rather than the most expensive one." },
      { heading: "Upper jaw vs lower jaw", body: "The upper jaw (maxilla) is softer and sits close to the sinuses, so the extra support of six implants is especially valuable there and a sinus lift is sometimes part of the plan. The lower jaw (mandible) is denser and often achieves very high primary stability, making same-day fixed temporaries particularly predictable. When both arches are treated, we sequence them for your comfort and the best final bite." },
      { heading: "Fixed bridge vs removable denture", body: "An All-on-6 bridge is fixed, it is cleaned in your mouth and never removed by you, feels close to natural teeth, and preserves bone by loading the jaw. A denture is removable, rests on the gum, tends to loosen over time and does nothing to stop bone shrinking. For most patients seeking a permanent solution, fixed is transformative." },
    ],
    maintenance: FULLARCH_MAINTENANCE,
    costNote: COST_FULLARCH,
    faqs: [
      { q: "Why choose All-on-6 instead of All-on-4?", a: "All-on-6 uses two additional implants, which spread bite force more evenly and add strength and stability, an advantage in the softer upper jaw, in larger arches, and for patients with strong bite forces. Where bone is limited, All-on-4 may be the better and equally valid choice. We recommend the option that suits your anatomy, confirmed by a CBCT scan." },
      { q: "How long does All-on-6 surgery take?", a: "Placement of the six implants for one arch typically takes a few hours, often with a fixed temporary bridge fitted the same day. The definitive bridge is made after a healing period of three to six months, which is why the treatment is usually completed over two trips." },
      { q: "Can I have All-on-6 if I have bone loss?", a: "Very often, yes. Angled placement of the rear implants can avoid grafting altogether, and where more bone is needed a graft or sinus lift makes treatment possible. Your CBCT scan tells us exactly what your case requires, and we'll tell you honestly before you travel." },
      { q: "What if one implant fails?", a: "Implant survival is high, around 95–98% at ten years in the literature, and with six implants the bridge has built-in redundancy. In the rare event an implant does not integrate, our team assesses the site and plans its replacement, staying in close contact with you throughout the follow-up." },
      { q: "How natural do All-on-6 teeth look and feel?", a: "The final bridge is individually designed for your face, lip line and skin tone in premium zirconia or hand-layered ceramic, then the bite is refined so it feels balanced. Most patients say it looks and functions like a healthy natural set of teeth, many find they eat foods they had avoided for years." },
      { q: "Will I have teeth on the same day?", a: "In most cases, yes. When the implants achieve enough primary stability, we fit a fixed temporary bridge the same day, so you are never without teeth. If your bone needs longer to heal first, we tell you in advance and plan accordingly." },
      { q: "How soon can I eat and travel normally?", a: "You keep to a soft diet while the implants integrate, gradually returning to normal foods with the final bridge. Most patients fly home four to seven days after surgery; your coordinator schedules your return flight so you travel comfortably." },
      { q: "How is All-on-6 planned in Albania?", a: "Every case is planned around you, your plan depends on extractions, any grafting and your final-bridge material. We give you a single, clear written treatment plan up front, send an X-ray or CBCT and photos for a free personalised plan within 24–48 hours." },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ALL-ON-4 (SINGLE ARCH), money page, full section set
  // ─────────────────────────────────────────────────────────────────────────
  "all-on-4-single": {
    specs: [
      { label: "Implants placed", value: "4 per arch" },
      { label: "Temporary teeth", value: "Same day (suitable cases)" },
      { label: "Final bridge", value: "After 3–6 months healing" },
      { label: "Typical trips to Tirana", value: "2" },
      { label: "Implant systems", value: "Straumann · Biodem · ETK" },
      { label: "Anaesthesia", value: "Local, with optional IV sedation" },
      { label: "Documentation", value: "Implant passport · serial numbers" },
      { label: "Grafting", value: "Often avoided (angled implants)" },
    ],
    steps: [
      { title: "Free remote plan & CBCT", text: "Send an X-ray or CBCT and photos for a written plan, then have a 3D scan on arrival that maps your bone, nerves and sinuses." },
      { title: "Digital surgical planning", text: "Four implants are planned on-screen, the two rear ones tilted to engage solid bone and, in most cases, avoid the need for grafting." },
      { title: "Comfort & anaesthesia", text: "Local anaesthetic keeps you comfortable; IV sedation by an anaesthesiologist is available for anxious patients or longer sessions." },
      { title: "Extractions, if needed", text: "Any failing teeth are removed in the same appointment, so treatment stays within one surgical visit." },
      { title: "Four-implant placement", text: "The implants are placed to the digital plan, angled for maximum contact with your available bone." },
      { title: "Same-day fixed temporaries", text: "In suitable cases a fixed provisional bridge goes in the same day, you leave with a full smile while the implants heal." },
      { title: "Healing & osseointegration", text: "The implants fuse to bone over three to six months; you return home with your temporaries and full aftercare support." },
      { title: "Definitive bridge", text: "On your second trip the final zirconia or layered-ceramic bridge is designed, fitted and bite-balanced, then secured for the long term." },
    ],
    candidates: FULLARCH_CANDIDATES,
    recovery: IMPLANT_RECOVERY,
    stats: IMPLANT_STATS,
    comparisons: [
      { heading: "All-on-4 vs All-on-6", body: "All-on-4 rebuilds a full arch on four implants and is the ideal, well-documented solution where bone is limited, the tilted rear implants often remove the need for grafting entirely. All-on-6 adds two implants for extra strength where the bone allows. Both are excellent; your CBCT scan and bite decide which we recommend, and we're honest about it." },
      { heading: "All-on-4 vs a removable denture", body: "All-on-4 is fixed, it stays in, feels close to natural teeth and preserves jawbone by loading it. A denture is removable, can slip, and lets bone shrink over time. For most patients, moving from a denture to a fixed All-on-4 bridge is genuinely life-changing." },
    ],
    maintenance: FULLARCH_MAINTENANCE,
    costNote: COST_FULLARCH,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ALL-ON-6 (BOTH ARCHES), top-tier full mouth
  // ─────────────────────────────────────────────────────────────────────────
  "all-on-6-both": {
    specs: [
      { label: "Implants placed", value: "12 (6 per jaw)" },
      { label: "Final restorations", value: "2 fixed bridges" },
      { label: "Temporary teeth", value: "Same day (suitable cases)" },
      { label: "Typical trips to Tirana", value: "2" },
      { label: "Implant systems", value: "Straumann · Biodem · ETK" },
      { label: "Anaesthesia", value: "Local, with optional IV sedation" },
      { label: "Documentation", value: "Implant passport · serial numbers" },
      { label: "Standards", value: "ISO 9001 · European protocols" },
    ],
    candidates: FULLARCH_CANDIDATES,
    recovery: IMPLANT_RECOVERY,
    stats: IMPLANT_STATS,
    comparisons: [
      { heading: "Why six per jaw for a full mouth", body: "Restoring both arches is the most demanding case a mouth can present, and twelve implants, six per jaw, give the strongest, most evenly loaded foundation we offer. It's the option we recommend for patients who want maximum longevity and have the bone to support it." },
      { heading: "Treated together or in stages?", body: "Both jaws are usually treated in the same surgical visit for efficiency and a single healing period, then both final bridges are fitted on your second trip. Where your case calls for it, we stage the arches for comfort, your plan spells this out before you travel." },
    ],
    maintenance: FULLARCH_MAINTENANCE,
    costNote: COST_FULLARCH,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ALL-ON-4 (BOTH ARCHES), full mouth
  // ─────────────────────────────────────────────────────────────────────────
  "all-on-4-both": {
    specs: [
      { label: "Implants placed", value: "8 (4 per jaw)" },
      { label: "Final restorations", value: "2 fixed bridges" },
      { label: "Temporary teeth", value: "Same day (suitable cases)" },
      { label: "Typical trips to Tirana", value: "2" },
      { label: "Implant systems", value: "Straumann · Biodem · ETK" },
      { label: "Anaesthesia", value: "Local, with optional IV sedation" },
      { label: "Documentation", value: "Implant passport · serial numbers" },
      { label: "Grafting", value: "Often avoided (angled implants)" },
    ],
    candidates: FULLARCH_CANDIDATES,
    recovery: IMPLANT_RECOVERY,
    stats: IMPLANT_STATS,
    maintenance: FULLARCH_MAINTENANCE,
    costNote: COST_FULLARCH,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SINGLE IMPLANT + CROWN, the most common implant case
  // ─────────────────────────────────────────────────────────────────────────
  "single-implant-crown": {
    specs: [
      { label: "Implants placed", value: "1" },
      { label: "Restoration", value: "Custom abutment + crown" },
      { label: "Crown material", value: "Zirconia or Ivoclar E-max" },
      { label: "Typical trips to Tirana", value: "2 (or 1 with immediate cases)" },
      { label: "Healing", value: "~3 months to final crown" },
      { label: "Anaesthesia", value: "Local" },
      { label: "Documentation", value: "Implant passport · serial numbers" },
    ],
    steps: [
      { title: "Assessment & 3D scan", text: "A CBCT scan confirms you have the bone for an implant and lets us plan its exact position around nerves and neighbouring roots." },
      { title: "Implant placement", text: "The titanium implant is placed into the gap in a short, comfortable appointment under local anaesthetic." },
      { title: "Healing & integration", text: "Over roughly three months the implant fuses with your bone, the biology that makes it as solid as a natural root." },
      { title: "Abutment & impression", text: "A custom abutment is fitted and a precise digital impression taken so your crown is built to match your bite and smile." },
      { title: "Crown fitting", text: "Your individually shade-matched zirconia or E-max crown is fitted and adjusted for a seamless, natural result." },
    ],
    candidates: [
      { title: "You're missing a single tooth", text: "An implant replaces one tooth from the root up without touching the healthy teeth on either side, unlike a conventional bridge, which must be ground down." },
      { title: "You want to protect your other teeth", text: "Because it stands alone, an implant preserves neighbouring teeth and stops them drifting into the gap." },
      { title: "You'd rather not have a denture or bridge", text: "For a single gap, an implant is the most tooth-like, permanent and low-maintenance solution available." },
    ],
    recovery: [
      { title: "First 48 hours", text: "Mild tenderness around the site is normal and settles with simple pain relief and a soft diet. There is rarely significant swelling for a single implant." },
      { title: "First week", text: "You return to normal activities quickly; keep the area clean and avoid chewing directly on it while it heals." },
      { title: "Months 1–3", text: "The implant integrates quietly with the bone. There's little to feel, you simply keep it clean until the crown is fitted." },
    ],
    stats: IMPLANT_STATS,
    comparisons: [
      { heading: "Implant vs conventional bridge", body: "A traditional bridge replaces one tooth by crowning the two healthy teeth beside the gap, permanently altering them. A single implant replaces just the missing tooth, leaves the neighbours untouched, and, unlike a bridge, preserves the bone under the gap. It typically outlasts a bridge and is easier to keep clean." },
    ],
    maintenance: [
      { title: "Brush and floss normally", text: "Care for your implant crown exactly like a natural tooth, brush twice a day and floss around it, paying attention to the gumline." },
      { title: "Annual professional check", text: "See a dentist once a year so the implant, crown and gum can be checked and cleaned professionally." },
      { title: "Protect from grinding", text: "If you clench or grind, a nightguard protects both your implant crown and your natural teeth." },
    ],
    costNote:
      "A single implant plus its custom abutment and crown is planned as a complete tooth, implant, abutment and crown, in one clear treatment plan rather than as separate, piecemeal steps. " +
      PLAN_CTA,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // STRAUMANN BLX, flagship premium implant
  // ─────────────────────────────────────────────────────────────────────────
  "straumann-blx-implant": {
    specs: [
      { label: "System", value: "Straumann BLX (Switzerland)" },
      { label: "Design", value: "Fully tapered, immediate-load capable" },
      { label: "Traceability", value: "Implant passport · serial numbers" },
      { label: "Same-day tooth", value: "Possible in suitable cases" },
      { label: "Typical trips to Tirana", value: "1–2" },
      { label: "Anaesthesia", value: "Local" },
      { label: "Evidence", value: "Most documented system worldwide" },
    ],
    candidates: [
      { title: "You want the best-documented system", text: "Straumann is the most clinically researched implant brand in the world, the choice for patients who want maximum long-term evidence behind their investment." },
      { title: "You're a candidate for immediate loading", text: "The fully tapered BLX often achieves the primary stability needed for a same-day temporary tooth in suitable cases." },
      { title: "You value full traceability", text: "Every BLX implant is recorded in your implant passport with verifiable serial numbers, alongside our documented ISO 9001 clinical protocols." },
    ],
    stats: IMPLANT_STATS,
    comparisons: [
      { heading: "Straumann BLX vs mid-premium implants", body: "Every implant we place is a genuine, certified European or Swiss system placed to the same clinical standard. The Straumann BLX sits at the very top: Swiss-made and the most researched design available. Our German Biodem system offers excellent European engineering in the refined mid-premium tier. Both are dependable, the BLX is for patients who specifically want the world's most trusted name." },
    ],
    costNote:
      "The Straumann BLX is our flagship premium system, chosen by patients who want the world's most documented implant, planned individually around your case. " +
      PLAN_CTA,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HOLLYWOOD SMILE (16 VENEERS), flagship aesthetic
  // ─────────────────────────────────────────────────────────────────────────
  "hollywood-smile-16": {
    specs: [
      { label: "Veneers", value: "16 (8 upper · 8 lower)" },
      { label: "Materials", value: "Ivoclar E-max / layered ceramic" },
      { label: "Design", value: "Digital Smile Design preview first" },
      { label: "Typical trips to Tirana", value: "1–2" },
      { label: "Preparation", value: "Minimal, enamel-preserving" },
      { label: "Craftsmanship", value: "In-house lab · Ivoclar ceramics" },
    ],
    steps: [
      { title: "Smile design & preview", text: "We photograph and scan your smile and design it digitally, often with a physical mock-up, so you see and approve the shape, proportion and shade before any treatment begins." },
      { title: "Gentle preparation", text: "A minimal, enamel-preserving amount of tooth surface is prepared across the smile zone, and a precise digital impression is taken." },
      { title: "Temporary veneers", text: "You wear natural-looking temporaries that follow the approved design while our in-house ceramists craft the finals." },
      { title: "Hand-crafted fabrication", text: "Your veneers are made in premium Ivoclar E-max or hand-layered ceramic by our master ceramists for lifelike translucency." },
      { title: "Bonding & finishing", text: "The veneers are precisely bonded, the bite balanced and the surfaces polished for a durable, radiant, camera-ready finish." },
    ],
    candidates: [
      { title: "You want a complete smile transformation", text: "Sixteen veneers redesign the whole visible smile, colour, shape, alignment and harmony, in one coordinated plan." },
      { title: "Your teeth are stained, chipped, worn or uneven", text: "Veneers correct discolouration, small gaps, chips and mild misalignment that whitening or single fixes can't fully address." },
      { title: "Your teeth and gums are healthy", text: "Veneers are an aesthetic layer over sound teeth. We treat any decay or gum issues first so the result lasts." },
    ],
    stats: [
      { value: "16", label: "Veneers across the full smile zone (8 upper, 8 lower)" },
      { value: "E-max", label: "Premium Ivoclar ceramic, hand-finished in our in-house lab" },
      { value: "1–2", label: "Trips to Tirana, depending on your schedule" },
    ],
    comparisons: [
      { heading: "16 vs 20 veneers", body: "Sixteen veneers cover the teeth most people show in a full smile (the front eight upper and lower). Twenty extend further back to the premolars for those with a very wide smile. A quick smile-design assessment shows exactly how many teeth you reveal when you smile broadly, so you fit the right number rather than over- or under-treating." },
      { heading: "Veneers vs crowns", body: "Veneers are thin shells bonded to the front of largely healthy teeth, preserving most of the natural tooth. Crowns cover the whole tooth and suit teeth that are heavily filled, root-treated or broken down. For a primarily cosmetic makeover on sound teeth, veneers are the more conservative, tooth-preserving choice." },
    ],
    maintenance: [
      { title: "Brush and floss daily", text: "Care for veneers like natural teeth; good hygiene keeps the gum margins healthy and the result looking its best." },
      { title: "Wear a nightguard if you grind", text: "The single most important protection, a nightguard shields veneers from the forces of clenching and grinding." },
      { title: "Avoid using teeth as tools", text: "Don't bite nails, pens or bottle tops; veneers are strong but not indestructible." },
      { title: "Regular professional cleaning", text: "Six-monthly hygiene visits keep both veneers and gums in top condition for the long term." },
    ],
    costNote:
      "A full Hollywood Smile in Tirana is crafted in premium Ivoclar E-max or hand-layered ceramic in our own lab. Your plan depends on the number and material of the veneers. " +
      PLAN_CTA,
  },
};
