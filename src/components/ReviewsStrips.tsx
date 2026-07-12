"use client";

import { Reveal } from "@/components/Reveal";
import { useT } from "@/lib/i18n";
import {
  REVIEW_STRIP_A,
  REVIEW_STRIP_B,
  REVIEW_STATS,
  type Review,
} from "@/lib/reviews";
import { CONTACT } from "@/lib/site";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-[2px]" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-[15px] w-[15px]"
          fill={i < rating ? "#FBBC04" : "#e4e4e4"}
          aria-hidden="true"
        >
          <path d="M12 17.27l5.18 3.12-1.37-5.9 4.58-3.97-6.03-.52L12 4.5 9.64 9.99l-6.03.52 4.58 3.97-1.37 5.9z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.26-2.09 3.56-5.17 3.56-8.87z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.87-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="mx-3 flex w-[340px] shrink-0 flex-col rounded-2xl border border-[#ececec] bg-white p-6 shadow-[0_2px_16px_rgba(7,21,34,0.05)] sm:w-[380px]">
      <div className="mb-3 flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[16px] font-medium text-white"
          style={{ backgroundColor: review.color }}
          aria-hidden="true"
        >
          {review.initial}
        </span>
        <div className="min-w-0">
          <p className="truncate font-serif text-[16px] leading-tight text-[#071522]">{review.author}</p>
          <p className="text-[12px] text-[#9a9a9a]">{review.timeAgo}</p>
        </div>
        <GoogleGlyph />
      </div>
      <Stars rating={review.rating} />
      <p className="mt-3 line-clamp-6 text-[14px] leading-[1.55] text-[#4a4a4a]">{review.text}</p>
    </article>
  );
}

function Strip({ items, reverse = false }: { items: Review[]; reverse?: boolean }) {
  // Duplicate the row so the -50% translate loops seamlessly.
  const row = [...items, ...items];
  return (
    <div className="tpds-reviews-mask relative overflow-hidden py-2">
      <div className={`tpds-reviews-track flex w-max ${reverse ? "tpds-reviews-track--reverse" : ""}`}>
        {row.map((r, i) => (
          <ReviewCard key={`${r.author}-${i}`} review={r} />
        ))}
      </div>
    </div>
  );
}

export function ReviewsStrips() {
  const t = useT();

  return (
    <section id="reviews" className="bg-[#f7f8f9] py-[80px]">
      <div className="tpds-container mb-10 text-center">
        <p className="eyebrow mb-3 text-[#9a9a9a]">{t("reviews.eyebrow")}</p>
        <h2 className="serif-title text-[clamp(28px,3.4vw,42px)] leading-[1.12]">{t("reviews.heading")}</h2>

        <a
          href={CONTACT.maps}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-3 rounded-full border border-[#ececec] bg-white px-5 py-2.5 shadow-[0_2px_12px_rgba(7,21,34,0.06)] transition-shadow hover:shadow-[0_4px_18px_rgba(7,21,34,0.1)]"
        >
          <GoogleGlyph />
          <span className="text-[20px] font-semibold text-[#071522]">{REVIEW_STATS.ratingValue.toFixed(1)}</span>
          <Stars rating={5} />
          <span className="text-[13px] text-[#6a6a6a]">
            {REVIEW_STATS.reviewCount}+ {t("reviews.ratingLabel")}
          </span>
        </a>
      </div>

      <Reveal y={20}>
        <div className="flex flex-col gap-4">
          <Strip items={REVIEW_STRIP_A} />
          <Strip items={REVIEW_STRIP_B} reverse />
        </div>
      </Reveal>
    </section>
  );
}