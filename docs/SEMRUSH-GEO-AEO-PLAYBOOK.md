# Semrush + MCP Data Stack + GEO/AEO Operating Manual — Dental Med Austria

Companion to [SEO-KEYWORD-MAP.md](./SEO-KEYWORD-MAP.md) (what to rank for) and
[AUTHORITY-PLAYBOOK.md](./AUTHORITY-PLAYBOOK.md) (off-site authority). This file covers
**how to run Semrush like a senior specialist**, **which MCP servers feed live keyword/trend
data into Claude Code**, and the **proven GEO/AEO tactics** with their measured lifts.
Every tool below was verified live (47/47 claims confirmed, research run 2026-07-09).

---

## 1. Live keyword/search data → Claude Code (the MCP stack)

### Already working today, zero setup
- **Google Trends via the Supermetrics connector** (already connected to this workspace,
  source id `GT`, **no authentication required**). Report types: InterestOverTime,
  InterestByRegion, RelatedQueries (top/rising), RelatedTopics, DailyTrends, Suggestions —
  per country, per language, web/news/YouTube/shopping. Ask Claude to query it any time.
  Caveat: niche phrases return "No data" — seed with broader category terms
  (`zahnimplantate`, `turismo dentale`, `dental tourism`) and mine the related queries.
  The same connector also exposes **Google Search Console, Semrush Analytics, Ahrefs,
  Bing Webmaster Tools, Google My Business, Google Ads Keyword Planner (`GAKEY`)** — each
  needs a one-time login via the link `data_source_discovery(ds_id=...)` returns.

