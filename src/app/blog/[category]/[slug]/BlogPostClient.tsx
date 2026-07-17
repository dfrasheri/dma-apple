"use client";

import Link from "next/link";
import { useEffect, type ReactElement, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { motion, useScroll } from "motion/react";
import { PageShell } from "@/components/PageShell";
import { LeadRailForm } from "@/components/LeadRailForm";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "@/components/icons";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { categoryBySlug, slugify, useBlogPosts, blogImagePosition, type BlogPost } from "@/lib/blog";
import {
  ARTICLE_UI,
  articleLocale,
  inlineImagesFor,
  readingMinutes,
  type InlineImage,
} from "@/lib/blog-article-extras";
import { useLocale, useT } from "@/lib/i18n";
import { BLOG_CATEGORY_SQ } from "@/lib/catalogue-names-sq";
import { SITE_URL, localeUrl, breadcrumbJsonLd } from "@/lib/seo";

// ── Inline markdown-lite: [anchor](href) links and **bold** ────────────────
function renderInline(text: string) {
  const out: Array<string | ReactElement> = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  const pushText = (s: string) => {
    // **bold** inside plain segments
    const parts = s.split(/\*\*([^*]+)\*\*/g);
    for (let i = 0; i < parts.length; i++) {
      if (!parts[i]) continue;
      if (i % 2 === 1) out.push(<strong key={`b${k++}`} className="font-medium text-[#2a2018]">{parts[i]}</strong>);
      else out.push(parts[i]);
    }
  };
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) pushText(text.slice(last, m.index));
    const href = m[2];
    out.push(
      <Link key={`l${k++}`} href={href} className="text-[#9a7638] underline decoration-[#c6a15b]/60 underline-offset-2 transition-colors hover:text-[#c6a15b]">
        {m[1]}
      </Link>,
    );
    last = re.lastIndex;
  }
  if (last < text.length) pushText(text.slice(last));
  return out;
}

// ── Markdown pipe-table helpers ─────────────────────────────────────────────
function tableCells(row: string): string[] {
  let r = row.trim();
  if (r.startsWith("|")) r = r.slice(1);
  if (r.endsWith("|")) r = r.slice(0, -1);
  return r.split("|").map((c) => c.trim());
}
function isTableSeparator(row: string): boolean {
  const cells = tableCells(row);
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c.replace(/\s/g, "")));
}

function Figure({ img }: { img: InlineImage }) {
  // Reduced-motion users get the still poster instead of the looping video.
  const reduced = usePrefersReducedMotion();

  return (
    <figure className="my-9">
      {img.video && !reduced ? (
        <video
          src={img.video}
          poster={img.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={img.alt}
          className={
            img.aspect === "video"
              ? "mx-auto block aspect-video w-full max-w-[640px] rounded-2xl object-cover shadow-[var(--shadow-brand-md)]"
              : "mx-auto block aspect-square w-full max-w-[460px] rounded-2xl object-cover shadow-[var(--shadow-brand-md)]"
          }
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img.src}
          alt={img.alt}
          loading="lazy"
          style={{ objectPosition: img.pos ?? "center" }}
          className="mx-auto max-h-[460px] w-full max-w-[600px] rounded-2xl object-contain shadow-[var(--shadow-brand-md)]"
        />
      )}
      {img.caption && (
        <figcaption className="mt-3 text-center font-serif text-[13px] italic text-[#a99a8b]">{img.caption}</figcaption>
      )}
    </figure>
  );
}

type Block = { kind: "h2" | "other"; el: ReactElement };
type Heading = { id: string; text: string };

/**
 * Parse the markdown-lite body into blocks, tracking H2s for the table of
 * contents. Supports: "## " / "### " headings, paragraphs, "- " bullets,
 * "N. " numbered LISTICLES (styled cards), "> " callouts, one pipe table,
 * and explicit image figures: ![alt](/path "caption").
 */
