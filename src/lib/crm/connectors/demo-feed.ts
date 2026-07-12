/**
 * Shared demo Instagram feed. `SEED_POSTS` is the initial state the seed loads;
 * `LIVE_FEED` is what a later account re-sync returns, deliberately containing
 * one EDIT, one DELETE and one NEW post so the reconcile engine has something to
 * demonstrate end-to-end.
 */
import type { IncomingPost } from "../reconcile";

const ACCOUNT = "dentalmedaustria.clinic";

export const SEED_POSTS: IncomingPost[] = [
  {
    postId: "IG_1001",
    account: ACCOUNT,
    caption:
      "Join our Open Day in Venice, Italy on July 4th for zirconium crowns with our clinical team! 🦷 Limited spots.",
    mediaUrl: "https://example.com/media/venice.jpg",
    permalink: "https://instagram.com/p/IG_1001",
    postTimestamp: "2026-06-20T09:00:00Z"
  },
  {
    postId: "IG_1002",
    account: ACCOUNT,
    caption:
      "Open House at our Venice Beach pop-up on July 11th, laser liposuction consults all day!",
    mediaUrl: "https://example.com/media/venicebeach.jpg",
    permalink: "https://instagram.com/p/IG_1002",
    postTimestamp: "2026-06-21T09:00:00Z"
  },
  {
    postId: "IG_1003",
    account: ACCOUNT,
    caption: "Dental implants in Istanbul from €450 this summer ✈️ Book your consultation now.",
    mediaUrl: "https://example.com/media/istanbul.jpg",
    permalink: "https://instagram.com/p/IG_1003",
    postTimestamp: "2026-06-22T09:00:00Z"
  },
  {
    postId: "IG_1004",
    account: ACCOUNT,
    caption: "Big OPEN DAY announcement! See you on 4/7 and 11/7 🎉 limited spots, DM us!",
    mediaUrl: "https://example.com/media/announce.jpg",
    permalink: "https://instagram.com/p/IG_1004",
    postTimestamp: "2026-06-23T09:00:00Z"
  },
  {
    postId: "IG_1005",
    account: ACCOUNT,
    caption: "20% off all veneers in Milan this week only! Hollywood smile season is here.",
    mediaUrl: "https://example.com/media/milan.jpg",
    permalink: "https://instagram.com/p/IG_1005",
    postTimestamp: "2026-06-24T09:00:00Z"
  }
];

export const LIVE_FEED: IncomingPost[] = [
  // EDIT: the Venice open day moved from July 4th → July 5th.
  {
    ...SEED_POSTS[0],
    caption:
      "Update: our Open Day in Venice, Italy is now on July 5th for zirconium crowns with our clinical team! 🦷",
    postTimestamp: "2026-06-25T09:00:00Z"
  },
  // DELETE: the Venice Beach pop-up was cancelled.
  { postId: SEED_POSTS[1].postId, account: ACCOUNT, deleted: true },
  // UNCHANGED
  SEED_POSTS[2],
  SEED_POSTS[3],
  SEED_POSTS[4],
  // NEW
  {
    postId: "IG_2001",
    account: ACCOUNT,
    caption:
      "NEW! Hair transplant (DHI) open day in Dubai on August 2nd with Dr. Adan. Reserve your slot ✈️",
    mediaUrl: "https://example.com/media/dubai.jpg",
    permalink: "https://instagram.com/p/IG_2001",
    postTimestamp: "2026-06-26T09:00:00Z"
  }
];
