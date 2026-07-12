/**
 * The omnichannel bot brain, drafts a reply for an inbound message.
 *
 * Hard rule: for ACTIONABLE asks (open day, price, location) the bot answers
 * ONLY from approved structured facts (`retrieval.findFacts`), cites the source
 * post, and HANDS OFF to a human when it has no confirmed fact, it never
 * guesses a date or a city. Free-text answering is reserved for evergreen
 * questions ("how long do implants last?").
 *
 * REAL API SEAM: replace the evergreen branch with a Claude + RAG call over your
 * vetted knowledge content. Keep the actionable branch filter-based, that's the
 * safety guarantee.
 */
import { parseCities, parseDates, parseProcedures } from "./extract";
import { bestFact, findFacts } from "./retrieval";
// The website's own content, shared with the public chatbot, so a CRM-drafted
// reply about treatments/brands/standards is grounded in the same source.
import { CLINIC_PROFILE, searchKnowledge, knowledgeText } from "@/lib/clinic-knowledge";
import { hasAnthropicKey, aiComplete, type ChatTurn } from "@/lib/ai";
import {
  detectLangFromContext,
  fold,
  freePlan,
  GUARDRAILS,
  KEYWORDS,
  T
} from "@/lib/chat-i18n";

export type BotIntent =
  | "greeting"
  | "open_day"
  | "price"
  | "location"
  | "evergreen"
  | "smalltalk";

