/**
 * Own-account post ingestion (mock).
 *
 * REAL API SEAM: call the Instagram Graph API for the authorized business
 * account, e.g. GET /{ig-user-id}/media?fields=id,caption,media_url,timestamp,
 * permalink, paginate, map each node → IncomingPost. A one-time human auth
 * grants the token; after that it's token-based (HIL at setup, not per fetch).
 * Webhooks (`field=media`) push new/edited/deleted posts in near-real-time.
 */
import type { IncomingPost } from "../reconcile";
import { LIVE_FEED } from "./demo-feed";

export async function fetchAccountPosts(
  _account = "dentalmedaustria.clinic"
): Promise<IncomingPost[]> {
  // REAL API SEAM: replace with a live Graph API media fetch.
  return LIVE_FEED;
}
