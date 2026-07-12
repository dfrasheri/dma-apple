# Keyword Map, SEM Plan & Link-Vendor Policy — Dental Med Austria

Companion to [AUTHORITY-PLAYBOOK.md](./AUTHORITY-PLAYBOOK.md) (off-site authority) — this file
covers **what to rank for**, **what to pay Google for**, and **what never to buy**.
On-site implementation (schema, hreflang, llms.txt, click-to-call NAP) already lives in code:
`src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `public/llms.txt`.

---

## 1. Keyword clusters (by language, intent and target page)

Priority = how hard to push it in content + internal links + GBP posts.
"Best X" queries are won by *review volume + independent citations*, not on-page tricks —
that work is Phases 1–3 of the authority playbook.

### English (international patients: UK, IE, US expats, Balkans EN-speakers)

| Cluster | Example queries | Intent | Target page | Priority |
|---|---|---|---|---|
| Best-clinic head terms | best dental clinic in albania · best dentist tirana · best dental clinic in the balkans · top dental clinics albania 2026 | Commercial | `/en` home + own comparison page (playbook §14) | ★★★ |
| Implant head terms | dental implants albania · all on 4 albania · best implants albania · full mouth implants cost albania | Commercial | `/en/catalogue/dental-implants`, All-on-4/6 pages | ★★★ |
| Cost / price | dental implant cost albania · veneers price albania · how much do dentists cost in albania vs uk | Commercial-informational | blog cost guides + treatment pages (each has a price-anchor FAQ) | ★★★ |
| Dental tourism | dental tourism albania · albania vs turkey dental work · is albania safe for dental treatment | Informational → commercial | `/en/clinic/dental-tourism` + blog comparisons | ★★ |
| Veneers / smile | veneers albania · hollywood smile tirana · smile makeover albania | Commercial | `/en/catalogue/*veneers*`, smiles gallery | ★★ |
| Trust / brand | dental med austria reviews · dental med austria tirana | Navigational | home + (external) Trustpilot/GBP profiles | ★★★ |

### German (DACH — biggest price-delta market)

| Cluster | Example queries | Target | Priority |
|---|---|---|---|
| Zahnklinik head | beste zahnklinik albanien · zahnklinik tirana erfahrungen · zahnarzt albanien | `/de` home | ★★★ |
| Implantate | zahnimplantate albanien kosten · all-on-4 albanien · zahnimplantate ausland erfahrungen | implant pages `/de` | ★★★ |
| Kosten/Vergleich | zahnbehandlung albanien kosten · zähne machen lassen albanien vs türkei · heil- und kostenplan ausland | DE blog cost cluster | ★★★ |
| Angst/Trust | zahnbehandlung albanien seriös · zahntourismus albanien erfahrungen | DE blog + ProvenExpert/Trustpilot | ★★ |

### Italian (proximity market, ferry/flight distance)

| Cluster | Example queries | Target | Priority |
|---|---|---|---|
| Dentista head | dentista in albania · migliore clinica dentale albania · dentisti tirana | `/it` home | ★★★ |
| Impianti | impianti dentali albania prezzi · all on 4 albania costo · implantologia albania | implant pages `/it` | ★★★ |
| Turismo dentale | turismo dentale albania · quanto costa un dentista in albania · albania dentisti esperienze/forum | IT blog | ★★★ |
| Estetica | faccette dentali albania · corone in zirconio albania prezzo | veneer/crown pages `/it` | ★★ |

### Albanian (local + diaspora "summer visit" patients)

| Cluster | Example queries | Target | Priority |
|---|---|---|---|
| Klinika head | klinika dentare tirane · klinika me e mire dentare ne shqiperi · dentist tirane | `/sq` home | ★★★ |
| Implante | implante dentare cmimi · implant dentar tirane · all on 4 shqiperi | implant pages `/sq` | ★★★ |
| Estetike | faseta dentare cmimi · hollywood smile tirane · zbardhim dhembesh | veneer/whitening `/sq` | ★★ |
| Diaspora | dentist ne tirane per pushime · klinika dentare per emigrantet | packets + dental-tourism `/sq` | ★★ |

**Rules for using this map**
1. One primary cluster per URL — never split "dental implants albania" across two pages.
2. Every money page answers the price question explicitly (FAQ block → FAQPage schema already wired).
3. Blog posts target informational queries and internally link *down* to exactly one money page with keyword-rich (not spammy) anchors.
4. Publish every post in all 4 locales when relevant — the hreflang plumbing already handles it.

## 2. AEO / GEO checklist (AI answer engines)

Already live in code: `llms.txt` with canonical NAP · JSON-LD entity graph (`Dentist` with
telephone/geo/sameAs) · FAQPage on treatments · AI crawlers welcomed in `robots.ts` ·
four-locale hreflang. Remaining moves, in impact order:

1. **Review mass on quotable platforms** (GBP, Trustpilot, Bookimed, WhatClinic) — AI engines cite these, not your homepage. → playbook Phase 1.
2. **Own "Best dental clinics in Albania" comparison page**, medically reviewed, honest — playbook §14. The page AI engines want to quote for the exact "best" query.
3. **Consistent one-number claim** — resolve the 24,000+ vs 8,000+ patient-count conflict (`CLINIC_STATS` TODO in `seo.ts`). Contradictory numbers get clinics dropped from AI answers.
4. **Named-dentist bylines + medical reviewer** on every blog post (E-E-A-T; already have `/team/dr-mentor-zeqja` to link).
5. **Statistics + citations inside content** ("Straumann 10-year survival 98.8%…" with source) — pages with citable numbers get quoted 30–40% more by generative engines.
6. **YouTube with transcripts** (playbook §19) — transcripts are AI-citable text.

## 3. SEM — Google Ads plan (paid, immediate)

While organic authority builds (months), Ads buys the "best/cost/implants" SERP today.

**Account structure**
- **Search DE** (highest ROI): ad groups = Implantate / All-on-4 / Kosten / Zahnklinik-Albanien. Phrase + exact only. Landing: `/de` treatment pages, *not* home.
- **Search IT**: Impianti / Turismo dentale / Faccette → `/it` pages.
- **Search EN**: implants + best-clinic terms → `/en`.
- **Search SQ (Brand + local)**: cheap defense of "klinika dentare tirane" + brand.
- **Performance Max for travel intent** after 30+ conversions/month of signal.
- **Remarketing** (Display + YouTube): site visitors who didn't submit the form; frequency-capped; creative = before/after + guarantee + price anchor.

**Musts**
- Conversion tracking first: form submit, WhatsApp click, `tel:` click, email click as separate conversions in GA4 → imported to Ads. (The tel/mailto links now exist site-wide via the sticky bar.)
- Negative keywords: jobs, salary, school, "free", competitor-brand terms you don't want to pay for.
- Call extensions with +355 67 703 3332 · location extension via GBP · price extensions for packages.
- Budget split at start: 50% DE / 25% IT / 15% EN / 10% SQ; rebalance monthly on cost-per-lead.
- Landing-page rule: the ad's keyword appears in the H1 and the price-FAQ of the page it lands on.

## 4. Link-vendor policy — the "110 dofollow backlinks" offer

**Verdict: do not buy it.** The pitch (bulk dofollow links, "high DA", drip-fed over 30 days,
vendor-written content) is a textbook **link scheme** under Google's spam policies
(https://developers.google.com/search/docs/essentials/spam-policies#link-spam). Buying or
selling links that pass PageRank — including "manual outreach" packages — risks:
- SpamBrain silently **nullifying** the links (money burned, zero effect — the usual outcome), or
- a **manual action** ("Unnatural links to your site") that removes the site from results — fatal
  for a domain whose whole business is being found. Recovery = months of disavow work.
- "Dripfeed to be safe" is the vendor admitting the pattern looks unnatural to Google.

**DA/DR is an Ahrefs/Moz metric, not a Google ranking factor.** 110 links from link-farm blogs
with inflated DR move nothing that matters.

**What to do instead** (same budget, compounding instead of radioactive):
[AUTHORITY-PLAYBOOK.md](./AUTHORITY-PLAYBOOK.md) end-to-end — directory/marketplace profiles
(Bookimed, WhatClinic, Dental Departures, Qunomedical…), review velocity, first-mover German
directory slots, disclosed advertorials on real mastheads (Handelsblatt-style, the competitor-
proven route), press-release syndication for launches, and the linkable-asset content engine
(cost-comparison studies, the "best clinics" page, YouTube). Those links are editorially real,
survive every algorithm update, and are the ones AI engines actually cite.

**Ahrefs** (there's an Ahrefs MCP connector available in this workspace — needs auth): use it for
*monitoring* — competitor link-gap analysis (who links to dentaltrio/dentale-albania but not us →
those are outreach targets), rank tracking for the clusters above, and disavow-list hygiene.
That's the legitimate "ahrefs superpower", not buying links.

## 5. Monthly reporting loop

Track in GA4 + Search Console (verify property, submit sitemap.xml on day 1):
1. Clicks/impressions per cluster (GSC regex filters per language folder `/de/`, `/it/`…).
2. Leads by channel: form / WhatsApp / tel-click / email-click (GA4 events) + CRM source field.
3. Review counts per platform (playbook tracking sheet).
4. Core Web Vitals (GSC + `npm run build` size budget).
5. AI-citation spot-checks: monthly, ask ChatGPT/Perplexity/Gemini "best dental clinic in Albania" in EN/DE/IT and log whether DMA appears and which source it cites — that tells you which platform to feed next.
