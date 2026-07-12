// SERVER-ONLY shared Anthropic access used by every "thing" that needs the API:
// AutoSEO, Orbita, the public chatbot and the CRM bot. One key, one client,
// graceful fallback (returns null) when the key is absent so callers degrade to
// their rule-based behaviour instead of crashing.
import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function hasAnthropicKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim());
}

export function getAnthropic(): Anthropic | null {
  if (!hasAnthropicKey()) return null;
  if (!_client) _client = new Anthropic();
  return _client;
}

export type ChatTurn = { role: "user" | "assistant"; content: string };

/** A single inline image (base64, no data-URL prefix) for vision requests. */
export type AiImageMediaType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";
export type AiImage = { data: string; mediaType: AiImageMediaType };

/**
 * Normalise a turn list into a valid Anthropic `messages` array:
 *  - drop empty-content turns,
 *  - drop leading assistant turns (the API must start with `user`),
 *  - merge consecutive same-role turns (the API requires alternation),
 *  - drop a trailing assistant turn (the final turn must be `user`).
 * Returns [] when nothing usable remains.
 */
function normalizeTurns(turns: ChatTurn[]): ChatTurn[] {
  const cleaned = turns
    .map((t) => ({ role: t.role, content: (t.content ?? "").trim() }))
    .filter((t) => t.content.length > 0);
  while (cleaned.length && cleaned[0].role === "assistant") cleaned.shift();
  const merged: ChatTurn[] = [];
  for (const t of cleaned) {
    const last = merged[merged.length - 1];
    if (last && last.role === t.role) last.content += `\n${t.content}`;
    else merged.push({ ...t });
  }
  while (merged.length && merged[merged.length - 1].role === "assistant") merged.pop();
  return merged;
}

/**
 * Short, grounded text completion. Returns the model's text, or null if there is
 * no key or the call fails, callers MUST handle null by falling back.
 *
 * Pass `messages` for a multi-turn conversation (it is normalised to a valid
 * alternating list), or `user` for a single-turn prompt. If both are given,
 * `messages` wins; if `messages` normalises to empty, it falls back to `user`.
 * Pass `image` to attach one inline image to the FINAL user turn (vision).
 */
export async function aiComplete(opts: {
  system: string;
  user?: string;
  messages?: ChatTurn[];
  maxTokens?: number;
  image?: AiImage | null;
}): Promise<string | null> {
  const client = getAnthropic();
  if (!client) return null;

  let messages: ChatTurn[] = [];
  if (opts.messages && opts.messages.length) messages = normalizeTurns(opts.messages);
  if (!messages.length && opts.user && opts.user.trim()) {
    messages = [{ role: "user", content: opts.user.trim() }];
  }
  if (!messages.length) return null;

  // normalizeTurns guarantees the final turn is a `user` turn, so the image
  // can always ride on it as a multimodal content block.
  const apiMessages: Anthropic.MessageParam[] = messages.map((t) => ({
    role: t.role,
    content: t.content,
  }));
  if (opts.image) {
    const last = apiMessages[apiMessages.length - 1];
    last.content = [
      {
        type: "image",
        source: {
          type: "base64",
          media_type: opts.image.mediaType,
          data: opts.image.data,
        },
      },
      { type: "text", text: typeof last.content === "string" ? last.content : "" },
    ];
  }

  try {
    const msg = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: opts.maxTokens ?? 600,
      system: opts.system,
      messages: apiMessages,
    });
    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    return text || null;
  } catch {
    return null;
  }
}
