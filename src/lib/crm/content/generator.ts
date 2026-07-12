/**
 * SEO + GEO content-calendar generator (pure, deterministic, no I/O).
 *
 * Given a year + month it produces a month of blog topics, each:
 *  - in a native title across every content locale (en/sq/it/de/fr),
 *  - shaped for a primary channel, SEO (rank) or GEO (get cited by AI engines),
 *  - tied to a real subject (catalogue category / service / strategic theme),
 *  - targeted at a geographic market for outreach,
 *  - with a schema.org type + an editorial brief (H2 outline + SEO/GEO guidance).
 *
 * Deterministic: same (year, month, seed) → same calendar, so a "regenerate" is
 * reproducible and idempotent. Titles are templated from a curated, native
 * vocabulary rather than machine-translated, so they read correctly in each
 * language; the admin edits before publishing (HIL).
 *
 * This is the deterministic baseline. An LLM pass can later enrich the briefs
 * behind the same interface (see `GeneratedTopic`), but the engine never
 * *needs* an external call to produce a usable calendar.
 */
import type {
  ContentChannel,
  ContentFormat,
  ContentLocale,
  ContentSchemaType
} from "@/lib/crm/types";
import { CONTENT_LOCALES } from "@/lib/crm/types";

// ── output shape ─────────────────────────────────────────────────────────────
export type GeneratedVariant = {
  locale: ContentLocale;
  title: string;
  slug: string;
  metaDescription: string;
};

export type GeneratedTopic = {
  slotDay: number; // 1..daysInMonth
  format: ContentFormat;
  channel: ContentChannel;
  market: string;
  subject: string; // subject id
  keyword: string;
  schemaType: ContentSchemaType;
  brief: string[];
  variants: GeneratedVariant[];
};

// ── tiny seeded RNG (mulberry32) ─────────────────────────────────────────────
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── localized vocabulary ─────────────────────────────────────────────────────
type LocaleMap = Record<ContentLocale, string>;

/** "in Albania", placed by the templates. */
const PLACE: LocaleMap = {
  en: "in Albania",
  sq: "në Shqipëri",
  it: "in Albania",
  de: "in Albanien",
  fr: "en Albanie"
};

/** Subjects = what a post is about. `noun` is used inside titles. */
type Subject = {
  id: string;
  /** maps loosely to a catalogue category / blog theme for internal linking */
  topic: string;
  keyword: string; // English base keyword
  noun: LocaleMap;
  /** medical procedure → MedicalWebPage schema is appropriate */
  medical?: boolean;
};

