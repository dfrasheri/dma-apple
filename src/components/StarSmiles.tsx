"use client";

/**
 * "Dental Med Smiles on our Stars", the celebrity smile wall.
 *
 * The clinic's #unëbuzëqesh campaign has real Albanian & Kosovar stars posing
 * with their DMA smiles: the portraits here are the clinic's own campaign
 * shots (reposted on the clinic Instagram), stored locally under
 * public/images/dma/stars/, no hotlinked CDN URLs. Each card links to the
 * exact Instagram post that features that same smile shot (not the profile),
 * so a click lands on the star's DMA smile post.
 *
 * Design: dark-navy editorial wall between the white ImplantSystems section
 * and the SmileGallery photo banner, 4:5 portrait cards on a staggered grid
 * (even columns drop slightly on desktop), gold accents on the house palette.
 *
 * SEO/GEO/AEO: the lead keeps every star's name in visible, crawlable text
 * while steering the message to the clinic's core work in the visitor's
 * language, implants (Straumann, then ETK) first, then crowns (zirconia and
 * IPS e.max by Ivoclar).
 */
import { useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/dictionaries";
import { Reveal } from "@/components/Reveal";
import { InstagramIcon } from "@/components/icons";
import { CONTACT } from "@/lib/site";

const GOLD = "#d3b57f";

type Star = {
  key: string;
  name: string;
  /** Instagram handle (without @), shown on the chip. */
  handle: string;
  /** Exact Instagram post URL featuring this star's smile shot. */
  post: string;
  /** Localized one-word-ish role shown under the name. */
  role: Record<Locale, string>;
  photo: string;
};

const STARS: Star[] = [
  {
    key: "kiara",
    name: "Kiara Tito",
    handle: "kiaratito",
    post: "https://www.instagram.com/p/CtCVbPetHCa/",
    photo: "/images/dma/stars/kiara-tito.jpg",
    role: {
      en: "TV Host",
      sq: "Moderatore televizive",
      it: "Conduttrice TV",
      de: "TV-Moderatorin",
      fr: "Animatrice TV",
    },
  },
  {
    key: "jori",
    name: "Jori Delli",
    handle: "joridelli",
    post: "https://www.instagram.com/p/DFgAno8tm2G/",
    photo: "/images/dma/stars/jori-delli.jpg",
    role: {
      en: "DJ & TV Personality",
      sq: "DJ & personazh televiziv",
      it: "DJ e personaggio TV",
      de: "DJ & TV-Persönlichkeit",
      fr: "DJ et personnalité TV",
    },
  },
  {
    key: "franceska",
    name: "Franceska Murati",
    handle: "franceska_murati",
    post: "https://www.instagram.com/p/DSpjZWsDKTE/",
    photo: "/images/dma/stars/franceska-murati.jpg",
    role: {
      en: "Model & Big Brother VIP Star",
      sq: "Modele & ylli i Big Brother VIP",
      it: "Modella e star di Big Brother VIP",
      de: "Model & Big-Brother-VIP-Star",
      fr: "Mannequin et star de Big Brother VIP",
    },
  },
  {
    key: "amina",
    name: "Amina Shena",
    handle: "aminashena",
    post: "https://www.instagram.com/p/C8ZcjpOt2DG/",
    photo: "/images/dma/stars/amina-shena.jpg",
    role: {
      en: "Artist",
      sq: "Artiste",
      it: "Artista",
      de: "Künstlerin",
      fr: "Artiste",
    },
  },
  {
    key: "meriton",
    name: "Meriton Mjekiqi",
    handle: "meriton.mjekiqi",
    post: "https://www.instagram.com/p/DA0j3xvtXfk/",
    photo: "/images/dma/stars/meriton-mjekiqi.jpg",
    role: {
      en: "Influencer",
      sq: "Influencer",
      it: "Influencer",
      de: "Influencer",
      fr: "Influenceur",
    },
  },
  {
    key: "gjelbrona",
    name: "Gjelbrona Gashi",
    handle: "gjelbrona__gashi",
    post: "https://www.instagram.com/p/DVayJhEDQh_/",
    photo: "/images/dma/stars/gjelbrona-gashi.jpg",
    role: {
      en: "Model",
      sq: "Modele",
      it: "Modella",
      de: "Model",
      fr: "Mannequin",
    },
  },
];

const T: Record<
  Locale,
  { eyebrow: string; title: string; lead: string; follow: string; visit: string }
> = {
  en: {
    eyebrow: "#UnëBuzëqesh · Celebrity Smiles",
    title: "Dental Med Smiles on our Stars",
    lead:
      "TV host Kiara Tito, DJ Jori Delli, Big Brother VIP star Franceska Murati, Amina Shena, Meriton Mjekiqi and Gjelbrona Gashi all trusted their smiles to Dental Med Austria. Behind every result is the same expertise the clinic is known for: dental implants placed with Swiss-made Straumann and ETK systems, and crowns finished in zirconia and IPS e.max by Ivoclar.",
    follow: "Follow the smiles on Instagram",
    visit: "View post",
  },
  sq: {
    eyebrow: "#UnëBuzëqesh · Buzëqeshjet e Yjeve",
    title: "Yjet Buzëqeshin me Dental Med Austria",
    lead:
      "Moderatorja Kiara Tito, DJ Jori Delli, ylli i Big Brother VIP Franceska Murati, Amina Shena, Meriton Mjekiqi dhe Gjelbrona Gashi ia besuan buzëqeshjen e tyre Dental Med Austria. Pas çdo rezultati qëndron e njëjta ekspertizë për të cilën njihet klinika: implante dentare të vendosura me sisteme Straumann (prodhim zviceran) dhe ETK, dhe kurora të përfunduara në zirkon dhe IPS e.max nga Ivoclar.",
    follow: "Ndiqni buzëqeshjet në Instagram",
    visit: "Shiko postimin",
  },
  it: {
    eyebrow: "#UnëBuzëqesh · I Sorrisi delle Star",
    title: "Le Star Sorridono con Dental Med Austria",
    lead:
      "La conduttrice Kiara Tito, il DJ Jori Delli, la star di Big Brother VIP Franceska Murati, Amina Shena, Meriton Mjekiqi e Gjelbrona Gashi hanno affidato il loro sorriso a Dental Med Austria. Dietro ogni risultato c'è la stessa competenza per cui la clinica è conosciuta: impianti dentali posizionati con sistemi Straumann (made in Switzerland) ed ETK, e corone rifinite in zirconio e IPS e.max di Ivoclar.",
    follow: "Segui i sorrisi su Instagram",
    visit: "Vedi il post",
  },
  de: {
    eyebrow: "#UnëBuzëqesh · Star-Lächeln",
    title: "Die Stars lächeln mit Dental Med Austria",
    lead:
      "TV-Moderatorin Kiara Tito, DJ Jori Delli, Big-Brother-VIP-Star Franceska Murati, Amina Shena, Meriton Mjekiqi und Gjelbrona Gashi vertrauten ihr Lächeln Dental Med Austria an. Hinter jedem Ergebnis steht dieselbe Kompetenz, für die die Klinik bekannt ist: Zahnimplantate mit Swiss-made Straumann- und ETK-Systemen und Kronen aus Zirkon und IPS e.max von Ivoclar.",
    follow: "Den Lächeln auf Instagram folgen",
    visit: "Beitrag ansehen",
  },
  fr: {
    eyebrow: "#UnëBuzëqesh · Les Sourires des Stars",
    title: "Les Stars Sourient avec Dental Med Austria",
    lead:
      "L'animatrice Kiara Tito, le DJ Jori Delli, la star de Big Brother VIP Franceska Murati, Amina Shena, Meriton Mjekiqi et Gjelbrona Gashi ont confié leur sourire à Dental Med Austria. Derrière chaque résultat, la même expertise qui fait la réputation de la clinique : des implants dentaires posés avec les systèmes Straumann (fabriqués en Suisse) et ETK, et des couronnes finies en zircone et IPS e.max d'Ivoclar.",
    follow: "Suivez les sourires sur Instagram",
    visit: "Voir la publication",
  },
};

function StarCard({
  star,
  role,
  visit,
  offset,
}: {
  star: Star;
  role: string;
  visit: string;
  offset: boolean;
}) {
  return (
    <a
      href={star.post}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${star.name}, ${role} · ${visit}`}
      className={`group relative block overflow-hidden rounded-2xl bg-[#0d2233] shadow-[0_24px_60px_-32px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1.5 hover:ring-[#d3b57f]/60 ${
        offset ? "lg:translate-y-8 lg:hover:translate-y-[26px]" : ""
      }`}
    >
      <span className="block aspect-[4/5] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- local campaign photo, plain <img> per site convention */}
        <img
          src={star.photo}
          alt={`${star.name}, ${role}, smile by Dental Med Austria`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
        />
      </span>

      {/* legibility gradient */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#04101c]/90" />

      {/* name / role / handle */}
      <span className="absolute inset-x-0 bottom-0 p-5">
        <span className="block font-serif text-[clamp(19px,1.6vw,24px)] leading-tight text-white">
          {star.name}
        </span>
        <span className="mt-1 block text-[12px] uppercase tracking-[1.5px] text-white/65">
          {role}
        </span>
        <span
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11.5px] font-medium text-white/90 backdrop-blur-sm transition-colors duration-300 group-hover:bg-[#d3b57f] group-hover:text-[#071522]"
        >
          <InstagramIcon className="h-3.5 w-3.5" />
          @{star.handle}
        </span>
      </span>
    </a>
  );
}

export function StarSmiles() {
  const { locale } = useLocale();
  const t = T[locale] ?? T.en;

  return (
    <section
      id="star-smiles"
      aria-labelledby="star-smiles-title"
      className="relative overflow-hidden bg-[#071522] py-24"
    >
      {/* soft gold glow accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-[-120px] h-[420px] w-[420px] rounded-full opacity-[0.14]"
        style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 bottom-[-160px] h-[520px] w-[520px] rounded-full opacity-[0.1]"
        style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)` }}
      />

      <div className="tpds-container relative">
        <Reveal className="mx-auto max-w-3xl text-center" y={26}>
          <p className="eyebrow" style={{ color: GOLD }}>
            {t.eyebrow}
          </p>
          <h2
            id="star-smiles-title"
            className="mt-4 font-serif text-[clamp(30px,4vw,48px)] font-normal leading-[1.12] text-white"
          >
            {t.title}
          </h2>
          <p className="mt-6 text-[15.5px] leading-relaxed text-white/60">{t.lead}</p>
        </Reveal>

        <Reveal
          className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:pb-10"
          y={30}
        >
          {STARS.map((star, i) => (
            <StarCard
              key={star.key}
              star={star}
              role={star.role[locale] ?? star.role.en}
              visit={t.visit}
              offset={i % 2 === 1}
            />
          ))}
        </Reveal>

        <div className="mt-14 text-center">
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#d3b57f]/60 px-6 py-3 text-[13px] uppercase tracking-[1.5px] text-[#d3b57f] transition-colors duration-300 hover:bg-[#d3b57f] hover:text-[#071522]"
          >
            <InstagramIcon className="h-4 w-4" />
            {t.follow}
          </a>
        </div>
      </div>
    </section>
  );
}
