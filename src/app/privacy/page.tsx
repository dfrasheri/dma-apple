import type { Metadata } from "next";
import { Fragment } from "react";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { getLocale, getT } from "@/lib/server-i18n";
import { PRIVACY } from "@/lib/privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy, Dental Med Austria",
  description:
    "How Dental Med Austria collects, manages and protects your personal data, in full compliance with the GDPR and Albanian Law No. 9887.",
};

/**
 * Turn bare URLs and email addresses inside a plain string into clickable
 * links, so the policy body can stay as plain translatable text in
 * privacy-content.ts. Everything else is rendered verbatim.
 */
function renderText(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+|[^\s@]+@[^\s@]+\.[^\s@.,)]+)/g);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const href = part.replace(/[.,)]+$/, "");
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[#071522]"
        >
          {part}
        </a>
      );
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@.,)]+$/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className="underline underline-offset-2 hover:text-[#071522]">
          {part}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const t = await getT();
  const content = PRIVACY[locale] ?? PRIVACY.en;

  return (
    <PageShell>
      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        image="/images/dma/interiors/reception-wide.jpg"
        imagePosition="center 40%"
        crumbs={[{ label: t("nav.home"), href: "/" }, { label: content.title }]}
      />

      <div className="mx-auto max-w-3xl px-6 py-16 text-[#343434]">
        <p className="mb-10 text-sm text-neutral-500">{content.updated}</p>

        <div className="space-y-5 text-[15px] leading-7">
          {content.intro.map((block, i) =>
            block.kind === "p" ? (
              <p key={i}>{renderText(block.text)}</p>
            ) : (
              <ul key={i} className="list-decimal space-y-2 pl-6">
                {block.items.map((item, j) => (
                  <li key={j}>{renderText(item)}</li>
                ))}
              </ul>
            ),
          )}
        </div>

        <div className="mt-12 space-y-10">
          {content.sections.map((section, i) => (
            <section key={i}>
              <h2
                className="mb-3 text-xl font-semibold text-[#2a2018]"
                style={{ fontFamily: "var(--font-newsreader)" }}
              >
                {section.heading}
              </h2>
              <div className="space-y-4 text-[15px] leading-7">
                {section.blocks.map((block, j) =>
                  block.kind === "p" ? (
                    <p key={j}>{renderText(block.text)}</p>
                  ) : (
                    <ul key={j} className="list-disc space-y-2 pl-6">
                      {block.items.map((item, k) => (
                        <li key={k}>{renderText(item)}</li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
