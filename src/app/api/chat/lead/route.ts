/**
 * POST /api/chat/lead, turn a website chat into a packaged warm lead.
 *
 * The chatbot calls this once the visitor leaves their name + phone. We:
 *   • infer the country from the phone dialling code (or locale),
 *   • mint a reference code (origin + channel + date), e.g. CH-WC-260628-A3F2,
 *   • parse what they were interested in from the conversation (knowledge layer),
 *   • capture where they came from (referrer / landing page / UTM / locale),
 *   • attach the full chat transcript,
 * then create a `webchat`-sourced lead (auto-scored, deduped) and notify the team.
 *
 * Reachable without a session (the middleware matcher excludes /api).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import * as leadsService from "@/lib/crm/services/leads";
import { resolveAffiliateId } from "@/lib/crm/services/affiliates";
import { searchKnowledge } from "@/lib/clinic-knowledge";
import { inferCountry, makeRefCode } from "@/lib/crm/origin";
import { notifyNewLead } from "@/lib/crm/notify";
import { LEAD_SOURCES, type LeadSource } from "@/lib/crm/types";

export const runtime = "nodejs";

const bodySchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional().default(""),
    phone: z.string().min(3, "A phone number is required"),
    email: z.string().optional().default(""),
    /** Which media the visitor reached us through. */
    channel: z.enum([...LEAD_SOURCES] as [LeadSource, ...LeadSource[]]).default("webchat"),
    /** The visitor's own messages, used to infer their interests. */
    userMessages: z.array(z.string()).optional().default([]),
    transcript: z.string().optional().default(""),
    referrer: z.string().optional().default(""),
    landingPath: z.string().optional().default(""),
    utm: z.record(z.string()).optional().default({}),
    locale: z.string().optional().default(""),
    /** Affiliate referral code from ?ref= on the landing URL. */
    ref: z.string().optional().default(""),
  })
  .strip();

/** Top distinct treatments/areas the visitor asked about, from the knowledge layer. */
function inferInterests(userMessages: string[], transcript: string): string[] {
  const query = (userMessages.join(" ") || transcript).slice(0, 800);
  if (!query.trim()) return [];
  const hits = searchKnowledge(query, 12)
    .map((s) => s.entry)
    .filter((e) => e.kind === "service" || e.kind === "category");
  const seen = new Set<string>();
  const out: string[] = [];
  for (const e of hits) {
    if (seen.has(e.title)) continue;
    seen.add(e.title);
    out.push(e.title);
    if (out.length >= 3) break;
  }
  return out;
}

function buildNote(parts: {
  refCode: string;
  channel: string;
  interests: string[];
  referrer: string;
  landingPath: string;
  utm: Record<string, string>;
  locale: string;
  country: string | null;
  transcript: string;
}): string {
  const utmStr = Object.entries(parts.utm)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
  const lines = [
    `Reference: ${parts.refCode}`,
    `Channel: ${parts.channel}`,
    parts.interests.length && `Interested in: ${parts.interests.join(", ")}`,
    parts.country && `Likely from: ${parts.country}`,
    parts.referrer && `Came from: ${parts.referrer}`,
    parts.landingPath && `Landing page: ${parts.landingPath}`,
    utmStr && `Campaign (UTM): ${utmStr}`,
    parts.locale && `Language: ${parts.locale}`,
  ].filter(Boolean);
  let note = lines.join("\n");
  if (parts.transcript.trim()) {
    note += `\n\n- Chat history -\n${parts.transcript.trim().slice(0, 4000)}`;
  }
  return note;
}

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid request", details: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const d = parsed.data;

  const name = `${d.firstName} ${d.lastName}`.trim();
  const country = inferCountry({ phone: d.phone, locale: d.locale });
  const refCode = makeRefCode({ countryCode: country?.code, source: d.channel });
  const interests = inferInterests(d.userMessages, d.transcript);
  const affiliateId = resolveAffiliateId(d.ref);

  const note = buildNote({
    refCode,
    channel: d.channel,
    interests,
    referrer: d.referrer,
    landingPath: d.landingPath,
    utm: d.utm,
    locale: d.locale,
    country: country?.name ?? null,
    transcript: d.transcript,
  });

  const lead = await leadsService.createLead({
    name,
    email: d.email && d.email.includes("@") ? d.email : "",
    phone: d.phone,
    country: country?.name,
    locale: d.locale || undefined,
    service: interests[0],
    source: affiliateId ? "referral" : d.channel,
    sourceDetail: d.referrer || d.landingPath || "Site chatbot",
    refCode,
    affiliateId: affiliateId ?? undefined,
    message: d.ref ? `${note}\nReferred by code: ${d.ref}` : note,
  });

  await notifyNewLead(lead);

  // ── mirror into the standalone DMA CRM inbox (GHL-CRM) ────────────────────
  // Fire-and-forget: the website chat must never break if the CRM is down.
  // Configure with CRM_INBOUND_URL (+ optional CRM_INBOUND_SECRET).
  const crmUrl = process.env.CRM_INBOUND_URL ?? "http://localhost:4300/api/inbound";
  void fetch(crmUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", ...(process.env.CRM_INBOUND_SECRET ? { "x-webhook-secret": process.env.CRM_INBOUND_SECRET } : {}),
    },
    body: JSON.stringify({
      firstName: d.firstName,
      lastName: d.lastName,
      phone: d.phone,
      email: d.email || undefined,
      channel: "WhatsApp", // web-chat leads continue on WhatsApp
      leadSource: "website",
      leadSourceDetail: d.landingPath || d.referrer || "Site chatbot",
      transcript: d.transcript,
      message: d.userMessages[d.userMessages.length - 1] ?? undefined,
    }),
  }).catch((e) => console.error("[crm-mirror] failed", e));

  return NextResponse.json({ ok: true, id: lead.id, refCode }, { status: 201 });
}
