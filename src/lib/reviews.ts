// Real, verbatim 5-star Google reviews for Dental Med Austria, transcribed from
// the clinic's Google Business Profile. Kept as structured DATA (not baked into
// markup) so the reviews section is data-driven: add/remove/reorder here and the
// UI + JSON-LD update automatically.
//
// To go fully live (auto-syncing from Google), replace the static REVIEWS array
// with a server fetch of the Google Places "Place Details" endpoint
// (fields=rating,userRatingCount,reviews) and map the response into this shape.
// See getGoogleReviews() sketch in the PR notes.

export type Review = {
  /** Reviewer display name, exactly as shown on Google. */
  author: string;
  /** Single-letter avatar fallback (Google-style coloured circle). */
  initial: string;
  /** Avatar background colour. */
  color: string;
  /** Relative recency label as shown on Google (e.g. "3 weeks ago"). */
  timeAgo: string;
  /** Star rating 1–5. All published testimonials here are 5. */
  rating: number;
  /** Verbatim review text. */
  text: string;
};

// ── Aggregate rating shown in the header + emitted in JSON-LD ──
// Reflects the clinic's live Google Business Profile total. Update the two
// numbers here whenever the Google figure changes (or wire the Places API).
export const REVIEW_STATS = {
  ratingValue: 4.8,
  reviewCount: 300,
} as const;

