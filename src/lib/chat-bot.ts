/**
 * The Dental Med Austria assistant, drafts a grounded reply to a visitor.
 *
 * Every answer is built from the clinic knowledge layer (which is itself derived
 * from the website's own content), so the bot can only ever state facts that are
 * on the site. It NEVER invents a price: case-specific pricing always routes to
 * the free written treatment plan. This `handoff` flag is what the CRM uses to
 * decide whether a human coordinator should take over.
 *
 * REAL API SEAM: to make answers more conversational, replace `compose()` with a
 * Claude call that is given `searchKnowledge(message)` as grounding context and
 * instructed to answer ONLY from it (and to hand off on price). The retrieval and
 * the price/booking guards below are the safety guarantee, keep them.
 */
import {
  CLINIC_PROFILE,
  searchKnowledge,
  knowledgeText,
  type KnowledgeEntry,
} from "./clinic-knowledge";
import { hasAnthropicKey, aiComplete, type AiImage, type ChatTurn } from "./ai";
import { brainGroundingFor } from "./brain";
import {
  detectLang,
  fold,
  freePlan,
  GUARDRAILS,
  KEYWORDS,
  LANG_NAME,
  resolveLang,
  T,
  type Lang,
} from "./chat-i18n";

export type ChatSource = { title: string; url?: string };

export type ChatReply = {
  text: string;
  sources: ChatSource[];
  /** True → a human coordinator should follow up (e.g. exact pricing). */
  handoff: boolean;
  intent: ChatIntent;
};

export type ChatIntent =
  | "greeting"
  | "price"
  | "booking"
  | "safety"
  | "location"
  | "doctor"
  | "tourism"
  | "knowledge"
  | "fallback";

function sourcesFrom(entries: KnowledgeEntry[], limit = 3): ChatSource[] {
  const seen = new Set<string>();
  const out: ChatSource[] = [];
  for (const e of entries) {
    const key = e.url ?? e.title;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ title: e.title, url: e.url });
    if (out.length >= limit) break;
  }
  return out;
}

function trim(body: string, max = 420): string {
  if (body.length <= max) return body;
  const cut = body.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "));
  return (lastStop > 120 ? cut.slice(0, lastStop + 1) : cut.trimEnd() + "…");
}

function classify(message: string): ChatIntent {
  const t = fold(message); // accent-insensitive: "përshëndetje" == "pershendetje"
  // Content intents win over a leading greeting, in any language, so
  // "përshëndetje, sa kushton?" is priced, not greeted.
  if (KEYWORDS.price.test(t)) return "price";
  if (KEYWORDS.booking.test(t)) return "booking";
  // A greeting only wins when the message is essentially just a greeting, this
  // is what stops a bare "ckemi"/"hallo" from being sent to the LLM and coming
  // back as a booking/deposit reply.
  if (KEYWORDS.greeting.test(t) && t.trim().split(/\s+/).length <= 4) return "greeting";
  if (KEYWORDS.safety.test(t)) return "safety";
  if (KEYWORDS.location.test(t)) return "location";
  if (KEYWORDS.doctor.test(t)) return "doctor";
  if (KEYWORDS.tourism.test(t)) return "tourism";
  return "knowledge";
}