const SUBJECTS: Subject[] = [
  {
    id: "dental-implants",
    topic: "implants",
    keyword: "dental implants in albania",
    medical: true,
    noun: { en: "Dental Implants", sq: "Implantet Dentare", it: "gli Impianti Dentali", de: "Zahnimplantate", fr: "les Implants Dentaires" }
  },
  {
    id: "all-on-4",
    topic: "implants",
    keyword: "all-on-4 implants albania",
    medical: true,
    noun: { en: "All-on-4 Implants", sq: "Implantet All-on-4", it: "gli Impianti All-on-4", de: "All-on-4 Implantate", fr: "les Implants All-on-4" }
  },
  {
    id: "dental-crowns",
    topic: "crowns-aesthetics",
    keyword: "dental crowns in albania",
    medical: true,
    noun: { en: "Dental Crowns", sq: "Kurorat Dentare", it: "le Corone Dentali", de: "Zahnkronen", fr: "les Couronnes Dentaires" }
  },
  {
    id: "veneers",
    topic: "crowns-aesthetics",
    keyword: "veneers in albania",
    medical: true,
    noun: { en: "Veneers", sq: "Faetat (Veneers)", it: "le Faccette Dentali", de: "Veneers", fr: "les Facettes Dentaires" }
  },
  {
    id: "dental-prostheses",
    topic: "crowns-aesthetics",
    keyword: "dentures and prostheses albania",
    medical: true,
    noun: { en: "Dentures & Prostheses", sq: "Protezat Dentare", it: "le Protesi Dentali", de: "Zahnprothesen", fr: "les Prothèses Dentaires" }
  },
  {
    id: "orthodontics",
    topic: "orthodontics",
    keyword: "invisalign and braces albania",
    medical: true,
    noun: { en: "Invisalign & Braces", sq: "Invisalign dhe Aparatet", it: "Invisalign e gli Apparecchi", de: "Invisalign & Zahnspangen", fr: "Invisalign et les Appareils" }
  },
  {
    id: "teeth-whitening",
    topic: "whitening",
    keyword: "teeth whitening albania",
    medical: true,
    noun: { en: "Teeth Whitening", sq: "Zbardhimi i Dhëmbëve", it: "lo Sbiancamento Dentale", de: "die Zahnaufhellung", fr: "le Blanchiment Dentaire" }
  },
  {
    id: "root-canal",
    topic: "endodontics",
    keyword: "root canal treatment albania",
    medical: true,
    noun: { en: "Root Canal Treatment", sq: "Trajtimi i Kanalit", it: "la Devitalizzazione", de: "die Wurzelbehandlung", fr: "le Traitement de Canal" }
  },
  {
    id: "dental-tourism",
    topic: "tourism",
    keyword: "dental tourism albania",
    noun: { en: "Dental Tourism", sq: "Turizmi Dentar", it: "il Turismo Dentale", de: "Zahntourismus", fr: "le Tourisme Dentaire" }
  },
  {
    id: "cost-savings",
    topic: "tourism",
    keyword: "cost of dental treatment albania",
    noun: { en: "the Value of Dental Treatment", sq: "Vlera e Trajtimit Dentar", it: "il Valore delle Cure Dentali", de: "der Wert einer Zahnbehandlung", fr: "la Valeur des Soins Dentaires" }
  },
  {
    id: "quality-safety",
    topic: "warranties",
    keyword: "safe dental clinic albania",
    noun: { en: "Safe, Premium-Quality Dental Care", sq: "Kujdes Dentar i Sigurt me Cilësi Premium", it: "Cure Dentali Sicure di Qualità Premium", de: "sichere Zahnmedizin in Premium-Qualität", fr: "des Soins Dentaires Sûrs de Qualité Premium" }
  },
  {
    id: "best-clinic",
    topic: "warranties",
    keyword: "best dental clinic in albania",
    noun: { en: "the Best Dental Clinic", sq: "Klinika Më e Mirë Dentare", it: "la Migliore Clinica Dentale", de: "die beste Zahnklinik", fr: "la Meilleure Clinique Dentaire" }
  }
];

/** Geographic outreach markets. `rival` is the localized "vs X" comparison anchor. */
type Market = { id: string; rival: LocaleMap };
const MARKETS: Market[] = [
  { id: "switzerland", rival: { en: "Switzerland", sq: "Zvicrën", it: "la Svizzera", de: "der Schweiz", fr: "la Suisse" } },
  { id: "germany", rival: { en: "Germany", sq: "Gjermaninë", it: "la Germania", de: "Deutschland", fr: "l'Allemagne" } },
  { id: "hungary", rival: { en: "Hungary", sq: "Hungarinë", it: "l'Ungheria", de: "Ungarn", fr: "la Hongrie" } },
  { id: "italy", rival: { en: "Italy", sq: "Italinë", it: "l'Italia", de: "Italien", fr: "l'Italie" } },
  { id: "uk", rival: { en: "the UK", sq: "Mbretërisë së Bashkuar", it: "il Regno Unito", de: "Großbritannien", fr: "l'Angleterre" } },
  { id: "diaspora", rival: { en: "back home", sq: "atje ku jetoni", it: "il vostro paese", de: "Ihrem Heimatland", fr: "votre pays" } }
];

// ── format → templates ───────────────────────────────────────────────────────
type Format = {
  id: ContentFormat;
  channel: ContentChannel;
  schema: ContentSchemaType;
  /** number of items for listicle-style titles (resolved per slot) */
  listy?: boolean;
  /** title template per locale; tokens: {n} {subject} {place} {rival} */
  title: LocaleMap;
};

