"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { useBlogPosts, postsForLocale } from "@/lib/blog";
import { useT, useLocale } from "@/lib/i18n";

export function BlogStrip() {
  const { locale } = useLocale();
  const posts = postsForLocale(useBlogPosts(), locale);
  const items = posts.slice(0, 12);
  const t = useT();

  return (
    <section className="bg-white pb-[90px] pt-[70px]">
      <div className="tpds-container">
        <Reveal className="mb-10 text-center" stagger={0.1} y={24}>
          <p className="eyebrow mb-3 text-[#9a9a9a]">{t("blogstrip.eyebrow")}</p>
          <h2 className="serif-title text-[clamp(28px,3.4vw,42px)] leading-[1.12]">{t("blogstrip.heading")}</h2>
        </Reveal>

        <Reveal
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          stagger={0.06}
          y={22}
        >
          {items.map((p) => (
            <Link key={p.id} href={`/${locale}/blog/${p.category}/${p.slug}`} className="group relative block h-[230px] overflow-hidden">
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-[1100ms] group-hover:scale-105"
                style={{ backgroundImage: `url(${p.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="mb-1 text-[10px] uppercase tracking-[1.3px] text-white/75">{p.category.replace(/-/g, " ")}</p>
                <h3 className="font-serif text-[16px] font-normal leading-snug text-white">{p.title}</h3>
              </div>
            </Link>
          ))}
        </Reveal>

        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center bg-[#f1f1f1] px-[30px] py-[14px] text-[14px] uppercase tracking-[1.2px] text-[#343434] transition-colors hover:bg-[#e2e2e2]"
          >
            {t("blogstrip.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