export type BotDraft = {
  text: string;
  /** True → don't auto-send; route to a human. */
  handoff: boolean;
  confidence: number;
  citedFactIds: string[];
  intent: BotIntent;
  reason?: string;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function humanDate(iso?: string | null): string {
  if (!iso) return "the announced date";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function postDate(ts?: Date | null): string {
  if (!ts) return "a recent post";
  return `our post of ${humanDate(ts.toISOString().slice(0, 10))}`;
}

/** Minimal evergreen knowledge, REAL API SEAM: replace with RAG over vetted content. */
const EVERGREEN: { match: RegExp; answer: string }[] = [
  { match: /implant/i, answer: "Dental implants typically last 15+ years, often a lifetime, with good oral hygiene and regular check-ups." },
  { match: /veneer|hollywood smile/i, answer: "Ceramic veneers generally last 10–15 years before they may need replacing." },
  { match: /hair transplant|fue|dhi/i, answer: "Transplanted hair follicles are permanent; full results show after about 12 months." },
  { match: /recovery|downtime|pain/i, answer: "Recovery varies by procedure. Most of our minimally invasive treatments have little downtime, and a coordinator can give specifics for your case." },
  { match: /safe|risk/i, answer: "All procedures are physician-led and follow strict safety protocols. Your coordinator can share the details relevant to you." }
];

function classify(text: string): BotIntent {
  const t = fold(text); // accent-insensitive: "përshëndetje" == "pershendetje"
  // Content intents win over a leading greeting ("hi, how much is an implant?").
  if (/\bopen\s?(day|house)\b/.test(t) || (/\bwhen\b/.test(t) && /\bopen\b/.test(t)))
    return "open_day";
  if (KEYWORDS.price.test(t)) return "price";
  if (KEYWORDS.location.test(t)) return "location";
  // A greeting only wins when the message is essentially JUST a greeting, this
  // is what stops a bare "ckemi"/"hallo" from being answered as a booking.
  if (KEYWORDS.greeting.test(t) && t.trim().split(/\s+/).length <= 4) return "greeting";
  // Everything else that looks like a real question → knowledge/RAG, in any
  // language (was English-only before, so Albanian/German fell through).
  if (
    KEYWORDS.safety.test(t) ||
    KEYWORDS.doctor.test(t) ||
    KEYWORDS.tourism.test(t) ||
    /how long|last|recovery|downtime|pain|what is|what's|results|\?/.test(t) ||
    t.trim().split(/\s+/).length > 3
  )
    return "evergreen";
  return "smalltalk";
}

export async function draftReply(
  message: string,
  opts: { contactName?: string; history?: ChatTurn[] } = {}
): Promise<BotDraft> {
  const intent = classify(message);
  const history = opts.history ?? [];
  const lang = detectLangFromContext(message, history);
  const cities = parseCities(message);
  const procedures = parseProcedures(message);
  parseDates(message); // entity-parse parity with extraction (dates not needed for routing)
  const hi = opts.contactName ? `Hi ${opts.contactName.split(" ")[0]}, ` : "Hi! ";
  const plan = freePlan(CLINIC_PROFILE.email, lang);

  // ── GREETING (bare hello in any language) ──────────────────────────────────
  // Answered locally with a warm, localized greeting, NEVER routed to the LLM,
  // so a simple "ckemi" can never turn into a booking/deposit reply.
  if (intent === "greeting") {
    return {
      intent,
      text: T[lang].greeting(CLINIC_PROFILE.name),
      handoff: false,
      confidence: 0.9,
      citedFactIds: []
    };
  }

  // ── ACTIONABLE: open day ───────────────────────────────────────────────────
  if (intent === "open_day") {
    const fact = await bestFact({
      type: "open_day",
      city: cities[0],
      procedure: procedures[0]
    });
    if (fact && !fact.conflictFlag) {
      const where = fact.city ? `the ${fact.city} open day` : "our open day";
      const proc = fact.procedure ? ` for ${fact.procedure}` : "";
      return {
        intent,
        text: `${hi}per ${postDate(fact.post?.postTimestamp)}, ${where} is on ${humanDate(fact.date)}${proc}. Would you like me to reserve a slot for you?`,
        handoff: false,
        confidence: fact.confidence,
        citedFactIds: [fact.id]
      };
    }
    return {
      intent,
      text: `${hi}I want to give you the exact date${cities[0] ? ` for ${cities[0]}` : ""}, so let me confirm with the team and come straight back to you.`,
      handoff: true,
      confidence: fact?.confidence ?? 0,
      citedFactIds: fact ? [fact.id] : [],
      reason: fact ? "Matching fact is flagged/unconfirmed" : "No confirmed open-day fact"
    };
  }

  // ── ACTIONABLE: price ──────────────────────────────────────────────────────
  // Dental pricing is per-case; like the website bot we NEVER quote a figure -
  // always route to the free written treatment plan, in the visitor's language.
  if (intent === "price") {
    return {
      intent,
      text: T[lang].priceHandoff(plan),
      handoff: true,
      confidence: 0,
      citedFactIds: [],
      reason: "Pricing routed to free treatment plan"
    };
  }

  // ── ACTIONABLE: location ───────────────────────────────────────────────────
  if (intent === "location") {
    const facts = await findFacts({ type: "location", city: cities[0] });
    const fact = facts[0];
    if (fact) {
      return {
        intent,
        text: `${hi}per ${postDate(fact.post?.postTimestamp)}, we're in ${fact.venue ?? fact.city}. Want directions or a consultation slot?`,
        handoff: false,
        confidence: fact.confidence,
        citedFactIds: [fact.id]
      };
    }
    return {
      intent,
      text: `${hi}let me confirm the exact venue with the team and send you the address right away.`,
      handoff: true,
      confidence: 0,
      citedFactIds: [],
      reason: "No confirmed location fact"
    };
  }

  // ── EVERGREEN (free-text OK) ───────────────────────────────────────────────
  // Grounded in the website knowledge layer first (services, brands, standards,
  // doctor), then the small canned set, then a human handoff. A short smalltalk
  // reply mid-conversation ("po", "yes") is routed here too, so Claude can use
  // the prior turns instead of returning a context-blind canned line.
  if (intent === "evergreen" || (intent === "smalltalk" && history.length > 0)) {
    // Claude + RAG over the vetted website knowledge layer (falls back to the
    // canned answers / handoff below when there is no key or the call fails).
    const ragHits = searchKnowledge(message, 4);
    // Call Claude whenever a key exists, even if the (English-biased) keyword
    // search found nothing for an Albanian/German question. Grounding is passed
    // when available; the guardrails keep it from guessing beyond the facts.
    if (hasAnthropicKey()) {
      const grounding = ragHits.length
        ? ragHits.map((s, i) => `[${i + 1}] ${s.entry.title}\n${knowledgeText(s.entry)}`).join("\n\n")
        : "(no specific clinic page matched)";
      const p = CLINIC_PROFILE;
      const clinicFacts = [
        `Clinic: ${p.name}, ${p.address}. Hours: ${p.hours}. Email: ${p.email}.`,
        `Standards: ${p.standards.join(", ")}. Premium brands: ${p.brands.join(", ")}.`,
        `Aftercare & traceability: ${p.aftercare.join(", ")}.`,
        `Leadership: the clinic is led by its ${p.doctor.role.toLowerCase()} (non-clinical). Never name the founder. Treatment is carried out by the clinic's clinical team.`
      ].filter(Boolean).join("\n");
      const text = await aiComplete({
        system: [
          `You are a patient-care assistant for ${p.name}, a premium dental clinic in Tirana serving international patients. Continue the conversation, answering the visitor's latest message using the prior turns, the CONTEXT and the CLINIC FACTS below. If the answer is in none of them, say a coordinator will follow up rather than guessing.`,
          `Detect the language of the visitor's latest message and reply in that same language.`,
          GUARDRAILS,
          `\nCLINIC FACTS:\n${clinicFacts}`
        ].join(" "),
        messages: [
          ...history,
          { role: "user", content: `CONTEXT:\n${grounding}\n\nMessage: ${message}` }
        ],
        maxTokens: 320
      });
      if (text) {
        return { intent, text, handoff: false, confidence: 0.82, citedFactIds: [] };
      }
    }

    // Rule-based fallback (no key / API error): knowledge hit, then the small
    // canned set, then a localized graceful handoff.
    const known = searchKnowledge(message, 1)[0];
    if (known && known.score >= 3) {
      return {
        intent,
        text: `${known.entry.body} ${T[lang].coordinatorOffer}`,
        handoff: false,
        confidence: Math.min(0.9, 0.6 + known.score / 20),
        citedFactIds: []
      };
    }

    const hit = EVERGREEN.find((e) => e.match.test(message));
    if (hit) {
      return {
        intent,
        text: `${hit.answer} ${T[lang].coordinatorOffer}`,
        handoff: false,
        confidence: 0.7,
        citedFactIds: []
      };
    }
    return {
      intent,
      text: T[lang].fallback(plan),
      handoff: true,
      confidence: 0.3,
      citedFactIds: [],
      reason: "Evergreen question with no canned answer"
    };
  }

  // ── SMALLTALK ──────────────────────────────────────────────────────────────
  return {
    intent: "smalltalk",
    text: T[lang].help(CLINIC_PROFILE.name),
    handoff: false,
    confidence: 0.6,
    citedFactIds: []
  };
}