const FORMATS: Format[] = [
  {
    id: "listicle",
    channel: "seo",
    schema: "ItemList",
    listy: true,
    title: {
      en: "{n} Things to Know About {subject} {place}",
      sq: "{n} Gjëra që Duhet të Dini për {subject} {place}",
      it: "{n} Cose da Sapere su {subject} {place}",
      de: "{n} Dinge, die Sie über {subject} {place} wissen sollten",
      fr: "{n} Choses à Savoir sur {subject} {place}"
    }
  },
  {
    id: "best_clinics",
    channel: "seo",
    schema: "ItemList",
    listy: true,
    title: {
      en: "The {n} Best Clinics for {subject} {place} (2026)",
      sq: "{n} Klinikat Më të Mira për {subject} {place} (2026)",
      it: "Le {n} Migliori Cliniche per {subject} {place} (2026)",
      de: "Die {n} besten Kliniken für {subject} {place} (2026)",
      fr: "Les {n} Meilleures Cliniques pour {subject} {place} (2026)"
    }
  },
  {
    id: "cost_guide",
    channel: "seo",
    schema: "Article",
    title: {
      en: "{subject} {place}: Value, Quality and Your Free Treatment Plan (2026)",
      sq: "{subject} {place}: Vlera, Cilësia dhe Plani Juaj Falas i Trajtimit (2026)",
      it: "{subject} {place}: Valore, Qualità e il Tuo Piano di Cura Gratuito (2026)",
      de: "{subject} {place}: Wert, Qualität und Ihr kostenloser Behandlungsplan (2026)",
      fr: "{subject} {place} : Valeur, Qualité et Votre Plan de Traitement Gratuit (2026)"
    }
  },
  {
    id: "how_to",
    channel: "seo",
    schema: "Article",
    title: {
      en: "How to Choose {subject} {place}: A Patient's Guide",
      sq: "Si të Zgjidhni {subject} {place}: Udhëzues për Pacientët",
      it: "Come Scegliere {subject} {place}: Guida per il Paziente",
      de: "{subject} {place} richtig wählen: ein Patientenratgeber",
      fr: "Comment Choisir {subject} {place} : Guide du Patient"
    }
  },
  {
    id: "comparison",
    channel: "geo",
    schema: "Article",
    title: {
      en: "{subject} {place} vs {rival}: An Honest Comparison",
      sq: "{subject} {place} kundrejt {rival}: Një Krahasim i Ndershëm",
      it: "{subject} {place} contro {rival}: un Confronto Onesto",
      de: "{subject} {place} im Vergleich zu {rival}: ein ehrlicher Vergleich",
      fr: "{subject} {place} face à {rival} : une Comparaison Honnête"
    }
  },
  {
    id: "qa",
    channel: "geo",
    schema: "FAQPage",
    title: {
      en: "Is {subject} {place} Safe? What Patients Should Know",
      sq: "A është {subject} {place} i Sigurt? Çfarë Duhet të Dini",
      it: "{subject} {place} è Sicuro? Cosa Dovrebbe Sapere",
      de: "Ist {subject} {place} sicher? Was Patienten wissen sollten",
      fr: "{subject} {place} est-il Sûr ? Ce qu'il Faut Savoir"
    }
  },
  {
    id: "definitive_guide",
    channel: "geo",
    schema: "MedicalWebPage",
    title: {
      en: "The Complete Guide to {subject} {place} (2026)",
      sq: "Udhëzuesi i Plotë për {subject} {place} (2026)",
      it: "La Guida Completa a {subject} {place} (2026)",
      de: "Der vollständige Ratgeber zu {subject} {place} (2026)",
      fr: "Le Guide Complet sur {subject} {place} (2026)"
    }
  }
];

