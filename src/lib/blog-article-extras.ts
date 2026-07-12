// Presentation extras for blog articles: localized article-chrome labels and
// deterministic inline photo picks. Server-safe (no hooks), used by the
// article renderer to give EVERY post the classic SEO blog anatomy (TOC,
// listicles, accordion FAQs, photo sections, CTA) without touching the
// stored bodies of the 120+ generated posts.
import type { BlogPost } from "./blog-data";

type ArticleLocale = "en" | "sq" | "it" | "de" | "fr";

export function articleLocale(post: BlogPost): ArticleLocale {
  const l = post.locale ?? "en";
  return (["en", "sq", "it", "de", "fr"].includes(l) ? l : "en") as ArticleLocale;
}

export type ArticleUi = {
  toc: string;
  takeaways: string;
  faqTitle: string;
  by: string;
  minRead: (n: number) => string;
  ctaKicker: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  related: string;
};

export const ARTICLE_UI: Record<ArticleLocale, ArticleUi> = {
  en: {
    toc: "In this article",
    takeaways: "Key takeaways",
    faqTitle: "Frequently asked questions",
    by: "By",
    minRead: (n) => `${n} min read`,
    ctaKicker: "Free treatment plan",
    ctaTitle: "Find out what your new smile could look like in Tirana",
    ctaBody:
      "Send a panoramic X-ray or a few photos and our clinical team will reply with a free, written treatment plan within 24–48 hours, with no obligation.",
    ctaButton: "Get my free plan",
    related: "More in",
  },
  sq: {
    toc: "Në këtë artikull",
    takeaways: "Pikat kryesore",
    faqTitle: "Pyetjet më të shpeshta",
    by: "Nga",
    minRead: (n) => `${n} min lexim`,
    ctaKicker: "Plan trajtimi falas",
    ctaTitle: "Zbuloni si mund të duket buzëqeshja juaj e re në Tiranë",
    ctaBody:
      "Na dërgoni një radiografi panoramike ose disa foto dhe ekipi ynë klinik do t'ju përgjigjet me një plan trajtimi falas, me shkrim, brenda 24–48 orëve, pa asnjë detyrim.",
    ctaButton: "Merrni planin falas",
    related: "Më shumë nga",
  },
  it: {
    toc: "In questo articolo",
    takeaways: "Punti chiave",
    faqTitle: "Domande frequenti",
    by: "Di",
    minRead: (n) => `${n} min di lettura`,
    ctaKicker: "Piano di trattamento gratuito",
    ctaTitle: "Scopri come potrebbe essere il tuo nuovo sorriso a Tirana",
    ctaBody:
      "Inviaci una panoramica o qualche foto e il nostro team clinico ti risponderà con un piano di trattamento gratuito e scritto entro 24–48 ore, senza impegno.",
    ctaButton: "Richiedi il piano gratuito",
    related: "Altro in",
  },
  de: {
    toc: "In diesem Artikel",
    takeaways: "Das Wichtigste in Kürze",
    faqTitle: "Häufige Fragen",
    by: "Von",
    minRead: (n) => `${n} Min. Lesezeit`,
    ctaKicker: "Kostenloser Behandlungsplan",
    ctaTitle: "Erfahren Sie, wie Ihr neues Lächeln in Tirana aussehen könnte",
    ctaBody:
      "Senden Sie uns ein Panorama-Röntgenbild oder einige Fotos, und unser klinisches Team antwortet innerhalb von 24–48 Stunden mit einem kostenlosen schriftlichen Behandlungsplan, ganz unverbindlich.",
    ctaButton: "Kostenlosen Plan anfordern",
    related: "Mehr aus",
  },
  fr: {
    toc: "Dans cet article",
    takeaways: "L'essentiel à retenir",
    faqTitle: "Questions fréquentes",
    by: "Par",
    minRead: (n) => `${n} min de lecture`,
    ctaKicker: "Plan de traitement gratuit",
    ctaTitle: "Découvrez à quoi pourrait ressembler votre nouveau sourire à Tirana",
    ctaBody:
      "Envoyez-nous une radiographie panoramique ou quelques photos et notre équipe clinique vous répondra avec un plan de traitement gratuit et écrit sous 24–48 heures, sans engagement.",
    ctaButton: "Obtenir mon plan gratuit",
    related: "Plus dans",
  },
};

// ── Deterministic inline photos ──────────────────────────────────────────────

type PoolEntry = { src: string; kind: "clinic" | "sterile" | "lab" };

/** Short, muted montage of the in-house lab crafting crowns (loops in the
 * article figure). The matching lab still is used as its poster/fallback. */
const LAB_VIDEO = "/videos/dma/lab-work.mp4";

