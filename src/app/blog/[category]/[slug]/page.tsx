// Server wrapper for the blog article page. Supplies SSR metadata that a client
// component cannot: per-article <title>, meta description, canonical, and
// hreflang alternates linking the four localized versions of the article
// (each locale has its OWN slug, so the generic per-path alternates from the
// layout would be wrong here). The interactive rendering stays in BlogPostClient.
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { findPost, postAlternates, type BlogPost } from "@/lib/blog-data";
import { loadPublishedBlogPosts, findDbPost, dbPostAlternates } from "@/lib/blog-db";
import { getLocale } from "@/lib/server-i18n";
import { SITE_URL, localeUrl } from "@/lib/seo";
import { BlogPostClient } from "./BlogPostClient";

type Params = { category: string; slug: string };

/**
 * Resolve an article on the server: static seeds first, then the CRM
 * `published_posts` table (AutoSEO articles published from the CRM). The db
 * lookup is best-effort (loadPublishedBlogPosts resolves [] on any failure),
 * and its hreflang siblings come from the db list — the static
 * `postAlternates` cannot see them.
 */
async function resolvePost(
  category: string,
  slug: string,
  locale?: string,
): Promise<{ post: BlogPost | undefined; alternates: BlogPost[]; fromDb: boolean }> {
  const post = findPost(category, slug, locale);
  if (post) return { post, alternates: postAlternates(post), fromDb: false };
  const all = await loadPublishedBlogPosts();
  const dbPost = findDbPost(all, category, slug, locale);
  if (dbPost) return { post: dbPost, alternates: dbPostAlternates(dbPost, all), fromDb: true };
  return { post: undefined, alternates: [], fromDb: false };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category, slug } = await params;
  const { post, alternates } = await resolvePost(category, slug);
  if (!post) return { title: "Story Not Found | Dental Med Austria", robots: { index: false } };

  const locale = post.locale ?? "en";
  const languages: Record<string, string> = {};
  for (const alt of alternates) {
    languages[alt.locale ?? "en"] = localeUrl(alt.locale ?? "en", `/blog/${alt.category}/${alt.slug}`);
  }
  if (languages.en) languages["x-default"] = languages.en;

  const title = `${post.metaTitle || post.title} | Dental Med Austria`;
  const description = post.metaDescription || post.excerpt;
  return {
    title,
    description,
    keywords: post.keywords,
    alternates: {
      canonical: localeUrl(locale, `/blog/${post.category}/${post.slug}`),
      languages,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description,
      type: "article",
      images: [{ url: post.image.startsWith("http") ? post.image : `${SITE_URL}${post.image}` }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  // Each locale has its OWN slug, so a URL like /sq/blog/cat/<english-slug>
  // (from swapping only the locale prefix — the language switcher or a hand-typed
  // URL) would otherwise fall back to the English article. If the slug belongs to
  // a different locale than the one requested, bounce to this article's real slug
  // in the active locale so the switch lands on the translated version.
  const { category, slug } = await params;
  const locale = await getLocale();
  const { post, alternates, fromDb } = await resolvePost(category, slug);
  if (post && (post.locale ?? "en") !== locale) {
    const alt = alternates.find((p) => (p.locale ?? "en") === locale);
    if (alt && (alt.slug !== slug || alt.category !== category)) {
      redirect(`/${locale}/blog/${alt.category}/${alt.slug}`);
    }
  }
  // A db-published article is unknown to the static seeds the client renders
  // from on the server pass, so hand it down for SSR; the client's own
  // /api/blog/published merge takes over after hydration (identical object).
  return <BlogPostClient fallbackPost={fromDb ? post ?? null : null} />;
}
