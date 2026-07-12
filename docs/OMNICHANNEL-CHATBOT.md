# Omnichannel chatbot — WhatsApp · Messenger · Instagram, one brain

WhatsApp, Messenger and Instagram DMs all run the **same CRM pipeline** as each
other and answer with the **same grounded brain** the website chat uses
(`src/lib/crm/bot.ts` → `draftReply`, which pulls from `clinic-knowledge` +
`lib/ai`). The website widget (`/api/chat`) is unchanged.

Flow (`src/lib/crm/pipeline.ts`): inbound → record → `draftReply` → auto-reply
when confident, else send a holding line and mark the conversation `pending` +
unread for a coordinator. Channels differ only in transport.

## Proactive triggers — the reactivity

`src/lib/crm/proactive.ts` reaches out FIRST when someone engages, and records
the reason as a grey line in the thread (like Instagram's "messaged you because
you followed their account"):

| Trigger | Webhook source | Delivery |
|---|---|---|
| Clicked a click-to-Messenger/IG ad | `messaging_referrals` | direct DM opener ("You opened this chat through an ad") |
| Ad click + typed a message | `message.referral` | reason line + normal bot reply |
| Commented on a post | Page `feed` / IG `comments` | **private reply** (the 1 DM Meta allows per comment) |
| Tapped Get Started / opted in | `messaging_postbacks` / `messaging_optins` | direct DM opener |
| Liked a post / the page | Page `feed` | DM if a 24h window is open; else captured as a pending signal for staff |
| Followed (Instagram) | *not in Meta's public API* (limited beta; no third-party tool has it) | parser slot wired for the day Meta ships it; until then enable Instagram's native in-app welcome message |

Webhook retries and repeat likes are deduped per occurrence (`triggerKey` in
message meta). Message retries are deduped by provider message id. Opener texts
live in `OPENERS` in `proactive.ts` — edit freely.

## Going live with Meta (all mock until these are set in `.env.local`)

```
# The token YOU choose when subscribing the webhook (Meta calls GET
# /api/crm/webhooks/meta with it to verify the URL).
META_WEBHOOK_VERIFY_TOKEN=

# Meta app secret — enables X-Hub-Signature-256 verification on inbound
# webhooks. REQUIRED in production; unsigned Meta payloads are rejected there.
META_APP_SECRET=

# Page access token for the Facebook Page (Messenger) with the linked
# Instagram professional account (Instagram DMs). Used for Graph sends.
META_PAGE_ACCESS_TOKEN=

# WhatsApp Business Cloud API — system-user token + the phone number id
# (NOT the phone number itself) from WhatsApp Manager.
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

Steps:

1. Create a Meta app (Business type) with the **Messenger**, **Instagram** and
   **WhatsApp** products; link the Facebook Page + Instagram professional account.
2. Point ALL THREE products' webhooks at **one URL**:
   `https://<host>/api/crm/webhooks/meta` using your `META_WEBHOOK_VERIFY_TOKEN`
   (subscribe fields: `messages` for WhatsApp; `messages`, `messaging_postbacks`,
   `messaging_referrals`, `messaging_optins`, `feed`/`comments` for Messenger &
   Instagram). The payload's `object` field picks the channel — the URL segment
   only matters for the dev simulator.
3. Fill the env vars above. Meta's 24h rule is enforced: outside the window a
   live free-form send is refused (`requiresTemplate`) — approved templates are
   the seam still left to wire.

## Testing without Meta (dev simulator)

Every channel still works in mock mode with no tokens. Fire events at
`POST /api/crm/webhooks/<channel>`:

```bash
# inbound message → bot auto-replies
curl -X POST localhost:9999/api/crm/webhooks/whatsapp \
  -H 'content-type: application/json' \
  -d '{"externalId":"49170...","body":"How much are implants?","contact":{"name":"Anna"}}'

# proactive trigger → bot reaches out first
curl -X POST localhost:9999/api/crm/webhooks/instagram \
  -H 'content-type: application/json' \
  -d '{"trigger":"comment","externalId":"IG_1","contact":{"name":"Sara"},"context":{"commentId":"c1","commentText":"price?"}}'
```

Real Meta payloads (with `object`/`entry`) are also accepted at the same URL and
signature-checked when `META_APP_SECRET` is set.
