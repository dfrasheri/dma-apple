import * as affiliatesService from "@/lib/crm/services/affiliates";
import {
  Card,
  CardHeader,
  SectionHeading,
  StatCard,
  Badge,
  Table,
  THead,
  TH,
  TBody,
  TR,
  TD,
  EmptyState,
  relativeTime,
  eur,
} from "@/components/crm/ui";
import { Share2, Users, BadgeCheck, Trophy } from "lucide-react";
import { AddAffiliate } from "./_components/AddAffiliate";
import { CopyButton } from "./_components/CopyButton";

const STATUS_META: Record<string, string> = {
  active: "bg-emerald-400/10 text-emerald-700 ring-1 ring-inset ring-emerald-400/30",
  pending: "bg-amber-400/10 text-amber-700 ring-1 ring-inset ring-amber-400/30",
  paused: "bg-zinc-400/10 text-zinc-700 ring-1 ring-inset ring-zinc-400/30",
};
const KIND_LABEL: Record<string, string> = { partner: "Partner", patient: "Patient" };

export default async function AffiliatesPage() {
  const affiliates = affiliatesService.listWithStats();

  const totalLeads = affiliates.reduce((s, a) => s + a.stats.leadsBrought, 0);
  const totalWon = affiliates.reduce((s, a) => s + a.stats.won, 0);
  const totalWonValue = affiliates.reduce((s, a) => s + a.stats.wonValue, 0);
  const activeCount = affiliates.filter((a) => a.status === "active").length;

  return (
    <div>
      <SectionHeading
        title="Affiliates"
        subtitle="Every referral link and what it has brought, partners and patient referrers."
        action={<AddAffiliate />}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Affiliates" value={String(affiliates.length)} sub={`${activeCount} active`} icon={<Share2 className="h-4 w-4" />} />
        <StatCard label="Leads brought" value={String(totalLeads)} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Won" value={String(totalWon)} icon={<Trophy className="h-4 w-4" />} />
        <StatCard label="Won value" value={eur(totalWonValue)} icon={<BadgeCheck className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader title="All affiliates" subtitle={`${affiliates.length} total`} />
        {affiliates.length === 0 ? (
          <EmptyState
            title="No affiliates yet"
            hint="Create one, or approve a help-desk registration. Their links and results show here."
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Affiliate</TH>
                <TH>Referral link</TH>
                <TH>Status</TH>
                <TH className="text-right">Leads</TH>
                <TH className="text-right">Won</TH>
                <TH className="text-right">Conv.</TH>
                <TH className="text-right">Won value</TH>
                <TH className="text-right">Joined</TH>
              </TR>
            </THead>
            <TBody>
              {affiliates.map((a) => (
                <TR key={a.id}>
                  <TD>
                    <div className="font-medium text-zinc-900">{a.name}</div>
                    <div className="text-[11px] text-zinc-500">
                      {KIND_LABEL[a.kind] ?? a.kind}
                      {a.commissionPct != null && ` · ${a.commissionPct}%`}
                      {a.email && ` · ${a.email}`}
                    </div>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-700">
                        {a.code}
                      </code>
                      <CopyButton text={a.link} label="Copy link" />
                    </div>
                  </TD>
                  <TD>
                    <Badge className={STATUS_META[a.status] ?? STATUS_META.paused}>{a.status}</Badge>
                  </TD>
                  <TD className="text-right tabular-nums">{a.stats.leadsBrought}</TD>
                  <TD className="text-right tabular-nums">{a.stats.won}</TD>
                  <TD className="text-right tabular-nums text-zinc-600">
                    {Math.round(a.stats.conversion * 100)}%
                  </TD>
                  <TD className="text-right tabular-nums">{eur(a.stats.wonValue)}</TD>
                  <TD className="text-right text-zinc-600">{relativeTime(a.createdAt)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
