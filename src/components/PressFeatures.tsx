"use client";

/**
 * Press features, the clinic's international print appearances, staged as
 * physical magazines on the house navy.
 *
 * Two editorial rows, alternating sides:
 *   · Capital Point, "A Dawn of Excellence" (presented with Forbes Global
 *     Properties), page 100 fanned over the issue cover.
 *   · GATE mag n°62 (Italian travel magazine), the real 90–91 spread shown as
 *     an open magazine: two page scans, centre-gutter shadow, sheet stack
 *     behind, folio strip beneath.
 * Every visual and CTA deep-links to the exact page in the original online
 * viewer (Issuu / FlippingBook), so the coverage is verifiable at the source.
 *
 * Page scans live in public/images/press/. Copy is original per locale; only
 * the printed headlines are quoted, as attribution.
 *
 * SEO/GEO/AEO: the same two features are registered on the sitewide Dentist
 * entity as `subjectOf` press citations (src/lib/seo.ts), giving answer
 * engines a machine-readable "as featured in" trail that mirrors this
 * visible, localized section.
 */
import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";

const GOLD = "#d3b57f";

const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-magazine {
    animation: fadeInUp 0.7s ease-out forwards;
  }
  .animate-magazine-delayed {
    animation: fadeInUp 0.7s ease-out 0.15s forwards;
    opacity: 0;
  }
