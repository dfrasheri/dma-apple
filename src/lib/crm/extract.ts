/**
 * Structured fact extraction from a social post, turns a free-text caption into
 * typed, filterable rows with a confidence score and a conflict flag.
 *
 * This is a DETERMINISTIC mock of the LLM extraction step. It is intentionally
 * conservative: ambiguous captions get low confidence and/or a conflict flag so
 * the HIL review queue catches them. The exported parsers are reused by `bot.ts`
 * to understand an incoming question with the SAME vocabulary.
 *
 * REAL API SEAM: swap `extractFacts` for a Claude call returning the same
 * `ExtractedFact[]` shape (caption → JSON), and run OCR on `mediaUrl` for text
 * baked into the image. The reconcile + HIL pipeline downstream is unchanged.
 */
import type { FactType } from "./types";

export type ExtractedFact = {
  type: FactType;
  city?: string;
  venue?: string;
  date?: string; // ISO YYYY-MM-DD
  procedure?: string;
  doctor?: string;
  payload?: Record<string, unknown>;
  confidence: number; // 0–1
  conflictFlag: boolean;
  conflictReason?: string;
};

// ── vocabularies ─────────────────────────────────────────────────────────────
// Order matters for the "longest match consumes the span" logic below, keep the
// most specific entries first so "Venice Beach" wins over "Venice".
const KNOWN_CITIES = [
  "Venice Beach",
  "Beverly Hills",
  "Los Angeles",
  "New York",
  "Abu Dhabi",
  "Venice",
  "Istanbul",
  "Tirana",
  "Milan",
  "Rome",
  "Florence",
  "Antalya",
  "Izmir",
  "Dubai",
  "London",
  "Manchester",
  "Paris",
  "Berlin",
  "Munich",
  "Zurich",
  "Geneva",
  "Vienna",
  "Athens",
  "Belgrade",
  "Sofia",
  "Bucharest",
  "Budapest",
  "Prague",
  "Amsterdam",
  "Madrid",
  "Barcelona",
  "Lisbon",
  "Stockholm",
  "Copenhagen",
  "Dublin",
  "Miami"
].sort((a, b) => b.length - a.length);

/** Cities whose bare name is geographically ambiguous (Venice IT vs Venice Beach US). */
const AMBIGUOUS_CITIES = new Set(["venice"]);

const KNOWN_PROCEDURES = [
  "laser liposuction",
  "zirconium crowns",
  "dental implants",
  "hair transplant",
  "hollywood smile",
  "breast augmentation",
  "tummy tuck",
  "mesotherapy",
  "rhinoplasty",
  "liposuction",
  "zirconium",
  "implants",
  "veneers",
  "facelift",
  "fillers",
  "botox",
  "exosomes",
  "ozone",
  "eboo",
  "lesc",
  "lav",
  "mct",
  "prp",
  "fue",
  "dhi",
  "ivf",
  "bbl"
].sort((a, b) => b.length - a.length);

const MONTHS: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12
};
const MONTH_RE = Object.keys(MONTHS).join("|");

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const clamp01 = (n: number) => Math.max(0.02, Math.min(0.98, n));
const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

