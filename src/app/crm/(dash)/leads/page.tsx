import Link from "next/link";
import * as leadsService from "@/lib/crm/services/leads";
import {
  Card,
  CardHeader,
  SectionHeading,
  Badge,
  Table,
  THead,
  TH,
  TBody,
  TR,
  TD,
  ProgressBar,
  EmptyState,
  relativeTime,
  eur
} from "@/components/crm/ui";
import { STAGE_META, SOURCE_META } from "@/lib/crm/display";
import { KanbanBoard } from "./_components/KanbanBoard";

export default async function LeadsPage() {
  const leads = await leadsService.listLeads();

  return (
    <div>
      <SectionHeading
        title="Leads"
        subtitle="Pipeline, drag a card between stages to advance a lead"
      />

      <div className="mb-6">
        <KanbanBoard leads={leads} />
      </div>

      <Card>
        <CardHeader title="All leads" subtitle={`${leads.length} total`} />
        {leads.length === 0 ? (
          <EmptyState title="No leads yet" hint="New enquiries will appear here." />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Ref</TH>
                <TH>Location</TH>
                <TH>Service</TH>
                <TH>Source</TH>
                <TH className="w-40">Score</TH>
                <TH className="text-right">Value</TH>
                <TH>Stage</TH>
                <TH className="text-right">Updated</TH>
              </TR>
            </THead>
            <TBody>
              {leads.map((lead) => {
                const loc = [lead.contact?.city, lead.contact?.country]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <TR key={lead.id}>
                    <TD>
                      <Link
                        href={`/crm/leads/${lead.id}`}
                        className="font-medium text-zinc-900 hover:text-[var(--elx-gold)]"
                      >
                        {lead.contact?.name ?? "Unknown"}
                      </Link>
                    </TD>
                    <TD>
                      {lead.refCode ? (
                        <span className="font-mono text-[11px] text-zinc-600">{lead.refCode}</span>
                      ) : (
                        "-"
                      )}
                    </TD>
                    <TD>{loc || "-"}</TD>
                    <TD>{lead.service ?? "-"}</TD>
                    <TD>
                      <Badge className={SOURCE_META[lead.source].className}>
                        {SOURCE_META[lead.source].label}
                      </Badge>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-2">
                        <ProgressBar value={lead.score} className="w-20" />
                        <span className="text-xs tabular-nums text-zinc-600">
                          {lead.score}
                        </span>
                      </div>
                    </TD>
                    <TD className="text-right tabular-nums">{eur(lead.valueEstimate)}</TD>
                    <TD>
                      <Badge className={STAGE_META[lead.stage].className}>
                        {STAGE_META[lead.stage].label}
                      </Badge>
                    </TD>
                    <TD className="text-right text-zinc-600">{relativeTime(lead.updatedAt)}</TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