const CLINIC_POOL: PoolEntry[] = [
  { src: "/images/dma/interiors/treatment-room-view.jpg", kind: "clinic" },
  { src: "/images/dma/interiors/reception-wide.jpg", kind: "clinic" },
  { src: "/images/dma/interiors/reception-led-wall.jpg", kind: "clinic" },
  { src: "/images/dma/interiors/corridor-lounge.jpg", kind: "clinic" },
  { src: "/images/dma/interiors/sterilization-room.jpg", kind: "sterile" },
  { src: "/images/dma/interiors/lab-detail-2.jpg", kind: "lab" },
  { src: "/images/dma/interiors/treatment-room-bright.jpg", kind: "clinic" },
  { src: "/images/dma/interiors/lab-crowns-macro.jpg", kind: "lab" },
  { src: "/images/dma/interiors/lab-technician.jpg", kind: "lab" },
];

// Only the young, tightly-framed smile shots where the teeth sit near the
// centre of the frame, so the wide article crop always lands on the smile.
// Older-subject and full-portrait shots (patient-smile-1/3/4/6/8) are reserved
// for the Smiles gallery and kept out of the blog rotation. `pos` is the
// vertical focal point tuned to the wide ~760x440 figure crop.
const SMILE_POOL: { src: string; pos: string }[] = [
  { src: "/images/dma/patients/patient-smile-2.jpg", pos: "center 55%" },
  { src: "/images/dma/patients/patient-smile-5.jpg", pos: "center 45%" },
  { src: "/images/dma/patients/patient-smile-7.jpg", pos: "center 55%" },
  { src: "/images/dma/patients/smile-veneers-1.jpg", pos: "center 45%" },
  { src: "/images/dma/patients/smile-veneers-2.jpg", pos: "center 50%" },
  { src: "/images/dma/patients/smile-veneers-3.jpg", pos: "center 42%" },
];

// Pin a specific real patient photo to a specific article (keyed by the post's
// shared `group`, so every locale variant matches). Overrides the deterministic
// SMILE_POOL pick for that post only, leaving the rest of the rotation untouched.
const SMILE_OVERRIDES: Record<string, { src: string; pos: string }> = {
  "best-clinic-how-to-choose": { src: "/images/dma/patients/smile-veneers-4.jpg", pos: "center" },
};

const CAPTIONS: Record<"clinic" | "sterile" | "lab" | "smile", Record<ArticleLocale, string>> = {
  clinic: {
    en: "Inside the Dental Med Austria clinic in Tirana",
    sq: "Brenda klinikës Dental Med Austria në Tiranë",
    it: "All'interno della clinica Dental Med Austria a Tirana",
    de: "Ein Blick in die Klinik von Dental Med Austria in Tirana",
    fr: "À l'intérieur de la clinique Dental Med Austria à Tirana",
  },
  sterile: {
    en: "Rigorous sterilisation at Dental Med Austria: every instrument, every time",
    sq: "Sterilizim rigoroz në Dental Med Austria: çdo instrument, çdo herë",
    it: "Sterilizzazione rigorosa da Dental Med Austria: ogni strumento, ogni volta",
    de: "Strenge Sterilisation bei Dental Med Austria: jedes Instrument, jedes Mal",
    fr: "Stérilisation rigoureuse chez Dental Med Austria : chaque instrument, à chaque fois",
  },
  lab: {
    en: "The in-house laboratory where every restoration is crafted",
    sq: "Laboratori ynë i brendshëm, ku përgatitet çdo restaurim",
    it: "Il laboratorio interno dove nasce ogni restauro",
    de: "Das hauseigene Labor, in dem jede Restauration entsteht",
    fr: "Le laboratoire interne où chaque restauration est réalisée",
  },
  smile: {
    en: "A real patient result at Dental Med Austria",
    sq: "Rezultati i një pacienti real në Dental Med Austria",
    it: "Il risultato reale di un paziente di Dental Med Austria",
    de: "Das echte Ergebnis eines Patienten von Dental Med Austria",
    fr: "Le résultat réel d'un patient de Dental Med Austria",
  },
};

export type InlineImage = { src: string; alt: string; caption: string; pos?: string; video?: string; aspect?: "square" | "video" };

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Two inline photo sections for a post, chosen deterministically from the
 * clinic/patient pools (stable across renders and SSR): one clinic/quality
 * shot, one real patient smile. Captions follow the article's language.
 */
export function inlineImagesFor(post: BlogPost): [InlineImage, InlineImage] {
  const locale = articleLocale(post);
  const h = hashId(post.group ?? post.id);
  const clinicPick = CLINIC_POOL[h % CLINIC_POOL.length];
  const smilePick = SMILE_OVERRIDES[post.group ?? post.id] ?? SMILE_POOL[h % SMILE_POOL.length];
  const clinicCaption = CAPTIONS[clinicPick.kind][locale];
  const smileCaption = CAPTIONS.smile[locale];
  return [
    {
      src: clinicPick.src,
      alt: clinicCaption,
      caption: clinicCaption,
      pos: "center",
      // The in-house lab shot becomes a short looping video of the lab at work.
      ...(clinicPick.kind === "lab" ? { video: LAB_VIDEO } : {}),
    },
    { src: smilePick.src, alt: smileCaption, caption: smileCaption, pos: smilePick.pos },
  ];
}

/** Rough reading time at ~200 wpm, never below 1. */
export function readingMinutes(body: string): number {
  return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));
}
