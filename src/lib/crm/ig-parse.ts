/**
 * "Ctrl+F for Instagram", find a competitor's public Instagram *profile* URL
 * inside their website HTML. This is the trivial, legal half of the competitor
 * map: parse a public link and store it. It does NOT read any IG data (followers,
 * posts, engagement), that's the harvest branch we deliberately don't build.
 *
 * Pure string work, no network. The fetch lives in `connectors/instagram-fetch.ts`.
 */

/** Path segments that are NOT a profile handle. */
const NON_PROFILE = new Set([
  "p",
  "reel",
  "reels",
  "tv",
  "explore",
  "stories",
  "accounts",
  "about",
  "developer",
  "directory",
  "legal",
  "privacy",
  "web",
  "sharer"
]);

const HANDLE_RE = /(?:https?:)?\/\/(?:www\.)?instagram\.com\/([A-Za-z0-9._]+)\/?/gi;

/** Extract the first plausible IG profile handle from HTML. Returns null if none. */
export function extractInstagramHandle(html: string): string | null {
  if (!html) return null;
  const seen = new Set<string>();
  for (const match of html.matchAll(HANDLE_RE)) {
    const handle = match[1]?.replace(/\/+$/, "");
    if (!handle) continue;
    const lower = handle.toLowerCase();
    if (NON_PROFILE.has(lower)) continue;
    if (lower.includes("?")) continue;
    if (seen.has(lower)) continue;
    seen.add(lower);
    return handle;
  }
  return null;
}

/** Normalise to a canonical public profile URL. */
export function instagramUrlFromHandle(handle: string): string {
  return `https://instagram.com/${handle.replace(/^@/, "").replace(/\/+$/, "")}`;
}

/** Convenience: HTML → canonical profile URL (or null). */
export function extractInstagramUrl(html: string): string | null {
  const handle = extractInstagramHandle(html);
  return handle ? instagramUrlFromHandle(handle) : null;
}

/** Pull the @handle back out of a stored profile URL, for display. */
export function handleFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/instagram\.com\/([A-Za-z0-9._]+)/i);
  return m ? `@${m[1]}` : null;
}
