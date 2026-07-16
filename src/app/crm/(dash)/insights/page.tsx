import {
  BadgePercent,
  Clock,
  MessagesSquare,
  ScanLine
} from "lucide-react";
import * as analyticsService from "@/lib/crm/services/analytics";
import {
  Badge,
  Card,
  CardHeader,
  EmptyState,
  ProgressBar,
  SectionHeading,
  StatCard,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table
} from "@/components/crm/ui";
import { CHANNEL_META } from "@/lib/crm/display";
import type { Meta } from "@/lib/crm/display";
import { CHANNELS } from "@/lib/crm/types";

export const dynamic = "force-dynamic";

/** Badge styling per bot intent, same tone family as the other *_META maps. */
const INTENT_META: Record<string, Meta> = {
  price: { label: "Price", className: "bg-emerald-400/10 text-emerald-700 ring-1 ring-inset ring-emerald-400/30" },
  booking: { label: "Booking", className: "bg-amber-400/10 text-amber-700 ring-1 ring-inset ring-amber-400/30" },
  safety: { label: "Safety", className: "bg-rose-400/10 text-rose-700 ring-1 ring-inset ring-rose-400/30" },
  location: { label: "Location", className: "bg-sky-400/10 text-sky-700 ring-1 ring-inset ring-sky-400/30" },
  doctor: { label: "Doctors", className: "bg-violet-400/10 text-violet-700 ring-1 ring-inset ring-violet-400/30" },
  tourism: { label: "Tourism", className: "bg-teal-400/10 text-teal-700 ring-1 ring-inset ring-teal-400/30" },
  knowledge: { label: "Knowledge", className: "bg-indigo-400/10 text-indigo-700 ring-1 ring-inset ring-indigo-400/30" },
  fallback: { label: "Fallback", className: "bg-slate-400/10 text-slate-700 ring-1 ring-inset ring-slate-400/30" },
  unknown: { label: "No intent", className: "bg-zinc-400/10 text-zinc-600 ring-1 ring-inset ring-zinc-400/30" }
};

function intentMeta(intent: string): Meta {
  return (
    INTENT_META[intent] ?? {
      label: intent.charAt(0).toUpperCase() + intent.slice(1),
      className: "bg-slate-400/10 text-slate-700 ring-1 ring-inset ring-slate-400/30"
    }
  );
}

function pct(n: number, total: number): string {
  if (!total) return "0%";
  return `${Math.round((n / total) * 100)}%`;
}

function fmtMinutes(min: number | null): string {
  if (min == null) return "-";
  if (min >= 180) return `${(min / 60).toFixed(1)} h`;
  return `${Math.round(min)} min`;
}

