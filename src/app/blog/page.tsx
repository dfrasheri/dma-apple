"use client";

import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { BLOG_CATEGORIES, useBlogPosts, postsForLocale } from "@/lib/blog";
import { ARTICLE_UI, articleLocale, readingMinutes } from "@/lib/blog-article-extras";
import { useLocale, useT } from "@/lib/i18n";
import { BLOG_CATEGORY_SQ } from "@/lib/catalogue-names-sq";

export default function BlogIndexPage() {
  const { locale } = useLocale();
  const t = useT();
  const posts = postsForLocale(useBlogPosts(), locale);
  const catLabel = (slug: string, fallback: string) =>
    locale === "sq" ? BLOG_CATEGORY_SQ[slug]?.label ?? fallback : fallback;
  const catBlurb = (slug: string, fallback: string) =>
    locale === "sq" ? BLOG_CATEGORY_SQ[slug]?.blurb ?? fallback : fallback;

  return (
    <PageShell>
      <PageHero
        eyebrow={t("blog.hero.eyebrow")}
        title={t("blog.index.title")}
        image="/images/dma/interiors/reception-wide.jpg"
        crumbs={[{ label: t("nav.home"), href: "/" }, { label: t("blog.crumb") }]}
      />

      <div className="section-y bg-[#fbf7f2]">
        {BLOG_CATEGORIES.map((cat) => {
          const catPosts = posts.filter((p) => p.category === cat.slug);
          if (catPosts.length === 0) return null;
          return (
            <section key={cat.slug} className="mb-20 last:mb-0">
              <div className="tpds-container">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                  <div>
                    <h2 className="serif-title text-[clamp(24px,2.8vw,34px)] text-[#2a2018]">
                      {catLabel(cat.slug, cat.label)}
                    </h2>
                    <p className="mt-2 max-w-[560px] text-[15px] font-light leading-relaxed text-[#6e6152]">
                      {catBlurb(cat.slug, cat.blurb)}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/blog/${cat.slug}`}
                    className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9a7638] decoration-[#c6a15b] underline-offset-4 transition-colors duration-300 hover:text-[#2a2018] hover:underline"
                  >
                    {t("blog.viewAll")} ({catPosts.length})
                  </Link>
                </div>
                <div className="gold-rule mb-9" />

                <Reveal className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08} y={24}>
                  {catPosts.slice(0, 6).map((p) => {
                    const ui = ARTICLE_UI[articleLocale(p)];
                    return (
                      <Link key={p.id} href={`/${locale}/blog/${p.category}/${p.slug}`} className="group block">
                        <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-brand-sm)] transition-shadow duration-500 group-hover:shadow-[var(--shadow-brand-md)]">
                          <div
                            className="h-[260px] w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url(${p.image})` }}
                          />
                        </div>
                        <span className="mt-4 inline-flex rounded-full bg-[#f4ecdd] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a7638]">
                          {catLabel(cat.slug, cat.label)}
                        </span>
                        <h3 className="mt-3 font-serif text-[21px] font-medium leading-snug text-[#2a2018] decoration-[#c6a15b] decoration-1 underline-offset-4 group-hover:underline">
                          {p.title}
                        </h3>
                        <p className="mt-2 text-[13px] tracking-wide text-[#a99a8b]">
                          {p.date} &middot; {ui.minRead(readingMinutes(p.body))}
                        </p>
                        <p className="mt-2 text-[15px] font-light leading-[1.55] text-[#6e6152]">{p.excerpt}</p>
                      </Link>
                    );
                  })}
                </Reveal>
              </div>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
