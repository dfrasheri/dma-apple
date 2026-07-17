// Sitemap for the whole public site: every marketing page in all four locales
// (each entry carrying its hreflang alternates) plus EVERY blog article with
// its localized-slug alternates (via the server-safe blog-data module).
// Served at /sitemap.xml, middleware skips extension paths, so this resolves
// at the root domain.
import type { MetadataRoute } from "next";
import { localeUrl } from "@/lib/seo";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/dictionaries";
import { CATALOGUE_SERVICES } from "@/lib/catalogue";
import { PROCEDURES, CLINIC_PAGES } from "@/lib/pages";
import { ALL_SEED_POSTS, BLOG_CATEGORIES, postAlternates } from "@/lib/blog-data";

const NOW = new Date();

type Freq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

/** One sitemap entry per locale for a shared-path page, each with hreflang alternates. */
function multi(path: string, priority: number, changeFrequency: Freq): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l.code] = localeUrl(l.code, path);
  languages["x-default"] = localeUrl(DEFAULT_LOCALE, path);
  return LOCALES.map((l) => ({
    url: localeUrl(l.code, path),
    lastModified: NOW,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Core pages
  entries.push(...multi("/", 1, "weekly"));
  for (const p of ["/catalogue", "/care", "/packets"]) entries.push(...multi(p, 0.9, "weekly"));
  for (const p of ["/contact", "/technology", "/safety", "/smiles", "/blog"]) entries.push(...multi(p, 0.8, "weekly"));
  for (const p of ["/affiliate", "/privacy"]) entries.push(...multi(p, 0.5, "monthly"));

  // Dynamic content pages (same path across locales)
  for (const s of CATALOGUE_SERVICES) entries.push(...multi(`/catalogue/${s.slug}`, 0.8, "monthly"));
  for (const p of PROCEDURES) entries.push(...multi(`/care/${p.slug}`, 0.8, "monthly"));
  for (const c of CLINIC_PAGES) entries.push(...multi(`/clinic/${c.slug}`, 0.6, "monthly"));
  for (const c of BLOG_CATEGORIES) entries.push(...multi(`/blog/${c.slug}`, 0.7, "weekly"));

  // Blog articles: slugs are localized, so each post is ONE entry in its own
  // locale, with hreflang alternates pointing at its sibling language versions.
  for (const post of ALL_SEED_POSTS) {
    const locale = post.locale ?? "en";
    const languages: Record<string, string> = {};
    for (const a of postAlternates(post)) {
      languages[a.locale ?? "en"] = localeUrl(a.locale ?? "en", `/blog/${a.category}/${a.slug}`);
    }
    if (languages.en) languages["x-default"] = languages.en;
    entries.push({
      url: localeUrl(locale, `/blog/${post.category}/${post.slug}`),
      lastModified: post.date ? new Date(post.date) : NOW,
      changeFrequency: "monthly",
      priority: 0.7, ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
    });
  }

  // CRM-published articles (AutoSEO → published_posts), same per-post shape as
  // the static articles above but with hreflang siblings resolved from the db
  // list. Best-effort: a missing/locked CRM sqlite file (fresh checkout,
  // read-only serverless fs) contributes no entries rather than breaking the
  // whole sitemap.
  try {
    const { loadPublishedBlogPosts, dbPostAlternates } = await import("@/lib/blog-db");
    const dbPosts = await loadPublishedBlogPosts();
    const urlKey = (p: { locale?: string; category: string; slug: string }) =>
      `${p.locale ?? "en"}|${p.category}|${p.slug}`;
    const staticKeys = new Set(ALL_SEED_POSTS.map(urlKey));
    for (const post of dbPosts) {
      if (staticKeys.has(urlKey(post))) continue; // static article wins the URL
      const locale = post.locale ?? "en";
      const languages: Record<string, string> = {};
      for (const a of dbPostAlternates(post, dbPosts)) {
        languages[a.locale ?? "en"] = localeUrl(a.locale ?? "en", `/blog/${a.category}/${a.slug}`);
      }
      if (languages.en) languages["x-default"] = languages.en;
      entries.push({
        url: localeUrl(locale, `/blog/${post.category}/${post.slug}`),
        lastModified: post.dateModified
          ? new Date(post.dateModified)
          : post.date
            ? new Date(post.date)
            : NOW,
        changeFrequency: "monthly",
        priority: 0.7, ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
      });
    }
  } catch {
    /* db unavailable — the static sitemap stands alone */
  }

  return entries;
}
