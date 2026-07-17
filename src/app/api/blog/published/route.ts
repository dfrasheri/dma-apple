/**
 * GET /api/blog/published — PUBLIC feed of CRM-published blog articles.
 *
 * Returns `{ posts: BlogPost[] }` shaped exactly like the static posts in
 * src/lib/blog-data.ts (markdown body included) so the public blog can merge
 * them straight into its seed corpus. `?locale=en|sq|it|de|fr` filters to one
 * language; anything else returns every locale. Reachable without a session
 * (the middleware matcher excludes /api) and must NEVER 500 the public site:
 * any DB failure — e.g. a missing sqlite file on a fresh deploy — degrades to
 * an empty feed.
 */
import { NextResponse } from "next/server";
import type { BlogPost } from "@/lib/blog-data";
import { CONTENT_LOCALES, type ContentLocale } from "@/lib/crm/types";

export const runtime = "nodejs";

/** Hero fallback for subjects without a mapped image (BlogPost.image is required). */
const FALLBACK_IMAGE = "/images/dma/blog-tourism101.webp";

function parseLocale(value: string | null): ContentLocale | undefined {
  return value !== null && (CONTENT_LOCALES as readonly string[]).includes(value)
    ? (value as ContentLocale)
    : undefined;
}

export async function GET(req: Request) {
  try {
    // Imported lazily so a failure to open the sqlite file is caught here
    // (module-scope `new Database()` would otherwise throw outside try/catch).
    const { listPublishedPosts } = await import("@/lib/crm/services/content");
    const locale = parseLocale(new URL(req.url).searchParams.get("locale"));
    const rows = await listPublishedPosts(locale);

    const posts: BlogPost[] = rows.map((row) => ({
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
      ...(row.faq ? { faq: row.faq } : {}),
      ...(row.targetKeyword ? { targetKeyword: row.targetKeyword } : {}),
      group: row.grp,
      dateModified: row.updatedAt.toISOString().slice(0, 10)
    }));

    return NextResponse.json(
      { posts },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
        }
      }
    );
  } catch (err) {
    console.error("[blog] published feed error:", err);
    // Never cache the degraded response so recovery is immediate.
    return NextResponse.json(
      { posts: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
