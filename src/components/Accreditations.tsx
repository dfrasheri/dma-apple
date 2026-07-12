"use client";

/**
 * Accreditations & professional memberships, the clinic's credential wall.
 *
 * A continuously revolving strip of the real logos of the bodies the clinic is
 * certified by / a member of. The logos are background-removed (transparent) and
 * revolve on ONE shared light rail, no per-logo boxes, so the multi-colour
 * real marks stay legible on the house navy without recolouring anyone's
 * trademark. The strip reuses the sitewide `tpds-marquee` animation (edge fade,
 * pause-on-hover, reduced-motion aware). Each slot falls back to a clean wordmark
 * until its logo file is present, then swaps to the image automatically.
 *
 * LOGO SOURCING, files live in public/images/accreditations/ :
 *   iso-9001-tuvnord.svg ← TÜV NORD mark (the trademark-safe ISO 9001
 *                          certification-body mark, not the ISO org logo). [present]
 *   iti.svg              ← official ITI logo (bg removed).                 [present]
 *   eda.svg              ← EDA (European Dental Association e.V.) logo.    [present]
 *   ada-transparent.png  ← American Dental Association logo, white bg knocked
 *                          out to transparent so the shared black-silhouette
 *                          filter shows the mark, not a black box.          [present]
 * Each logo is clickable and links to the organization's website.
 *
 * SEO/GEO/AEO: the lead paragraph literally answers "Is Dental Med Austria
 * accredited?" in the visitor's language (answer-engine bait), the bodies live
 * in the sitewide Dentist entity (`hasCredential`/`memberOf` in src/lib/seo.ts),
 * and this section emits the homepage FAQPage JSON-LD, including the
 * implant-systems answer for the section below it (one FAQPage per page).
 */
import { useState } from "react";
import { useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/dictionaries";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { CLINIC_ID, localeUrl } from "@/lib/seo";

const GOLD = "#d3b57f";

type Accreditation = {
  key: string;
  /** Short wordmark used for alt text and the pre-logo fallback. */
  acronym: string;
  /** Localized full name shown beneath the logo. */
  name: Record<Locale, string>;
  /** Path to the real logo file under /public (missing files fall back). */
  logo: string;
  /** URL to open when logo is clicked. */
  url: string;
  /**
   * Rendered height in px. The marks range from ultra-wide wordmarks (TÜV NORD,
   * 6.6:1) to near-square emblems (ADA, 2.3:1), so a shared height would make
   * the wide ones enormous and the square ones tiny, each gets an optical
   * height tuned so all five carry similar visual weight on the rail.
   */
  height: number;
};

const ACCREDITATIONS: Accreditation[] = [
  {
    key: "iso",
    acronym: "ISO 9001",
    logo: "/images/accreditations/iso-9001-tuvnord.svg",
    url: "https://www.tuev-nord.de/en/industries/healthcare/",
    height: 26,
    name: {
      en: "ISO 9001, certified by TÜV NORD",
      sq: "ISO 9001, certifikuar nga TÜV NORD",
      it: "ISO 9001, certificata da TÜV NORD",
      de: "ISO 9001, zertifiziert durch TÜV NORD",
      fr: "ISO 9001, certifiée par TÜV NORD",
    },
  },
  {
    key: "iti",
    acronym: "ITI",
    logo: "/images/accreditations/iti.svg",
    url: "https://www.iti.org/",
    height: 40,
    name: {
      en: "International Team for Implantology",
      sq: "International Team for Implantology",
      it: "International Team for Implantology",
      de: "International Team for Implantology",
      fr: "International Team for Implantology",
    },
  },
  {
    key: "eda",
    acronym: "EDA",
    logo: "/images/accreditations/eda.svg",
    url: "https://www.edassociation.org/",
    height: 46,
    name: {
      en: "European Dental Association",
      sq: "Shoqata Dentare Evropiane",
      it: "Associazione Dentale Europea",
      de: "European Dental Association",
      fr: "Association Dentaire Européenne",
    },
  },
  {
    key: "ada",
    acronym: "ADA",
    logo: "/images/accreditations/ada-transparent.png",
    url: "https://www.ada.org/",
    height: 48,
    name: {
      en: "American Dental Association",
      sq: "American Dental Association",
      it: "American Dental Association",
      de: "American Dental Association",
      fr: "American Dental Association",
    },
  },
];

const T: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    lead: string;
    /** FAQ pairs mirrored into the per-locale FAQPage JSON-LD. */
    faqQ1: string;
    faqA1: string;
    faqQ2: string;
    faqA2: string;
  }
