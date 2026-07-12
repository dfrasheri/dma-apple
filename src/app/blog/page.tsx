"use client";

import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { BLOG_CATEGORIES, useBlogPosts, postsForLocale } from "@/lib/blog";
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

      <div className="bg-white py-[70px]">
        {BLOG_CATEGORIES.map((cat) => {
          const catPosts = posts.filter((p) => p.category === cat.slug);
          if (catPosts.length === 0) return null;
          return (
            <section key={cat.slug} className="mb-16 last:mb-0">
              <div className="tpds-container">
                <div className="mb-7 flex items-end justify-between gap-6">
                  <div>
                    <h2 className="serif-title text-[clamp(24px,2.8vw,34px)]">{catLabel(cat.slug, cat.label)}</h2>
                    <p className="mt-2 max-w-[560px] text-[15px] font-light text-[#6f6f6f]">{catBlurb(cat.slug, cat.blurb)}</p>
                  </div>
                  <Link
                    href={`/${locale}/blog/${cat.slug}`}
                    className="shrink-0 text-[13px] uppercase tracking-[1.2px] text-[#071522] hover:opacity-60"
                  >
                    {t("blog.viewAll")} ({catPosts.length})
                  </Link>
                </div>

                <Reveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08} y={24}>
                  {catPosts.slice(0, 6).map((p) => (
                    <Link key={p.id} href={`/${locale}/blog/${p.category}/${p.slug}`} className="group block">
                      <div className="relative h-[260px] overflow-hidden">
                        <div
                          className="h-full w-full bg-cover bg-center transition-transform duration-[1100ms] group-hover:scale-105"
                          style={{ backgroundImage: `url(${p.image})` }}
                        />
                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                      </div>
                      <h3 className="mt-4 font-serif text-[20px] font-normal leading-snug text-[#071522] group-hover:opacity-70">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-[15px] font-light leading-[1.5] text-[#6f6f6f]">{p.excerpt}</p>
                    </Link>
                  ))}
                </Reveal>
              </div>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
