/**
 * Resolve a competitor's PUBLIC Instagram profile URL from their website (mock).
 *
 * This is the legal half of the competitor map: fetch the public site, parse the
 * IG link, store the URL. It does NOT log into Instagram or read any IG data.
 *
 * REAL API SEAM: replace `fetchWebsiteHtml` with `await fetch(url).then(r =>
 * r.text())`. The parsing (`extractInstagramUrl`) stays exactly the same.
 */
import { extractInstagramUrl, instagramUrlFromHandle } from "../ig-parse";

/** A couple of canned pages; otherwise we synthesize a plausible footer link. */
const MOCK_SITES: Record<string, string> = {
  "https://bosphorussmile.com":
    `<html><footer><a href="https://instagram.com/bosphorussmile">Follow us</a></footer></html>`,
  "https://estetikistanbul.com":
    `<html><a class="ig" href="https://www.instagram.com/estetik.istanbul/">IG</a></html>`
};

export async function fetchWebsiteHtml(url: string): Promise<string | null> {
  if (!url) return null;
  if (MOCK_SITES[url]) return MOCK_SITES[url];

  // REAL API SEAM: `const res = await fetch(url); return res.ok ? res.text() : null;`
  // For the demo we synthesize a footer IG link derived from the domain so the
  // "resolve IG" action is observable without live network calls.
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const handle = host.split(".")[0].replace(/[^a-z0-9._]/gi, "");
    if (!handle) return null;
    return `<html><body><a href="${instagramUrlFromHandle(handle)}">Instagram</a></body></html>`;
  } catch {
    return null;
  }
}

export async function resolveInstagramFromWebsite(
  url: string
): Promise<string | null> {
  const html = await fetchWebsiteHtml(url);
  return html ? extractInstagramUrl(html) : null;
}
