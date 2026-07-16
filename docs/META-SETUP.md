# Meta Setup — Connect Messenger + Instagram to the CRM

> **Same chatbot brain, same guardrails, same CRM inbox.** The website widget,
> Messenger and Instagram DMs all funnel through `handleInbound()` →
> `draftReply()` (`src/lib/crm/pipeline.ts`) and land in the CRM inbox. No
> ManyChat / Chatfuel / third-party bot is needed — this runbook only wires
> Meta's webhooks to code that already exists.

## What the code already provides

| Piece | File | Behavior |
| --- | --- | --- |
| Webhook endpoint | `src/app/api/crm/webhooks/[channel]/route.ts` | `GET` = Meta verification handshake (echoes `hub.challenge` when `hub.verify_token` matches `META_WEBHOOK_VERIFY_TOKEN`). `POST` = real Meta payloads (signature-checked) or the dev simulator (non-prod only). |
| Payload parser | `src/lib/crm/connectors/meta-webhook.ts` | One endpoint for all Meta products — the payload's `object` field picks the channel (`page` → messenger, `instagram` → instagram, `whatsapp_business_account` → whatsapp). Echoes and delivery/read statuses are dropped; webhook retries are deduped by provider message id. |
| Signature check | same file | Verifies `X-Hub-Signature-256` (HMAC-SHA256 of the raw body with `META_APP_SECRET`). **Required in production** — without the secret the route returns 503; with a bad signature, 401. |
| Outbound sends | `src/lib/crm/connectors/messaging.ts` | Messenger + IG replies via Graph `POST /v23.0/me/messages` using `META_PAGE_ACCESS_TOKEN`. Comment-to-DM private replies via `sendPrivateReply()`. WhatsApp via `WHATSAPP_ACCESS_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID`. **No token set = mock delivery** (inbox still works, nothing leaves the building). |
| Proactive triggers | `src/lib/crm/proactive.ts` | Ad referrals, Get Started postbacks, opt-ins, comments, likes → bot opener or staff flag, always via a Meta-permitted path. |
| 24h window | `messaging.ts` `within24hWindow()` | Free-form sends outside 24h since the user's last inbound are **refused** (`requiresTemplate: true`) instead of fired at the API. Already enforced — nothing to configure. |

Webhook URLs the code answers on (any `[channel]` segment works for real,
signed Meta payloads; the segment only matters for the dev simulator):

- Recommended single callback: `https://<your-deployed-domain>/api/crm/webhooks/meta`
- Simulator paths (dev only): `/api/crm/webhooks/messenger`, `/api/crm/webhooks/instagram`, `/api/crm/webhooks/whatsapp`

## Prerequisites

