/**
 * Team notification on a new lead, the "tell the whole team" seam.
 *
 * Always logs a one-line summary server-side. Then, per channel:
 *   - `LEAD_WEBHOOK_URL` (Slack / Teams / Discord incoming webhook accepting
 *     `{ text }`): posts the one-line summary.
 *   - `RESEND_API_KEY` (+ optional `LEAD_EMAIL_TO`, `LEAD_EMAIL_FROM`): emails
 *     the full lead card to the clinic inbox via the Resend HTTP API, no SDK
 *     dependency. The sending domain must be verified in Resend.
 * Failures never block the lead from being created.
 */
import type { LeadDetail } from "./services/leads";

function summarise(lead: LeadDetail): string {
  const name = lead.contact?.name ?? "Unknown";
  const loc = [lead.contact?.city, lead.contact?.country].filter(Boolean).join(", ");
  const bits = [
    `🦷 New lead: ${name}`,
    lead.refCode && `[${lead.refCode}]`,
    loc && `• ${loc}`,
    lead.service && `• ${lead.service}`,
    `• via ${lead.source}`,
    `• score ${lead.score}/100`,
  ].filter(Boolean);
  return bits.join(" ");
}

/** Plain-text email body: the summary plus every contact detail and the intake note. */
function emailBody(lead: LeadDetail): string {
  const note = lead.activities.find((a) => a.type === "note")?.body ?? "";
  return [
    summarise(lead),
    "",
    `Name:    ${lead.contact?.name ?? "-"}`,
    `Phone:   ${lead.contact?.phone ?? "-"}`,
    `Email:   ${lead.contact?.email ?? "-"}`,
    `Country: ${lead.contact?.country ?? "-"}`,
    `Service: ${lead.service ?? "-"}`,
    `Source:  ${lead.source}${lead.sourceDetail ? ` (${lead.sourceDetail})` : ""}`,
    `Owner:   ${lead.owner ?? "unassigned"}`, ...(note ? ["", "- Intake note -", note] : []),
    "",
    "Open the CRM: /crm/leads",
  ].join("\n");
}

async function emailLead(lead: LeadDetail): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const to = process.env.LEAD_EMAIL_TO ?? "info@dentalmedaustria.com";
  const from = process.env.LEAD_EMAIL_FROM ?? "leads@dentalmedaustria.al";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from: `DMA Leads <${from}>`,
        to: [to],
        subject: `New lead: ${lead.contact?.name ?? "Unknown"}${lead.refCode ? ` [${lead.refCode}]` : ""}`,
        text: emailBody(lead),
      }),
    });
    if (!res.ok) console.error("[lead] email failed:", res.status, await res.text().catch(() => ""));
  } catch (err) {
    console.error("[lead] email failed:", err);
  }
}

export async function notifyNewLead(lead: LeadDetail): Promise<void> {
  const text = summarise(lead);
  // Always visible in server logs / the omnichannel feed pipeline.
  console.info("[lead]", text);

  // Email + webhook run in parallel; neither can block or fail lead creation.
  const jobs: Promise<void>[] = [emailLead(lead)];

  const url = process.env.LEAD_WEBHOOK_URL;
  if (url) {
    jobs.push(
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
        .then(() => undefined)
        .catch((err) => console.error("[lead] webhook failed:", err)),
    );
  }
  await Promise.allSettled(jobs);
}