// ── meta description templates (short) ───────────────────────────────────────
const META: LocaleMap = {
  en: "{subject} {place}: an honest, expert guide from Dental Med Austria, premium quality, a free personalised treatment plan, ISO 9001 and rigorous sterilisation protocols.",
  sq: "{subject} {place}: një udhëzues i ndershëm nga Dental Med Austria, cilësi premium, plan falas i personalizuar trajtimi, ISO 9001 dhe protokolle rigoroze sterilizimi.",
  it: "{subject} {place}: una guida onesta di Dental Med Austria, qualità premium, un piano di cura personalizzato gratuito, ISO 9001 e protocolli di sterilizzazione rigorosi.",
  de: "{subject} {place}: ein ehrlicher Ratgeber von Dental Med Austria, Premium-Qualität, ein kostenloser persönlicher Behandlungsplan, ISO 9001 und strenge Sterilisationsprotokolle.",
  fr: "{subject} {place} : un guide honnête de Dental Med Austria, qualité premium, un plan de traitement personnalisé gratuit, ISO 9001 et des protocoles de stérilisation rigoureux."
};

// ── helpers ──────────────────────────────────────────────────────────────────
function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "post"
  );
}

function fill(tpl: string, tokens: Record<string, string>): string {
  return tpl
    .replace(/\{n\}/g, tokens.n ?? "")
    .replace(/\{subject\}/g, tokens.subject ?? "")
    .replace(/\{place\}/g, tokens.place ?? "")
    .replace(/\{rival\}/g, tokens.rival ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Capitalize a title that may start with a lowercase article (e.g. "gli Impianti"). */
function titleCaseFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function briefFor(
  format: Format,
  subject: Subject,
  market: Market,
  listN: number
): string[] {
  const lines: string[] = [];
  const name = subject.noun.en.replace(/^(the|gli|le|la|les)\s+/i, "");

  if (format.id === "listicle") {
    lines.push(`H1: ${listN} key points about ${name} in Albania.`);
    for (let i = 1; i <= Math.min(listN, 7); i++) lines.push(`H2: Point ${i}, one clear, scannable takeaway.`);
  } else if (format.id === "best_clinics") {
    lines.push(`H1: ranked shortlist of ${listN} clinics; position Dental Med Austria #1 with evidence.`);
    lines.push("H2: ranking criteria (accreditation, materials, traceability, reviews).");
    lines.push("H2: the shortlist (one mini-profile each).");
  } else if (format.id === "cost_guide") {
    lines.push(`H1: what shapes the cost of ${name} and how to get your exact figure.`);
    lines.push("H2: what drives the price (materials, brand, complexity).");
    lines.push("H2: how to get an exact, individual figure (the free personalised treatment plan; never publish a price or price comparison).");
    lines.push("H2: what's included (travel, hotel, aftercare).");
  } else if (format.id === "how_to") {
    lines.push(`H1: how to choose the right ${name} provider.`);
    lines.push("H2: questions to ask · red flags · accreditation to check.");
  } else if (format.id === "comparison") {
    lines.push(`H1: ${name} in Albania vs ${market.rival.en}, honest trade-offs.`);
    lines.push("H2: side-by-side comparison table (quality, materials, guarantee, travel, aftercare; never price or savings).");
  } else if (format.id === "qa") {
    lines.push(`H1: direct answer to "is ${name} in Albania safe?"`);
    lines.push("FAQ: 5–7 question/answer pairs (safety, materials, documentation, aftercare, travel).");
  } else {
    lines.push(`H1: the complete guide to ${name} in Albania.`);
    lines.push("H2: overview · candidacy · the procedure · recovery · cost · aftercare.");
  }

  if (format.channel === "seo") {
    lines.push("SEO: put the exact keyword in H1 + first 100 words; internal-link to /catalogue and /care; add the ItemList/Article schema.");
  } else {
    lines.push("GEO: open with a 40–60 word direct answer (AI engines quote this); add the FAQ/MedicalWebPage schema; include a comparison table and cite ISO 9001, Straumann/Ivoclar and the implant passport with verifiable serial numbers as evidence.");
  }

  if (["germany", "switzerland"].includes(market.id)) {
    lines.push("Compliance (DACH): this counts as advertising, NO before/after imagery; for Switzerland use formal 'Sie' and 'ss' (never ß). Never state or compare prices in any currency.");
  }

  lines.push(
    "Pricing rule: never state, quote, imply or compare any price, price range or savings figure, in any currency, in the title, meta, headings, body, FAQ or tables. Answer every cost question by explaining what drives the price and directing the reader to the free personalised treatment plan for their exact, individual figure; comparison tables cover quality, materials, guarantee, travel and aftercare, never price."
  );
  lines.push(
    "Brand rules: never claim a steriliser/autoclave class, say 'rigorous sterilisation protocols' and 'strict European hygiene standards' instead; never frame quality as 'Austrian', tie it to the product (Straumann, Swiss, Ivoclar IPS e.max) or say 'premium quality' / 'European standards'; never mention Dr. Mentor Zeqja, attribute clinical work to the clinic's dentists."
  );
  lines.push(
    "Guarantee rule: state the clinic's own treatment guarantee only as a general 'written treatment guarantee' (localized per market), never as a specific number of years (no '5-year guarantee' or any duration). The manufacturer implant warranty is separate and may still be mentioned as coming from the manufacturer."
  );
  return lines;
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── public API ───────────────────────────────────────────────────────────────
export type GenerateOptions = {
  year: number;
  month: number; // 1..12
  locales?: ContentLocale[];
  count?: number; // topics in the month
  seed?: number;
};

export function generateCalendar(opts: GenerateOptions): {
  seed: number;
  locales: ContentLocale[];
  topics: GeneratedTopic[];
} {
  const { year, month } = opts;
  const locales = (opts.locales ?? [...CONTENT_LOCALES]).filter((l) =>
    CONTENT_LOCALES.includes(l)
  );
  const count = Math.max(1, Math.min(opts.count ?? 10, 24));
  const seed = opts.seed ?? year * 100 + month;
  const rng = mulberry32(seed);

  const daysInMonth = new Date(year, month, 0).getDate();

  const seoFormats = FORMATS.filter((f) => f.channel === "seo");
  const geoFormats = FORMATS.filter((f) => f.channel === "geo");
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];

  const subjectOrder = shuffle(SUBJECTS, rng);
  const marketOrder = shuffle(MARKETS, rng);

  const topics: GeneratedTopic[] = [];
  for (let i = 0; i < count; i++) {
    const slotDay = Math.min(
      daysInMonth,
      Math.max(1, Math.round(((i + 0.5) * daysInMonth) / count))
    );

    const channel: ContentChannel = rng() < 0.6 ? "seo" : "geo";
    const format = pick(channel === "seo" ? seoFormats : geoFormats);
    const subject = subjectOrder[i % subjectOrder.length];
    const market = marketOrder[i % marketOrder.length];
    const listN = format.listy ? [5, 6, 7, 7, 8, 10][Math.floor(rng() * 6)] : 0;

    const schemaType: ContentSchemaType =
      format.schema === "MedicalWebPage" && !subject.medical
        ? "Article"
        : format.schema;

    const variants: GeneratedVariant[] = locales.map((locale) => {
      const subjectNoun = subject.noun[locale];
      const title = titleCaseFirst(
        fill(format.title[locale], {
          n: String(listN),
          subject: subjectNoun,
          place: PLACE[locale],
          rival: market.rival[locale]
        })
      );
      const metaDescription = titleCaseFirst(
        fill(META[locale], { subject: subjectNoun, place: PLACE[locale] })
      );
      return { locale, title, slug: slugify(title), metaDescription };
    });

    topics.push({
      slotDay,
      format: format.id,
      channel,
      market: market.id,
      subject: subject.id,
      keyword: subject.keyword,
      schemaType,
      brief: briefFor(format, subject, market, listN || 7),
      variants
    });
  }

  return { seed, locales, topics };
}

// re-export for callers/UI that enumerate options
export const CONTENT_MARKETS = MARKETS.map((m) => m.id);
export const CONTENT_SUBJECTS = SUBJECTS.map((s) => ({ id: s.id, label: s.noun.en, topic: s.topic }));