function compose(message: string, langOverride?: Lang): ChatReply {
  const intent = classify(message);
  const lang = langOverride ?? detectLang(message);
  const plan = freePlan(CLINIC_PROFILE.email, lang);
  const hits = searchKnowledge(message, 5).map((s) => s.entry);

  switch (intent) {
    case "greeting":
      return {
        intent,
        handoff: false,
        sources: [],
        text: T[lang].greeting(CLINIC_PROFILE.name),
      };

    case "price":
      return {
        intent,
        handoff: true,
        sources: [{ title: "Contact & free treatment plan", url: "/contact" }],
        text: T[lang].priceHandoff(plan),
      };

    case "booking":
      return {
        intent,
        handoff: true,
        sources: [{ title: "Contact", url: "/contact" }],
        text: T[lang].bookingHandoff(plan),
      };

    case "safety": {
      const safetyHits = searchKnowledge("safe quality guarantee sterilisation brands", 4).map(
        (s) => s.entry,
      );
      return {
        intent,
        handoff: false,
        sources: sourcesFrom(safetyHits),
        text:
          `Great question! It's what international patients care about most. ${CLINIC_PROFILE.name} works to ${CLINIC_PROFILE.standards.join(", ")}, with ${CLINIC_PROFILE.stats.implants} at a ${CLINIC_PROFILE.stats.successRate}. We use the same premium brands as top Western clinics: ${CLINIC_PROFILE.brands.slice(0, 4).join(", ")} and more. Every implant comes with a passport and serial numbers you can verify directly with the manufacturer, and our team stays available for aftercare and follow-up.`,
      };
    }

    case "location":
      return {
        intent,
        handoff: false,
        sources: [{ title: "Contact & location", url: "/contact" }],
        text:
          `We're at ${CLINIC_PROFILE.address}, open ${CLINIC_PROFILE.hours}. You can reach us at ${CLINIC_PROFILE.email}. We care for local and international patients in ${CLINIC_PROFILE.languages.join(", ")}. Would you like directions or to plan a visit?`,
      };

    case "doctor": {
      // Institutional answer, leadership is never presented by name.
      const doc = CLINIC_PROFILE.doctor;
      return {
        intent,
        handoff: false,
        sources: [{ title: "Our clinical team", url: "/team" }],
        text: `Care at Dental Med Austria is delivered by our experienced clinical team. ${trim(doc.bio, 360)}`,
      };
    }

    case "tourism": {
      const tourismHits = searchKnowledge("dental tourism travel flight hotel airport coordinator", 4)
        .map((s) => s.entry);
      const top = tourismHits[0];
      return {
        intent,
        handoff: false,
        sources: sourcesFrom(tourismHits),
        text: top
          ? `${trim(top.body)} We handle the whole journey: airport pickup, partner hotels, and translation throughout your stay. Want a coordinator to plan your trip?`
          : `We offer full dental-tourism support: airport pickup, partner hotels, and a multilingual coordinator. Want help planning your trip?`,
      };
    }
  }

  // ── general knowledge retrieval ────────────────────────────────────────────
  const top = hits[0];
  if (top) {
    const related = hits.slice(1).filter((e) => e.kind === "service" || e.kind === "faq");
    const tail = related.length
      ? ` You might also look at ${related.slice(0, 2).map((e) => e.title).join(" and ")}.`
      : "";
    return {
      intent: "knowledge",
      handoff: false,
      sources: sourcesFrom(hits),
      text: `${trim(top.body)}${tail}`,
    };
  }

  // ── nothing matched → graceful handoff ─────────────────────────────────────
  return {
    intent: "fallback",
    handoff: true,
    sources: [{ title: "Contact", url: "/contact" }],
    text: T[lang].fallback(plan),
  };
}

export function draftReply(message: string): ChatReply {
  const clean = (message ?? "").trim();
  if (!clean) {
    return {
      intent: "greeting",
      handoff: false,
      sources: [],
      text: `Hi! Ask me about our treatments, technology, safety standards, or planning a visit to ${CLINIC_PROFILE.name}.`,
    };
  }
  return compose(clean);
}

// ── Claude-grounded reply (used by /api/chat) ────────────────────────────────
// Keeps the rule-based answer as the guaranteed fallback. Pricing and booking
// ALWAYS use the rule-based handoff so the model can never quote a price.
function chatSystem(lang: Lang, hasImage: boolean): string {
  const p = CLINIC_PROFILE;
  const facts = [
    `Clinic: ${p.name}. Address: ${p.address}. Hours: ${p.hours}. Email: ${p.email}.`,
    `Languages: ${p.languages.join(", ")}.`,
    `Standards: ${p.standards.join(", ")}. Premium brands: ${p.brands.join(", ")}.`,
    `Aftercare & traceability: ${p.aftercare.join(", ")}.`,
    `Leadership: the clinic is led by its ${p.doctor.role.toLowerCase()} (non-clinical). Never name the founder. Treatment is carried out by the clinic's clinical team.`,
  ].filter(Boolean).join("\n");
  return [
    `You are the friendly website assistant for ${p.name}, a premium dental and medical-tourism clinic in Tirana, Albania serving international patients (especially German-speaking / DACH patients).`,
    `Continue the conversation, answering the visitor's latest message using the prior turns, the CONTEXT passages and the clinic facts below. If the answer is in none of them, say you will connect them with a coordinator rather than guessing.`,
    `Detect the language of the visitor's latest message and reply in that same language. The visitor is browsing the site in ${LANG_NAME[lang]}; when their message is too short or ambiguous to tell, reply in ${LANG_NAME[lang]}.`,
    hasImage
      ? `The visitor attached a photo, most likely a dental X-ray or panoramic image. Thank them warmly. You may say whether it looks like a panoramic X-ray / dental photo and whether it is readable, and explain in general terms how the clinical team uses such an image, but you must NOT diagnose, name conditions, count or identify teeth, or estimate treatment or cost from it; the clinic's clinical team reviews every image personally. Invite them to leave their name and phone number so a coordinator can send their free written treatment plan within 24-48 hours.`
      : "",
    GUARDRAILS,
    ``,
    `CLINIC FACTS:`,
    facts,
  ].filter(Boolean).join("\n");
}

