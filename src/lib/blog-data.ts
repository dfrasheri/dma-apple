// SERVER-SAFE blog data: types, categories, seed posts and pure helpers.
// No "use client" here, Server Components (generateMetadata, sitemap.ts)
// import from THIS module. Client hooks (localStorage etc.) live in blog.ts,
// which re-exports everything below so existing imports keep working.
import { GENERATED_POSTS } from "./generated-posts";
import { SEED_ENRICHED } from "./seed-posts-enriched";
import { BLOG_POSTS_SQ } from "./blog-posts-sq";
import { SEED_POSTS_IT } from "./seed-posts-it";

export type BlogCategory = {
  slug: string;
  label: string;
  blurb: string;
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  { slug: "dental-tourism", label: "Dental Tourism", blurb: "Practical guides to safe, high-quality dental care abroad - and why patients choose Albania." },
  { slug: "dental-tips", label: "Dental Tips", blurb: "Honest advice on treatments and how to get the most from your dental care." },
  { slug: "dental-med-news", label: "Dental Med News", blurb: "Updates, treatments, and insights from the team at Dental Med Austria." },
];

/**
 * Per-image focal point for the wide post hero, so the subject (usually faces)
 * stays in frame instead of being cropped out by a plain centre crop. Card
 * crops are near-square and read fine centred; the tall, very wide hero does
 * not. Keyed by image basename; anything not listed defaults to "center".
 */
const BLOG_IMAGE_FOCUS: Record<string, string> = {
  "implants-cost": "center",
  "full-mouth": "center 30%",
  "veneers": "center 38%",
};
export function blogImagePosition(image: string): string {
  for (const key of Object.keys(BLOG_IMAGE_FOCUS)) {
    if (image.includes(key)) return BLOG_IMAGE_FOCUS[key];
  }
  return "center";
}

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  keywords: string[];
  image: string;
  date: string;
  // Optional fields added for AutoSEO multilingual articles (back-compatible).
  locale?: string; // "en" | "it" | "de" | "sq"; absent = treated as "en"
  metaTitle?: string;
  metaDescription?: string;
  faq?: { q: string; a: string }[];
  targetKeyword?: string;
  /** Shared key linking the language versions of one article (for hreflang). */
  group?: string;
  // GEO/E-E-A-T fields (all optional, back-compatible).
  /** Self-contained factual takeaways rendered as a citable block up top. */
  keyTakeaways?: string[];
  /** Named human author (E-E-A-T). Falls back to the clinic default. */
  author?: { name: string; jobTitle?: string; url?: string };
  /** Medical reviewer surfaced as a visible byline + schema reviewedBy. */
  reviewedBy?: { name: string; jobTitle?: string; url?: string };
  /** ISO date the content was last substantively updated (freshness signal). */
  dateModified?: string;
  /** ISO date a clinician last reviewed the medical content. */
  reviewedDate?: string;
};

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "post";
}

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

