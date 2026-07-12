import * as factsService from "@/lib/crm/services/facts";
import type { FactWithPost } from "@/lib/crm/services/facts";
import {
  Card,
  CardHeader,
  SectionHeading,
  Badge,
  EmptyState,
  ConfidenceBar,
  Table,
  THead,
  TH,
  TBody,
  TR,
  TD,
  formatDate
} from "@/components/crm/ui";
import { LegendChip } from "@/components/crm/LegendChip";
import { FACT_TYPE_META, FACT_STATUS_META } from "@/lib/crm/display";
import { cn } from "@/lib/utils";
import { AlertTriangle, BookOpen, Inbox } from "lucide-react";
import { ReviewActions } from "./_components/ReviewActions";
import { ReconcileButton } from "./_components/ReconcileButton";

function PostSource({ fact }: { fact: FactWithPost }) {
  if (!fact.post) return <span className="text-zinc-500">-</span>;
  const caption = fact.post.caption?.trim();
  const label = caption && caption.length > 0 ? caption : "(no caption)";
  const text = label.length > 80 ? `${label.slice(0, 80)}…` : label;
  if (fact.post.permalink) {
    return (
      <a
        href={fact.post.permalink}
        target="_blank"
        rel="noreferrer"
        className="text-zinc-600 underline decoration-white/20 underline-offset-2 hover:text-zinc-900"
      >
        {text}
      </a>
    );
  }
  return <span className="text-zinc-600">{text}</span>;
}

export default async function KnowledgePage() {
  const [queue, facts] = await Promise.all([
    factsService.listReviewQueue(),
    factsService.listFacts()
  ]);

  return (
    <div>
      <SectionHeading
        title="Knowledge base"
        subtitle="Facts the bot may state, extracted from posts, kept fresh by webhook, gated by a human."
        action={<ReconcileButton />}
      />

      {/* Provenance + HIL explainer */}
      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <LegendChip provenance="derived" cadence="webhook" hil />
          <p className="text-sm text-zinc-600">
            Each fact is <span className="text-emerald-700">✚ derived</span> from an own-account post,
            refreshed on a <span className="text-emerald-700">webhook</span> as posts are created,
            edited or deleted, and high-stakes or low-confidence facts wait behind the{" "}
            <span className="text-amber-700">HIL gate</span> until a human approves them, only then
            may the bot say it.
          </p>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          <span className="font-medium text-zinc-600">Sync &amp; reconcile</span> pulls the latest
          posts and diffs them against the store: changed posts update their facts in place (edit),
          deleted posts retire their facts, and new posts insert fresh ones, keyed on post id so a
          fact is never duplicated.
        </p>
      </Card>

      {/* Review queue */}
      <Card className="mb-6">
        <CardHeader
          title={
            <span className="inline-flex items-center gap-2">
              Review queue
              {queue.length > 0 && (
                <Badge className="bg-amber-400/10 text-amber-700 ring-1 ring-inset ring-amber-400/30">
                  {queue.length} pending
                </Badge>
              )}
            </span>
          }
          subtitle="High-stakes or low-confidence facts awaiting human approval before the bot may state them."
        />
        {queue.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-8 w-8" />}
            title="Nothing to review"
            hint="Every extracted fact has been graded or approved. New low-confidence or conflicting facts will land here."
          />
        ) : (
          <ul className="divide-y divide-zinc-200">
            {queue.map((fact) => (
              <li key={fact.id} className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={FACT_TYPE_META[fact.type].className}>
                      {FACT_TYPE_META[fact.type].label}
                    </Badge>
                    {fact.city && <span className="text-sm text-zinc-800">{fact.city}</span>}
                    {fact.date && (
                      <span className="text-xs text-zinc-600">{formatDate(fact.date)}</span>
                    )}
                    {fact.procedure && (
                      <span className="text-xs text-zinc-600">· {fact.procedure}</span>
                    )}
                  </div>
                  <p className="truncate text-sm text-zinc-600">
                    <span className="text-zinc-500">Source post:</span>{" "}
                    {fact.post?.caption?.trim() || "(no caption)"}
                  </p>
                  <div className="max-w-xs">
                    <ConfidenceBar value={fact.confidence} />
                  </div>
                  {fact.conflictFlag && (
                    <p className="inline-flex items-start gap-1.5 rounded-lg bg-rose-400/10 px-2 py-1 text-xs text-rose-700 ring-1 ring-inset ring-rose-400/30">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{fact.conflictReason ?? "Conflicts with an existing fact."}</span>
                    </p>
                  )}
                </div>
                <ReviewActions factId={fact.id} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* All facts */}
      <Card>
        <CardHeader
          title="All facts"
          subtitle={`${facts.length} extracted ${facts.length === 1 ? "fact" : "facts"}, retired & superseded facts are de-emphasised.`}
        />
        {facts.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-8 w-8" />}
            title="No facts yet"
            hint="Run Sync & reconcile to pull posts and extract facts."
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Type</TH>
                <TH>City</TH>
                <TH>Date</TH>
                <TH>Procedure</TH>
                <TH>Status</TH>
                <TH>Confidence</TH>
                <TH>Source post</TH>
              </TR>
            </THead>
            <TBody>
              {facts.map((fact) => {
                const muted = fact.status === "retired" || fact.supersededBy != null;
                return (
                  <TR key={fact.id} className={cn(muted && "opacity-50")}>
                    <TD>
                      <Badge className={FACT_TYPE_META[fact.type].className}>
                        {FACT_TYPE_META[fact.type].label}
                      </Badge>
                    </TD>
                    <TD>{fact.city ?? "-"}</TD>
                    <TD className="tabular-nums">{fact.date ? formatDate(fact.date) : "-"}</TD>
                    <TD>{fact.procedure ?? "-"}</TD>
                    <TD>
                      <div className="flex flex-col items-start gap-1">
                        <Badge className={FACT_STATUS_META[fact.status].className}>
                          {FACT_STATUS_META[fact.status].label}
                        </Badge>
                        {fact.supersededBy != null && fact.status !== "retired" && (
                          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                            superseded
                          </span>
                        )}
                      </div>
                    </TD>
                    <TD>
                      <ConfidenceBar value={fact.confidence} />
                    </TD>
                    <TD className="max-w-xs">
                      <PostSource fact={fact} />
                    </TD>
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
