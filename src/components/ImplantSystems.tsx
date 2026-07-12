"use client";

/**
 * The implant systems & ceramics wall, every material the clinic restores a
 * smile with, shown as premium plaques with a hover "quality dossier" and a
 * designed implant-passport card. Each card leads with the system's mark on a
 * quiet paper "logo stage" (real logo where we have the file, letterpress
 * serif wordmark otherwise), never cropped photos of logos.
 *
 * Deliberately never the word "brands": these are clinical systems the clinic
 * is accountable for. Cards keep name/summary/chips always visible (mobile
 * included); pointer devices get the dossier overlay on hover/focus.
 *
 * SEO/GEO/AEO: answer-shaped lead ("Which implants does DMA use? …"), keyword
 * alt texts, and an ItemList of Brand entities anchored to the clinic id. The
 * matching FAQ answer is emitted by <Accreditations /> (one FAQPage per page).
 */
import { useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/dictionaries";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { CLINIC_ID, localeUrl } from "@/lib/seo";

const GOLD = "#d3b57f";
const NAVY = "#071522";

type SystemKind = "implant" | "ceramic";

type SystemDef = {
  key: string;
  display: string;
  kind: SystemKind;
  /** Existing logo asset, when we have the real mark on disk. */
  logo?: string;
  /** Clinic photo + honest alt, currently unused by the card (the logo stage
   *  replaced photo headers) but kept for reuse elsewhere. */
  photo: string;
  photoAlt: string;
  passport: boolean;
  /** Only well-known public origins are stated (see docs/SAFETY-CONFIRM-WITH-CLINIC.md). */
  origin?: "ch" | "fr" | "li";
  heritage: Record<Locale, string>;
  blurb: Record<Locale, string>;
};

const SYSTEMS: SystemDef[] = [
  {
    key: "straumann",
    display: "Straumann®",
    kind: "implant",
    logo: "/images/brands/straumann-logo.svg",
    photo: "/images/dma/partner-straumann.jpg",
    photoAlt: "Straumann implant system materials at Dental Med Austria, Tirana",
    passport: true,
    origin: "ch",
    heritage: {
      en: "Swiss-made, created in Basel, Switzerland, the global reference in implantology, backed by decades of published clinical research.",
      sq: "I prodhuar në Zvicër, i krijuar në Bazel, referenca botërore e implantologjisë, e mbështetur nga dekada studimesh klinike të publikuara.",
      it: "Made in Switzerland, creato a Basilea, il riferimento mondiale dell'implantologia, sostenuto da decenni di ricerca clinica pubblicata.",
      de: "Swiss made, entwickelt in Basel, die weltweite Referenz der Implantologie, gestützt auf Jahrzehnte publizierter klinischer Forschung.",
      fr: "Fabriqué en Suisse, créé à Bâle, la référence mondiale de l'implantologie, appuyée par des décennies de recherche clinique publiée.",
    },
    blurb: {
      en: "The gold standard of dental implants, our choice for cases that demand maximum long-term certainty.",
      sq: "Standardi i artë i implanteve dentare, zgjedhja jonë për rastet që kërkojnë siguri maksimale afatgjatë.",
      it: "Il gold standard degli impianti dentali, la nostra scelta per i casi che richiedono la massima certezza a lungo termine.",
      de: "Der Goldstandard der Zahnimplantate, unsere Wahl für Fälle, die maximale Langzeitsicherheit verlangen.",
      fr: "Le gold standard des implants dentaires, notre choix pour les cas exigeant une certitude maximale à long terme.",
    },
  },
  {
    key: "etk",
    display: "ETK",
    kind: "implant",
    logo: "/images/brands/etk.png",
    photo: "/images/dma/clinic-xray.jpg",
    photoAlt: "Digital X-ray diagnostics for implant planning at Dental Med Austria, Tirana",
    passport: true,
    origin: "fr",
    heritage: {
      en: "Sallanches, France, French implant engineering with prosthetic precision and standardised components.",
      sq: "Sallanches, Francë, inxhinieri franceze implantesh me precizion protetik dhe komponentë të standardizuar.",
      it: "Sallanches, Francia, ingegneria implantare francese con precisione protesica e componenti standardizzati.",
      de: "Sallanches, Frankreich, französische Implantat-Ingenieurskunst mit prothetischer Präzision.",
      fr: "Sallanches, France, l'ingénierie implantaire française, précision prothétique et composants standardisés.",
    },
    blurb: {
      en: "A European system with full clinical documentation, a favourite for guided, digitally planned surgery.",
      sq: "Sistem evropian me dokumentim të plotë klinik, i preferuar për kirurgjinë e guiduar dhe të planifikuar dixhitalisht.",
      it: "Un sistema europeo con documentazione clinica completa, ideale per la chirurgia guidata e pianificata digitalmente.",
      de: "Ein europäisches System mit vollständiger klinischer Dokumentation, ideal für geführte, digital geplante Chirurgie.",
      fr: "Un système européen à la documentation clinique complète, idéal pour la chirurgie guidée planifiée numériquement.",
    },
  },
  {
    key: "alphabio",
    display: "Alpha-Bio",
    kind: "implant",
    photo: "/images/dma/interiors/sterilization-room.jpg",
    photoAlt: "Alpha-Bio implant system materials at Dental Med Austria, Tirana",
    passport: true,
    heritage: {
      en: "An internationally established implant system, widely documented and placed in clinics worldwide, with a versatile, standardised prosthetic range.",
      sq: "Sistem implantesh i njohur ndërkombëtarisht, i dokumentuar gjerësisht dhe i përdorur në klinika anembanë botës, me gamë protetike të gjithanshme e të standardizuar.",
      it: "Un sistema implantare affermato a livello internazionale, ampiamente documentato e utilizzato in cliniche di tutto il mondo, con una gamma protesica versatile e standardizzata.",
      de: "Ein international etabliertes Implantatsystem, umfassend dokumentiert und weltweit in Kliniken eingesetzt, mit vielseitigem, standardisiertem Prothetiksortiment.",
      fr: "Un système implantaire reconnu internationalement, largement documenté et posé dans des cliniques du monde entier, avec une gamme prothétique polyvalente et standardisée.",
    },
    blurb: {
      en: "A proven, widely used system offering excellent value, placed under the same sterile protocols as every premium line we use.",
      sq: "Sistem i provuar dhe i përdorur gjerësisht me vlerë të shkëlqyer, i vendosur me të njëjtat protokolle sterile si çdo linjë premium që përdorim.",
      it: "Un sistema collaudato e molto diffuso dall'ottimo rapporto qualità-prezzo, inserito con gli stessi protocolli sterili di ogni linea premium che usiamo.",
      de: "Ein bewährtes, weit verbreitetes System mit hervorragendem Preis-Leistungs-Verhältnis, gesetzt nach denselben sterilen Protokollen wie jede Premium-Linie.",
      fr: "Un système éprouvé et très répandu offrant un excellent rapport qualité-prix, posé selon les mêmes protocoles stériles que chaque ligne premium.",
    },
  },
  {
    key: "biodem",
    display: "Biodem",
    kind: "implant",
    logo: "/images/brands/biodem.svg",
    photo: "/images/dma/partner-biodem.jpg",
    photoAlt: "Biodem implant system materials at Dental Med Austria, Tirana",
    passport: true,
    heritage: {
      en: "Fully documented implant system with a complete prosthetic range and full serial traceability.",
      sq: "Sistem implantesh i dokumentuar plotësisht, me gamë të plotë protetike dhe gjurmueshmëri të plotë seriale.",
      it: "Sistema implantare pienamente documentato, con gamma protesica completa e piena tracciabilità seriale.",
      de: "Vollständig dokumentiertes Implantatsystem mit komplettem Prothetiksortiment und lückenloser Serien-Rückverfolgbarkeit.",
      fr: "Système implantaire entièrement documenté, avec une gamme prothétique complète et une traçabilité sérielle totale.",
    },
    blurb: {
      en: "Excellent quality-to-value ratio, always delivered with its implant passport and verifiable serial numbers.",
      sq: "Raport i shkëlqyer cilësi–vlerë, gjithmonë me pasaportën e implantit dhe numra serialë të verifikueshëm.",
      it: "Eccellente rapporto qualità-prezzo, sempre consegnato con il passaporto implantare e numeri di serie verificabili.",
      de: "Hervorragendes Preis-Leistungs-Verhältnis, stets mit Implantatpass und überprüfbaren Seriennummern.",
      fr: "Excellent rapport qualité-prix, toujours livré avec son passeport implantaire et des numéros de série vérifiables.",
    },
  },
  {
    key: "emax-ivoclar",
    display: "IPS e.max®, Ivoclar",
    kind: "ceramic",
    logo: "/images/brands/ivoclar-logo.svg",
    photo: "/images/dma/partner-ivoclar.jpg",
    photoAlt: "IPS e.max ceramic material by Ivoclar at Dental Med Austria, Tirana",
    passport: false,
    origin: "li",
    heritage: {
      en: "Schaan, Liechtenstein, IPS e.max, the most clinically documented lithium-disilicate ceramic in the world.",
      sq: "Schaan, Lihtenshtajn, IPS e.max, qeramika e disilikatit të litiumit më e dokumentuar klinikisht në botë.",
      it: "Schaan, Liechtenstein, IPS e.max, la ceramica al disilicato di litio più documentata clinicamente al mondo.",
      de: "Schaan, Liechtenstein, IPS e.max, die klinisch am besten dokumentierte Lithium-Disilikat-Keramik der Welt.",
      fr: "Schaan, Liechtenstein, IPS e.max, la céramique au disilicate de lithium la plus documentée cliniquement au monde.",
    },
    blurb: {
      en: "Crowns and veneers with unmatched strength and lifelike aesthetics, backed by decades of clinical documentation.",
      sq: "Kurora dhe faseta me fortësi dhe estetikë të pashoqe, të mbështetura nga dekada dokumentimi klinik.",
      it: "Corone e faccette con resistenza senza pari ed estetica naturale, sostenute da decenni di documentazione clinica.",
      de: "Kronen und Veneers mit unerreichter Festigkeit und natürlicher Ästhetik, gestützt auf Jahrzehnte klinischer Dokumentation.",
      fr: "Couronnes et facettes d'une solidité et d'une esthétique inégalées, appuyées par des décennies de documentation clinique.",
    },
  },
  {
    key: "emax-gisi",
    display: "e.max, GiSi",
    kind: "ceramic",
    photo: "/images/dma/interiors/lab-detail-2.jpg",
    photoAlt: "Ceramic finishing in the in-house dental laboratory of Dental Med Austria, Tirana",
    passport: false,
    heritage: {
      en: "Pressed e.max line for aesthetic restorations, finished in our in-house laboratory for a perfect fit.",
      sq: "Linjë e presuar e.max për restaurime estetike, e përpunuar në laboratorin tonë të brendshëm për përshtatje të përsosur.",
      it: "Linea e.max pressata per restauri estetici, rifinita nel nostro laboratorio interno per un adattamento perfetto.",
      de: "Gepresste e.max-Linie für ästhetische Restaurationen, gefertigt in unserem hauseigenen Labor für perfekten Sitz.",
      fr: "Ligne e.max pressée pour les restaurations esthétiques, finie dans notre laboratoire interne pour un ajustement parfait.",
    },
    blurb: {
      en: "Zero outsourcing: every detail is controlled by our own ceramists, from shade to final glaze.",
      sq: "Asnjë nënkontraktim: çdo detaj kontrollohet nga qeramistët tanë, nga ngjyra deri te glazura finale.",
      it: "Zero outsourcing: ogni dettaglio è controllato dai nostri ceramisti, dal colore alla glasura finale.",
      de: "Kein Outsourcing: Jedes Detail kontrollieren unsere eigenen Keramiker, vom Farbton bis zur finalen Glasur.",
      fr: "Zéro sous-traitance : chaque détail est contrôlé par nos propres céramistes, de la teinte au glaçage final.",
    },
  },
];

const T: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    lead: string;
    origins: { ch: string; fr: string; li: string };
    kindImplant: string;
    kindCeramic: string;
    dossier: string;
    use: string;
    docs: string;
    useImplantValue: string;
    useCeramicValue: string;
    docsValueImplant: string;
    docsValueCeramic: string;
    passportIncluded: string;
    passportTitle: string;
    passportKicker: string;
    passportHeading: string;
    passportBody: string;
    passportSystems: string;
    rowSystem: string;
    rowSerial: string;
    rowLot: string;
    rowDate: string;
    rowVerify: string;
    verifyValue: string;
  }
