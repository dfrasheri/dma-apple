import Link from "next/link";
import { notFound } from "next/navigation";
import * as leadsService from "@/lib/crm/services/leads";
import {
  Card,
  CardHeader,
  SectionHeading,
  Badge,
  KeyValue,
  EmptyState,
  ConfidenceBar,
  relativeTime,
  eur
} from "@/components/crm/ui";
import { STAGE_META, SOURCE_META } from "@/lib/crm/display";
import { LeadActions } from "./_components/LeadActions";
import { ReferralLink } from "./_components/ReferralLink";

export default async function LeadDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await leadsService.getLead(id);
  if (!lead) notFound();

  const contact = lead.contact;
  const location = [contact?.city, contact?.country].filter(Boolean).join(", ");

  return (
    <div>
      <SectionHeading
        title={contact?.name ?? "Lead"}
        subtitle={
          <span className="inline-flex items-center gap-2">
            <Badge className={STAGE_META[lead.stage].className}>
              {STAGE_META[lead.stage].label}
            </Badge>
            <Badge className={SOURCE_META[lead.source].className}>
              {SOURCE_META[lead.source].label}
            </Badge>
          </span>
        }
        action={
          <Link
            href="/crm/leads"
            className="rounded-lg border border-white/15 px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-100"
          >
            ← Back to pipeline
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: contact + scoring + actions */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader title="Contact" />
            <div className="px-5 py-4">
              <KeyValue label="Name" value={contact?.name ?? "-"} />
              <KeyValue
                label="Email"
                value={
                  contact?.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-zinc-800 hover:text-[var(--elx-gold)]"
                    >
                      {contact.email}
                    </a>
                  ) : (
                    "-"
                  )
                }
              />
              <KeyValue
                label="Phone"
                value={
                  contact?.phone ? (
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-zinc-800 hover:text-[var(--elx-gold)]"
                    >
                      {contact.phone}
                    </a>
                  ) : (
                    "-"
                  )
                }
              />
              <KeyValue label="Location" value={location || "-"} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Lead" />
            <div className="px-5 py-4">
              <div className="py-1.5">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-zinc-500">
                  Score
                </span>
                <ConfidenceBar value={lead.score / 100} />
              </div>
              <KeyValue label="Service" value={lead.service ?? "-"} />
              <KeyValue label="Value" value={eur(lead.valueEstimate)} />
              <KeyValue label="Owner" value={lead.owner ?? "-"} />
              {lead.refCode && (
                <KeyValue
                  label="Reference"
                  value={<span className="font-mono text-xs text-zinc-700">{lead.refCode}</span>}
                />
              )}
              {lead.lostReason && (
                <KeyValue label="Lost reason" value={lead.lostReason} />
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Referral link (preventiv)" />
            <div className="px-5 py-4">
              <ReferralLink leadId={lead.id} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Actions" />
            <div className="px-5 py-4">
              <LeadActions leadId={lead.id} currentStage={lead.stage} />
            </div>
          </Card>
        </div>

        {/* Right column: activity timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Activity"
              subtitle={`${lead.activities.length} events`}
            />
            {lead.activities.length === 0 ? (
              <EmptyState title="No activity yet" hint="Notes and stage changes appear here." />
            ) : (
              <ol className="divide-y divide-zinc-200">
                {lead.activities.map((a) => (
                  <li key={a.id} className="flex gap-3 px-5 py-3.5">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--elx-gold)]/70" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                          {a.type.replace(/_/g, " ")}
                        </span>
                        <span className="shrink-0 text-xs text-zinc-500">
                          {relativeTime(a.createdAt)}
                        </span>
                      </div>
                      {a.body && (
                        <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-zinc-800">
                          {a.body}
                        </p>
                      )}
                      {a.author && (
                        <p className="mt-0.5 text-xs text-zinc-500">- {a.author}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