function parseArticle(body: string): { blocks: Block[]; headings: Heading[]; hasFigure: boolean } {
  const lines = body.split("\n").map((l) => l.trim()).filter(Boolean);
  const blocks: Block[] = [];
  const headings: Heading[] = [];
  let hasFigure = false;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      const text = line.slice(3);
      const id = `${slugify(text)}-${headings.length}`;
      headings.push({ id, text });
      blocks.push({
        kind: "h2",
        el: (
          <h2
            key={`h2-${i}`}
            id={id}
            className="serif-title mb-3 mt-12 scroll-mt-28 text-[clamp(21px,2.3vw,27px)] text-[#2a2018]"
          >
            {text}
          </h2>
        ),
      });
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({
        kind: "other",
        el: (
          <h3 key={`h3-${i}`} className="serif-title mb-2 mt-8 text-[clamp(17px,1.7vw,20px)] text-[#2a2018]">
            {line.slice(4)}
          </h3>
        ),
      });
      i++;
      continue;
    }

    // Explicit image figure: ![alt](/path "caption")
    const fig = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/);
    if (fig) {
      hasFigure = true;
      const fSrc = fig[2];
      const fAlt = fig[1] || fig[3] || "";
      const fCap = fig[3] ?? "";
      // A video source (.mp4/.webm) renders as a looping clip; its poster is the
      // sibling .jpg (same basename), which reduced-motion users see as a still.
      const fImg: InlineImage = /\.(mp4|webm)$/i.test(fSrc)
        ? { video: fSrc, src: fSrc.replace(/\.(mp4|webm)$/i, ".jpg"), alt: fAlt, caption: fCap, aspect: "video" }
        : { src: fSrc, alt: fAlt, caption: fCap };
      blocks.push({ kind: "other", el: <Figure key={`fig-${i}`} img={fImg} /> });
      i++;
      continue;
    }

    // Callout: consecutive "> " lines → gold tip box
    if (line.startsWith(">")) {
      const parts: string[] = [];
      const start = i;
      while (i < lines.length && lines[i].startsWith(">")) {
        parts.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({
        kind: "other",
        el: (
          <div key={`q-${start}`} className="my-7 rounded-r-2xl border-l-[3px] border-[#c6a15b] bg-[#f4ecdd] px-6 py-5">
            <p className="font-serif text-[16.5px] italic leading-relaxed text-[#6e6152]">{renderInline(parts.join(" "))}</p>
          </div>
        ),
      });
      continue;
    }

    // Numbered LISTICLE: consecutive "1. " / "2) " lines → numbered cards
    if (/^\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      const start = i;
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+[.)]\s+/, ""));
        i++;
      }
      blocks.push({
        kind: "other",
        el: (
          <ol key={`ol-${start}`} className="my-7 space-y-3.5">
            {items.map((it, j) => (
              <li
                key={j}
                className="flex gap-4 rounded-2xl border border-[#e8ddc9] bg-[#fffefb] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c6a15b]/40 hover:shadow-[var(--shadow-brand-md)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#241c15] font-serif text-[16px] text-[#e4cd9a]">
                  {j + 1}
                </span>
                <span className="pt-1 text-[16px] leading-relaxed text-[#2a2018]">{renderInline(it)}</span>
              </li>
            ))}
          </ol>
        ),
      });
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      const start = i;
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push({
        kind: "other",
        el: (
          <ul key={`ul-${start}`} className="ml-5 list-disc space-y-2">
            {items.map((it, j) => (
              <li key={j}>{renderInline(it)}</li>
            ))}
          </ul>
        ),
      });
      continue;
    }

    if (line.startsWith("|") && line.includes("|", 1)) {
      const rows: string[] = [];
      const start = i;
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(lines[i]);
        i++;
      }
      const dataRows = rows.filter((r) => !isTableSeparator(r));
      if (dataRows.length) {
        const [head, ...bodyRows] = dataRows;
        blocks.push({
          kind: "other",
          el: (
            <div key={`t-${start}`} className="my-6 overflow-x-auto">
              <table className="w-full border-collapse text-[15px]">
                <thead>
                  <tr>
                    {tableCells(head).map((c, j) => (
                      <th key={j} className="border-b border-[#c6a15b]/50 bg-[#f4ecdd] px-3 py-2 text-left font-medium text-[#2a2018]">
                        {renderInline(c)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((r, ri) => (
                    <tr key={ri}>
                      {tableCells(r).map((c, ci) => (
                        <td key={ci} className="border-b border-[#e8ddc9] px-3 py-2 align-top text-[#2a2018]">
                          {renderInline(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        });
      }
      continue;
    }

    blocks.push({ kind: "other", el: <p key={`p-${i}`}>{renderInline(line)}</p> });
    i++;
  }

  return { blocks, headings, hasFigure };
}

/**
 * Assemble the article: parsed blocks + auto photo sections (when the body has
 * no explicit figures) + a mid-article free-plan CTA before the final section.
 */
function assembleArticle(post: BlogPost): { nodes: ReactNode[]; headings: Heading[] } {
  const { blocks, headings, hasFigure } = parseArticle(post.body);
  const plocale = articleLocale(post);
  const ui = ARTICLE_UI[plocale];
  const h2Indexes = blocks.map((b, idx) => (b.kind === "h2" ? idx : -1)).filter((x) => x >= 0);
  const [imgA, imgB] = inlineImagesFor(post);

  // Positions (block indexes) to inject BEFORE. Photos close section 1 and
  // section ~3; the CTA lands before the final (conclusion) section.
  const injections = new Map<number, ReactNode[]>();
  const addBefore = (idx: number, node: ReactNode) => {
    const list = injections.get(idx) ?? [];
    list.push(node);
    injections.set(idx, list);
  };

  if (!hasFigure && h2Indexes.length >= 3) {
    addBefore(h2Indexes[1], <Figure key="auto-fig-a" img={imgA} />);
    const bIdx = h2Indexes[Math.min(3, h2Indexes.length - 1)];
    if (bIdx !== h2Indexes[1]) addBefore(bIdx, <Figure key="auto-fig-b" img={imgB} />);
  } else if (!hasFigure && blocks.length > 2) {
    addBefore(Math.ceil(blocks.length / 2), <Figure key="auto-fig-a" img={imgA} />);
  }

  const cta = (
    <div
      key="article-cta"
      className="marble-dark my-12 overflow-hidden rounded-3xl px-7 py-10 text-[#fbf7f2] sm:px-10"
    >
      <p className="eyebrow text-[#e4cd9a]">{ui.ctaKicker}</p>
      <h3 className="mt-3 font-serif text-[clamp(21px,2.4vw,28px)] font-medium leading-snug text-[#fbf7f2]">
        {ui.ctaTitle}
      </h3>
      <p className="mt-3 max-w-xl text-[15px] font-light leading-relaxed text-[#fbf7f2]/70">{ui.ctaBody}</p>
      <Link
        href={localeUrl(plocale, "/contact").replace(SITE_URL, "")}
        className="gold-shimmer-host mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#c6a15b] px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#241c15] shadow-[0_12px_34px_-8px_rgba(198,161,91,0.5)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
      >
        {ui.ctaButton} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
  if (h2Indexes.length >= 2) addBefore(h2Indexes[h2Indexes.length - 1], cta);

  const nodes: ReactNode[] = [];
  blocks.forEach((b, idx) => {
    const before = injections.get(idx);
    if (before) nodes.push(...before);
    nodes.push(b.el);
  });
  if (h2Indexes.length < 2) nodes.push(cta);

  return { nodes, headings };
}

function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function BlogPostClient({
  fallbackPost = null,
}: {
  /**
   * Server-resolved article for posts the static seeds don't contain (CRM
   * `published_posts` articles): keeps SSR + the first client render showing
   * the real article instead of "story not found" until the client-side
   * /api/blog/published merge in useBlogPosts() catches up with the same post.
   */
  fallbackPost?: BlogPost | null;
}) {
  const params = useParams<{ category: string; slug: string }>();
  const category = params?.category ?? "";
  const slug = params?.slug ?? "";
  const { locale } = useLocale();
  const t = useT();
  const posts = useBlogPosts();
  // Reading-progress for the fixed gold bar at the top of the article page.
  const { scrollYProgress } = useScroll();

  const post: BlogPost | undefined =
    posts.find((p) => p.category === category && p.slug === slug && (p.locale ?? "en") === locale) ??
    posts.find((p) => p.category === category && p.slug === slug) ??
    (fallbackPost && fallbackPost.category === category && fallbackPost.slug === slug
      ? fallbackPost
      : undefined);
  const cat = categoryBySlug(category);
  const catLabel =
    (locale === "sq" ? BLOG_CATEGORY_SQ[category]?.label : undefined) ?? cat?.label ?? t("blog.crumb");

  // The server page supplies SSR <title>/meta via generateMetadata; this effect
  // only keeps them in sync when the client-side locale switch swaps the post.
  useEffect(() => {
    if (!post) return;
    const prevTitle = document.title;
    document.title = `${post.metaTitle || post.title} | Dental Med Austria`;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? null;
    if (meta && (post.metaDescription || post.excerpt)) {
      meta.setAttribute("content", post.metaDescription || post.excerpt);
    }
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc !== null) meta.setAttribute("content", prevDesc);
    };
  }, [post]);

  if (!post) {
    return (
      <PageShell>
        <PageHero title={t("blog.notFound.title")} image="/images/dma/interiors/reception-wide.jpg" crumbs={[{ label: t("nav.home"), href: `/${locale}` }, { label: t("blog.crumb"), href: `/${locale}/blog` }]} />
        <section className="section-y bg-[#fbf7f2] text-center">
          <p className="text-[17px] text-[#6e6152]">{t("blog.notFound.text")}</p>
          <Link href={`/${locale}/blog`} className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#9a7638] transition-colors hover:text-[#2a2018]">
            {t("blog.backToBlog")} <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </PageShell>
    );
  }

  const plocale = articleLocale(post);
  const ui = ARTICLE_UI[plocale];
  const { nodes, headings } = assembleArticle(post);
  const minutes = readingMinutes(post.body);

  const related = posts
    .filter((p) => p.category === category && p.id !== post.id && (p.locale ?? "en") === (post.locale ?? "en"))
    .slice(0, 3);

  const url = localeUrl(locale, `/blog/${category}/${slug}`);
  const authorNode = post.author
    ? { "@type": "Person", name: post.author.name, ...(post.author.jobTitle ? { jobTitle: post.author.jobTitle } : {}), ...(post.author.url ? { url: post.author.url } : {}) }
    : { "@type": "Organization", name: "Dental Med Austria" };
  const reviewerNode = post.reviewedBy
    ? { "@type": "Physician", name: post.reviewedBy.name, ...(post.reviewedBy.jobTitle ? { jobTitle: post.reviewedBy.jobTitle } : {}), ...(post.reviewedBy.url ? { url: post.reviewedBy.url } : {}) }
    : null;
  // MedicalWebPage carries the reviewer/lastReviewed signals Google weights for
  // YMYL medical content; the Article headline/author sits inside it.
  const articleLd = {
    "@context": "https://schema.org",
    "@type": ["MedicalWebPage", "Article"],
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    inLanguage: post.locale ?? "en",
    datePublished: post.date,
    dateModified: post.dateModified ?? post.date,
    image: post.image.startsWith("http") ? post.image : `${SITE_URL}${post.image}`,
    mainEntityOfPage: url,
    author: authorNode, ...(reviewerNode ? { reviewedBy: reviewerNode } : {}), ...(post.reviewedDate ? { lastReviewed: post.reviewedDate } : {}),
    publisher: { "@type": "Organization", name: "Dental Med Austria", url: SITE_URL }, ...(post.keywords?.length ? { keywords: post.keywords.join(", ") } : {}),
  };
  const faqLd =
    post.faq && post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: post.locale ?? "en",
          mainEntity: post.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;
  // BreadcrumbList mirrors the visible crumb trail (Home / Blog / Category /
  // Post) so search + answer engines can resolve the article's place in the site.
  const breadcrumbLd = breadcrumbJsonLd([
    { name: t("nav.home"), path: `/${locale}` },
    { name: t("blog.crumb"), path: `/${locale}/blog` },
    { name: catLabel, path: `/${locale}/blog/${category}` },
    { name: post.title, path: `/${locale}/blog/${category}/${slug}` },
  ]);

  return (
    <PageShell>
      {/* Gold reading-progress bar, scaleX driven by page scroll */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[#e4cd9a] via-[#c6a15b] to-[#9a7638]"
      />
      <JsonLd data={articleLd} />
      {faqLd && <JsonLd data={faqLd} />}
      <JsonLd data={breadcrumbLd} />
      {/* right-docked lead form: article title becomes the lead's interest note */}
      <LeadRailForm service={post.title} />
      <PageHero
        eyebrow={catLabel}
        title={post.title}
        image={post.image}
        imagePosition={blogImagePosition(post.image)}
        crumbs={[
          { label: t("nav.home"), href: `/${locale}` },
          { label: t("blog.crumb"), href: `/${locale}/blog` },
          { label: catLabel, href: `/${locale}/blog/${category}` },
          { label: post.title },
        ]}
      />

      <article className="section-y bg-[#fbf7f2]">
        <Reveal className="tpds-container max-w-[760px]" stagger={0.1} y={26}>
          {/* meta row: date · author · reading time */}
          <p className="eyebrow mb-4 text-[#a99a8b]">
            {post.date}
            {post.author?.name ? ` · ${ui.by} ${post.author.name}` : ""}
            {` · ${ui.minRead(minutes)}`}
          </p>
          {(post.reviewedBy?.name || post.reviewedDate) && (
            <p className="mb-6 text-[13px] text-[#a99a8b]">
              {post.reviewedBy?.name
                ? `${t("blog.reviewedBy")} ${post.reviewedBy.name}${post.reviewedBy.jobTitle ? `, ${post.reviewedBy.jobTitle}` : ""}`
                : t("blog.medicallyReviewed")}
              {post.reviewedDate ? ` · ${t("blog.lastReviewed")} ${post.reviewedDate}` : ""}
            </p>
          )}

          {post.keyTakeaways && post.keyTakeaways.length > 0 && (
            <div className="mb-8 rounded-2xl border border-[#e8ddc9] border-l-[3px] border-l-[#c6a15b] bg-[#f4ecdd] px-6 py-5">
              <p className="eyebrow gold-foil mb-3">{ui.takeaways}</p>
              <ul className="ml-5 list-disc space-y-2 text-[16px] font-light leading-[1.55] text-[#2a2018]">
                {post.keyTakeaways.map((t, i) => (
                  <li key={i}>{renderInline(t)}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Table of contents, the classic "In this article" jump list */}
          {headings.length >= 3 && (
            <nav
              aria-label={ui.toc}
              className="mb-10 rounded-3xl border border-[#9a7638]/10 bg-[#fffefb] px-6 py-6 shadow-[var(--shadow-brand-sm)] sm:px-7"
            >
              <p className="eyebrow gold-foil mb-4">{ui.toc}</p>
              <ol className="space-y-2.5">
                {headings.map((h, i) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="group flex items-baseline gap-3 text-[15px] text-[#2a2018] transition-colors duration-300 hover:text-[#9a7638]"
                    >
                      <span className="gold-foil font-serif text-[14px] font-medium italic">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="decoration-[#c6a15b] underline-offset-4 group-hover:underline">{h.text}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="space-y-5 text-[18px] font-light leading-[1.6] text-[#2a2018]">{nodes}</div>

          {/* FAQ, open/close accordion (FAQPage JSON-LD emitted above) */}
          {post.faq && post.faq.length > 0 && (
            <div className="mt-14 pt-10">
              <div className="gold-rule mb-10" />
              <h2 className="serif-title mb-6 text-[clamp(22px,2.6vw,30px)] text-[#2a2018]">{ui.faqTitle}</h2>
              <div className="overflow-hidden rounded-3xl border border-[#e8ddc9] bg-[#fffefb] shadow-[var(--shadow-brand-sm)]">
                {post.faq.map((f, i) => (
                  <details key={i} open={i === 0} className="group border-b border-[#e8ddc9] last:border-b-0">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-serif text-[17px] font-medium text-[#2a2018] transition-colors duration-300 hover:bg-[#f4ecdd]/60 [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span
                        aria-hidden="true"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#9a7638]/35 text-[#9a7638] transition-transform duration-300 group-open:rotate-45"
                      >
                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M6 1v10M1 6h10" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <p className="px-6 pb-6 text-[15.5px] font-light leading-[1.65] text-[#6e6152]">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {post.keywords.length > 0 && (
            <div className="mt-9 flex flex-wrap gap-2">
              {post.keywords.map((kw) => (
                <span key={kw} className="rounded-full bg-[#f4ecdd] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a7638]">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </Reveal>
      </article>

      {related.length > 0 && (
        <section className="section-y-sm bg-[#f4ecdd]">
          <div className="tpds-container">
            <h2 className="serif-title mb-8 text-[clamp(22px,2.6vw,30px)] text-[#2a2018]">
              {ui.related} {cat?.label ?? "this category"}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/${locale}/blog/${p.category}/${p.slug}`}
                  className="group block overflow-hidden rounded-3xl bg-[#fffefb] shadow-[var(--shadow-brand-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-brand-lg)]"
                >
                  <div className="relative h-[200px] overflow-hidden">
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${p.image})` }}
                    />
                  </div>
                  <h3 className="px-5 py-5 font-serif text-[18px] font-medium leading-snug text-[#2a2018] decoration-[#c6a15b] decoration-1 underline-offset-4 group-hover:underline">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
