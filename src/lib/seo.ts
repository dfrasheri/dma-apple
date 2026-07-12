// Centralised SEO + GEO (Generative Engine Optimization) structured data.
// NOTE: geo coordinates are approximate (Tirana) - verify the exact clinic
// location before going live.

import { CATALOGUE_CATEGORIES, OFFICIAL_SERVICES } from "@/lib/catalogue";
import { CONTACT } from "@/lib/site";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "@/lib/dictionaries";

export const SITE_URL = "https://www.dentalmedaustria.al";

export const CLINIC_ID = `${SITE_URL}/#clinic`;

/**
 * SINGLE SOURCE OF TRUTH for headline stats. Canonical patient count is
 * "24,000+", keep every public claim aligned to this value; mismatched
 * public claims hurt E-E-A-T and patient trust.
 */
export const CLINIC_STATS = {
  patients: "24,000+", // canonical, matches CLINIC_PROFILE.stats.patients
  since: 2009,
};

/** Core LocalBusiness / Dentist entity - the anchor for local + AI search. */
export const clinicJsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  "@id": CLINIC_ID,
  name: "Dental Med Austria",
  alternateName: "Dental Med Travel",
  url: SITE_URL,
  image: `${SITE_URL}/images/dma/interiors/reception-wide.jpg`,
  logo: `${SITE_URL}/images/dma/logo2.svg`,
  email: CONTACT.email,
  telephone: CONTACT.phone,
  hasMap: CONTACT.maps,
  medicalSpecialty: [
    "Dentistry",
    "Oral surgery",
    "Prosthodontics",
    "Orthodontics",
    "Cosmetic dentistry",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "reservations",
      telephone: CONTACT.phone,
      email: CONTACT.email,
      availableLanguage: ["English", "Italian", "German", "French", "Albanian"],
      areaServed: ["AL", "IT", "DE", "CH", "GB", "US", "HU", "FR"],
    },
  ],
  foundingDate: "2009",
  slogan: "Advanced Dental Care in Albania",
  description:
    `premium-quality dental clinic in Tirana, Albania. Implants, crowns, veneers, prostheses and orthodontics for local and international patients, with ${CLINIC_STATS.patients} patients treated since ${CLINIC_STATS.since}.`,
  currenciesAccepted: "EUR",
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.address1,
    addressLocality: "Tiranë",
    addressCountry: "AL",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 41.3236,
    longitude: 19.8086,
  },
  areaServed: [
    { "@type": "Country", name: "Albania" },
    { "@type": "Country", name: "Italy" },
    { "@type": "Country", name: "Germany" },
    { "@type": "Country", name: "Switzerland" },
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "Hungary" },
  ],
  knowsLanguage: ["en", "it", "de", "fr", "sq"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "15:00",
    },
  ],
  // Accreditations & memberships, full objects so AI/answer engines can
  // resolve the accrediting bodies as entities (see <Accreditations />, which
  // renders the same facts as visible, localized page content).
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "ISO 9001 Certification, Quality Management (issued by TÜV NORD)",
      credentialCategory: "certification",
      recognizedBy: {
        "@type": "Organization",
        name: "TÜV NORD",
        url: "https://www.tuev-nord.de",
      },
    },
    // Warranty/guarantee claims are no longer made anywhere on the site.
    // Aftercare facts (implant passport, traceable serial numbers, follow-up
    // support) live in the homepage FAQ and the visible trust copy instead.
  ],
  memberOf: [
    {
      "@type": "Organization",
      name: "ITI, International Team for Implantology",
      url: "https://www.iti.org",
    },
    { "@type": "Organization", name: "EDA, European Dental Association" },
    {
      "@type": "Organization",
      name: "Albstom, Shoqëria Stomatologjike Shqiptare (Albanian Stomatological Society)",
    },
    {
      "@type": "Organization",
      name: "ADA, Albania Dental & Aesthetic",
      url: "https://albaniadentalaesthetic.com",
    },
  ],
  // Press citations, the clinic's international print features, deep-linked
  // to the original online viewers. Rendered as visible, localized content by
  // <PressFeatures /> on the homepage; kept here as machine-readable E-E-A-T
  // signals for search/answer engines.
  subjectOf: [
    {
      "@type": "Article",
      headline: "Dental Med Austria: il sorriso come esperienza di viaggi",
      inLanguage: "it",
      pagination: "90-91",
      url: "https://issuu.com/gatemagita/docs/gatemag_n_62/90",
      isPartOf: {
        "@type": "PublicationIssue",
        name: "GATEmag n°62",
        issueNumber: "62",
        isPartOf: { "@type": "Periodical", name: "GATE mag" },
      },
    },
    {
      "@type": "Article",
      headline: "Exceptional dental care tailored to your needs",
      inLanguage: "en",
      pagination: "100",
      url: "https://online.flippingbook.com/view/609783083/100/",
      isPartOf: {
        "@type": "PublicationIssue",
        name: "Capital Point, A Dawn of Excellence",
      },
    },
  ],
  // Entity grounding for AI engines: the clinic's verified public profiles.
  // (Add Google Business Profile / WhatClinic / Trustpilot URLs as they exist.)
  sameAs: [CONTACT.instagram, CONTACT.facebook].filter(Boolean) as string[],
};