// All reviews are genuine 5-star reviews pulled from Google.
export const REVIEWS: Review[] = [
  {
    author: "Wendy Johnson",
    initial: "W",
    color: "#C5221F",
    timeAgo: "3 weeks ago",
    rating: 5,
    text: "Truly a wonderful experience attending Dental Clinic Med Austria in Tirana from being picked up at the airport to arriving at the clinic. Staff are approachable polite friendly made me feel at ease from the moment I stepped in. All clinics and surgeries are facing a beautiful lake when you are having your procedure. Treatment was more than I expected being someone who had extractions and fillings under general anaesthetic. Best dental experience in my life. So grateful to staff members Joanna Nevela and Eda.",
  },
  {
    author: "Fraser Munro",
    initial: "F",
    color: "#1A73E8",
    timeAgo: "a month ago",
    rating: 5,
    text: "The whole experience was faultless. An extremely modern and sparklingly clean clinic. I had an implant fitted so two visits no pain completely satisfied. Picked up at the airport and dropped off helped to find good accommodation. Special thanks to Angie who fitted my tooth a brilliant dentist and fantastic singer. I highly recommend this practice and Eda at the Clinic group.",
  },
  {
    author: "Maria Nonxoloba",
    initial: "M",
    color: "#0F9D58",
    timeAgo: "a month ago",
    rating: 5,
    text: "These facilities are amazing. Every staff is always smiling with good energy, so kind and very helpful. Started my journey in January, was so scared because my teeth have been giving me problems nearly half of my life. My doctor Xhesiana and her assistant Eni made me feel very safe. They are so amazing as a team. I would like to thank them and Xhoana receptionist/accountant who made it feel easy for me by arranging transportation and accommodation in a way that's not stressful. Thank you to all the lovely staff who entertained my grand children who accompanied me to my treatment. By the way I am from the UK.",
  },
  {
    author: "betty elisavet",
    initial: "B",
    color: "#7E57C2",
    timeAgo: "8 months ago",
    rating: 5,
    text: "I've been to Dental Med Austria a few times now under the care of Dr. Blerina and her amazing team, and I couldn't be more pleased with the experience and the progress so far. From the very first visit, I've always felt welcomed and well cared for. Recently, I had two implants done, and the whole procedure went incredibly smoothly. The surgeon took the time to explain every step, which really helped me feel comfortable and confident throughout. A big thank you as well to the front desk staff – the girls are always so friendly, helpful, and genuinely welcoming every time I walk in. I'm really happy with the results and the overall service. I'll definitely be recommending Dental Med Austria to my friends and family!",
  },
  {
    author: "MAYAYA",
    initial: "M",
    color: "#00897B",
    timeAgo: "5 months ago",
    rating: 5,
    text: "Just completed a full mouth I am so happy and grateful to the best team the best clinic. They are so professional. Coming from Israel this is a high level of work my case was completed and they managed to resolve all challenges. This clinic is soo beautiful and it feels like a family. I highly recommend it to everyone, you are in the best hands.",
  },
  {
    author: "F K",
    initial: "F",
    color: "#616161",
    timeAgo: "6 months ago",
    rating: 5,
    text: "Each and every member of this clinic took great care with my procedures and the whole process of my dental implants. From Dr. Alesio's dental implant placement procedure which had impressive healing time to Dr. Blerina's careful and gentle hands in my crown placement procedures, I had the easiest and most comfortable time being followed up on. The communication process with the admin staff is also outstanding. I appreciate and thank everyone involved as it made everything easier and less scary. I have and will continue recommending this clinic because the professionalism and skill found here is unmatched.",
  },
  {
    author: "Roy Kenney",
    initial: "R",
    color: "#C5221F",
    timeAgo: "3 weeks ago",
    rating: 5,
    text: "What a great experience from all the staff from Dental Med Austria highly recommended full restoration of my teeth surprisingly pain free highly recommended see you all soon for final fitting.",
  },
  {
    author: "Natalie Addison-Brown",
    initial: "N",
    color: "#0F9D58",
    timeAgo: "4 months ago",
    rating: 5,
    text: "Great experience for a crown here and plan to return to get implants and additional dental work. Immaculate facility everything is clean organized and looks brand new. There was no waiting time. 5 stars!",
  },
  {
    author: "Thomas Prifti",
    initial: "T",
    color: "#7E57C2",
    timeAgo: "8 months ago",
    rating: 5,
    text: "I visited this clinic recently and could only stay for a week, but they were really accommodating and made sure everything was done on time. The doctors were great at answering all my questions in person and even gave me prescriptions just in case I needed them after going back abroad. What really stands out is that the clinic has its own lab and scanners on-site, so you don't have to go elsewhere for scans or adjustments. It makes everything so much faster, if something needs trimming, reshaping, or a colour tweak, they can handle it right there. I'm really happy with the results and would definitely recommend them!",
  },
  {
    author: "Piotr Paliwoda",
    initial: "P",
    color: "#00897B",
    timeAgo: "a year ago",
    rating: 5,
    text: "I'm very satisfied with the services provided by the clinic! Everything was perfectly organized – from transportation and hotel accommodation to the treatment itself. Top-level service, complete professionalism, and a very friendly atmosphere. The staff is competent, helpful, and kind. I felt well taken care of from start to finish. I highly recommend it to anyone looking for high-quality dental treatment!",
  },
  {
    author: "Kautsky Lozano",
    initial: "K",
    color: "#E8710A",
    timeAgo: "5 months ago",
    rating: 5,
    text: "I've come here multiple times to treat my teeth. I've seen over the years how much they've expanded and kept an efficient service and improved their customer service. I recommend choosing this place to clean and treat your teeth.",
  },
  {
    author: "Maria “Maja” Nachajova",
    initial: "M",
    color: "#0F9D58",
    timeAgo: "7 months ago",
    rating: 5,
    text: "Dentist from Dental Med Austria managed to save my tooth despite being told by my UK dentist that an implant is the only option. Staff at the clinic was nothing but professional and friendly. I would like to thank them all for taking great care of their patients. Maria",
  },
  {
    author: "Orian Berisha",
    initial: "O",
    color: "#00897B",
    timeAgo: "a year ago",
    rating: 5,
    text: "My wife recently had her implants placed under sedation, and she couldn't be more grateful for the experience. The entire team at the clinic was incredibly friendly and professional. As someone who tends to get nervous and anxious, she truly appreciated how the surgeon, dentist, and assistants took the time to thoroughly explain each step of the process, which helped ease her concerns. The first step is now complete, and she's in the recovery process. We highly recommend this clinic!",
  },
];

/** Two interleaved rows so both marquee strips carry a mix of short/long cards. */
export const REVIEW_STRIP_A: Review[] = REVIEWS.filter((_, i) => i % 2 === 0);
export const REVIEW_STRIP_B: Review[] = REVIEWS.filter((_, i) => i % 2 === 1);

/**
 * Rich-result-safe structured data: a Dentist LocalBusiness node carrying the
 * aggregate rating AND the individual reviews that are actually displayed on the
 * page. Marking up on-page reviews (rather than a bare self-serving rating) is
 * the compliant path for Google review rich results.
 */
export function reviewsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "Dental Med Austria",
    url: "https://dentalmedaustria.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rruga Kristo Luarasi",
      addressLocality: "Tiranë",
      addressCountry: "AL",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: REVIEW_STATS.ratingValue,
      reviewCount: REVIEW_STATS.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: REVIEWS.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: r.text,
    })),
  };
}