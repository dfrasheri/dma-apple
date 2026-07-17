"use client";

// Client-side blog utilities (localStorage persistence + hooks). All the DATA
// (types, categories, seed posts, locale helpers) lives in blog-data.ts, which
// is server-safe and re-exported here so existing imports keep working.
import { useEffect, useState } from "react";
import { ALL_SEED_POSTS, type BlogPost } from "./blog-data";

export {
  BLOG_CATEGORIES,
  SEED_POSTS,
  ALL_SEED_POSTS,
  slugify,
  makeId,
  postsForLocale,
  categoryBySlug,
  postAlternates,
  findPost,
  blogImagePosition,
} from "./blog-data";
export type { BlogCategory, BlogPost } from "./blog-data";

const STORAGE_KEY = "tpds_blog_posts_v1";

// ── CRM-published articles (second merge source, beside localStorage) ───────
// Fetched from the public /api/blog/published feed ONCE per page load, then
// cached at module level. Client-only, exactly like the localStorage seam:
// SSR and the first client render always show the deterministic seeds, and
// the "tpds-blog-updated" event re-renders every mounted useBlogPosts() when
// the db articles arrive. Best-effort: any network/db failure simply leaves
// the static blog untouched.
let dbPosts: BlogPost[] = [];
let dbFetchStarted = false;

/** locale+category+slug — a post's public URL identity, used for deduping. */
function postKey(p: BlogPost): string {
  return `${p.locale ?? "en"}|${p.category}|${p.slug}`;
}

/** Light shape check on feed items — trust nothing that crosses the wire. */
function isBlogPostLike(p: unknown): p is BlogPost {
  if (!p || typeof p !== "object") return false;
  const o = p as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.slug === "string" &&
    typeof o.category === "string" &&
    typeof o.excerpt === "string" &&
    typeof o.body === "string" &&
    typeof o.image === "string" &&
    typeof o.date === "string" &&
    Array.isArray(o.keywords)
  );
}

function ensureDbPostsFetched(): void {
  if (typeof window === "undefined" || dbFetchStarted) return;
  dbFetchStarted = true;
  void fetch("/api/blog/published")
    .then((r) => (r.ok ? (r.json() as Promise<unknown>) : null))
    .then((data) => {
      const posts = (data as { posts?: unknown } | null)?.posts;
      if (!Array.isArray(posts)) return;
      const clean = posts.filter(isBlogPostLike);
      if (clean.length === 0) return;
      dbPosts = clean;
      window.dispatchEvent(new Event("tpds-blog-updated"));
    })
    .catch(() => {
      /* offline / db unavailable — the static blog stays as-is */
    });
}

/** Seeds + CRM-published extras; a static post wins any URL collision. */
function seedAndDbPosts(): BlogPost[] {
  if (dbPosts.length === 0) return ALL_SEED_POSTS;
  const staticKeys = new Set(ALL_SEED_POSTS.map(postKey));
  const extras = dbPosts.filter((p) => !staticKeys.has(postKey(p)));
  return [...extras, ...ALL_SEED_POSTS];
}

export function loadPosts(): BlogPost[] {
  if (typeof window === "undefined") return ALL_SEED_POSTS;
  const base = seedAndDbPosts();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as BlogPost[];
    if (!Array.isArray(parsed) || parsed.length === 0) return base;
    // MERGE, never replace: a stale localStorage copy (saved before newer
    // AutoSEO articles were published) must not hide freshly published posts.
    // localStorage may only contribute EXTRA posts (admin demo drafts) — a
    // stale snapshot of a db article (same id or URL) must not shadow it.
    const knownIds = new Set(base.map((p) => p.id));
    const knownKeys = new Set(base.map(postKey));
    const extras = parsed.filter(
      (p) => p && typeof p.id === "string" && !knownIds.has(p.id) && !knownKeys.has(postKey(p)),
    );
    return [...extras, ...base];
  } catch {
    return base;
  }
}

export function savePosts(posts: BlogPost[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    window.dispatchEvent(new Event("tpds-blog-updated"));
  } catch {
    /* storage full or unavailable - ignore for demo */
  }
}

export function resetPosts(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("tpds-blog-updated"));
}

/** SSR-safe hook: starts from deterministic seeds, hydrates from localStorage on mount. */
export function useBlogPosts(): BlogPost[] {
  const [posts, setPosts] = useState<BlogPost[]>(ALL_SEED_POSTS);

  useEffect(() => {
    // SSR-safe: seeds render first (see doc comment above), this hydrates
    // the real localStorage-backed value once mounted. The db feed arrives
    // asynchronously and re-renders via the same "tpds-blog-updated" event.
    ensureDbPostsFetched();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosts(loadPosts());
    const onUpdate = () => setPosts(loadPosts());
    window.addEventListener("tpds-blog-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("tpds-blog-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  return posts;
}