/** Deterministic seed posts so the home strip and blog pages are never empty. */
const RAW_SEED_POSTS: BlogPost[] = [
  {
    id: "seed-1", title: "Modern Orthodontics for Precise Function and Lasting Aesthetic Results", slug: "modern-orthodontics-precise-function-aesthetic-results", category: "dental-med-news",
    excerpt: "Orthodontics in Albania offers specialized dental care that focuses on correcting teeth and jaw alignment.",
    body: "Modern orthodontics is about far more than straight teeth - it's about restoring balanced function and lasting aesthetics. At Dental Med Austria, our orthodontic care corrects both teeth and jaw alignment so that your bite works as beautifully as it looks.\n\nOur orthodontic team offers traditional braces for complex movements and Invisalign clear aligners for discreet, everyday treatment. Each plan is built around a detailed assessment, so the path to your new smile is predictable from the very first appointment.\n\nThe result is a smile that is healthier, easier to clean, and naturally aligned - protected for the long term with custom retainers and backed by our written treatment guarantee.",
    keywords: ["orthodontics", "braces", "invisalign", "albania"], image: "/images/dma/blog-orthodontics.webp", date: "2026-05-18",
  },
  {
    id: "seed-2", title: "Dental Crowns in Albania - Restore Strength and Natural Aesthetics", slug: "dental-crowns-albania-restore-strength-natural-aesthetics", category: "dental-med-news",
    excerpt: "Dental crowns restore broken, missing, or damaged teeth while improving both function and natural appearance.",
    body: "When a tooth is too damaged for a simple filling, a dental crown rebuilds its strength while restoring a natural shape, colour, and bite. At Dental Med Austria, every crown is crafted from premium materials by trusted partners such as Ivoclar.\n\nWe match each restoration carefully to your surrounding teeth, so the finished crown blends seamlessly into your smile. Whether you need a single zirconia crown, a porcelain crown, or a multi-tooth bridge, the work is built to last.\n\nEvery restoration is produced to ISO 9001 and European quality standards and protected by our written treatment guarantee - giving local and international patients complete peace of mind.",
    keywords: ["crowns", "zirconia", "porcelain", "albania"], image: "/images/dma/blog-crowns.webp", date: "2026-04-22",
  },
  {
    id: "seed-3", title: "Dental Prostheses in Albania - Restore Function, Comfort, and a Harmonious Smile", slug: "dental-prostheses-albania-restore-function-comfort", category: "dental-med-news",
    excerpt: "Custom dental prostheses restore missing or damaged teeth for function, comfort, and a harmonious smile.",
    body: "Missing or damaged teeth affect far more than appearance - they change how you chew, speak, and feel about yourself. Custom dental prostheses restore all three, rebuilding function, comfort, and a harmonious smile.\n\nAt Dental Med Austria we offer fixed and removable prostheses, custom dentures, and full-mouth rehabilitation, often combined with implants for added stability. Each prosthesis is designed and fitted with care so it feels secure and natural every day.\n\nWith advanced technology, premium materials, and our written treatment guarantee, patients from Albania and abroad can trust the comfort and longevity of their results.",
    keywords: ["prostheses", "dentures", "rehabilitation", "albania"], image: "/images/dma/blog-prostheses.webp", date: "2026-03-30",
  },
  {
    id: "seed-4", title: "Dental Tourism 101: How to Find Safe, High-Quality Dental Care Abroad", slug: "dental-tourism-101-safe-affordable-care-abroad", category: "dental-tourism",
    excerpt: "A practical guide to finding safe, high-quality dental treatment when travelling abroad.",
    body: "Travelling abroad for dental care can be an excellent choice without compromising on quality - but only if you choose the right clinic. The essentials are simple: look for recognised standards, transparent treatment plans, and a clinic that supports you before, during, and after your visit.\n\nAlbania has become a leading dental-tourism destination by combining breathtaking sights with world-class care. At Dental Med Austria we make the journey effortless, arranging convenient flights, airport pickup at Tirana, comfortable partner hotels, and translation in English, Italian, German, and French.\n\nOur process is built around safety: an initial consultation to plan your treatment, expert care using premium materials, and dedicated follow-up after you return home - all backed by ISO 9001 standards and a written treatment guarantee.",
    keywords: ["dental tourism", "safe", "premium quality", "abroad"], image: "/images/dma/blog-tourism101.webp", date: "2026-05-06",
  },
  {
    id: "seed-5", title: "Understanding Tooth Surgeries: What Are Your Options?", slug: "understanding-tooth-surgeries-options-costs", category: "dental-tips",
    excerpt: "A clear look at common tooth surgery options and what each one involves.",
    body: "The word 'surgery' can sound daunting, but many dental procedures are routine, gentle, and life-changing. Understanding your options helps you make confident decisions about your care.\n\nCommon procedures range from extractions and bone regeneration to implant placement and full-arch solutions such as All-on-4 and All-on-6. At Dental Med Austria, careful planning and painless techniques keep every procedure as comfortable as possible.\n\nEvery case is different, which is why we provide a free, personalised treatment plan up front. To discuss your options, simply email info.dentalmedaustria.com.",
    keywords: ["tooth surgery", "extraction", "aftercare", "options"], image: "/images/dma/blog-surgeries.webp", date: "2026-02-26",
  },
  {
    id: "seed-6", title: "Dental Veneers: How to Find Premium-Quality Solutions Without Compromising", slug: "cost-of-dental-veneer-affordable-without-compromising-quality", category: "dental-tips",
    excerpt: "How to choose the right veneers without compromising on quality, materials, or natural-looking results.",
    body: "Veneers are one of the most transformative cosmetic treatments - and one where quality truly matters. The right choice depends on the material, the number of teeth, and the expertise behind the work.\n\nPorcelain veneers offer the most durable, light-reflective finish, while composite veneers provide a convenient, same-visit option. At Dental Med Austria, both are crafted to a flawless, natural standard using premium materials.\n\nBy combining premium-quality dentistry in Albania, patients achieve a Hollywood-level smile - without ever compromising on quality. For a free, personalised treatment plan, email info.dentalmedaustria.com.",
    keywords: ["veneers", "premium quality", "smile design", "porcelain"], image: "/images/dma/blog-veneer-cost.webp", date: "2026-02-12",
  },
  {
    id: "seed-7", title: "What is Dental Tourism? Definition, Benefits, and More", slug: "what-is-dental-tourism-definition-benefits", category: "dental-tourism",
    excerpt: "A simple definition of dental tourism, its key benefits, and what to expect from the experience.",
    body: "Dental tourism is the practice of travelling abroad to receive dental treatment, usually combining high-quality care with a memorable trip. For many patients, it makes treatments that once felt out of reach entirely achievable.\n\nThe benefits are substantial. Patients gain access to experienced specialists, premium materials, and modern facilities - often with shorter waiting times. Albania, with its scenery and welcoming culture, makes the experience genuinely enjoyable.\n\nAt Dental Med Austria, we handle the details that make dental tourism stress-free: flights, airport pickup, partner hotels, multilingual support, and attentive follow-up care once you're home.",
    keywords: ["dental tourism", "benefits", "definition", "albania"], image: "/images/dma/blog-what-tourism.webp", date: "2026-04-03",
  },
  {
    id: "seed-8", title: "Best Country for Dental Implants: Where to Find Premium Quality Abroad", slug: "cheapest-country-dental-implants-best-deals", category: "dental-tourism",
    excerpt: "Where to find premium-quality dental implants abroad - and how to balance quality with peace of mind.",
    body: "When researching dental implants abroad, the right choice comes from balancing proven materials, experienced clinicians, and reliable aftercare.\n\nAlbania consistently ranks among the leading destinations for high-quality implants. At Dental Med Austria, we've placed more than 42,000 implants with a 98% success rate, using premium partners such as Straumann and Implant Swiss.\n\nCombined with our dental-tourism support and written treatment guarantee, patients enjoy world-class implant treatment - without cutting corners on quality. For a free, personalised treatment plan, email info.dentalmedaustria.com.",
    keywords: ["implants", "premium quality", "abroad", "guarantee"], image: "/images/dma/blog-cheapest-implants.webp", date: "2026-03-11",
  },
  {
    id: "seed-9", title: "Ceramic Veneers: A Premium-Quality Guide for Every Patient", slug: "porcelain-veneer-cost-guide-budget-conscious-patients", category: "dental-tips",
    excerpt: "A clear guide to ceramic veneers and how to make a confident, informed decision.",
    body: "Porcelain veneers are prized for their durability and lifelike finish - and understanding what goes into them is the first step to a confident decision.\n\nThe result reflects the quality of the porcelain, the laboratory craftsmanship, and the dentist's experience in smile design. At Dental Med Austria, every veneer is custom-crafted for a natural result and protected by our written treatment guarantee.\n\nBy choosing premium-quality care in Albania, patients achieve a flawless, Hollywood-level smile. For a free, personalised treatment plan, email info.dentalmedaustria.com.",
    keywords: ["porcelain veneers", "premium quality", "smile design", "smile"], image: "/images/dma/blog-porcelain-cost.webp", date: "2026-01-28",
  },
  {
    id: "seed-10", title: "How to Get Premium-Quality Teeth Implants Abroad", slug: "how-to-save-thousands-inexpensive-teeth-implants", category: "dental-tips",
    excerpt: "Practical ways to access safe, high-quality dental implants while travelling abroad for care.",
    body: "Dental implants are a long-term investment in your health and confidence - and there are smart ways to access them without compromising on safety or quality.\n\nThe biggest advantage comes from choosing a trusted clinic abroad. At Dental Med Austria, our experienced team places implants using premium materials, with full-arch options like All-on-4 and All-on-6 that maximise long-term results.\n\nWith dental-tourism support, transparent planning, and a written treatment guarantee, patients receive care to ISO 9001 and European standards. To explore your options and request a free, personalised treatment plan, email info.dentalmedaustria.com.",
    keywords: ["implants", "premium quality", "guarantee", "tourism"], image: "/images/dma/blog-save-thousands.webp", date: "2026-01-14",
  },
];

