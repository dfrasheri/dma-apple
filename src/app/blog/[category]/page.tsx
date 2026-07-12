"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { categoryBySlug, useBlogPosts, postsForLocale } from "@/lib/blog";
import { useLocale, useT } from "@/lib/i18n";
import { BLOG_CATEGORY_SQ } from "@/lib/catalogue-names-sq";

export default function BlogCategoryPage() {
  const params = useParams<{ category: string }>();
  const category = params?.category ?? "";
  const cat = categoryBySlug(category);
  const { locale } = useLocale();
  const t = useT();
  const posts = postsForLocale(useBlogPosts(), locale).filter((p) => p.category === category);
  const catLabel =
    (locale === "sq" ? BLOG_CATEGORY_SQ[category]?.label : undefined) ?? cat?.label ?? t("blog.stories");
  const catBlurb =
    (locale === "sq" ? BLOG_CATEGORY_SQ[category]?.blurb : undefined) ?? cat?.blurb ?? "";

  return (
    <PageShell>
      <PageHero
        eyebrow={t("blog.category.eyebrow")}
        title={catLabel}
        image={posts[0]?.image ?? "/images/dma/interiors/reception-wide.jpg"}
        crumbs={[{ label: t("nav.home"), href: `/${locale}` }, { label: t("blog.crumb"), href: `/${locale}/blog` }, { label: catLabel }]}
      />

      <section className="bg-white py-[70px]">
        <div className="tpds-container">
          {catBlurb && (
            <Reveal className="mb-10 max-w-[680px]" y={22}>
              <p className="text-[17px] font-light leading-[1.5] text-[#343434]">{catBlurb}</p>
            </Reveal>
          )}

          {posts.length === 0 ? (
            <p className="text-[16px] text-[#6f6f6f]">{t("blog.empty")}</p>
          ) : (
            <Reveal className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08} y={24}>
              {posts.map((p) => (
                <Link key={p.id} href={`/${locale}/blog/${p.category}/${p.slug}`} className="group block">
                  <div className="relative h-[280px] overflow-hidden">
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-[1100ms] group-hover:scale-105"
                      style={{ backgroundImage: `url(${p.image})` }}
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                  </div>
                  <p className="mt-4 text-[12px] uppercase tracking-[1.2px] text-[#9a9a9a]">{p.date}</p>
                  <h3 className="mt-1 font-serif text-[22px] font-normal leading-snug text-[#071522] group-hover:opacity-70">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[15px] font-light leading-[1.5] text-[#6f6f6f]">{p.excerpt}</p>
                </Link>
              ))}
            </Reveal>
          )}
        </div>
      </section>
    </PageShell>
  );
}
