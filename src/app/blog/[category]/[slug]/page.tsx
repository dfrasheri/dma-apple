// Server wrapper for the blog article page. Supplies SSR metadata that a client
// component cannot: per-article <title>, meta description, canonical, and
// hreflang alternates linking the four localized versions of the article
// (each locale has its OWN slug, so the generic per-path alternates from the
// layout would be wrong here). The interactive rendering stays in BlogPostClient.
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { findPost, postAlternates } from "@/lib/blog-data";
import { getLocale } from "@/lib/server-i18n";
import { SITE_URL, localeUrl } from "@/lib/seo";
import { BlogPostClient } from "./BlogPostClient";

type Params = { category: string; slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category, slug } = await params;
  const post = findPost(category, slug);
  if (!post) return { title: "Story Not Found | Dental Med Austria", robots: { index: false } };

  const locale = post.locale ?? "en";
  const languages: Record<string, string> = {};
  for (const alt of postAlternates(post)) {
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
  const post = findPost(category, slug);
  if (post && (post.locale ?? "en") !== locale) {
    const alt = postAlternates(post).find((p) => (p.locale ?? "en") === locale);
    if (alt && (alt.slug !== slug || alt.category !== category)) {
      redirect(`/${locale}/blog/${alt.category}/${alt.slug}`);
    }
  }
  return <BlogPostClient />;
}
