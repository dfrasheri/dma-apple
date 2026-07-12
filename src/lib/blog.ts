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

export function loadPosts(): BlogPost[] {
  if (typeof window === "undefined") return ALL_SEED_POSTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return ALL_SEED_POSTS;
    const parsed = JSON.parse(raw) as BlogPost[];
    if (!Array.isArray(parsed) || parsed.length === 0) return ALL_SEED_POSTS;
    // MERGE, never replace: a stale localStorage copy (saved before newer
    // AutoSEO articles were published) must not hide freshly published posts.
    // localStorage may only contribute EXTRA posts (admin demo drafts).
    const known = new Set(ALL_SEED_POSTS.map((p) => p.id));
    const extras = parsed.filter((p) => p && typeof p.id === "string" && !known.has(p.id));
    return [...extras, ...ALL_SEED_POSTS];
  } catch {
    return ALL_SEED_POSTS;
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
    // the real localStorage-backed value once mounted.
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
