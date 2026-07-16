#!/usr/bin/env node
/**
 * IndexNow submitter — pushes the site's sitemap URLs to search engines that
 * support instant indexing (Bing, Seznam, Naver, Yandex; Bing also feeds
 * Copilot/ChatGPT answer surfaces). Google does NOT support IndexNow — use
 * Search Console (sitemap + Request Indexing) for Google.
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs                 # submit every sitemap URL
 *   node scripts/indexnow-submit.mjs /en /en/blog    # submit specific paths
 *
 * The key file (public/<KEY>.txt) is served at https://<host>/<KEY>.txt which
 * is how IndexNow verifies domain ownership. Run after each deploy or content
 * change — resubmitting unchanged URLs is allowed but rate-limit courteous.
 */

const SITE_URL = process.env.SITE_URL || "https://www.dentalmedaustria.al";
const KEY = "dma4f7c19ae2b8d3650e9a1c47f8b2d5e63";

const host = new URL(SITE_URL).host;

async function urlsFromSitemap() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml fetch failed: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (!urls.length) throw new Error("No <loc> entries found in sitemap.xml");
  return urls;
}

async function main() {
  const args = process.argv.slice(2);
  const urlList = args.length
    ? args.map((p) => (p.startsWith("http") ? p : `${SITE_URL}${p.startsWith("/") ? "" : "/"}${p}`))
    : await urlsFromSitemap();

  // IndexNow accepts up to 10,000 URLs per call.
  const body = {
    host,
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList,
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  console.log(`Submitted ${urlList.length} URLs for ${host}`);
  console.log(`IndexNow response: ${res.status} ${res.statusText}`);
  if (res.status === 200) console.log("OK — URLs accepted.");
  else if (res.status === 202) console.log("Accepted — key validation pending (normal on first submit).");
  else console.log(await res.text());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