> = {
  en: {
    eyebrow: "Premium Materials & Systems",
    title: "The Implant Systems & Ceramics Behind Every Smile",
    lead:
      "Which implants does Dental Med Austria use? Only internationally documented systems, Swiss-made Straumann, ETK (France), Alpha-Bio and Biodem, restored with IPS e.max ceramics by Ivoclar and GiSi. Nothing anonymous ever enters your mouth: every implant arrives with its manufacturer's passport and verifiable serial numbers.",
    origins: { ch: "Swiss-made", fr: "France", li: "Liechtenstein" },
    kindImplant: "Implant system",
    kindCeramic: "Crown & veneer ceramic",
    dossier: "Quality dossier",
    use: "Used for",
    docs: "Documentation",
    useImplantValue: "Implants · guided surgery",
    useCeramicValue: "Crowns · veneers",
    docsValueImplant: "Serial + lot traceability",
    docsValueCeramic: "Clinically documented ceramic",
    passportIncluded: "Implant passport included",
    passportTitle: "IMPLANT PASSPORT",
    passportKicker: "Your proof of quality",
    passportHeading: "You leave with an implant passport in hand",
    passportBody:
      "After your surgery, every implant we place, Straumann, ETK, Alpha-Bio or Biodem, is handed over with the manufacturer's official implant passport: the exact system, diameter, serial and lot number of what is in your jaw, verifiable directly with the manufacturer, anywhere in the world.",
    passportSystems: "Issued with every Straumann, ETK, Alpha-Bio and Biodem implant",
    rowSystem: "System",
    rowSerial: "Serial no.",
    rowLot: "Lot",
    rowDate: "Placed on",
    rowVerify: "Verification",
    verifyValue: "Direct with manufacturer",
  },
  sq: {
    eyebrow: "Materiale & Sisteme Premium",
    title: "Sistemet e Implanteve pas Çdo Buzëqeshjeje",
    lead:
      "Cilat implante përdoren në Dental Med Austria? Vetëm sisteme të dokumentuara ndërkombëtarisht, Straumann i prodhuar në Zvicër, ETK (Francë), Alpha-Bio dhe Biodem, të restauruara me qeramikat IPS e.max nga Ivoclar dhe GiSi. Asgjë anonime nuk hyn kurrë në gojën tuaj: çdo implant vjen me pasaportën e prodhuesit dhe numra serialë të verifikueshëm.",
    origins: { ch: "Prodhim zviceran", fr: "Francë", li: "Lihtenshtajn" },
    kindImplant: "Sistem implanti",
    kindCeramic: "Qeramikë kurorash & fasetash",
    dossier: "Dosja e cilësisë",
    use: "Përdoret për",
    docs: "Dokumentimi",
    useImplantValue: "Implante · kirurgji e guiduar",
    useCeramicValue: "Kurora · faseta",
    docsValueImplant: "Gjurmueshmëri seriale + lot",
    docsValueCeramic: "Qeramikë e dokumentuar klinikisht",
    passportIncluded: "Pasaporta e implantit e përfshirë",
    passportTitle: "PASAPORTA E IMPLANTIT",
    passportKicker: "Prova juaj e cilësisë",
    passportHeading: "Largoheni me pasaportën e implantit në dorë",
    passportBody:
      "Pas operacionit, çdo implant që vendosim, Straumann, ETK, Alpha-Bio apo Biodem, ju dorëzohet me pasaportën zyrtare të prodhuesit: sistemi i saktë, diametri, numri serial dhe loti i asaj që ndodhet në nofullën tuaj, i verifikueshëm drejtpërdrejt te prodhuesi, kudo në botë.",
    passportSystems: "Lëshohet me çdo implant Straumann, ETK, Alpha-Bio dhe Biodem",
    rowSystem: "Sistemi",
    rowSerial: "Nr. serial",
    rowLot: "Loti",
    rowDate: "Vendosur më",
    rowVerify: "Verifikimi",
    verifyValue: "Direkt te prodhuesi",
  },
  it: {
    eyebrow: "Materiali & Sistemi Premium",
    title: "I Sistemi Implantari e le Ceramiche Dietro Ogni Sorriso",
    lead:
      "Quali impianti usa Dental Med Austria? Solo sistemi documentati a livello internazionale, Straumann made in Switzerland, ETK (Francia), Alpha-Bio e Biodem, restaurati con le ceramiche IPS e.max di Ivoclar e GiSi. Nulla di anonimo entra mai nella tua bocca: ogni impianto arriva con il passaporto del produttore e numeri di serie verificabili.",
    origins: { ch: "Made in Switzerland", fr: "Francia", li: "Liechtenstein" },
    kindImplant: "Sistema implantare",
    kindCeramic: "Ceramica per corone & faccette",
    dossier: "Dossier di qualità",
    use: "Utilizzato per",
    docs: "Documentazione",
    useImplantValue: "Impianti · chirurgia guidata",
    useCeramicValue: "Corone · faccette",
    docsValueImplant: "Tracciabilità seriale + lotto",
    docsValueCeramic: "Ceramica documentata clinicamente",
    passportIncluded: "Passaporto implantare incluso",
    passportTitle: "PASSAPORTO IMPLANTARE",
    passportKicker: "La tua prova di qualità",
    passportHeading: "Esci con il passaporto implantare in mano",
    passportBody:
      "Dopo l'intervento, ogni impianto che inseriamo, Straumann, ETK, Alpha-Bio o Biodem, ti viene consegnato con il passaporto ufficiale del produttore: sistema esatto, diametro, numero di serie e lotto di ciò che è nella tua mascella, verificabile direttamente presso il produttore, ovunque nel mondo.",
    passportSystems: "Rilasciato con ogni impianto Straumann, ETK, Alpha-Bio e Biodem",
    rowSystem: "Sistema",
    rowSerial: "N. di serie",
    rowLot: "Lotto",
    rowDate: "Inserito il",
    rowVerify: "Verifica",
    verifyValue: "Diretta col produttore",
  },
  de: {
    eyebrow: "Premium-Materialien & Systeme",
    title: "Die Implantatsysteme & Keramiken hinter jedem Lächeln",
    lead:
      "Welche Implantate verwendet Dental Med Austria? Ausschließlich international dokumentierte Systeme, Swiss-made Straumann, ETK (Frankreich), Alpha-Bio und Biodem, restauriert mit IPS-e.max-Keramik von Ivoclar und GiSi. Nichts Anonymes gelangt je in Ihren Mund: Jedes Implantat kommt mit dem Pass des Herstellers und überprüfbaren Seriennummern.",
    origins: { ch: "Swiss made", fr: "Frankreich", li: "Liechtenstein" },
    kindImplant: "Implantatsystem",
    kindCeramic: "Kronen- & Veneer-Keramik",
    dossier: "Qualitätsdossier",
    use: "Eingesetzt für",
    docs: "Dokumentation",
    useImplantValue: "Implantate · geführte Chirurgie",
    useCeramicValue: "Kronen · Veneers",
    docsValueImplant: "Serien- + Chargenrückverfolgung",
    docsValueCeramic: "Klinisch dokumentierte Keramik",
    passportIncluded: "Implantatpass inklusive",
    passportTitle: "IMPLANTATPASS",
    passportKicker: "Ihr Qualitätsnachweis",
    passportHeading: "Sie verlassen die Klinik mit dem Implantatpass in der Hand",
    passportBody:
      "Nach dem Eingriff erhalten Sie zu jedem gesetzten Implantat, Straumann, ETK, Alpha-Bio oder Biodem, den offiziellen Implantatpass des Herstellers: exaktes System, Durchmesser, Serien- und Chargennummer dessen, was in Ihrem Kiefer sitzt, weltweit direkt beim Hersteller überprüfbar.",
    passportSystems: "Ausgestellt zu jedem Straumann-, ETK-, Alpha-Bio- und Biodem-Implantat",
    rowSystem: "System",
    rowSerial: "Serien-Nr.",
    rowLot: "Charge",
    rowDate: "Gesetzt am",
    rowVerify: "Verifizierung",
    verifyValue: "Direkt beim Hersteller",
  },
  fr: {
    eyebrow: "Matériaux & Systèmes Premium",
    title: "Les Systèmes Implantaires & Céramiques Derrière Chaque Sourire",
    lead:
      "Quels implants utilise Dental Med Austria ? Uniquement des systèmes documentés internationalement, Straumann fabriqué en Suisse, ETK (France), Alpha-Bio et Biodem, restaurés avec les céramiques IPS e.max d'Ivoclar et de GiSi. Rien d'anonyme n'entre jamais dans votre bouche : chaque implant arrive avec le passeport du fabricant et des numéros de série vérifiables.",
    origins: { ch: "Fabriqué en Suisse", fr: "France", li: "Liechtenstein" },
    kindImplant: "Système implantaire",
    kindCeramic: "Céramique couronnes & facettes",
    dossier: "Dossier qualité",
    use: "Utilisé pour",
    docs: "Documentation",
    useImplantValue: "Implants · chirurgie guidée",
    useCeramicValue: "Couronnes · facettes",
    docsValueImplant: "Traçabilité série + lot",
    docsValueCeramic: "Céramique documentée cliniquement",
    passportIncluded: "Passeport implantaire inclus",
    passportTitle: "PASSEPORT IMPLANTAIRE",
    passportKicker: "Votre preuve de qualité",
    passportHeading: "Vous repartez avec votre passeport implantaire en main",
    passportBody:
      "Après votre intervention, chaque implant posé, Straumann, ETK, Alpha-Bio ou Biodem, vous est remis avec le passeport officiel du fabricant : le système exact, le diamètre, le numéro de série et le lot de ce qui se trouve dans votre mâchoire, vérifiable directement auprès du fabricant, partout dans le monde.",
    passportSystems: "Délivré avec chaque implant Straumann, ETK, Alpha-Bio et Biodem",
    rowSystem: "Système",
    rowSerial: "N° de série",
    rowLot: "Lot",
    rowDate: "Posé le",
    rowVerify: "Vérification",
    verifyValue: "Directe auprès du fabricant",
  },
};