1. Admin access to the **"Dental Med Travel Albania"** Facebook Page in Meta Business Suite ([business.facebook.com](https://business.facebook.com)).
2. The clinic's Instagram account converted to a **Professional account** and **linked to that Page** (Business Suite → Settings → Accounts → Instagram → Connect). Instagram DMs will not flow otherwise.
3. In Instagram itself: **Settings → Messages and story replies → Message controls → Connected tools → Allow access to messages** must be ON.
4. The site deployed on HTTPS (Meta rejects plain-HTTP callback URLs).

## 1. Create the Meta app

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps) → **Create App**.
2. Use case: **Other** → app type: **Business**. Name it (e.g. `DMA CRM Bot`), set the contact email, and attach the clinic's **Business portfolio** (required later for App Review).
3. In the app dashboard, note **App settings → Basic → App Secret** (click *Show*). This becomes `META_APP_SECRET`.

## 2. Add the Messenger and Instagram products

1. Dashboard → **Add product** → **Messenger** → *Set up*.
2. Dashboard → **Add product** → **Instagram** → *Set up* (the "Instagram API with Facebook login" flavor — the IG account is reached through the linked Page).

## 3. Generate the Page access token

1. **Messenger → Messenger API settings → Generate access tokens** → *Connect* the "Dental Med Travel Albania" Page.
2. Grant the requested permissions. The code needs:
   - `pages_messaging` — send/receive Messenger DMs (`POST /me/messages`)
   - `instagram_manage_messages` — send/receive Instagram DMs
   - `pages_manage_metadata` — subscribe the Page to webhook fields
   - `pages_read_engagement` + `instagram_basic` + `instagram_manage_comments` — needed for the feed/comment triggers and comment private replies (`sendPrivateReply()`)
3. Copy the generated **Page access token** → `META_PAGE_ACCESS_TOKEN`. Tokens from this panel are long-lived; regenerate here if it's ever invalidated (password change, etc.).

One token serves both Messenger and Instagram — `sendViaGraph()` posts to
`/me/messages` for both channels; recipient IDs (PSID/IGSID) come from the
webhooks.

## 4. Set the environment variables

On the deployed host (e.g. Vercel → Project → Settings → Environment Variables), set:

| Var | Value |
| --- | --- |
| `META_WEBHOOK_VERIFY_TOKEN` | Any random string you invent (e.g. `openssl rand -hex 24`). You'll paste the same string into Meta in step 5. |
| `META_APP_SECRET` | App settings → Basic → App Secret. **Mandatory in production** — the route refuses unsigned Meta payloads without it. |
| `META_PAGE_ACCESS_TOKEN` | The Page token from step 3. Until it's set, replies are mocked (stored in the inbox, never sent). |

Redeploy so the values are live **before** step 5 — Meta calls the `GET`
handshake immediately when you save the callback URL.

## 5. Subscribe the webhooks

1. App dashboard → **Webhooks** (or Messenger → Settings → Webhooks → *Configure*).
2. Object **Page** → *Subscribe to this object*:
   - Callback URL: `https://<your-deployed-domain>/api/crm/webhooks/meta`
   - Verify token: the exact `META_WEBHOOK_VERIFY_TOKEN` value
   - *Verify and save* — Meta sends `GET ?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...`; the route echoes the challenge when the token matches.
3. Subscribe to Page fields: **`messages`**, **`messaging_postbacks`**, **`messaging_referrals`**, **`messaging_optins`**, **`feed`** (feed powers the comment/like triggers).
4. Object **Instagram** → same callback URL + token → subscribe to fields: **`messages`**, **`comments`**. (`follows` is parsed too but Meta hasn't shipped it publicly — enable Instagram's native welcome message in-app for follows.)
5. Back in **Messenger API settings**, confirm the Page row shows the webhook subscription attached (the token generation in step 3 with `pages_manage_metadata` normally does this automatically).

## 6. Smoke-test in Development mode

While the app is in Development mode, **only people with a role on the app**
(App roles → add yourself/testers) can message the bot.

1. From your personal account, DM the Page on Messenger → expect a bot reply within seconds and the conversation in the CRM inbox (`/crm`) with `channel: messenger`.
2. DM the linked Instagram account → same, `channel: instagram`.
3. Comment on a Page post → expect a private reply (one per comment — Meta's comment-to-DM rule) and a grey system line in the thread recording the trigger.
4. Errors: check host logs. `401 Invalid webhook signature` = wrong `META_APP_SECRET`; `403 Webhook verification failed` on save = verify-token mismatch or env not deployed; Graph send failures are recorded on the message (`sendResult.note`) rather than thrown.

## 7. App Review — required before real patients work

Development mode silently drops messages from anyone without an app role. To go
live:

1. Complete **Business verification** for the clinic's Business portfolio (Business Suite → Settings → Business info; needs a business document).
2. App dashboard → **App Review → Permissions and features** → request **Advanced Access** for: `pages_messaging`, `instagram_manage_messages`, `pages_manage_metadata`, `pages_read_engagement`, `instagram_basic`, `instagram_manage_comments`.
3. For each, provide a screencast: show a user DMing the Page/IG account, the bot answering, and a human replying from the CRM inbox. State plainly it's the clinic's own first-party CRM answering patient enquiries.
4. When approved, switch the app to **Live mode** (toggle at the top of the dashboard).

Until review passes, keep testing with app-role accounts — everything else in
this setup is already production-ready.

## 8. The 24-hour window (already enforced — just know it exists)

Meta policy: a Page may send free-form messages only within 24h of the user's
last inbound message. `sendOutbound()` checks `within24hWindow()` and refuses
live sends outside it (`delivered: false, requiresTemplate: true`) so the API
never rejects us. Comment private replies are the sanctioned exception (one DM
per comment, handled by `sendPrivateReply()`). If the clinic later needs
out-of-window outreach, that requires Meta-approved message templates
(WhatsApp) / message tags — a separate feature, not covered here.

## 9. Local testing without Meta — the dev simulator

In non-production (`NODE_ENV !== "production"`), the same route accepts
unsigned JSON, with the channel taken from the path:

```bash
# Inbound DM (runs the full bot pipeline):
curl -X POST http://localhost:3000/api/crm/webhooks/instagram \
  -H "Content-Type: application/json" \
  -d '{"externalId":"ig-user-1","body":"How much is All-on-4?","contact":{"name":"Test User","handle":"@testuser"}}'

# Proactive trigger (comment, ad referral, postback, optin, ...):
curl -X POST http://localhost:3000/api/crm/webhooks/messenger \
  -H "Content-Type: application/json" \
  -d '{"trigger":"comment","externalId":"fb-user-1","contact":{"name":"Test User"},"context":{"commentText":"price?","postId":"post_1"}}'
```

These paths are hard-refused in production (`403`) — only signature-verified
Meta payloads are accepted there. To test the *real* payload shape + signature
locally, tunnel with `ngrok http 3000`, point a test app's webhook at the
tunnel URL, and set `META_APP_SECRET`/`META_WEBHOOK_VERIFY_TOKEN` in `.env`.

## Quick reference

| Thing | Value |
| --- | --- |
| Callback URL | `https://<your-deployed-domain>/api/crm/webhooks/meta` |
| Page webhook fields | `messages`, `messaging_postbacks`, `messaging_referrals`, `messaging_optins`, `feed` |
| Instagram webhook fields | `messages`, `comments` |
| Env vars | `META_WEBHOOK_VERIFY_TOKEN`, `META_APP_SECRET`, `META_PAGE_ACCESS_TOKEN` (WhatsApp later: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`) |
| Graph API version in code | `v23.0` (`GRAPH_BASE` in `messaging.ts`) |
| Rate limit | 240 webhook POSTs/min per source IP (`rateLimitOr429`) |