/** WebSite entity so AI engines can resolve the site itself as a known thing. */
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Dental Med Austria",
  inLanguage: LOCALES.map((l) => l.code),
  publisher: { "@id": CLINIC_ID },
};

/**
 * The official treatment catalogue as an ItemList of MedicalProcedures
 * (GEO-friendly). Mirrors the visible /catalogue listing, which shows strictly
 * the clinic's official 2026 service list.
 */
export const catalogueItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Dental Med Austria - Treatment Catalogue",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: OFFICIAL_SERVICES.length,
  itemListElement: OFFICIAL_SERVICES.map((s, i) => {
    const cat = CATALOGUE_CATEGORIES.find((c) => c.slug === s.category);
    return {
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MedicalProcedure",
        name: s.name,
        description: s.summary,
        category: cat?.label ?? s.category,
        url: `${SITE_URL}/catalogue/${s.slug}`,
        provider: { "@id": CLINIC_ID },
      },
    };
  }),
};

/** FAQ schema - strong for both classic rich results and AI answer engines. */
export const catalogueFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where is Dental Med Austria located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dental Med Austria is located at Rruga Kristo Luarasi in Tirana, Albania, and welcomes both local and international patients.",
      },
    },
    {
      "@type": "Question",
      name: "What dental treatments does Dental Med Austria offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The clinic offers dental implants (including All-on-4 and All-on-6), zirconia and E-max crowns, ceramic and composite veneers, Hollywood smile makeovers, teeth whitening, root canal treatment, gum care, Invisalign and braces, oral surgery, and 3D CBCT diagnostics.",
      },
    },
    {
      "@type": "Question",
      name: "How much do dental implants cost in Albania?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing depends on the implant brand and the complexity of your case. Dental Med Austria provides a free remote treatment plan with a written cost estimate within 24-48 hours when you send an X-ray and photos.",
      },
    },
    {
      "@type": "Question",
      name: "Does Dental Med Austria help international patients with travel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The clinic arranges airport pickup at Tirana, partner-hotel accommodation, and a multilingual coordinator who speaks English, Italian, German, French, and Albanian.",
      },
    },
    {
      "@type": "Question",
      name: "What aftercare and quality assurance does Dental Med Austria provide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every implant patient receives an implant passport documenting the exact implant brand and verifiable serial numbers, so treatment is fully traceable. All work is carried out to ISO 9001 and European hygiene standards, and the clinic remains available for follow-up support after treatment.",
      },
    },
  ],
};

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

// ── Multilingual URL + hreflang helpers ────────────────────────────────────