/**
 * ItemList of the systems, built per locale so the structured data speaks the
 * same language as the visible page it sits on, anchored to the clinic entity.
 */
function systemsJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${localeUrl(locale, "/")}#material-systems`,
    inLanguage: locale,
    about: { "@id": CLINIC_ID },
    name: "Implant systems and ceramics used at Dental Med Austria",
    description:
      "Internationally documented implant systems (Straumann, ETK, Alpha-Bio, Biodem) and crown ceramics (IPS e.max by Ivoclar, e.max by GiSi) used at Dental Med Austria in Tirana, Albania. Every implant includes the manufacturer's implant passport with verifiable serial numbers.",
    itemListElement: SYSTEMS.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Brand",
        name: s.display.replace(/[®]/g, ""),
        description: `${s.heritage[locale] ?? s.heritage.en} ${s.blurb[locale] ?? s.blurb.en}`,
      },
    })),
  };
}

/** Serif wordmark for systems we have no vector/PNG mark for, set like a
 *  letterpress specimen (large serif, thin gold rule) so it reads as a mark,
 *  not as missing artwork. */
function Wordmark({ text }: { text: string }) {
  return (
    <span className="flex flex-col items-center gap-2.5">
      <span className="font-serif text-[clamp(24px,2.2vw,30px)] tracking-[0.6px] text-[#071522]">
        {text}
      </span>
      <span className="block h-px w-10" style={{ backgroundColor: GOLD }} />
    </span>
  );
}

