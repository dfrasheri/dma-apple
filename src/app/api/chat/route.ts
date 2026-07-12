/**
 * POST /api/chat, the public assistant endpoint.
 *
 * Body: {
 *   message: string,
 *   history?: { role: "user"|"assistant", content: string }[],
 *   image?: { data: string, mediaType: string },   // ONE X-ray/photo, base64 or data URL
 *   locale?: string,                               // site locale, language tiebreaker
 * }
 * Returns: { text, sources, handoff, intent }
 *
 * Answers are grounded in the clinic knowledge layer (the website's own data).
 * The route is intentionally outside the i18n middleware (matcher excludes /api),
 * so it is reachable without a locale prefix. `history` lets the assistant answer
 * follow-ups with context; everything is sanitised and capped since this is public.
 */
import { NextResponse } from "next/server";
import { draftReplyAI } from "@/lib/chat-bot";
import type { AiImage, ChatTurn } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Trust nothing from the client: keep only well-formed turns, capped in size. */
function sanitizeHistory(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatTurn[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if ((role === "user" || role === "assistant") && typeof content === "string" && content.trim()) {
      out.push({ role, content: content.slice(0, 1000) });
    }
  }
  return out.slice(-10); // last 10 turns is plenty of context
}

// ~6 MB of decoded image is far more than a downscaled X-ray needs; anything
// bigger is rejected rather than forwarded to the model.
const MAX_IMAGE_B64_CHARS = 8_000_000;
const IMAGE_TYPES = new Set<AiImage["mediaType"]>([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/**
 * Validate the single attached image: known media type, base64 payload (data-URL
 * prefix tolerated), bounded size. Returns null when anything is off.
 */
function sanitizeImage(raw: unknown): AiImage | null {
  if (!raw || typeof raw !== "object") return null;
  const rawData = (raw as { data?: unknown }).data;
  const mediaType = (raw as { mediaType?: unknown }).mediaType;
  if (typeof rawData !== "string" || typeof mediaType !== "string") return null;
  if (!IMAGE_TYPES.has(mediaType as AiImage["mediaType"])) return null;
  const dataUrl = rawData.match(/^data:image\/[a-z0-9+.-]+;base64,(.+)$/i);
  const data = (dataUrl ? dataUrl[1] : rawData).replace(/\s+/g, "");
  if (!data || data.length > MAX_IMAGE_B64_CHARS) return null;
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(data)) return null;
  return { data, mediaType: mediaType as AiImage["mediaType"] };
}

// Larger than any legitimate widget payload (downscaled image ≤ ~1MB base64
// plus capped history), anything bigger is rejected before it is buffered.
const MAX_BODY_BYTES = 12_000_000;

// Cheap per-IP sliding-window rate limit. In-memory per process, enough to
// stop casual abuse of the paid model behind this public endpoint.
const RATE_LIMIT = 20; // requests
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string, now: number): boolean {
  const windowStart = now - RATE_WINDOW_MS;
  const seen = (hits.get(ip) ?? []).filter((t) => t > windowStart);
  if (seen.length >= RATE_LIMIT) {
    hits.set(ip, seen);
    return true;
  }
  seen.push(now);
  hits.set(ip, seen);
  if (hits.size > 10_000) {
    // Prune abandoned IPs so the map cannot grow without bound.
    for (const [k, v] of hits) {
      if (!v.length || v[v.length - 1] <= windowStart) hits.delete(k);
    }
  }
  return false;
}

export async function POST(req: Request) {
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  const ip =
    (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "local";
  if (rateLimited(ip, Date.now())) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let message = "";
  let history: ChatTurn[] = [];
  let image: AiImage | null = null;
  let imageProvided = false;
  let locale = "";
  try {
    const body = await req.json();
    message = typeof body?.message === "string" ? body.message : "";
    history = sanitizeHistory(body?.history);
    imageProvided = body?.image != null;
    image = sanitizeImage(body?.image);
    locale = typeof body?.locale === "string" ? body.locale.slice(0, 5) : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // The widget validates client-side, so a bad image here is a broken or
  // hostile client, refuse loudly instead of silently answering without it.
  if (imageProvided && !image) {
    return NextResponse.json({ error: "Unsupported or oversized image" }, { status: 415 });
  }

  if (message.length > 2000) message = message.slice(0, 2000);

  const reply = await draftReplyAI(message, history, { image, localeHint: locale });
  return NextResponse.json(reply);
}