export default async function Page() {
  const a = await analyticsService.getChatAnalytics();

  const intentMax = Math.max(1, ...a.intents.map((i) => i.count));
  const hourMax = Math.max(1, ...a.scans.byHour);
  const weekdayMax = Math.max(1, ...a.scans.byWeekday.map((w) => w.count));
  const depthMax = Math.max(1, ...a.scans.byDepth.map((d) => d.count));
  const afterOfferShare = a.scans.total
    ? pct(a.scans.afterPriceOffer, a.scans.total)
    : "-";

  return (
    <div>
      <SectionHeading
        title="Insights"
        subtitle={`Chat analytics across all channels - what people ask, where they write, and when they send their X-ray. Last ${a.rangeDays} days.`}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Inbound messages"
          value={<span className="tabular-nums">{a.inboundTotal}</span>}
          sub="From contacts, all channels"
          icon={<MessagesSquare className="h-5 w-5" />}
        />
        <StatCard
          label="Scans received"
          value={<span className="tabular-nums">{a.scans.total}</span>}
          sub="X-ray / 3D scan uploads"
          icon={<ScanLine className="h-5 w-5" />}
          accent={a.scans.total > 0}
        />
        <StatCard
          label="Median time to scan"
          value={<span className="tabular-nums">{fmtMinutes(a.scans.medianMinutesToScan)}</span>}
          sub="From first message of the thread"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="After free-plan offer"
          value={<span className="tabular-nums">{afterOfferShare}</span>}
          sub="Scans right after a price/booking reply"
          icon={<BadgePercent className="h-5 w-5" />}
        />
      </div>

      {/* ── Top questions ─────────────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Top questions by intent"
            subtitle="What inbound messages are about, as classified by the bot"
          />
          {a.inboundTotal ? (
            <Table>
              <THead>
                <TR>
                  <TH>Intent</TH>
                  <TH className="w-16 text-right">Count</TH>
                  <TH className="w-40">Share</TH>
                  <TH>Recent examples</TH>
                </TR>
              </THead>
              <TBody>
                {a.intents.map((row) => {
                  const meta = intentMeta(row.intent);
                  return (
                    <TR key={row.intent}>
                      <TD>
                        <Badge className={meta.className}>{meta.label}</Badge>
                      </TD>
                      <TD className="text-right tabular-nums">{row.count}</TD>
                      <TD>
                        <div className="flex items-center gap-2">
                          <ProgressBar value={row.count} max={intentMax} className="w-24" />
                          <span className="text-xs tabular-nums text-zinc-500">
                            {pct(row.count, a.inboundTotal)}
                          </span>
                        </div>
                      </TD>
                      <TD>
                        {row.examples.length ? (
                          <ul className="flex flex-col gap-0.5">
                            {row.examples.map((ex, i) => (
                              <li key={i} className="max-w-md truncate text-xs text-zinc-500">
                                &ldquo;{ex}&rdquo;
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-xs text-zinc-400">-</span>
                        )}
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          ) : (
            <EmptyState
              title="No inbound messages yet"
              hint="Once contacts write in, their questions are classified and counted here."
              icon={<MessagesSquare className="h-6 w-6" />}
            />
          )}
        </Card>

        <Card>
          <CardHeader
            title="Most-asked questions"
            subtitle="Top 20 literal messages, deduplicated"
          />
          {a.topQuestions.length ? (
            <ol className="flex flex-col divide-y divide-zinc-200">
              {a.topQuestions.map((q, i) => (
                <li key={q.question} className="flex items-start gap-3 px-5 py-2.5">
                  <span className="mt-0.5 w-5 shrink-0 text-right text-xs tabular-nums text-zinc-400">
                    {i + 1}.
                  </span>
                  <span className="flex-1 text-sm text-zinc-700">{q.question}</span>
                  <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium tabular-nums text-zinc-600">
                    ×{q.count}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState
              title="Nothing asked yet"
              hint="Literal questions appear here once messages arrive."
            />
          )}
        </Card>
      </div>

      {/* ── By platform ───────────────────────────────────────────────────── */}
      <Card className="mt-6">
        <CardHeader
          title="By platform"
          subtitle={`Where conversations happen - messages, threads and a ${a.trendDays}-day inbound trend per channel`}
        />
        <Table>
          <THead>
            <TR>
              <TH>Channel</TH>
              <TH className="w-32 text-right">Conversations</TH>
              <TH className="w-28 text-right">Messages</TH>
              <TH className="w-28 text-right">Inbound</TH>
              <TH>Trend ({a.trendDays}d)</TH>
            </TR>
          </THead>
          <TBody>
            {a.channels.map((ch) => {
              const meta = CHANNEL_META[ch.channel];
              const seriesMax = Math.max(1, ...a.daily.map((d) => d.counts[ch.channel]));
              return (
                <TR key={ch.channel}>
                  <TD>
                    <Badge className={meta.className}>{meta.label}</Badge>
                  </TD>
                  <TD className="text-right tabular-nums">{ch.conversations}</TD>
                  <TD className="text-right tabular-nums">{ch.messages}</TD>
                  <TD className="text-right tabular-nums">{ch.inbound}</TD>
                  <TD>
                    <div className="flex h-8 max-w-60 items-end gap-px" aria-hidden>
                      {a.daily.map((d) => {
                        const v = d.counts[ch.channel];
                        return (
                          <div
                            key={d.date}
                            title={`${d.date}: ${v}`}
                            className={
                              v > 0
                                ? "flex-1 rounded-t-sm bg-[var(--elx-gold)]"
                                : "flex-1 rounded-t-sm bg-zinc-200"
                            }
                            style={{ height: v > 0 ? `${Math.max(12, (v / seriesMax) * 100)}%` : "3px" }}
                          />
                        );
                      })}
                    </div>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
        <div className="border-t border-zinc-200 px-5 py-3 text-xs text-zinc-500">
          Trend bars count inbound contact messages per day. Totals cover the full{" "}
          {a.rangeDays}-day window across {CHANNELS.length} channels.
        </div>
      </Card>

      {/* ── Scan willingness ──────────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader
            title="Scans by hour of day"
            subtitle="When X-rays / 3D scans actually arrive"
          />
          {a.scans.total ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 px-5 py-5 sm:grid-cols-2">
              {a.scans.byHour.map((count, hour) => (
                <div key={hour} className="grid grid-cols-[2.75rem_1fr_1.5rem] items-center gap-2">
                  <span className="text-xs tabular-nums text-zinc-500">
                    {String(hour).padStart(2, "0")}:00
                  </span>
                  <ProgressBar value={count} max={hourMax} />
                  <span className="text-right text-xs tabular-nums text-zinc-600">
                    {count || ""}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No scans yet"
              hint="Hourly distribution appears once a contact sends an X-ray or 3D scan."
              icon={<ScanLine className="h-6 w-6" />}
            />
          )}
        </Card>

        <Card>
          <CardHeader title="Scans by weekday" subtitle="Which days convert to uploads" />
          {a.scans.total ? (
            <div className="flex flex-col gap-2.5 px-5 py-5">
              {a.scans.byWeekday.map(({ day, count }) => (
                <div key={day} className="grid grid-cols-[2.5rem_1fr_1.5rem] items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    {day}
                  </span>
                  <ProgressBar value={count} max={weekdayMax} />
                  <span className="text-right text-xs tabular-nums text-zinc-600">
                    {count || ""}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No scans yet" hint="Weekday distribution appears here." />
          )}
        </Card>

        <Card>
          <CardHeader
            title="Willingness to send"
            subtitle="How deep into the conversation the scan lands"
          />
          {a.scans.total ? (
            <div className="px-5 py-5">
              <div className="flex flex-col gap-2.5">
                {a.scans.byDepth.map(({ bucket, count }) => (
                  <div
                    key={bucket}
                    className="grid grid-cols-[3.5rem_1fr_1.5rem] items-center gap-2"
                  >
                    <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      {bucket} msg
                    </span>
                    <ProgressBar value={count} max={depthMax} />
                    <span className="text-right text-xs tabular-nums text-zinc-600">
                      {count || ""}
                    </span>
                  </div>
                ))}
              </div>
              <dl className="mt-5 flex flex-col divide-y divide-zinc-200 border-t border-zinc-200 pt-2">
                <div className="flex items-center justify-between gap-4 py-2">
                  <dt className="text-xs uppercase tracking-wider text-zinc-500">
                    Median time to scan
                  </dt>
                  <dd className="text-sm tabular-nums text-zinc-800">
                    {fmtMinutes(a.scans.medianMinutesToScan)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-2">
                  <dt className="text-xs uppercase tracking-wider text-zinc-500">
                    After price/booking reply
                  </dt>
                  <dd className="text-sm tabular-nums text-zinc-800">
                    {a.scans.afterPriceOffer}{" "}
                    <span className="text-xs text-zinc-500">({afterOfferShare})</span>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-2">
                  <dt className="text-xs uppercase tracking-wider text-zinc-500">
                    Other context
                  </dt>
                  <dd className="text-sm tabular-nums text-zinc-800">{a.scans.otherwise}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <EmptyState
              title="No scans yet"
              hint="Depth buckets and timing appear once uploads happen."
            />
          )}
        </Card>
      </div>
    </div>
  );
}