export type DraftReplyOptions = {
  /** One attached image (a dental X-ray / photo) from the website widget. */
  image?: AiImage | null;
  /** Site locale the visitor is browsing in (e.g. "sq"), language tiebreaker. */
  localeHint?: string;
};

export async function draftReplyAI(
  message: string,
  history: ChatTurn[] = [],
  opts: DraftReplyOptions = {},
): Promise<ChatReply> {
  const clean = (message ?? "").trim();
  const image = opts.image ?? null;
  const lang = resolveLang(clean, history, opts.localeHint);
  if (!clean && !image) return draftReply(clean);

  // A visitor-sent X-ray/photo goes to the vision model when a key is
  // available (the guardrails forbid diagnosis and prices). Without a key, or
  // if the call fails, acknowledge receipt and hand the case to a coordinator.
  if (image) {
    const ack: ChatReply = {
      intent: "knowledge",
      handoff: true,
      sources: [{ title: "Contact", url: "/contact" }],
      text: T[lang].imageAck,
    };
    // The price/booking hard guard applies WITH an image too, "sa kushton?"
    // plus an X-ray must never reach the model, which could be induced to
    // quote from the picture. The ack already covers the free-plan answer.
    const imgIntent = classify(clean);
    if (imgIntent === "price" || imgIntent === "booking") {
      return { ...ack, intent: imgIntent };
    }
    if (!hasAnthropicKey()) return ack;
    const hits = clean ? searchKnowledge(clean, 4).map((s) => s.entry) : [];
    const kb = hits.map((e, i) => `[${i + 1}] ${e.title}\n${knowledgeText(e)}`).join("\n\n");
    const text = await aiComplete({
      system: chatSystem(lang, true),
      messages: [
        ...history,
        {
          role: "user",
          content: `CONTEXT:\n${kb || "(no specific page matched)"}\n\nVisitor: ${
            clean || "(the visitor sent a photo without any text)"
          }`,
        },
      ],
      image,
      maxTokens: 500,
    });
    if (!text) return ack;
    return { intent: "knowledge", handoff: true, sources: sourcesFrom(hits), text };
  }

  const intent = classify(clean);
  // Hard safety guards: never let the model handle greetings, pricing or
  // booking, those are answered locally so the model can never turn a bare
  // "ckemi" into a booking, quote a price, or promise a call/deposit.
  if (intent === "price" || intent === "booking" || intent === "greeting") return compose(clean, lang);
  if (!hasAnthropicKey()) return compose(clean, lang);

  const hits = searchKnowledge(clean, 6).map((s) => s.entry);
  const kb = hits.map((e, i) => `[${i + 1}] ${e.title}\n${knowledgeText(e)}`).join("\n\n");
  // Also ground in DMA's real Instagram voice (captions + video transcripts).
  const ig = brainGroundingFor(clean, 2);
  const grounding =
    [kb, ig && `FROM OUR INSTAGRAM (real patient content):\n${ig}`].filter(Boolean).join("\n\n") ||
    "(no specific page matched)";
  const text = await aiComplete({
    system: chatSystem(lang, false),
    messages: [
      ...history,
      { role: "user", content: `CONTEXT:\n${grounding}\n\nVisitor: ${clean}` },
    ],
    maxTokens: 500,
  });
  if (!text) return compose(clean, lang); // no key / API error → rule-based fallback
  return { intent, handoff: false, sources: sourcesFrom(hits), text };
}