function iso(y: number, m: number, d: number): string | null {
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// ── parsers (also used by bot.ts) ────────────────────────────────────────────
/** Distinct known cities in the text, longest-match first so Venice ≠ Venice Beach. */
export function parseCities(text: string): string[] {
  let work = ` ${text} `;
  const found: string[] = [];
  for (const city of KNOWN_CITIES) {
    const re = new RegExp(`\\b${escape(city)}\\b`, "i");
    if (re.test(work)) {
      found.push(city);
      work = work.replace(new RegExp(`\\b${escape(city)}\\b`, "gi"), " ");
    }
  }
  return found;
}

export function parseProcedures(text: string): string[] {
  let work = ` ${text} `;
  const found: string[] = [];
  for (const proc of KNOWN_PROCEDURES) {
    const re = new RegExp(`\\b${escape(proc)}\\b`, "i");
    if (re.test(work)) {
      found.push(proc);
      work = work.replace(new RegExp(`\\b${escape(proc)}\\b`, "gi"), " ");
    }
  }
  return found;
}

export function parseDoctor(text: string): string | null {
  const m = text.match(/\bdr\.?\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/);
  return m ? `Dr. ${m[1]}` : null;
}

/** Every distinct ISO date found (handles ISO, "July 4", "4 July", dd.mm.yyyy). */
export function parseDates(text: string, refYear = 2026): string[] {
  const out = new Set<string>();

  for (const m of text.matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b/g)) {
    const d = iso(+m[1], +m[2], +m[3]);
    if (d) out.add(d);
  }
  // Month D[, YYYY]
  for (const m of text.matchAll(
    new RegExp(`\\b(${MONTH_RE})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:?\\s+(\\d{4}))?`, "gi")
  )) {
    const d = iso(m[3] ? +m[3] : refYear, MONTHS[m[1].toLowerCase()], +m[2]);
    if (d) out.add(d);
  }
  // D[th] [of] Month [YYYY]
  for (const m of text.matchAll(
    new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?(${MONTH_RE})\\.?(?:?\\s+(\\d{4}))?`, "gi")
  )) {
    const d = iso(m[3] ? +m[3] : refYear, MONTHS[m[2].toLowerCase()], +m[1]);
    if (d) out.add(d);
  }
  // dd.mm.yyyy / dd/mm/yyyy (day-first, European)
  for (const m of text.matchAll(/\b(\d{1,2})[./](\d{1,2})[./](\d{2,4})\b/g)) {
    const y = +m[3] < 100 ? 2000 + +m[3] : +m[3];
    const d = iso(y, +m[2], +m[1]);
    if (d) out.add(d);
  }
  return [...out];
}

export type ParsedPrice = { amount: number; currency: string; raw: string };
export function parsePrices(text: string): ParsedPrice[] {
  const out: ParsedPrice[] = [];
  const sym: Record<string, string> = { "€": "EUR", $: "USD", "£": "GBP" };
  for (const m of text.matchAll(/([€$£])\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?)/g)) {
    out.push({
      currency: sym[m[1]],
      amount: Number(m[2].replace(/[.,](?=\d{3}\b)/g, "").replace(",", ".")),
      raw: m[0]
    });
  }
  for (const m of text.matchAll(/\b(\d{3,6})\s?(eur|euros?|usd|gbp|dollars?)\b/gi)) {
    const cur = /eur/i.test(m[2]) ? "EUR" : /gbp/i.test(m[2]) ? "GBP" : "USD";
    out.push({ currency: cur, amount: Number(m[1]), raw: m[0] });
  }
  return out;
}

// ── the extractor ────────────────────────────────────────────────────────────
export function extractFacts(post: {
  caption?: string | null;
  mediaUrl?: string | null;
  postTimestamp?: string | number | Date | null;
}): ExtractedFact[] {
  const text = (post.caption ?? "").trim();
  if (!text) return [];

  const refYear = post.postTimestamp
    ? new Date(post.postTimestamp).getFullYear() || 2026
    : 2026;

  const cities = parseCities(text);
  const dates = parseDates(text, refYear);
  const procedures = parseProcedures(text);
  const doctor = parseDoctor(text) ?? undefined;
  const prices = parsePrices(text);

  const isOpenDay = /\bopen\s?(day|house|days)\b|open[- ]door/i.test(text);
  const isPromo = /(\d{1,2}\s?%|percent)|discount|special offer|promo|sale\b/i.test(text);

  const facts: ExtractedFact[] = [];
  const ambiguousCity = cities.find((c) => AMBIGUOUS_CITIES.has(c.toLowerCase()));
  const cityHasCountryHint = /\bitaly|italia|usa|u\.s\.|california|veneto\b/i.test(text);

  // OPEN DAY, one fact per distinct city (Venice and Venice Beach split here).
  if (isOpenDay) {
    const targetCities = cities.length ? cities : [undefined];
    for (const city of targetCities) {
      let confidence = 0.5;
      let conflictFlag = false;
      let conflictReason: string | undefined;

      if (dates.length === 1) confidence += 0.2;
      else if (dates.length === 0) confidence -= 0.25;
      else {
        // multiple dates → which one is THE open day? Caption-vs-overlay style conflict.
        conflictFlag = true;
        conflictReason = `Multiple dates in caption (${dates.join(", ")})`;
        confidence -= 0.3;
      }
      if (city) confidence += 0.15;
      if (procedures.length) confidence += 0.1;
      if (city && AMBIGUOUS_CITIES.has(city.toLowerCase()) && !cityHasCountryHint) {
        confidence -= 0.1;
        conflictReason = conflictReason
          ? `${conflictReason}; ambiguous city "${city}"`
          : `Ambiguous city "${city}", no country given`;
      }

      facts.push({
        type: "open_day",
        city,
        date: dates[0],
        procedure: procedures[0] && titleCase(procedures[0]),
        doctor,
        payload: dates.length > 1 ? { candidateDates: dates } : undefined,
        confidence: clamp01(confidence),
        conflictFlag,
        conflictReason
      });
    }
  }

  // PRICE, one fact per price mentioned.
  for (const price of prices) {
    let confidence = 0.6;
    if (procedures.length) confidence += 0.12;
    if (cities.length) confidence += 0.08;
    facts.push({
      type: "price",
      city: cities[0],
      procedure: procedures[0] && titleCase(procedures[0]),
      payload: { amount: price.amount, currency: price.currency, raw: price.raw },
      confidence: clamp01(confidence),
      conflictFlag: false
    });
  }

  // PROMO
  if (isPromo) {
    facts.push({
      type: "promo",
      city: cities[0],
      procedure: procedures[0] && titleCase(procedures[0]),
      date: dates[0],
      payload: { caption: text.slice(0, 180) },
      confidence: clamp01(0.45 + (dates.length === 1 ? 0.1 : 0)),
      conflictFlag: false
    });
  }

  // Fallback, something locational/service-y but no strong intent.
  if (!facts.length) {
    const hasSignal = cities.length || procedures.length;
    facts.push({
      type: cities.length ? "location" : procedures.length ? "service" : "general",
      city: cities[0],
      procedure: procedures[0] && titleCase(procedures[0]),
      doctor,
      payload: { caption: text.slice(0, 180) },
      confidence: clamp01(hasSignal ? 0.4 : 0.2),
      conflictFlag: false
    });
  }

  if (ambiguousCity) {
    for (const f of facts) {
      if (f.city && AMBIGUOUS_CITIES.has(f.city.toLowerCase()) && !cityHasCountryHint) {
        f.conflictFlag = f.conflictFlag || f.type === "open_day";
      }
    }
  }

  return facts;
}