/** Absolute URL for a locale + clean path ("/" or "/care/dental-implants"). */
export function localeUrl(locale: string, path: string): string {
  const clean = !path || path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${SITE_URL}/${locale}${clean}`;
}

/** canonical + hreflang alternates for Metadata.alternates on any page. */
export function buildAlternates(locale: string, path: string) {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l.code] = localeUrl(l.code, path);
  languages["x-default"] = localeUrl(DEFAULT_LOCALE, path);
  return { canonical: localeUrl(locale, path), languages };
}

/** Per-locale default <title>/description, homepage + fallback for every page. */
export const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Best Dental Clinic in Albania | Dental Med Austria",
    description:
      "premium-quality dental implants, crowns and veneers in Tirana, Albania. Trusted by 24,000+ patients since 2009. Free treatment plan in 24–48h, airport pickup and ISO 9001-certified care.",
  },
  it: {
    title: "Migliore Clinica Dentale in Albania | Dental Med Austria",
    description:
      "Impianti, corone e faccette dentali di qualità premium a Tirana, Albania. Scelta da oltre 24.000 pazienti dal 2009. Preventivo gratuito in 24–48h e cure certificate ISO 9001.",
  },
  de: {
    title: "Beste Zahnklinik in Albanien | Dental Med Austria",
    description:
      "Zahnimplantate, Kronen und Veneers in Premium-Qualität in Tirana, Albanien. Über 24.000 Patienten seit 2009. Kostenloser Behandlungsplan in 24–48h, ISO-9001-zertifizierte Versorgung.",
  },
  sq: {
    title: "Klinika më e mirë dentare në Shqipëri | Dental Med Austria",
    description:
      "Implante, kurora dhe faseta dentare me cilësi premium në Tiranë, Shqipëri. Të besuara nga mbi 24.000 pacientë që nga 2009. Plan falas brenda 24–48 orësh dhe kujdes i certifikuar ISO 9001.",
  },
  fr: {
    title: "Meilleure Clinique Dentaire en Albanie | Dental Med Austria",
    description:
      "Implants dentaires, couronnes et facettes de qualité premium à Tirana, en Albanie. Plus de 24 000 patients depuis 2009. Plan de traitement gratuit sous 24–48h et des soins certifiés ISO 9001.",
  },
};

/**
 * Per-locale metadata for listing pages + reusable title/description templates
 * for the dynamic treatment/procedure pages. Keeps ALL SEO copy in one place
 * and fully in-language (no English leaking into IT/DE/SQ meta).
 */
type PageMeta = {
  catalogue: { title: string; description: string };
  care: { title: string; description: string };
  catTitleTpl: (name: string) => string;
  catDescTpl: (name: string) => string;
  careTitleTpl: (name: string) => string;
  careDescTpl: (name: string) => string;
};

export const PAGE_META: Record<Locale, PageMeta> = {
  en: {
    catalogue: {
      title: "Dental Treatments in Albania, Implants, Crowns & Veneers | Dental Med Austria",
      description:
        "Full treatment catalogue at Dental Med Austria, Tirana: dental implants, All-on-4/6, zirconia & E-max crowns, veneers, Hollywood smile, Invisalign. premium quality, free 24–48h treatment plan.",
    },
    care: {
      title: "Dental Procedures & Treatments in Tirana, Albania | Dental Med Austria",
      description:
        "Explore dental procedures at Dental Med Austria in Tirana, Albania, implants, crowns, veneers, prosthetics and more, with premium-quality, ISO 9001-certified care.",
    },
    catTitleTpl: (n) => `${n} in Albania, Cost & Free Treatment Plan | Dental Med Austria`,
    catDescTpl: (n) =>
      `${n} at Dental Med Austria in Tirana, Albania. premium quality, ISO 9001, implant passport for full traceability. Free remote treatment plan in 24–48h.`,
    careTitleTpl: (n) => `${n} in Tirana, Albania | Dental Med Austria`,
    careDescTpl: (n) =>
      `${n} at Dental Med Austria, premium-quality dental care in Tirana, Albania for local and international patients. Free treatment plan in 24–48h.`,
  },
  it: {
    catalogue: {
      title: "Trattamenti Dentali in Albania, Impianti, Corone e Faccette | Dental Med Austria",
      description:
        "Il catalogo completo di Dental Med Austria a Tirana: impianti dentali, All-on-4/6, corone in zirconio ed E-max, faccette, Hollywood smile, Invisalign. Qualità premium, preventivo gratuito in 24–48h.",
    },
    care: {
      title: "Procedure e Trattamenti Dentali a Tirana, Albania | Dental Med Austria",
      description:
        "Scopri le procedure dentali di Dental Med Austria a Tirana, Albania, impianti, corone, faccette, protesi e altro, con qualità premium e cure certificate ISO 9001.",
    },
    catTitleTpl: (n) => `${n} in Albania, Prezzi e Preventivo Gratuito | Dental Med Austria`,
    catDescTpl: (n) =>
      `${n} presso Dental Med Austria a Tirana, Albania. Qualità premium, ISO 9001, passaporto implantare per la piena tracciabilità. Preventivo gratuito a distanza in 24–48h.`,
    careTitleTpl: (n) => `${n} a Tirana, Albania | Dental Med Austria`,
    careDescTpl: (n) =>
      `${n} presso Dental Med Austria, cure dentali di qualità premium a Tirana, Albania, per pazienti locali e internazionali. Preventivo gratuito in 24–48h.`,
  },
  de: {
    catalogue: {
      title: "Zahnbehandlungen in Albanien, Implantate, Kronen & Veneers | Dental Med Austria",
      description:
        "Der komplette Behandlungskatalog von Dental Med Austria in Tirana: Zahnimplantate, All-on-4/6, Zirkon- & E-max-Kronen, Veneers, Hollywood-Smile, Invisalign. Premium-Qualität, kostenloser Heilplan in 24–48 Std.",
    },
    care: {
      title: "Zahnbehandlungen & Eingriffe in Tirana, Albanien | Dental Med Austria",
      description:
        "Entdecken Sie die Zahnbehandlungen von Dental Med Austria in Tirana, Albanien, Implantate, Kronen, Veneers, Prothetik und mehr, in Premium-Qualität nach ISO-9001-zertifizierten Standards.",
    },
    catTitleTpl: (n) => `${n} in Albanien, Kosten & kostenloser Heilplan | Dental Med Austria`,
    catDescTpl: (n) =>
      `${n} bei Dental Med Austria in Tirana, Albanien. Premium-Qualität, ISO 9001, Implantatpass für volle Nachverfolgbarkeit. Kostenloser Heil- & Kostenplan in 24–48 Std.`,
    careTitleTpl: (n) => `${n} in Tirana, Albanien | Dental Med Austria`,
    careDescTpl: (n) =>
      `${n} bei Dental Med Austria, Zahnmedizin in Premium-Qualität in Tirana, Albanien, für lokale und internationale Patienten. Kostenloser Heilplan in 24–48 Std.`,
  },
  sq: {
    catalogue: {
      title: "Trajtime Dentare në Shqipëri, Implante, Kurora & Faseta | Dental Med Austria",
      description:
        "Katalogu i plotë i trajtimeve te Dental Med Austria në Tiranë: implante dentare, All-on-4/6, kurora zirkoni & E-max, faseta, Hollywood smile, Invisalign. Cilësi premium, plan falas brenda 24–48 orësh.",
    },
    care: {
      title: "Procedura & Trajtime Dentare në Tiranë, Shqipëri | Dental Med Austria",
      description:
        "Zbuloni procedurat dentare te Dental Med Austria në Tiranë, Shqipëri, implante, kurora, faseta, proteza e më shumë, me cilësi premium dhe kujdes të certifikuar ISO 9001.",
    },
    catTitleTpl: (n) => `${n} në Shqipëri, Çmime & Plan Falas | Dental Med Austria`,
    catDescTpl: (n) =>
      `${n} te Dental Med Austria në Tiranë, Shqipëri. Cilësi premium, ISO 9001, pasaportë implanti për gjurmueshmëri të plotë. Plan trajtimi falas në distancë brenda 24–48 orësh.`,
    careTitleTpl: (n) => `${n} në Tiranë, Shqipëri | Dental Med Austria`,
    careDescTpl: (n) =>
      `${n} te Dental Med Austria, kujdes dentar me cilësi premium në Tiranë, Shqipëri, për pacientë vendas e ndërkombëtarë. Plan falas brenda 24–48 orësh.`,
  },
  fr: {
    catalogue: {
      title: "Soins Dentaires en Albanie, Implants, Couronnes & Facettes | Dental Med Austria",
      description:
        "Le catalogue complet de Dental Med Austria à Tirana : implants dentaires, All-on-4/6, couronnes en zircone et E-max, facettes, sourire hollywoodien, Invisalign. Qualité premium, plan gratuit sous 24–48h.",
    },
    care: {
      title: "Procédures et Soins Dentaires à Tirana, Albanie | Dental Med Austria",
      description:
        "Découvrez les soins dentaires de Dental Med Austria à Tirana, en Albanie, implants, couronnes, facettes, prothèses et plus, avec une qualité premium et des soins certifiés ISO 9001.",
    },
    catTitleTpl: (n) => `${n} en Albanie, Tarifs & Plan de Traitement Gratuit | Dental Med Austria`,
    catDescTpl: (n) =>
      `${n} chez Dental Med Austria à Tirana, en Albanie. Qualité premium, ISO 9001, passeport implantaire pour une traçabilité complète. Plan de traitement gratuit à distance sous 24–48h.`,
    careTitleTpl: (n) => `${n} à Tirana, Albanie | Dental Med Austria`,
    careDescTpl: (n) =>
      `${n} chez Dental Med Austria, soins dentaires de qualité premium à Tirana, en Albanie, pour patients locaux et internationaux. Plan gratuit sous 24–48h.`,
  },
};

/**
 * Real-review schema builder for AggregateRating + Review rich results.
 * IMPORTANT: only call with GENUINE patient reviews (e.g. synced from Google
 * Business Profile). Never invent ratings, self-serving fake review markup
 * violates Google's guidelines and risks a manual penalty. Returns null when
 * there are no reviews, so it is safe to render unconditionally.
 */
export function buildReviewJsonLd(
  reviews: { author: string; rating: number; body: string; date?: string }[],
) {
  if (!reviews.length) return null;
  const avg =
    Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": CLINIC_ID,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avg,
      reviewCount: reviews.length,
      bestRating: 5,
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.body, ...(r.date ? { datePublished: r.date } : {}),
    })),
  };
}
