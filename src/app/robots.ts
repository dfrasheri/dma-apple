import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Paths that are staff-only or non-content on every crawler.
const DISALLOW = ["/admin", "/crm", "/api"];

// AI answer engines (GEO): explicitly welcome the crawlers behind ChatGPT
// search, Perplexity, Claude, Gemini grounding and Bing/Copilot, so the site
// is eligible to be cited in AI answers. Each gets its own group because some
// bots only honor rules that name them specifically.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "Google-Extended",
  "Bingbot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