/** Gold specimen corner ticks framing the logo stage. */
function CornerTicks() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-4">
      {(["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"] as const).map((pos) => (
        <span
          key={pos}
          className={`absolute h-3.5 w-3.5 ${pos}`}
          style={{ borderColor: `${GOLD}99` }}
        />
      ))}
    </span>
  );
}

function PassportCard({ t }: { t: (typeof T)[Locale] }) {
  return (
    <div
      className="relative w-full max-w-[420px] overflow-hidden rounded-3xl p-7 shadow-[0_30px_80px_rgba(7,21,34,0.45)]"
      style={{
        background: `linear-gradient(150deg, ${NAVY} 0%, #0c2236 55%, #123049 100%)`,
        border: `1px solid ${GOLD}66`,
      }}
    >
      {/* slow foil sheen */}
      <span
        aria-hidden="true"
        className="dma-passport-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3"
        style={{
          background: "linear-gradient(105deg, transparent, rgba(211,181,127,0.16), transparent)",
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[3px]" style={{ color: GOLD }}>
            Dental Med Austria
          </p>
          <p className="mt-1.5 font-serif text-[21px] tracking-[1.5px] text-white">
            {t.passportTitle}
          </p>
        </div>
        {/* implant glyph in a gold ring */}
        <svg viewBox="0 0 48 48" className="h-12 w-12 shrink-0" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="none" stroke={GOLD} strokeWidth="1.4" />
          <path
            d="M20 10h8l-1 5h-6zM19.5 17h9l-1 4h-7zM20.5 23h7l-1 4h-5zM21.5 29h5l-1.2 4h-2.6zM22.8 35h2.4l-1.2 4z"
            fill={GOLD}
          />
        </svg>
      </div>

      <dl className="mt-6 space-y-3">
        {[
          [t.rowSystem, "Straumann® BLX Ø4.0", false],
          [t.rowSerial, null, true],
          [t.rowLot, null, true],
          [t.rowDate, "··· / ··· / ······", false],
          [t.rowVerify, t.verifyValue, false],
        ].map(([label, value, redacted], i) => (
          <div key={i} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2.5">
            <dt className="text-[10.5px] uppercase tracking-[1.8px] text-white/45">{label as string}</dt>
            <dd className="text-right text-[13px] text-white/90">
              {redacted ? (
                <span className="inline-flex gap-1" aria-label="redacted sample">
                  {[7, 5, 8].map((w, j) => (
                    <span
                      key={j}
                      className="inline-block h-3 rounded-[2px]"
                      style={{ width: w * 3, backgroundColor: `${GOLD}59` }}
                    />
                  ))}
                </span>
              ) : (
                (value as string)
              )}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 text-[11px] leading-relaxed text-white/50">{t.passportSystems}</p>
    </div>
  );
}

export function ImplantSystems() {
  const { locale } = useLocale();
  const t = T[locale] ?? T.en;

  return (
    <section
      id="implant-systems"
      aria-labelledby="implant-systems-title"
      className="bg-[#faf9f7] py-24"
    >
      <JsonLd data={systemsJsonLd(locale)} />

      <div className="tpds-container">
        <Reveal className="mx-auto max-w-3xl text-center" y={26}>
          <p className="eyebrow text-[#9a9a9a]">{t.eyebrow}</p>
          <h2
            id="implant-systems-title"
            className="serif-title mt-4 text-[clamp(30px,4vw,48px)]"
          >
            {t.title}
          </h2>
          <p className="mt-6 text-[15.5px] leading-relaxed text-[#5a5a5a]">{t.lead}</p>
        </Reveal>

        <Reveal className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3" stagger={0.09} y={30}>
          {SYSTEMS.map((s) => (
            <article
              key={s.key}
              tabIndex={0}
              className="group overflow-hidden rounded-3xl border border-black/[0.07] bg-white shadow-[0_6px_24px_rgba(7,21,34,0.06)] outline-none transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(7,21,34,0.16)] focus-visible:ring-2 focus-visible:ring-[#071522]/30"
            >
              {/* logo stage + hover dossier, the mark itself is the hero, set
                  on a quiet paper plinth with specimen corner ticks and a faint
                  oversized serif initial behind it. */}
              <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-b from-[#f6f3ed] to-white">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-8 -right-1 select-none font-serif text-[130px] leading-none text-[#071522]/[0.045]"
                >
                  {s.display.replace(/[^A-Za-z]/g, "").charAt(0)}
                </span>
                <CornerTicks />
                {s.logo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={s.logo}
                    alt={`${s.display.replace(/[®]/g, "")}, ${s.kind === "implant" ? "implant system" : "crown ceramic"} used at Dental Med Austria, Tirana`}
                    loading="lazy"
                    className="relative max-h-12 w-auto max-w-[62%] object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.06]"
                  />
                ) : (
                  <span className="relative transition-transform duration-500 group-hover:scale-[1.04]">
                    <Wordmark text={s.display} />
                  </span>
                )}

                {/* the dossier, hover on pointers, focus-visible for keyboard.
                    NOT focus-within: a mouse click would pin it open. */}
                <div className="absolute inset-0 flex flex-col justify-center gap-2.5 bg-[#071522]/[0.93] p-5 opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:duration-0">
                  <p className="text-[9.5px] uppercase tracking-[2.6px]" style={{ color: GOLD }}>
                    {t.dossier}
                  </p>
                  <p className="text-[12px] leading-relaxed text-white/85">{s.heritage[locale] ?? s.heritage.en}</p>
                  <dl className="mt-1 space-y-1.5">
                    <div className="flex justify-between gap-3 text-[11px]">
                      <dt className="uppercase tracking-[1.4px] text-white/40">{t.use}</dt>
                      <dd className="text-right text-white/85">
                        {s.kind === "implant" ? t.useImplantValue : t.useCeramicValue}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3 text-[11px]">
                      <dt className="uppercase tracking-[1.4px] text-white/40">{t.docs}</dt>
                      <dd className="text-right text-white/85">
                        {s.kind === "implant" ? t.docsValueImplant : t.docsValueCeramic}
                      </dd>
                    </div>
                  </dl>
                </div>

              </div>

              {/* always-visible body (mobile parity with the hover dossier) */}
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-[21px] leading-tight text-[#071522]">{s.display}</h3>
                  {s.origin && (
                    <span className="shrink-0 rounded-full border border-[#071522]/15 px-2.5 py-0.5 text-[10px] uppercase tracking-[1.2px] text-[#071522]/60">
                      {t.origins[s.origin]}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-[1.6px] text-[#9a9a9a]">
                  {s.kind === "implant" ? t.kindImplant : t.kindCeramic}
                </p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-[#5a5a5a]">
                  {s.blurb[locale] ?? s.blurb.en}
                </p>
                {s.passport && (
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium" style={{ backgroundColor: "#f4ecdd", color: "#6d5426" }}>
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                      <path d="M3 1.5h10a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Zm5 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM4.5 11.5h7v1h-7z" />
                    </svg>
                    {t.passportIncluded}
                  </p>
                )}
              </div>
            </article>
          ))}
        </Reveal>

        {/* implant passport feature */}
        <Reveal className="mt-20 grid items-center gap-12 lg:grid-cols-2" y={30}>
          <div className="order-2 flex justify-center lg:order-1">
            <PassportCard t={t} />
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow" style={{ color: "#a8894f" }}>
              {t.passportKicker}
            </p>
            <h3 className="serif-title mt-4 text-[clamp(26px,3vw,38px)]">{t.passportHeading}</h3>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#5a5a5a]">{t.passportBody}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
