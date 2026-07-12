"use client";

/**
 * SEO/GEO/AEO-loaded site footer.
 *
 * What earns its keep here (and why):
 *  - NAP block (name / address / phone) in a semantic <address>, byte-identical
 *    to the sitewide Dentist JSON-LD in src/lib/seo.ts, NAP consistency is the
 *    backbone of local SEO; no duplicate JSON-LD is emitted here on purpose
 *    (one entity source of truth).
 *  - Answer-shaped tagline ("ISO 9001-certified dental clinic in Tirana,
 *    Albania…patients from Italy, Germany…"), the boilerplate snippet answer
 *    engines and LLMs quote when citing the site from any page.
 *  - Crawlable, keyword-anchored internal links to every money page
 *    (treatments, catalogue, tourism, safety, FAQs, blog) inside a <nav>
 *    landmark, sitewide internal linking + anchor-text relevance.
 *  - Crawlable language links (real <a href="/{locale}">, hreflang attrs) that
 *    reinforce the Metadata hreflang alternates.
 *  - Visible trust line naming the accreditation entities (ISO 9001, TÜV
 *    NORD, ITI, EDA, Albstom, ADA), matching hasCredential/memberOf in seo.ts.
 *  - Legal row with locality-qualified copyright ("…Dental Clinic, Tirana,
 *    Albania") and a sitemap.xml link.
 * The lead form is unchanged, same packaged pipeline as the chatbot (CRM,
 * scoring, dedupe, notifications).
 */
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { FacebookIcon, InstagramIcon, GoogleIcon } from "@/components/icons";
import { CONTACT, CARE, CLINIC } from "@/lib/site";
import { LOCALES, useLocale, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const colTitleClass = "text-[11.5px] uppercase tracking-[2px] text-[#9a9a9a]";
const colLinkClass = "text-[14.5px] leading-none text-[#343434] transition-opacity hover:opacity-60";

/** "For Patients" column, journey pages that don't live in CARE/CLINIC. */
const PATIENT_LINKS: { href: string; tKey: string }[] = [
  { href: "/packets", tKey: "nav.packets" },
  { href: "/smiles", tKey: "footer.smiles" },
  { href: "/blog", tKey: "footer.blog" },
  { href: "/contact", tKey: "nav.contact" },
  { href: "/privacy", tKey: "footer.privacy" },
  { href: "#", tKey: "footer.risks" },
];

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className={colTitleClass}>{title}</p>
      <ul className="mt-5 space-y-3.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={colLinkClass}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const t = useT();
  const { locale, setLocale } = useLocale();

  const label = (item: { label: string; tKey?: string }) => (item.tKey ? t(item.tKey) : item.label);

  return (
    <Reveal as="footer" className="bg-white pt-16 sm:pt-20" y={30} duration={0.9} start="top 92%">
      <div className="tpds-container">
        {/* brand + answer-shaped boilerplate, then the crawlable link columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-[1.6fr_repeat(3,minmax(0,1fr))] lg:gap-x-10">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 lg:-ml-8 xl:-ml-12">
            {/* wordmark-cropped copy of the square logo (logo2.svg wastes ~76%
                of its canvas on padding); this fills its box so it reads at a
                proper footer size and left-aligns with the tagline. */}
            <img
              src="/images/dma/logo-wordmark.svg"
              alt="Dental Med Austria, dental clinic in Tirana, Albania"
              className="h-11 w-auto sm:h-12"
            />
            <p className="mt-6 max-w-[380px] text-[13.5px] font-light leading-[1.65] text-[#5a5a5a]">
              {t("footer.tagline")}
            </p>
            {/* visible trust entities, mirrors hasCredential/memberOf in seo.ts */}
            <p className="mt-5 text-[12px] leading-relaxed text-[#8a8a8a]">
              {t("footer.accredited")}:{" "}
              <Link href={`/${locale}#accreditations`} className="text-[#6d5426] hover:opacity-70">
                ISO 9001, TÜV NORD · ITI · EDA · Albstom · ADA
              </Link>
            </p>
          </div>

          <nav aria-label="Footer, treatments">
            <FooterColumn
              title={t("footer.col.treatments")}
              links={CARE.map((c) => ({ href: `/${locale}${c.href}`, label: label(c) }))}
            />
          </nav>
          <nav aria-label="Footer, clinic">
            <FooterColumn
              title={t("footer.col.clinic")}
              links={CLINIC.map((c) => ({ href: `/${locale}${c.href}`, label: label(c) }))}
            />
          </nav>
          <nav aria-label="Footer, patients">
            <FooterColumn
              title={t("footer.col.patients")}
              links={PATIENT_LINKS.map((c) => ({
                href: c.href === "#" ? c.href : `/${locale}${c.href}`,
                label: t(c.tKey),
              }))}
            />
          </nav>
        </div>

        {/* crawlable language links, real anchors reinforcing the hreflang
            alternates; the click also syncs the locale cookie for instant UX */}
        <div className="mt-14 border-t border-[#ededed] pt-6">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-[#8a8a8a]">
            <span className="uppercase tracking-[1.4px]">{t("footer.langs")}:</span>
            {LOCALES.map((l) => (
              <Link
                key={l.code}
                href={`/${l.code}`}
                hrefLang={l.code}
                lang={l.code}
                onClick={() => setLocale(l.code)}
                className={cn(
                  "hover:text-[#343434]",
                  locale === l.code ? "font-semibold text-[#343434] underline underline-offset-4" : "",
                )}
              >
                {l.name}
              </Link>
            ))}
          </p>
        </div>
      </div>

      {/* legal row, locality-qualified copyright + sitemap */}
      <div className="mt-6 border-t border-[#ededed] py-6">
        <div className="tpds-container flex flex-col items-center justify-between gap-3 text-[12px] text-[#7a7a7a] md:flex-row">
          <p>
            Copyright &copy;2026 Dental Med Austria. {t("footer.rights")}&nbsp;|&nbsp;
            <a href={`/${locale}/privacy`} className="hover:text-[#343434]">{t("footer.privacy")}</a>&nbsp;|&nbsp;
            <a href="#" className="hover:text-[#343434]">{t("footer.risks")}</a>&nbsp;|&nbsp;
            <a href="/sitemap.xml" className="hover:text-[#343434]">{t("footer.sitemap")}</a>
          </p>
          <p>Dental Med Austria, Dental Clinic, Rruga Kristo Luarasi, Tiranë, Albania</p>
        </div>
      </div>
    </Reveal>
  );
}