> = {
  en: {
    eyebrow: "Accreditations & Professional Memberships",
    title: "An Internationally Accredited Dental Clinic in Tirana, Albania",
    lead:
      "Is Dental Med Austria accredited? Yes, an ISO 9001-certified dental clinic (TÜV NORD) and an active member of ITI (International Team for Implantology), the European Dental Association (EDA), and the American Dental Association (ADA).",
    faqQ1: "Is Dental Med Austria an accredited dental clinic?",
    faqA1:
      "Yes. Dental Med Austria in Tirana, Albania is an ISO 9001-certified dental clinic (certified by TÜV NORD) and a member of ITI (International Team for Implantology), the European Dental Association (EDA), and the American Dental Association (ADA). Treatments follow ISO 9001 quality management, strict European hygiene protocols and rigorous sterilisation, every instrument sterilised after every patient.",
    faqQ2: "Which dental implant systems and crown ceramics does Dental Med Austria use?",
    faqA2:
      "Dental Med Austria works with internationally documented implant systems, Swiss-made Straumann, ETK (France), Alpha-Bio and Biodem, restored with IPS e.max ceramics by Ivoclar and e.max pressed ceramics by GiSi. Every implant placed at the clinic comes with the manufacturer's implant passport, carrying serial numbers you can verify directly with the manufacturer.",
  },
  sq: {
    eyebrow: "Akreditime & Anëtarësi Profesionale",
    title: "Klinikë Dentare e Akredituar Ndërkombëtarisht",
    lead:
      "A është Dental Med Austria klinikë e akredituar? Po, klinikë dentare e certifikuar ISO 9001 (nga TÜV NORD) dhe anëtare aktive e ITI (International Team for Implantology), EDA (European Dental Association) dhe ADA (American Dental Association).",
    faqQ1: "A është Dental Med Austria klinikë dentare e akredituar?",
    faqA1:
      "Po. Dental Med Austria në Tiranë është klinikë dentare e certifikuar ISO 9001 (nga TÜV NORD) dhe anëtare e ITI (International Team for Implantology), EDA (European Dental Association) dhe ADA (American Dental Association). Trajtimet ndjekin menaxhimin e cilësisë ISO 9001, protokolle rigoroze sterilizimi dhe standarde të rrepta evropiane higjiene.",
    faqQ2: "Cilat sisteme implantesh dhe qeramika kurorash përdor Dental Med Austria?",
    faqA2:
      "Dental Med Austria punon me sisteme implantesh të dokumentuara ndërkombëtarisht, Straumann i prodhuar në Zvicër, ETK (Francë), Alpha-Bio dhe Biodem, të restauruara me qeramikat IPS e.max nga Ivoclar dhe qeramikat e presuara e.max nga GiSi. Çdo implant i vendosur në klinikë shoqërohet me pasaportën e prodhuesit, me numra serialë të verifikueshëm drejtpërdrejt te prodhuesi.",
  },
  it: {
    eyebrow: "Accreditamenti & Affiliazioni Professionali",
    title: "Una Clinica Dentale con Accreditamenti Internazionali a Tirana",
    lead:
      "Dental Med Austria è una clinica accreditata? Sì, una clinica dentale certificata ISO 9001 (da TÜV NORD) e membro attivo di ITI (International Team for Implantology), EDA (European Dental Association) e ADA (American Dental Association).",
    faqQ1: "Dental Med Austria è una clinica dentale accreditata?",
    faqA1:
      "Sì. Dental Med Austria a Tirana, in Albania, è una clinica dentale certificata ISO 9001 (da TÜV NORD) e membro di ITI (International Team for Implantology), EDA (European Dental Association) e ADA (American Dental Association). I trattamenti seguono la gestione della qualità ISO 9001, severi standard igienici europei e protocolli di sterilizzazione rigorosi.",
    faqQ2: "Quali sistemi implantari e ceramiche per corone usa Dental Med Austria?",
    faqA2:
      "Dental Med Austria lavora con sistemi implantari documentati a livello internazionale, Straumann made in Switzerland, ETK (Francia), Alpha-Bio e Biodem, restaurati con le ceramiche IPS e.max di Ivoclar e le ceramiche pressate e.max di GiSi. Ogni impianto inserito in clinica è accompagnato dal passaporto del produttore, con numeri di serie verificabili direttamente presso il produttore.",
  },
  de: {
    eyebrow: "Akkreditierungen & Mitgliedschaften",
    title: "Eine international akkreditierte Zahnklinik in Tirana, Albanien",
    lead:
      "Ist Dental Med Austria akkreditiert? Ja, eine ISO-9001-zertifizierte Zahnklinik (durch TÜV NORD) und aktives Mitglied von ITI (International Team for Implantology), EDA (European Dental Association) und ADA (American Dental Association).",
    faqQ1: "Ist Dental Med Austria eine akkreditierte Zahnklinik?",
    faqA1:
      "Ja. Dental Med Austria in Tirana, Albanien, ist eine ISO-9001-zertifizierte Zahnklinik (zertifiziert durch TÜV NORD) und Mitglied von ITI (International Team for Implantology), EDA (European Dental Association) und ADA (American Dental Association). Behandlungen folgen dem ISO-9001-Qualitätsmanagement, strikten europäischen Hygienestandards und strengen Sterilisationsprotokollen.",
    faqQ2: "Welche Implantatsysteme und Kronenkeramiken verwendet Dental Med Austria?",
    faqA2:
      "Dental Med Austria arbeitet mit international dokumentierten Implantatsystemen, Swiss-made Straumann, ETK (Frankreich), Alpha-Bio und Biodem, restauriert mit IPS-e.max-Keramik von Ivoclar und gepresster e.max-Keramik von GiSi. Jedes in der Klinik gesetzte Implantat wird mit dem Implantatpass des Herstellers übergeben, mit direkt beim Hersteller überprüfbaren Seriennummern.",
  },
  fr: {
    eyebrow: "Accréditations & Affiliations Professionnelles",
    title: "Une Clinique Dentaire Accréditée Internationalement à Tirana",
    lead:
      "Dental Med Austria est-elle une clinique accréditée ? Oui, une clinique dentaire certifiée ISO 9001 (par TÜV NORD) et membre actif de l'ITI (International Team for Implantology), de l'EDA (European Dental Association) et de l'ADA (American Dental Association).",
    faqQ1: "Dental Med Austria est-elle une clinique dentaire accréditée ?",
    faqA1:
      "Oui. Dental Med Austria à Tirana, en Albanie, est une clinique dentaire certifiée ISO 9001 (par TÜV NORD) et membre de l'ITI (International Team for Implantology), de l'EDA (European Dental Association) et de l'ADA (American Dental Association). Les traitements suivent le management de la qualité ISO 9001, des normes d'hygiène européennes strictes et des protocoles de stérilisation rigoureux.",
    faqQ2: "Quels systèmes implantaires et céramiques de couronnes utilise Dental Med Austria ?",
    faqA2:
      "Dental Med Austria travaille avec des systèmes implantaires documentés internationalement, Straumann fabriqué en Suisse, ETK (France), Alpha-Bio et Biodem, restaurés avec les céramiques IPS e.max d'Ivoclar et les céramiques pressées e.max de GiSi. Chaque implant posé à la clinique est remis avec le passeport du fabricant, portant des numéros de série vérifiables directement auprès du fabricant.",
  },
};

