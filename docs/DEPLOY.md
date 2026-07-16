# Deploying dentalmedaustria.al to production

The site ranks for nothing while it lives on `localhost:9999`. This is the exact,
ordered runbook to take it live and get every URL indexed. Total hands-on time:
about 1–2 hours, then waiting on DNS + Google.

## 0. Pre-flight (already done in the repo)

- `npm run build` green (verified locally).
- `src/app/sitemap.ts` — full sitemap: every page × 4 locales with hreflang + all blog articles.
- `src/app/robots.ts` — allows all crawlers (incl. AI bots), blocks `/crm` `/autoseo` `/orbita` `/api`, points at the sitemap.
- Per-article SSR `<title>`/meta/canonical/hreflang via `blog/[category]/[slug]/page.tsx` `generateMetadata`.
- `SITE_URL` in `src/lib/seo.ts` is `https://www.dentalmedaustria.al` — change it there if the production domain differs.

## 1. Host on Vercel (recommended for Next.js 16)

1. Push the repo to GitHub (private is fine): `git init` (if needed) → commit → push.
2. vercel.com → **Add New → Project** → import the repo. Framework auto-detects Next.js. Build command `next build`, output default.
3. **Environment variables** (Project → Settings → Environment Variables, add to *Production* and *Preview*):
   | Name | Value | Note |
   |---|---|---|
   | `ANTHROPIC_API_KEY` | *(the rotated key)* | AutoSEO/Orbita/chatbot/CRM bot |
   | `AUTOSEO_DASHBOARD_KEY` | *(a strong password)* | gates the /autoseo dashboard + APIs |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `355675562354` | WhatsApp form target |
   | CRM auth secrets | *(whatever `src/lib/crm/auth` expects)* | check `.env.local` for the full list |
4. Deploy. Verify the `*.vercel.app` preview renders `/en`, `/de`, `/it`, `/sq`, a blog article, `/sitemap.xml`, `/robots.txt`.

### ⚠️ Publishing quirk to know
`/api/autoseo/publish` writes to `src/lib/generated-posts.ts` **on the filesystem**. That works on the dev/VPS setup but NOT on Vercel's read-only serverless filesystem. On Vercel, publish articles locally (dev server) and `git push` them — they become part of the next build. (Or later: move GENERATED_POSTS into a database.)

## 2. Domain

1. Vercel → Project → Settings → **Domains** → add `dentalmedaustria.al` and `www.dentalmedaustria.al` (www as primary, matching `SITE_URL`).
2. At the DNS provider for `dentalmedaustria.al`: `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`.
3. **Also add `crm.dentalmedaustria.al`** (`CNAME crm → cname.vercel-dns.com`) — the middleware serves the staff tools (CRM/AutoSEO/Orbita) only on the `crm.` host and redirects them off the public domain.
4. Wait for DNS + auto-SSL (minutes to hours). Verify `https://www.dentalmedaustria.al/robots.txt`.

## 3. Google Search Console (per-locale coverage)

1. search.google.com/search-console → **Add property** → *Domain* property `dentalmedaustria.al` → verify via the DNS TXT record they give you.
2. **Sitemaps** → submit `https://www.dentalmedaustria.al/sitemap.xml`.
3. **URL Inspection** → paste the DE money pages first (`/de`, `/de/catalogue`, 2–3 DE blog articles) → *Request indexing* for each (quota ~10/day; prioritize DE, then IT, EN, SQ).
4. After ~1 week check **Indexing → Pages** for hreflang/canonical errors, and **Performance** filtered by country (DE/AT/CH/IT).

## 4. Bing + AI engines

1. bing.com/webmasters → **Import from Google Search Console** (one click) — Bing powers ChatGPT browsing and much of the AI-answer ecosystem, so this matters for GEO.
2. robots.txt already allows GPTBot, PerplexityBot, ClaudeBot, Google-Extended (the `*` rule) — do not block them.

## 5. Google Business Profile (the single biggest local/GEO lever)

1. business.google.com → claim/create **"Dental Med Austria"**, Rruga Kristo Luarasi, Tirana.
2. Website = `https://www.dentalmedaustria.al`, categories *Dentist / Dental implants specialist*, hours 09:00–22:00 Mon–Sat, photos (use the clinic + technology shots from the site).
3. Start the review flow: after every treatment, the coordinator sends the Google review link (this feeds "best dental clinic albania" AI answers directly).

## 6. Post-launch smoke test (10 minutes)

- `https://www.dentalmedaustria.al/` → 307 to `/en` (or detected locale) ✅
- `/de/blog/dental-tourism/...` article → view-source shows `<title>`, `link rel="canonical"`, 5 × `hreflang` ✅
- `/sitemap.xml` → ~560 URLs ✅  `/robots.txt` → sitemap line ✅
- `https://crm.dentalmedaustria.al` → CRM login; `https://www.dentalmedaustria.al/crm` → redirects to crm. host ✅
- Rich results test (search.google.com/test/rich-results) on one blog article → Article + FAQPage detected ✅

## 7. What moves rankings after launch

Content is live; now authority decides. Work `docs/AUTHORITY-PLAYBOOK.md` top-to-bottom — it contains the verified, prioritized list of directories, review platforms, German portals, and AI-cited surfaces (with exact URLs and what to do on each).
