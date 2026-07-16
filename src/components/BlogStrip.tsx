"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { useBlogPosts, postsForLocale } from "@/lib/blog";
import { ARTICLE_UI, articleLocale, readingMinutes } from "@/lib/blog-article-extras";
import { useT, useLocale } from "@/lib/i18n";

export function BlogStrip() {
  const { locale } = useLocale();
  const posts = postsForLocale(useBlogPosts(), locale);
  const items = posts.slice(0, 12);
  const t = useT();

  return (
    <section className="section-y bg-[#fbf7f2]">
      <div className="tpds-container">
        <Reveal className="mb-12 text-center" stagger={0.1} y={24}>
          <p className="eyebrow gold-foil mb-3">{t("blogstrip.eyebrow")}</p>
          <h2 className="serif-title text-[clamp(28px,3.4vw,42px)] leading-[1.12] text-[#2a2018]">
            {t("blogstrip.heading")}
          </h2>
          <div className="gold-rule mx-auto mt-6 w-24" />
        </Reveal>

        <Reveal
          className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.06}
          y={22}
        >
          {items.map((p) => {
            const ui = ARTICLE_UI[articleLocale(p)];
            return (
              <Link key={p.id} href={`/${locale}/blog/${p.category}/${p.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-brand-sm)] transition-shadow duration-500 group-hover:shadow-[var(--shadow-brand-md)]">
                  <div
                    className="aspect-[4/3] w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${p.image})` }}
                  />
                </div>
                <span className="mt-4 inline-flex rounded-full bg-[#f4ecdd] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a7638]">
                  {p.category.replace(/-/g, " ")}
                </span>
                <h3 className="mt-3 font-serif text-[20px] font-medium leading-snug text-[#2a2018] decoration-[#c6a15b] decoration-1 underline-offset-4 group-hover:underline">
                  {p.title}
                </h3>
                <p className="mt-2 text-[13px] tracking-wide text-[#a99a8b]">
                  {p.date} &middot; {ui.minRead(readingMinutes(p.body))}
                </p>
              </Link>
            );
          })}
        </Reveal>

        <div className="mt-14 text-center">
          <Link
            href={`/${locale}/blog`}
            className="gold-shimmer-host inline-flex items-center justify-center rounded-full bg-[#c6a15b] px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#241c15] shadow-[0_12px_34px_-8px_rgba(198,161,91,0.5)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            {t("blogstrip.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