/**
 * Homepage FAQ, built per locale so the structured data matches the visible
 * page language on every localized URL (visible-content parity). The answers
 * mirror the lead copy here and in <ImplantSystems />.
 */
function faqJsonLd(locale: Locale) {
  const t = T[locale] ?? T.en;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${localeUrl(locale, "/")}#faq`,
    inLanguage: locale,
    about: { "@id": CLINIC_ID },
    mainEntity: [
      {
        "@type": "Question",
        name: t.faqQ1,
        acceptedAnswer: { "@type": "Answer", text: t.faqA1 },
      },
      {
        "@type": "Question",
        name: t.faqQ2,
        acceptedAnswer: { "@type": "Answer", text: t.faqA2 },
      },
    ],
  };
}

/**
 * One revolving logo: the transparent (background-removed) mark itself, no
 * per-logo box, the shared light rail behind the strip is the only surface.
 * Until a logo file exists at `item.logo` (or if it fails to load), it renders
 * a clean serif wordmark of the acronym so the strip never looks broken.
 */
function LogoTile({ item, hidden }: { item: Accreditation; hidden?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <li
      className="mx-9 flex h-16 shrink-0 items-center justify-center"
      aria-hidden={hidden || undefined}
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center transition-opacity hover:opacity-75"
        title={item.name.en}
      >
        {failed ? (
          <span className="font-serif text-[20px] tracking-wide text-[#0b1f33]">
            {item.acronym}
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- static logo, no optimization needed
          <img
            src={item.logo}
            alt={`${item.acronym} logo`}
            className="w-auto object-contain"
            style={{ height: item.height, filter: "brightness(0) saturate(0)" }}
            onError={() => setFailed(true)}
          />
        )}
      </a>
    </li>
  );
}

export function Accreditations() {
  const { locale } = useLocale();
  const t = T[locale] ?? T.en;

  return (
    <section
      id="accreditations"
      aria-labelledby="accreditations-title"
      className="relative overflow-hidden bg-white py-20"
    >
      <JsonLd data={faqJsonLd(locale)} />

      <div className="tpds-container relative">
        <Reveal className="mx-auto max-w-3xl text-center" y={26}>
          <p className="eyebrow" style={{ color: GOLD }}>
            {t.eyebrow}
          </p>
          <h2
            id="accreditations-title"
            className="mt-4 font-serif text-[clamp(30px,4vw,48px)] font-normal leading-[1.12] text-[#071522]"
          >
            {t.title}
          </h2>
          <p className="mt-6 text-[15.5px] leading-relaxed text-[#071522]/60">{t.lead}</p>
        </Reveal>
      </div>

      {/* revolving logo strip */}
      <div className="tpds-container relative mt-14">
        <Reveal
          className="tpds-marquee-mask relative mx-auto max-w-5xl overflow-hidden rounded-[20px] border border-[#e8e6e0] bg-[#f9f8f6] py-8 shadow-[0_4px_24px_rgba(7,21,34,0.06)]"
          y={24}
        >
          <ul className="tpds-marquee-track flex w-max items-center">
            {ACCREDITATIONS.map((a) => (
              <LogoTile key={a.key} item={a} />
            ))}
            {/* duplicate set for a seamless -50% loop; decorative to AT */}
            {ACCREDITATIONS.map((a) => (
              <LogoTile key={`${a.key}-dup`} item={a} hidden />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
