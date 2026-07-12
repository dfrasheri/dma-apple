import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { CONTACT } from "@/lib/site";
import { getT } from "@/lib/server-i18n";

export const metadata = { title: "Contact | Dental Med Austria" };

export default async function ContactPage() {
  const t = await getT();
  const HOURS = [
    { day: t("contactpage.hours.weekdays"), time: t("contactpage.hours.weekdaysTime") },
    { day: t("contactpage.hours.saturday"), time: t("contactpage.hours.saturdayTime") },
    { day: t("contactpage.hours.sunday"), time: t("contactpage.hours.sundayTime") },
  ];
  return (
    <PageShell>
      <PageHero
        eyebrow={t("contactpage.hero.eyebrow")}
        title={t("contactpage.hero.title")}
        image="/images/dma/interiors/reception-wide.jpg"
        crumbs={[{ label: t("nav.home"), href: "/" }, { label: t("nav.contact") }]}
      />
      <section className="bg-white py-[80px]">
        <div className="tpds-container">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.2fr]">
            <Reveal stagger={0.1} y={28}>
              <h2 className="serif-title mb-7 text-[clamp(26px,3vw,36px)]">{CONTACT.name}</h2>
              <a href={CONTACT.emailHref} className="text-[24px] text-[#343434] hover:opacity-70">
                {CONTACT.email}
              </a>
              <p className="mt-5 text-[17px] leading-snug text-[#343434]">
                {CONTACT.address1}
                <br />
                {CONTACT.address2}
              </p>
              <a
                href={CONTACT.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-[13px] uppercase tracking-[1.2px] text-[#343434] hover:opacity-70"
              >
                {t("contactpage.getDirections")}
              </a>
              <div className="mt-6 flex items-center gap-4 text-[14px] uppercase tracking-[1.2px] text-[#343434]">
                <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">{t("contactpage.instagram")}</a>
                <span className="text-[#d4d4d4]">·</span>
                <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">{t("contactpage.facebook")}</a>
              </div>

              <h3 className="mt-12 mb-4 text-[13px] uppercase tracking-[1.3px] text-[#9a9a9a]">{t("contactpage.openingHours")}</h3>
              <ul className="max-w-[360px] space-y-2">
                {HOURS.map((h) => (
                  <li key={h.day} className="flex justify-between border-b border-[#ededed] pb-2 text-[16px] text-[#343434]">
                    <span>{h.day}</span>
                    <span className="text-[#6f6f6f]">{h.time}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal y={30}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