/**
 * hreflang group per English seed, so each links to its Albanian counterpart
 * in BLOG_POSTS_SQ. (The seeds predate the group field; this backfills it
 * without rewriting the long inline bodies.)
 */
const SEED_GROUPS: Record<string, string> = {
  "seed-1": "seed-orthodontics",
  "seed-2": "seed-crowns-news",
  "seed-3": "seed-prostheses-news",
  "seed-4": "seed-tourism-101",
  "seed-5": "seed-tooth-surgeries",
  "seed-6": "seed-veneers-tips",
  "seed-7": "seed-what-is-tourism",
  "seed-8": "seed-best-country-implants",
  "seed-9": "seed-porcelain-veneers",
  "seed-10": "seed-implants-abroad",
};

/**
 * The seeds above keep their original short copy as the source of truth for
 * ids/slugs/meta; the full SEO-structured bodies (sections, listicles,
 * callouts, photo figures, FAQs, key takeaways) are merged in from the
 * generated enrichment module.
 */
export const SEED_POSTS: BlogPost[] = RAW_SEED_POSTS.map((p) => ({
  ...p, ...(SEED_GROUPS[p.id] ? { group: SEED_GROUPS[p.id] } : {}), ...(SEED_ENRICHED[p.id] ?? {}),
}));

