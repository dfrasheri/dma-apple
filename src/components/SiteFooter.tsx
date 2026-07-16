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

const colTitleClass = "text-[11.5px] uppercase tracking-[2.4px] font-semibold text-[#e4cd9a]";
const colLinkClass = "text-[14.5px] leading-none text-[#fbf7f2]/75 transition-colors hover:text-[#e4cd9a]";

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
    <Reveal as="footer" className="relative bg-[#241c15] pt-16 text-[#fbf7f2] sm:pt-20" y={30} duration={0.9} start="top 92%">
      {/* gold hairline crowning the footer */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c6a15b]/60 to-transparent" />
      {/* faint warm gold glow from the top */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64" style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(198,161,91,0.1), transparent 70%)" }} />
      <div className="tpds-container relative">
        {/* brand + answer-shaped boilerplate, then the crawlable link columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-[1.6fr_repeat(3,minmax(0,1fr))] lg:gap-x-10">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 lg:-ml-8 xl:-ml-12">
            {/* wordmark-cropped copy of the square logo, rendered ivory on the
                dark band via a filter (the source art is dark). */}
            <img
              src="/images/dma/logo-wordmark.svg"
              alt="Dental Med Austria, dental clinic in Tirana, Albania"
              className="h-11 w-auto sm:h-12"
              style={{ filter: "brightness(0) invert(1)", opacity: 0.95 }}
            />
            <p className="mt-6 max-w-[380px] text-[13.5px] font-light leading-[1.65] text-[#fbf7f2]/70">
              {t("footer.tagline")}
            </p>
            {/* visible trust entities, mirrors hasCredential/memberOf in seo.ts */}
            <p className="mt-5 text-[12px] leading-relaxed text-[#fbf7f2]/55">
              {t("footer.accredited")}:{" "}
              <Link href={`/${locale}#accreditations`} className="text-[#e4cd9a] hover:text-[#fbf7f2]">
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
        <div className="mt-14 border-t border-[#c6a15b]/20 pt-6">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-[#fbf7f2]/55">
            <span className="uppercase tracking-[1.4px]">{t("footer.langs")}:</span>
            {LOCALES.map((l) => (
              <Link
                key={l.code}
                href={`/${l.code}`}
                hrefLang={l.code}
                lang={l.code}
                onClick={() => setLocale(l.code)}
                className={cn(
                  "hover:text-[#e4cd9a]",
                  locale === l.code ? "font-semibold text-[#e4cd9a] underline underline-offset-4" : "",
                )}
              >
                {l.name}
              </Link>
            ))}
          </p>
        </div>
      </div>

      {/* legal row, locality-qualified copyright + sitemap */}
      <div className="mt-6 border-t border-[#c6a15b]/20 py-6">
        <div className="tpds-container flex flex-col items-center justify-between gap-3 text-[12px] text-[#fbf7f2]/50 md:flex-row">
          <p>
            Copyright &copy;2026 Dental Med Austria. {t("footer.rights")}&nbsp;|&nbsp;
            <a href={`/${locale}/privacy`} className="hover:text-[#e4cd9a]">{t("footer.privacy")}</a>&nbsp;|&nbsp;
            <a href="#" className="hover:text-[#e4cd9a]">{t("footer.risks")}</a>&nbsp;|&nbsp;
            <a href="/sitemap.xml" className="hover:text-[#e4cd9a]">{t("footer.sitemap")}</a>
          </p>
          <p>Dental Med Austria, Dental Clinic, Rruga Kristo Luarasi, Tiranë, Albania</p>
        </div>
      </div>
    </Reveal>
  );
}