### Recommended dedicated MCP servers (all verified July 2026)
| Server | What it gives | Setup | Cost |
|---|---|---|---|
| **Semrush MCP (official)** | Keyword volume/difficulty per country DB (de/it/uk/al), organic research, keyword gap, backlinks, Position Tracking (read) | `claude mcp add semrush https://mcp.semrush.com/v2/mcp -t http` then OAuth | Included w/ paid plan (One Starter/Pro+ or SEO Classic Pro/Guru) + 50k API units/mo; calls burn units — cache results |
| **DataForSEO MCP (official)** | Google volumes per locale, **Google Trends endpoint**, live SERPs + People-Also-Ask, **AI Keyword Data** ($0.01/kw — how people phrase queries in AI chats), **LLM Mentions** (does ChatGPT/Perplexity mention the clinic) | Remote `https://mcp.dataforseo.com/mcp` (Basic auth) or `npx -y dataforseo-mcp-server` | Pay-as-you-go, $1 trial, $50 min top-up; SERP queries $0.0006–0.002 |
| **Google Search Console MCP (community)** | Ground-truth real queries: clicks/impressions/CTR/position per page/country/device; URL inspection; the only *actual* (not estimated) demand data | [AminForou/mcp-gsc](https://github.com/AminForou/mcp-gsc) (20 tools) or [ahonn/mcp-server-gsc](https://github.com/ahonn/mcp-server-gsc) (25k rows); GSC API is free, service-account setup | Free |
| **Bing Webmaster MCP** | Bing query stats + **AI Performance report** (Copilot/Bing AI citations — public preview Feb 2026, Citation Share view added June 2026) | [saurabhsharma2u/search-console-mcp](https://github.com/saurabhsharma2u/search-console-mcp) (GSC+Bing+GA4, most maintained) or isiahw1/mcp-server-bing-webmaster | Free |
| **Reddit Research MCP** | Semantic search across 20k+ subreddits — mine dental-tourism demand language ("Turkey teeth", "is Albania safe") | [king-of-the-grackles/reddit-research-mcp](https://github.com/king-of-the-grackles/reddit-research-mcp) (free hosted) | Free |
| **Keywords Everywhere MCP** | Cheap volume/CPC/trend cross-check | `https://mcp.keywordseverywhere.com/mcp` (API key as Bearer) | ~$1.25/100k credits class pricing |
| **Ahrefs MCP (official)** | Keyword research, competitor link-gap, Brand Radar (AI mentions) | `https://api.ahrefs.com/mcp/mcp`; also available as claude.ai marketing-plugin connector (needs auth) | Paid Lite+ plan, consumes API units |
| **Mangools MCP (beta)** | KWFinder keywords, SERP watcher, **AI Search Watcher** (LLM visibility) | `https://mcp.mangools.com/mcp` | Free tier exists, no card |

### Google Trends specifically (the "latest searches" question)
- **pytrends is dead** (archived April 2025). **Official Google Trends API is still closed alpha** (waitlist).
- Use, in order: (1) the Supermetrics `GT` source already connected, (2) DataForSEO MCP's
  Trends endpoint, (3) SerpApi `google_trends` engine (~$75/mo) or Glimpse (absolute volumes).

### "What people ask AI chatbots" (the new keyword research)
- **Semrush AI Visibility Toolkit — Prompt Research**: real prompt topics with volume/intent
  from a 100M+-prompt database (ChatGPT, Gemini, AI Overviews, AI Mode). $99/mo per domain
  standalone (also bundled in Semrush One tiers with 50–200 tracked prompts). UI-only — not
  exposed through the MCP.
- **DataForSEO AI Keyword Data** ($0.01/keyword) — IS in the MCP; cheapest programmatic option.
- Skip **Profound Prompt Volumes** (enterprise-gated ~$2–5k/mo); their free public
  "Profound Index" (June 2026) is worth a monthly look. **Otterly** ($29+) / **Peec AI** are
  mid-market alternatives; Otterly's API+MCP starts at $189/mo.
- **AnswerThePublic has no API by design**; automate PAA via DataForSEO SERP API or
  AlsoAsked's API ($12+/mo, bundled all plans; community MCP: metehan777/alsoasked-mcp).

---

## 2. Semrush operating manual (senior-specialist workflow)

Run everything **once per country database** — google.de, google.it, google.co.uk, google.al.
Never research one market and translate; DE/IT/UK patients search differently (§4 of keyword map).

1. **Keyword Magic Tool — winnable keywords for a low-authority domain.**
   Enter the clinic domain in the AI domain bar → unlocks **Personal Keyword Difficulty (PKD%)**
   computed against *your* authority, not generic KD. Filters: PKD 0–29% ("Very Easy–Easy")
   first wave (<50% ceiling for a young site); Intent = Transactional+Commercial for money
   pages, Informational for blog; **Questions toggle** → harvest "how much / is it safe /
   how long" for FAQ blocks (feeds the existing FAQPage schema); Advanced filters → SERP
   Features → **AI Overview** → keywords that trigger AIOs = GEO targets; Volume ≥50 DE/IT/UK,
   ≥10 AL; word count ≥3 for long-tail. Broad-Match tab + left-rail modifier subgroups
   (kosten/erfahrungen/preise) → send selections to Keyword Strategy Builder.

2. **Keyword Gap — steal proven keywords.** Your domain + up to 4 rivals per market
   (DE db: Turkish/Hungarian/Croatian tourism clinics + Tirana rivals marketing to DACH;
   IT db: Albanian clinics targeting Italians; UK db: Turkey/Budapest clinics; AL db: local).
   Work the tabs in order **Untapped → Missing → Weak**; filters: competitor position Top 10,
   KD <40, PKD <50, volume ≥50 (≥10 AL). "Weak" at positions 11–20 = page-2 quick wins —
   fixable with on-page + internal links, no backlinks needed.

3. **Organic Research — reverse-engineer competitor PAGES.** Pages report sorted by
   Traffic % shows which *templates* win (price pages, cost calculators, "vs Turkey"
   comparisons, before/after galleries) → copy template types into Next.js routes.
   Position Changes → New/Improved = what's working for them right now. Competitors report
   reveals aggregators (Qunomedical, WhatClinic, Dentaly) = citation targets, and SERPs where
   Authority Score <30 domains / forums hold top-10 = your weak-spot SERPs.

4. **Keyword Strategy Builder — pillar/cluster architecture per locale.** One structured
   list per market (5 seeds each) → auto Topics > Pillar Pages > Subpages. Apply the
   **"Easy Start"** preset (built for low-authority sites), then "Quick Conversions".
   Map 1:1 to routes: pillar `/de/catalogue/zahnimplantate`, spokes kosten/erfahrungen/
   all-on-4/risiken, interlinked. Push buttons: → Position Tracking, → SEO Writing Assistant.

5. **Position Tracking — one campaign, ~10 targets (needs Guru).** Targets: DE desktop+mobile,
   IT, UK, AL-Tirana, + **ChatGPT** (supported engine). Tag keywords by treatment × market.
   SERP Features filter → AI Overviews: when your domain is cited in an AIO Semrush counts it
   as **position #1**; toggle Visibility % with/without AIO. Weekly: Pages report per geo —
   a `/en/` URL ranking in Germany = **hreflang regression** (this is the practical i18n test).
   Set position-drop email triggers.

6. **Content pipeline:** Topic Research (per market+language) → SEO Content Template
   (location-set — pulls top-10 rivals' term usage) → SEO Writing Assistant score before
   publish. Every treatment pillar gets: a cost page, a "vs Turkey/Hungary" comparison,
   an is-it-safe FAQ page — those three dominate dental-tourism question volume.

7. **AI Visibility Toolkit ($99/mo, month 2):** Brand Performance (share of voice + the
   narratives AI attaches to the brand vs competitors), Prompt Research (mine "dental
   implants albania vs turkey price"-type prompts), Prompt Tracking (25 prompts: ~8 DE,
   8 IT, 6 EN, 3 AL), AI Search Site Audit (validates the robots.ts AI-crawler allowances
   actually work end-to-end).

8. **.Trends / Traffic & Market toolkit** (now inside "Semrush One"): Market Explorer
   Growth Quadrant for the dental-tourism category, One2Target/Audience Profile for DACH
   demographics, EyeOn for automated competitor-activity alerts.

**90-day order:** W1–2 Organic Research + Keyword Gap exports → W2–3 Keyword Magic PKD 0–29
+ Questions + AIO pulls → 4 Strategy Builder lists ("Easy Start") → W3–4 Position Tracking
campaign + connect Semrush MCP → W4–12 publish 2–3 cluster pages/week (DE first, IT second)
→ Day 30 AI Visibility Toolkit + seed 25 prompts → ongoing: weekly PT review, monthly Gap
re-run, quarterly Market Explorer seasonality check.

---

## 3. AEO/GEO — proven tactics, with the numbers

The two games: **RAG citations** (ChatGPT Search, Perplexity, Gemini/AIO retrieve live pages)
and **training-data presence** (Reddit/Wikipedia/review platforms/listicles). Evidence base:
Princeton/KDD 2024 GEO paper (Aggarwal et al., 10k queries) + 2025–26 follow-ups.

1. **Answer-first passages** — every H2 opens with a direct 40–60-word answer, then depth.
   Self-contained 150–300-word passages are the dominant cited unit. Since content lives in
   `src/lib/catalogue-content.ts` + dictionaries, enforce this as a content-shape rule.
2. **Statistics + quotations + cited sources** — the 3 winning Princeton methods, each
   **+30–40% citation visibility** (and +97–115% for low-ranked sites — exactly our position).
   Keyword stuffing tested **−10%**. Add per page: 2–3 sourced stats ("10-year implant
   survival 96.4%, [journal]"), a named credentialed dentist quote, outbound citations.
3. **Query fan-out coverage** — AI Mode/ChatGPT split one prompt into 5–11 parallel
   sub-queries; retrieval is passage-level (top-10-organic share of AIO citations fell
   76%→38% Jul 2025→Mar 2026 — passages beat rank). Per treatment, cover: cost, cost-vs-home,
   safety, days/visits, materials, warranty, recovery, before/after, financing, travel — each
   as a question-H2 with a quotable first paragraph.
4. **Brand mentions > backlinks for AI** — Ahrefs correlation with AI citations: mentions
   r=0.664 vs backlinks r=0.218; **82% of AI citations are earned media**; list mentions
   drive ~41% of commercial AI recommendations; **listicles = ~43.8% of ChatGPT local
   citations**. → The AUTHORITY-PLAYBOOK listicle/directory work IS the AEO strategy.
5. **Freshness** — 83% of commercial-query AI citations come from pages updated within
   12 months; recently updated content appears 4.3×. Quarterly true-update cycle on top-20
   pages with honest `dateModified`.
6. **Consistency / fact layer** — AI cross-references owned data vs listings and drops
   providers whose numbers conflict (resolve the 24,000 vs 8,000 patient-count TODO in
   `seo.ts`). Centralize every recitable fact (prices, counts, NAP, warranty) in one typed
   module rendered everywhere; CI check for hardcoded prices outside it.
7. **Entity hardening** — Wikidata item, stable `@id`, `sameAs` to GBP/Trustpilot/Bookimed/
   socials, `alternateName` bridging "Dental Med Austria" ↔ "Elixence" (rebrand risk),
   `Physician` markup for dentists; `reviewedBy` belongs on a `MedicalWebPage` node (link
   the `BlogPosting` via `mainEntity`), typed with `schema-dts`.
8. **llms.txt: keep, but zero further effort** — Google explicitly ignores it; ~97% of
   llms.txt files get no AI requests. SSR + clean HTML is what matters (AI crawlers mostly
   don't execute JS — the Next.js SSR already covers this).
9. **Bing still matters, but less than 2025** — ChatGPT–Bing citation alignment fell ~26%→~9%
   (OpenAI crawls more itself now). Still: verify Bing Webmaster Tools (free), watch its
   **AI Performance report**, ship **IndexNow** pings on deploy (Bing/Copilot channel).
10. **Measurement** — Semrush AI Visibility Toolkit + a DIY weekly prompt panel (~30 prompts
    × engines × languages via scheduled Claude job, log mentions/citations to a drizzle
    table) — covers Claude/Gemini and de/it/sq gaps the $99 tier misses.

---

## 4. Local + international (clinic-specific)

- **GBP as a weekly channel**: GBP signals ≈ 32% of local pack (Whitespark 2026); primary
  category = single biggest factor; add all secondary categories; weekly posts; seed the
  Q&A section yourself; 10–15 new Google reviews/month with 100% response rate; review
  *recency/velocity* beats count. EU/DACH: ask-all-customers (no cherry-picking — Omnibus
  Directive/UWG), never incentivize.
- **Barnacle SEO**: Bookimed/WhatClinic/Dental Departures profiles rank ON the aggregator
  SERPs; their internal ranking rewards response speed, review score, completeness
  (→ AUTHORITY-PLAYBOOK Phases 1–2).
- **Bing Places + Apple Business** (Apple merged Business Connect into "Apple Business",
  April 2026): free listings that feed ChatGPT/Copilot/Siri local answers.
- **Transcreate, never translate keywords**: DE = skepticism/comparison queries
  ("erfahrungen", "kosten ausland"); IT = destination-led ("dentista in albania" — the
  IT→AL corridor is established); UK = procedure+abroad ("veneers abroad"). Unedited MT
  can suppress rankings across ALL locales — native review per locale.
- **YMYL E-E-A-T**: named practitioner authors + credentials page, visible "Medically
  reviewed by Dr. X — [date]", clinical citations (implant survival studies).

---

## 5. Auto-SEO: safe automation architecture

**The line:** Google's scaled-content-abuse + doorway policies punish volume-without-value.
City-swap pages ("dental implants in [city]") are named doorway spam (−63% traffic in 30
days post-March-2024 in tracked sets). Automation is safe when each page carries unique,
human-verified data.

- **Procedure × source-market matrix** (~10–15 procedures × 4 markets), each page from a
  structured record: clinic price, sourced home-country range, savings %, trips/days,
  flights from that market, materials, warranty, financing, FAQs. **Quality gate**: ≥500
  unique words + ≥3 pair-specific data points, else `noindex` + excluded from sitemap.
- **Pipeline** (extends the existing `/autoseo` system): weekly MCP pull (Semrush gap +
  GSC striking-distance queries + DataForSEO PAA) → diff against SEO-KEYWORD-MAP.md →
  briefs → Claude drafts as PR → **hard CODEOWNERS gate: dentist approves anything touching
  medical claims/prices** (matches SAFETY-CONFIRM-WITH-CLINIC.md) → ships with author +
  reviewedBy schema. Cap 2–4 articles/week/locale.
  - Key upgrade: `POST /api/autoseo/suggest` currently asks Claude for topics **blind**;
    feed it live keyword data (volume/PKD per locale from Semrush MCP, real GSC queries,
    PAA questions) so the queue is demand-driven.
- **Internal-linking automation** from the content graph at build time (blog → exactly one
  money page, keyword-rich-not-spammy anchors — rule already in keyword map).
- **Indexing**: IndexNow ping on deploy (free, Bing/Copilot); skip Google Indexing API
  (job/livestream schema only). Honest sitemap `lastmod` only on real changes.
- **CI SEO regression suite** (`seo-ci.yml`): Lighthouse CI assertions (SEO ≥0.95, LCP/CLS/
  INP budgets), lychee link check, custom script validating reciprocal hreflang clusters +
  self-canonical + one-H1 + unique titles across ~560 URLs, JSON-LD validation
  (schema-dts compile-time + runtime validator). Weekly full-site Unlighthouse scan with
  `--disable-dynamic-sampling`.
- **Rank alerting**: Semrush Position Tracking API (Business-plan add-on) or GSC
  API/BigQuery bulk export cron; alert on position drops + AIO citation loss.
- **Never automate**: medical claims, prices without clinic confirmation, testimonials,
  self-serving aggregateRating, unreviewed machine translations, mass geo-pages.

---

## 6. Gaps a top specialist would flag (repo-specific, ranked)

1. **INP/Core Web Vitals risk**: three.js implant models + hero videos + marquees on
   React 19; INP <200ms is the most-failed CWV (~43% of sites). `dynamic()`/lazy-load the
   3D scene below the fold; CrUX is per-country — check DE/IT mobile separately.
2. **The `seo-i18n-routing` branch itself is the biggest 30-day ranking risk**: needs a
   full 301 map old→new URLs, atomic canonical/sitemap/internal-link update, and GSC
   coverage monitoring post-launch.
3. **Consent Mode v2 + GA4**: mandatory for EEA targeting; without a CMP → blind analytics,
   no Ads conversion modeling. Track form/WhatsApp/tel/email as separate conversions.
4. **WhatsApp conversion path**: `wa.me` deep links with UTM + per-locale prefilled text,
   `ContactPoint`/`potentialAction` schema, response-time SLA (aggregators rank on it).
5. **Social search**: TikTok/IG Reels are search engines for Gen Z (65% use TikTok search);
   "Turkey teeth" is a huge vertical to hijack with "Albania vs Turkey" price-reveal and
   patient-journey formats; Reels/Shorts now surface in Google video results and AIOs.
6. **Video SEO**: `public/videos/procedures/` has no `VideoObject` schema, video sitemap,
   or transcripts (transcripts = AI-citable text ×4 languages).
7. **Image SEO**: before/after gallery pages targeting "veneers before after" (high volume,
   low KD), per-locale alt text, `ImageObject`/licensable markup.
8. **German HWG §11 compliance**: restricts before/after imagery + healing promises in
   medical advertising to German patients — DE-locale content and Ads need a legal pass;
   design DE content differently from EN/IT.
9. **Agentic booking (2026)**: Google agentic booking for local services + ChatGPT
   operator agents complete bookings — keep the consult-request path machine-completable
   (no CAPTCHA walls, structured availability).
10. **Seasonality**: build a 12-month demand calendar from Trends per market (DACH summer
    holidays, New-Year "new smile", Easter); publish pillar refreshes 6–8 weeks before
    peaks; patients book 1–3 months ahead.
11. **Brand SERP**: own page 1 for "Dental Med Austria" AND "Elixence"; claim the Knowledge
    Panel; `alternateName` cross-referencing; watch autosuggest.
12. **Crawl hygiene**: `X-Robots-Tag: noindex` on `*.vercel.app` previews; GSC Index
    Coverage triage per locale; orphan/redirect-chain audits.
13. **Boring link floor**: medical directories per market, .al registries, chamber-of-
    commerce/tourism-board links, German+Italian journalist-request programs (Qwoted,
    Featured, Source of Sources — HARO successors).
14. **Schema depth**: `MedicalProcedure` per treatment, `OfferCatalog`/`priceRange` with
    currency+validity on price pages (feeds AI price-comparison answers), `BreadcrumbList`,
    `VideoObject`/`ImageObject`.

---

## 6b. What "more aggressive than DataForSEO" actually means (decision)

DataForSEO and Semrush ARE the raw data — you don't out-aggress a data commodity with
another data commodity. Aggression is what you do with the data. The upgrade path, in order:

1. **Ahrefs (already available as a claude.ai plugin connector — just authorize it).**
   Its **Brand Radar** tracks brand/URL mentions inside AI answers (ChatGPT/Perplexity/
   Gemini) and its **link intersect** finds sites linking to competitors but not you — both
   are more aggressive on the off-page + AI-citation front than DataForSEO's pure data.
   Given the AUTHORITY-PLAYBOOK is mention/link-driven, this is the highest-value single add.
   Official Ahrefs MCP: `https://api.ahrefs.com/mcp/mcp` (paid Lite+ plan).
2. **An on-page content-optimization API wired into autoseo — the real "premium content"
   lever.** NeuronWriter (cheap, has an API) or Surfer SEO score a draft against the actual
   top-10's term vectors and entities and tell you exactly what to add to out-cover the
   current #1. This closes the loop the pipeline now opens (it already injects competitor
   H2s; an NLP optimizer guarantees term-coverage superiority, not just structural parity).
   This is the pick that most directly serves "be at the absolute top".
3. **A dedicated AI-visibility tracker for German/Italian** — Peec AI or Otterly (API+MCP,
   $189/mo) or the Semrush AI Visibility Toolkit ($99/mo) — because AI answers differ by
   language and market.

Honest note: with Semrush MCP connected + GSC (free) + Google Trends (free via Supermetrics),
you may not even need a DataForSEO subscription. Keep DataForSEO only for cheap live
People-Also-Ask at scale and AI-query data if the free/Semrush sources leave a gap.

## 6c. Envato in autoseo? (decision: no, and here is why + what to do instead)

- **Envato Market API** (`build.envato.com`, personal token) exists but is for marketplace
  items (themes/plugins/stock you buy on ThemeForest/CodeCanyon), your purchases and
  statements — nothing useful to feed an SEO content pipeline.
- **Envato Elements has NO public subscriber API** for programmatically searching or
  downloading stock assets. The only "Elements API" is an **affiliate/partner API** (for
  promoting Elements, not pulling assets). So you cannot legitimately wire your Elements
  subscription into autoseo to auto-fetch blog images.
- **Licensing** also blocks it: Elements requires a license registered per use ("item used
  in a project"); bulk/automated downloading is outside the fair-use terms.
- **What to do instead for autoseo images:**
  1. **Your own clinic photos win** for a medical/YMYL blog — real rooms, real team, real
     (HWG-compliant) before/afters carry E-E-A-T and image-SEO weight stock never will. The
     publish route already maps keywords to specific hero images in `/images/dma/blog/`.
  2. For supplementary stock, use the **Pexels or Unsplash APIs** (free, real REST APIs,
     commercial-use OK, easy to script/MCP) — those CAN be automated.
  3. Use **Envato Elements manually** for premium one-off design assets (logo studio,
     templates, the occasional hero) — that is its real role for you, not an autoseo feed.

## 6d. AutoSEO overhaul shipped 2026-07-09 (what changed in the codebase)

The pipeline no longer writes blind. New/changed files:
- **`src/lib/autoseo/keyword-data.ts`** (new) — the live-demand layer: per-market keyword,
  volume, difficulty, REAL People-Also-Ask questions (the query fan-out), competitor H2s to
  out-cover, and rising related queries. One interface (`writerSignals`, `demandDigest`)
  that any of Semrush MCP / DataForSEO / GSC / Google Trends refreshes. Seeded from the live
  research above.
- **`prompts.ts`** — the generation spec is now aggressively GEO: answer-first everywhere,
  mandatory query-fan-out coverage (answer every injected PAA as its own `### ` sub-heading),
  Princeton evidence density (2-3 sourced statistics + a credentialed quote), comparison
  tables now allowed and encouraged, a `keyTakeaways` block, and demand data injected into
  both the writer and the topic-suggester (topics are now demand-ranked, not invented).
- **generate route** injects per-market live signals into every article; **suggest route**
  inherits the demand digest.
- **Renderer + schema** (`BlogPostClient.tsx`) — now renders `### ` H3, bullet lists and
  comparison tables (AI engines extract tables directly), plus a visible "Key takeaways"
  block and a "Medically reviewed by Dr. …" byline. Article JSON-LD upgraded to
  `["MedicalWebPage","Article"]` with a **Person author**, **`reviewedBy` Physician**, and
  honest **`dateModified`/`lastReviewed`** — the E-E-A-T signals Google weights for YMYL.
- **publish route** stamps named author + reviewer + review date + `keyTakeaways` on every
  published post.

To keep it sharp: periodically ask Claude (with Semrush MCP connected) to refresh
`keyword-data.ts` from live Keyword Magic + GSC striking-distance queries + PAA.

## 7. Live Google Trends findings (queried 2026-07-09, via Supermetrics `GT`)

- **Italy is the hottest signal**: "turismo dentale albania" is the **#1 top related query**
  for "turismo dentale" in Italy (index 100 vs Croatia 33). The IT market pull is real and
  Albania-branded — prioritize IT content/ads accordingly.
- **Germany**: exact phrase "zahnklinik albanien" has ~zero measurable Trends volume;
  "zahnklinik ungarn" dominates the destination pattern. German demand phrases as
  procedure+cost ("zahnimplantate kosten/ausland"), and Hungary — not only Turkey — is the
  incumbent DACH destination to position against.
- **Worldwide EN**: "dental implants albania" only started registering ~Jan 2026
  (index ~5–7 vs Turkey ~80–100) — a nascent, growing query; first-mover window is open.
- Method note: Trends' RelatedQueries returns nothing for niche phrases — always seed with
  the broader category term and mine the related/rising lists.