`;

type PressItem = {
  key: string;
  url: string;
  publication: string;
  folioLeft: string;
  folioRight: string;
  headline: string;
  gloss: Record<Locale, string>;
  kicker: Record<Locale, string>;
  description: Record<Locale, string>;
  issue: string;
  pages: Record<Locale, string>;
  alt: Record<Locale, string>;
  variant: "spread" | "fan" | "flipbook";
  images: string[];
  /** Publication credential — an "As featured with …" backlink badge in the copy. */
  featured?: { href: string; kind: "forbes" | "gate" };
};

const FEATURES: PressItem[] = [
  {
    key: "capitalpoint",
    url: "https://online.flippingbook.com/view/609783083/100/",
    publication: "Capital Point",
    folioLeft: "CAPITAL POINT · FORBES GLOBAL PROPERTIES",
    folioRight: "P. 100–103",
    headline: "Exceptional dental care tailored to your needs",
    gloss: {
      en: "",
      sq: "Kujdes dentar i jashtezakonshim, i pershtatshum per ju",
      it: "Cure dentali d'eccellenza, su misura per voi",
      de: "Aussergewohnliche Zahnmedizin, auf Sie zugeschnitten",
      fr: "Des soins dentaires d'exception, adaptes a vos besoins",
    },
    kicker: {
      en: "Capital Point, with Forbes Global Properties",
      sq: "Capital Point, perkrah Forbes Global Properties",
      it: "Capital Point, con Forbes Global Properties",
      de: "Capital Point, mit Forbes Global Properties",
      fr: "Capital Point, avec Forbes Global Properties",
    },
    description: {
      en: "Inside A Dawn of Excellence, the Capital Point edition presented alongside Forbes Global Properties, Dental Med Austria appears on page 100 as Tirana's address for exceptional dental care.",
      sq: "Brenda A Dawn of Excellence, botimit te Capital Point te prezantuar perkrah Forbes Global Properties, Dental Med Austria shfaqet ne faqen 100 si adresa e kujdesit dentar te jashtezakonshim ne Tirane.",
      it: "In A Dawn of Excellence, l'edizione Capital Point presentata insieme a Forbes Global Properties, Dental Med Austria compare a pagina 100 come indirizzo delle cure dentali d'eccellenza a Tirana.",
      de: "In A Dawn of Excellence, der Capital-Point-Ausgabe, prasentiert mit Forbes Global Properties, erscheint Dental Med Austria auf Seite 100 als Adresse fur aussergewohnliche Zahnmedizin in Tirana.",
      fr: "Dans A Dawn of Excellence, l'edition Capital Point presentee aux cotes de Forbes Global Properties, Dental Med Austria figure en page 100 comme l'adresse des soins dentaires d'exception a Tirana.",
    },
    issue: '"A Dawn of Excellence"',
    pages: {
      en: "Pages 100–103",
      sq: "Faqet 100–103",
      it: "Pagine 100–103",
      de: "Seiten 100–103",
      fr: "Pages 100–103",
    },
    alt: {
      en: "Dental Med Austria feature in Capital Point with Forbes Global Properties, A Dawn of Excellence, pages 100–101",
      sq: "Artikulli per Dental Med Austria ne Capital Point me Forbes Global Properties, A Dawn of Excellence, faqet 100–101",
      it: "Articolo su Dental Med Austria in Capital Point con Forbes Global Properties, A Dawn of Excellence, pagine 100–101",
      de: "Beitrag uber Dental Med Austria in Capital Point mit Forbes Global Properties, A Dawn of Excellence, Seiten 100–101",
      fr: "Article sur Dental Med Austria dans Capital Point avec Forbes Global Properties, A Dawn of Excellence, pages 100–101",
    },
    variant: "flipbook",
    images: [
      "/images/press/capital-point-page-100.webp",
      "/images/press/capital-point-page-101.webp",
      "/images/press/capital-point-page-102.webp",
      "/images/press/capital-point-page-103.webp",
    ],
    featured: { href: "https://www.forbesglobalproperties.com", kind: "forbes" },
  },
  {
    key: "gatemag",
    url: "https://issuu.com/gatemagita/docs/gatemag_n_62/90",
    publication: "GATE mag",
    folioLeft: "GATE MAG · N°62",
    folioRight: "COVER · P. 91",
    headline: "Il sorriso come esperienza di viaggio",
    gloss: {
      en: "The smile as a travel experience",
      sq: "Buzeshja si pervojë udhëtimi",
      it: "",
      de: "Das Lacheln als Reiseerlebnis",
      fr: "Le sourire comme experience de voyage",
    },
    kicker: {
      en: "GATE mag, Italian travel magazine",
      sq: "GATE mag, Reviste italiane udhetimesh",
      it: "GATE mag, Rivista di viaggi",
      de: "GATE mag, Italienisches Reisemagazin",
      fr: "GATE mag, Magazine de voyage italien",
    },
    description: {
      en: "GATE mag dedicates a full page to the clinic in issue n°62, how technology, hospitality and European standards in Tirana are redefining dental tourism for travelling patients.",
      sq: "GATE mag i kushton klinikes nje faqe te plote ne numrin 62, si teknologjia, mikpritja dhe standardet evropiane ne Tirane po e ripercaktojne turizmin dentar per pacientet qe udhetojne.",
      it: "GATE mag dedica alla clinica una pagina intera nel numero 62, come tecnologia, accoglienza e standard europei a Tirana stanno ridefinendo il turismo dentale per i pazienti in viaggio.",
      de: "GATE mag widmet der Klinik in Ausgabe Nr. 62 eine ganze Seite, wie Technologie, Gastfreundschaft und europaische Standards in Tirana den Zahntourismus neu definieren.",
      fr: "GATE mag consacre une pleine page a la clinique dans son numero 62, comment technologie, accueil et standards europeens a Tirana redefinissent le tourisme dentaire.",
    },
    issue: "N°62 · 2026",
    pages: {
      en: "Page 91",
      sq: "Faqja 91",
      it: "Pagina 91",
      de: "Seite 91",
      fr: "Page 91",
    },
    alt: {
      en: "Dental Med Austria feature in GATE mag n°62, page 91",
      sq: "Artikulli per Dental Med Austria ne GATE mag n°62, faqja 91",
      it: "Articolo su Dental Med Austria in GATE mag n°62, pagina 91",
      de: "Beitrag uber Dental Med Austria in GATE mag Nr. 62, Seite 91",
      fr: "Article sur Dental Med Austria dans GATE mag n°62, page 91",
    },
    variant: "spread",
    images: ["/images/press/gatemag-62-cover.jpg", "/images/press/gatemag-62-page-91.jpg"],
    featured: { href: "https://issuu.com/gatemagita/docs/gatemag_n_62", kind: "gate" },
  },
];

const T: Record<Locale, { eyebrow: string; title: string; lead: string; cta: string }> = {
  en: {
    eyebrow: "In the Press",
    title: "As Featured in International Magazines",
    lead:
      "From Italy's GATE mag to Capital Point with Forbes Global Properties, the clinic's story keeps reaching print. Open each feature exactly as it appeared on the page.",
    cta: "Read the feature",
  },
  sq: {
    eyebrow: "Ne Shtyp",
    title: "Te Pranishem ne Revistat Nderkombetare",
    lead:
      "Nga revista italiane GATE mag te Capital Point perkrah Forbes Global Properties, historia e klinikes vazhdon te zerre vend ne shtyp. Hapini artikujt ashtu sica janë botuar.",
    cta: "Lexoni artikullin",
  },
  it: {
    eyebrow: "Dicono di Noi",
    title: "Sulle Pagine delle Riviste Internazionali",
    lead:
      "Dalla rivista italiana GATE mag a Capital Point con Forbes Global Properties, la storia della clinica continua ad arrivare in stampa. Aprite ogni articolo così com'è apparso sulla pagina.",
    cta: "Leggi l'articolo",
  },
  de: {
    eyebrow: "Aus der Presse",
    title: "In Internationalen Magazinen",
    lead:
      "Vom italienischen GATE mag bis zu Capital Point mit Forbes Global Properties, die Geschichte der Klinik erreicht immer wieder den Druck. Offnen Sie jeden Beitrag genau so, wie er erschienen ist.",
    cta: "Beitrag lesen",
  },
  fr: {
    eyebrow: "Dans la Presse",
    title: "A la Une des Magazines Internationaux",
    lead:
      "Du magazine italien GATE mag a Capital Point avec Forbes Global Properties, l'histoire de la clinique continue de s'imprimer. Ouvrez chaque article tel qu'il est paru.",
    cta: "Lire l'article",
  },
};

/**
 * The Forbes Global Properties logotype — the serif "Forbes" wordmark over
 * spaced "GLOBAL PROPERTIES" caps, mirroring the co-brand printed on the issue
 * cover. Rendered in the site's serif so it reads as a genuine press credential.
 */
function ForbesWordmark({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span className="flex flex-col leading-none">
      <span className={cn("font-serif tracking-tight text-white", size === "sm" ? "text-[15px]" : "text-[20px]")}>
        Forbes
      </span>
      <span
        className={cn("mt-[3px] uppercase", size === "sm" ? "text-[6px] tracking-[2px]" : "text-[7.5px] tracking-[2.6px]")}
        style={{ color: GOLD }}
      >
        Global Properties
      </span>
    </span>
  );
}

/** The GATE mag logotype — serif wordmark over a spaced descriptor. */
function GateWordmark() {
  return (
    <span className="flex flex-col leading-none">
      <span className="font-serif text-[20px] tracking-tight text-white">
        GATE <span className="italic">mag</span>
      </span>
      <span className="mt-[3px] text-[7.5px] uppercase tracking-[2.6px]" style={{ color: GOLD }}>
        Travel Magazine
      </span>
    </span>
  );
}

/** The clickable publication credential — a real outbound "as featured with" citation. */
function FeaturedBadge({ href, kind }: { href: string; kind: "forbes" | "gate" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={kind === "forbes" ? "Forbes Global Properties" : "GATE mag"}
      className="group/fb mt-7 inline-flex items-center gap-3.5 rounded-full border border-white/15 bg-white/[0.03] py-2.5 pl-4 pr-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d3b57f]/45 hover:bg-white/[0.06]"
    >
      <span className="text-[10px] uppercase tracking-[1.7px] text-white/45">As featured with</span>
      <span className="h-5 w-px bg-white/15" />
      {kind === "forbes" ? <ForbesWordmark /> : <GateWordmark />}
      <ArrowRight className="h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover/fb:translate-x-0 group-hover/fb:opacity-100" style={{ color: GOLD }} />
    </a>
  );
}

/**
 * Interactive magazine spread with a real 3D page-turn. Opens on the article
 * spread (pages 100–101) and lets the visitor turn the leaf to reveal the
 * second Dental Med Austria spread (the 102–103 showcase). Built from four page
 * scans: a static left page, a static right page underneath, and one physical
 * leaf between them (front = current right page, back = next left page) that
 * rotates around the spine. Keyboard- and click-accessible; reduced-motion
 * users still get an instant, correct swap because it is plain state + CSS.
 */
function MagazineFlip({ pages, alt }: { pages: string[]; alt: string }) {
  const [flipped, setFlipped] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [p0, p1, p2, p3] = pages;
  const rootRef = useRef<HTMLDivElement>(null);
  const engaged = useRef(false); // true once the visitor interacts OR the hint has fired

  const cancelHint = () => {
    engaged.current = true;
    setNudge(false);
  };
  const next = () => {
    cancelHint();
    setFlipped(true);
  };
  const prev = () => {
    cancelHint();
    setFlipped(false);
  };

  // Gentle one-time nudge: when the magazine scrolls into view, lift the leaf at
  // the spine and let it settle, so visitors notice it's a real, turnable
  // magazine. Skipped under prefers-reduced-motion and cancelled the instant the
  // visitor touches a control.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t1: ReturnType<typeof setTimeout>, t2: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !engaged.current) {
          engaged.current = true;
          io.disconnect();
          t1 = setTimeout(() => setNudge(true), 2200);
          t2 = setTimeout(() => setNudge(false), 3600);
        }
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {/* sheet stack peeking out behind the book */}
      <div className="absolute inset-x-5 -bottom-2 top-2 rotate-[0.9deg] rounded-[4px] bg-white/[0.07]" />
      <div className="absolute inset-x-2.5 -bottom-1 top-1 rotate-[-0.6deg] rounded-[4px] bg-white/[0.14]" />

      <div
        className="group/book relative w-full select-none overflow-hidden rounded-[5px] bg-[#0a0a0b] shadow-[0_34px_70px_-22px_rgba(0,0,0,0.7)] ring-1 ring-white/12"
        style={{ aspectRatio: "1934 / 1350", perspective: "2400px" }}
      >
        {/* static LEFT page (revealed leaf-back covers it when turned) */}
        <div className="absolute left-0 top-0 h-full w-1/2 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element -- static page scan */}
          <img src={p0} alt="" aria-hidden className="h-full w-full object-cover" loading="lazy" decoding="async" />
        </div>

        {/* RIGHT half: the revealed page sits under the turning leaf */}
        <div className="absolute right-0 top-0 z-10 h-full w-1/2" style={{ transformStyle: "preserve-3d" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static page scan */}
          <img src={p3} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />

          {/* the turning leaf, hinged at the spine (its left edge = page centre).
              `nudge` gives it a small one-time lift so visitors notice it turns. */}
          <div
            className="absolute inset-0 origin-left transition-transform"
            style={{
              transformStyle: "preserve-3d",
              transitionDuration: nudge ? "900ms" : "1150ms",
              transitionTimingFunction: "cubic-bezier(0.645, 0.045, 0.355, 1)",
              transform: flipped ? "rotateY(-180deg)" : nudge ? "rotateY(-20deg)" : "rotateY(0deg)",
            }}
          >
            {/* front face = current right page (p1) */}
            <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static page scan */}
              <img src={p1} alt={alt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
              {/* gutter shading + a sheen that sweeps as the leaf turns */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.30),transparent_18%)]" />
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                style={{ opacity: flipped ? 0.5 : 0, background: "linear-gradient(105deg,rgba(255,255,255,0.22),transparent 42%)" }}
              />
            </div>
            {/* back face = next left page (p2), pre-rotated so it reads correctly */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static page scan */}
              <img src={p2} alt="" aria-hidden className="h-full w-full object-cover" loading="lazy" decoding="async" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.30)_82%)]" />
            </div>
          </div>
        </div>

        {/* centre gutter fold, always on top */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-12 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.26)_50%,transparent)]" />

        {/* click zones: right half turns forward, left half turns back */}
        <button
          type="button"
          aria-label="Turn to the next page"
          onClick={next}
          className={cn("absolute right-0 top-0 z-30 h-full w-1/2", flipped ? "pointer-events-none" : "cursor-pointer")}
        />
        <button
          type="button"
          aria-label="Turn to the previous page"
          onClick={prev}
          className={cn("absolute left-0 top-0 z-30 h-full w-1/2", flipped ? "cursor-pointer" : "pointer-events-none")}
        />

        {/* corner curl hint (fades out once turned) */}
        <div
          className={cn(
            "pointer-events-none absolute bottom-0 right-0 z-20 h-16 w-16 transition-opacity duration-500",
            flipped ? "opacity-0" : "opacity-100 animate-[fadeInUp_0.7s_ease-out]",
          )}
          style={{
            background: "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.55))",
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          }}
        />
      </div>

      {/* controls: prev · dots · next */}
      <div className="mt-5 flex items-center justify-center gap-5">
        <button
          type="button"
          aria-label="Previous page"
          onClick={prev}
          disabled={!flipped}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
        </button>
        <div className="flex items-center gap-2">
          {[false, true].map((f) => (
            <button
              key={String(f)}
              type="button"
              aria-label={f ? "Second spread" : "First spread"}
              aria-current={flipped === f}
              onClick={() => setFlipped(f)}
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: flipped === f ? 22 : 8, backgroundColor: flipped === f ? GOLD : "rgba(255,255,255,0.28)" }}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next page"
          onClick={next}
          disabled={flipped}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SpreadVisual({ item, alt }: { item: PressItem; alt: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-x-6 -bottom-2.5 top-2.5 rotate-[1.1deg] rounded-[4px] bg-white/[0.08]" />
      <div className="absolute inset-x-3 -bottom-1 top-1 rotate-[-0.7deg] rounded-[4px] bg-white/[0.16]" />

      <div className="relative flex overflow-hidden rounded-[5px] bg-[#f6f3ec] shadow-[0_34px_70px_-22px_rgba(0,0,0,0.65)] ring-1 ring-white/15 transition duration-700 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_46px_90px_-24px_rgba(0,0,0,0.75)]">
        <img src={item.images[0]} alt="" aria-hidden className="w-1/2 object-cover" loading="lazy" decoding="async" />
        <img src={item.images[1]} alt={alt} className="w-1/2 object-cover" loading="lazy" decoding="async" />
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-14 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.14)_42%,rgba(0,0,0,0.34)_50%,rgba(0,0,0,0.14)_58%,transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.14),transparent_38%)]" />
      </div>
    </div>
  );
}

function FanVisual({ item, alt }: { item: PressItem; alt: string }) {
  return (
    <div className="relative mx-auto flex w-fit justify-center pl-[16%] pt-4">
      <img
        src={item.images[0]}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="absolute left-0 top-8 w-[52%] rotate-[-7deg] rounded-[4px] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.7)] ring-1 ring-white/15 transition duration-700 ease-out group-hover:rotate-[-9deg] group-hover:-translate-x-1"
      />
      <div className="relative overflow-hidden rounded-[4px] shadow-[0_34px_70px_-22px_rgba(0,0,0,0.7)] ring-1 ring-white/15 transition duration-700 ease-out group-hover:-translate-y-2 group-hover:rotate-[0.8deg] group-hover:shadow-[0_46px_90px_-24px_rgba(0,0,0,0.8)]">
        <img src={item.images[1]} alt={alt} className="w-[300px] max-w-[62vw] sm:w-[340px]" loading="lazy" decoding="async" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.14),transparent_38%)]" />
      </div>
    </div>
  );
}

export function PressFeatures() {
  const { locale } = useLocale();
  const t = T[locale] ?? T.en;

  return (
    <>
      <style>{animationStyles}</style>
      <section
        id="press"
        aria-labelledby="press-title"
        className="relative overflow-hidden bg-[#071522] py-24"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-[-260px] h-[520px] w-[860px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(211,181,127,0.16), transparent)" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-4 top-2 select-none font-serif text-[110px] leading-none text-white/[0.04] md:text-[210px]"
        >
          PRESS
        </span>

        <div className="tpds-container relative">
          <Reveal className="mx-auto max-w-3xl text-center" y={26}>
            <p className="eyebrow" style={{ color: GOLD }}>
              {t.eyebrow}
            </p>
            <h2
              id="press-title"
              className="mt-4 font-serif text-[clamp(30px,4vw,48px)] font-normal leading-[1.12] text-white"
            >
              {t.title}
            </h2>
            <p className="mt-6 text-[15.5px] leading-relaxed text-white/55">{t.lead}</p>
          </Reveal>

          <div className="mt-20 space-y-24">
            {FEATURES.map((item, i) => {
              const gloss = item.gloss[locale] ?? item.gloss.en;
              const alt = item.alt[locale] ?? item.alt.en;
              const reversed = i % 2 === 1;
              return (
                <Reveal
                  key={item.key}
                  className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16"
                  y={30}
                >
                  {item.variant === "flipbook" ? (
                    <div className={cn("lg:col-span-7 animate-magazine", reversed && "lg:order-2")}>
                      <MagazineFlip pages={item.images} alt={alt} />
                      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-3 text-[10.5px] uppercase tracking-[0.24em] text-white/40">
                        <span>{item.folioLeft}</span>
                        <span>{item.folioRight}</span>
                      </div>
                    </div>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t.cta}, ${item.publication}`}
                      className={cn("group block lg:col-span-7 animate-magazine", reversed && "lg:order-2")}
                    >
                      {item.variant === "spread" ? (
                        <SpreadVisual item={item} alt={alt} />
                      ) : (
                        <FanVisual item={item} alt={alt} />
                      )}
                      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-3 text-[10.5px] uppercase tracking-[0.24em] text-white/40">
                        <span>{item.folioLeft}</span>
                        <span>{item.folioRight}</span>
                      </div>
                    </a>
                  )}

                  <div className={cn("lg:col-span-5 animate-magazine-delayed", reversed && "lg:order-1")}>
                    <div className="flex items-center gap-3">
                      <span className="h-px w-10 shrink-0" style={{ backgroundColor: GOLD }} />
                      <p className="eyebrow !text-[12px] !tracking-[1.8px]" style={{ color: GOLD }}>
                        {item.kicker[locale] ?? item.kicker.en}
                      </p>
                    </div>
                    <h3 className="mt-5 font-serif text-[clamp(26px,2.6vw,36px)] font-normal leading-[1.15] text-white">
                      &ldquo;{item.headline}&rdquo;
                    </h3>
                    {gloss && (
                      <p className="mt-2 font-serif text-[17px] italic leading-snug text-white/50">{gloss}</p>
                    )}
                    <p className="mt-5 text-[15.5px] leading-relaxed text-white/60">
                      {item.description[locale] ?? item.description.en}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] uppercase tracking-[0.18em] text-white/40">
                      <span>{item.issue}</span>
                      <span className="h-1 w-1 rounded-full" style={{ backgroundColor: `${GOLD}99` }} />
                      <span>{item.pages[locale] ?? item.pages.en}</span>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/cta mt-8 inline-flex items-center gap-3 border-b pb-1.5 text-[13px] uppercase tracking-[0.2em] transition-colors hover:text-white"
                      style={{ color: GOLD, borderColor: `${GOLD}66` }}
                    >
                      {t.cta}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1.5" />
                    </a>
                    {item.featured && <FeaturedBadge href={item.featured.href} kind={item.featured.kind} />}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
