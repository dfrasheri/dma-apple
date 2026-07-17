/**
 * SERVER-ONLY bridge between the CRM content engine and the public blog:
 * loads AutoSEO articles published to the `published_posts` table and maps
 * them onto the static `BlogPost` shape the blog pages already render.
 *
 * Everything here is BEST-EFFORT by design: the public site must keep working
 * when the CRM sqlite file is missing or locked (fresh checkout, read-only
 * serverless fs), so the db-touching service is imported lazily and the
 * loader resolves to [] on ANY failure instead of throwing.
 *
 * Never import this from client components — client code consumes the same
 * data via GET /api/blog/published (see src/app/api/blog/published/route.ts),
 * merged into the static posts by src/lib/blog.ts.
 */
import type { BlogPost } from "./blog-data";
import type { PublishedPost } from "@/db/schema";

/**
 * Hero fallback when a published post carries no mapped image. MUST stay in
 * sync with /api/blog/published so the server-rendered copy of a post is
 * identical (same id/image) to the client-fetched one and dedupes cleanly.
 */
const FALLBACK_IMAGE = "/images/dma/blog-tourism101.webp";

/** Map a `published_posts` row onto the static blog shape (pure). */
export function publishedPostToBlogPost(row: PublishedPost): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    excerpt: row.excerpt,
    body: row.body,
    keywords: row.keywords,
    image: row.image ?? FALLBACK_IMAGE,
    date: row.date,
    locale: row.locale,
    metaDescription: row.metaDescription,
    // grp is the originating topic's UUID — distinct from the human-readable
    // static groups, so hreflang sets never cross the static/db boundary.
    group: row.grp,
    dateModified: row.updatedAt.toISOString().slice(0, 10),
    ...(row.faq ? { faq: row.faq } : {}),
    ...(row.targetKeyword ? { targetKeyword: row.targetKeyword } : {}),
  };
}

/**
 * All CRM-published articles as ready-to-render blog posts, newest first.
 * Lazy-imports the sqlite-backed service; resolves to [] when the db (or the
 * native driver) is unavailable so callers never need their own guard.
 */
export async function loadPublishedBlogPosts(): Promise<BlogPost[]> {
  try {
    const { listPublishedPosts } = await import("@/lib/crm/services/content");
    const rows = await listPublishedPosts();
    return rows.map(publishedPostToBlogPost);
  } catch {
    return [];
  }
}

/**
 * All language versions of one published article (itself included), resolved
 * against the loaded db list. The static `postAlternates` only searches the
 * seed posts, so db posts need this sibling lookup instead.
 */
export function dbPostAlternates(post: BlogPost, all: BlogPost[]): BlogPost[] {
  if (!post.group) return [post];
  const siblings = all.filter((p) => p.group === post.group);
  return siblings.length > 0 ? siblings : [post];
}

/** Find a published post by category + slug; prefers `locale` when given. */
export function findDbPost(
  all: BlogPost[],
  category: string,
  slug: string,
  locale?: string,
): BlogPost | undefined {
  const matches = all.filter((p) => p.category === category && p.slug === slug);
  if (locale) {
    const exact = matches.find((p) => (p.locale ?? "en") === locale);
    if (exact) return exact;
  }
  return matches[0];
}