/**
 * AutoSEO-published articles, then the English seeds, then the Albanian and
 * Italian translations of the English-only seed articles, so /sq/blog and
 * /it/blog have full parity with /en/blog. (The 24 AutoSEO topics already
 * ship an Italian variant inside GENERATED_POSTS.)
 */
const ALL_POSTS_RAW: BlogPost[] = [...GENERATED_POSTS, ...SEED_POSTS, ...BLOG_POSTS_SQ, ...SEED_POSTS_IT];

// ── Published-blog curation ──────────────────────────────────────────────────
// The public blog is deliberately curated down to a hand-picked set of articles.
// Only posts whose `group` is listed here are published anywhere the blog is
// surfaced (listing, category pages, article routes, sitemap, related posts) —
// every locale variant of a listed group is kept. This is fully reversible and
// non-destructive: the underlying post data (including the machine-owned
// generated-posts.ts) is untouched, so restoring an article is just adding its
// group back. New AutoSEO posts stay hidden until their group is added here.
// Leave the set EMPTY to publish everything again.
const PUBLISHED_GROUPS = new Set<string>([
  "best-clinic-how-to-choose", // Best Dental Clinic in Albania: How to Choose the Right One
  "implants-cost",             // Dental Implants in Albania (2026): Costs, Quality & What to Expect
  "all-on-4",                  // All-on-4 in Albania: Fixed Teeth, Premium Quality and Process
  "best-clinic",               // Best Dental Clinic in Albania: How to Choose in 2026
  "is-it-safe",                // Is Dental Tourism in Albania Safe? An Honest Guide for UK Patients
]);

export const ALL_SEED_POSTS: BlogPost[] =
  PUBLISHED_GROUPS.size === 0
    ? ALL_POSTS_RAW
    : ALL_POSTS_RAW.filter((p) => p.group != null && PUBLISHED_GROUPS.has(p.group));

/** Newest first, a blog surface should always lead with the latest article. */
function byDateDesc(a: BlogPost, b: BlogPost): number {
  return (b.date || "").localeCompare(a.date || "");
}

/** Posts for a given locale; English seeds (no locale) act as the default/fallback. */
export function postsForLocale(posts: BlogPost[], locale: string): BlogPost[] {
  const inLocale = posts.filter((p) => (p.locale ?? "en") === locale);
  // For non-English locales, fall back to English posts only if nothing localized exists.
  if (locale !== "en" && inLocale.length === 0) {
    return posts.filter((p) => (p.locale ?? "en") === "en").sort(byDateDesc);
  }
  return (inLocale.length > 0 ? inLocale : posts).slice().sort(byDateDesc);
}

export function categoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

/** All language versions of the same article (its hreflang set), including itself. */
export function postAlternates(post: BlogPost): BlogPost[] {
  if (!post.group) return [post];
  return ALL_SEED_POSTS.filter((p) => p.group === post.group);
}

/** Find a post by category + slug; prefers the given locale, falls back to any. */
export function findPost(category: string, slug: string, locale?: string): BlogPost | undefined {
  const matches = ALL_SEED_POSTS.filter((p) => p.category === category && p.slug === slug);
  if (locale) {
    const exact = matches.find((p) => (p.locale ?? "en") === locale);
    if (exact) return exact;
  }
  return matches[0];
}
