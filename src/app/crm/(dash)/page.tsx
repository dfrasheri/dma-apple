import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Database,
  LineChart,
  Map as MapIcon,
  MessagesSquare,
  Newspaper,
  TrendingUp,
  Trophy,
  Users
} from "lucide-react";
import * as dashboardService from "@/lib/crm/services/dashboard";
import {
  Card,
  CardHeader,
  EmptyState,
  ProgressBar,
  SectionHeading,
  StatCard,
  eur
} from "@/components/crm/ui";
import { STAGE_META } from "@/lib/crm/display";
import { cn } from "@/lib/utils";

const QUICK_LINKS = [
  { href: "/crm/leads", label: "Leads", icon: Users },
  { href: "/crm/inbox", label: "Inbox", icon: MessagesSquare },
  { href: "/crm/content", label: "Auto-SEO", icon: Newspaper },
  { href: "/crm/insights", label: "Insights", icon: LineChart },
  { href: "/crm/knowledge", label: "Knowledge", icon: Database },
  { href: "/crm/competitors", label: "Competitors", icon: MapIcon },
  { href: "/crm/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/crm/market", label: "Market", icon: TrendingUp }
] as const;

export default async function Page() {
  const m = await dashboardService.getDashboard();
  const maxStage = Math.max(1, ...m.stageCounts.map((s) => s.count));
  const needsAttention = m.reviewQueue > 0 || m.conversationsUnread > 0 || m.contentSuggested > 0;

  return (
    <div>
      <SectionHeading title="Dashboard" subtitle="Pipeline, inbox and knowledge at a glance" />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard
          label="Open leads"
          value={<span className="tabular-nums">{m.openLeads}</span>}
          sub={`${m.leadsTotal} total`}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Pipeline value"
          value={<span className="tabular-nums">{eur(m.pipelineValue)}</span>}
          sub="Open stages only"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Open conversations"
          value={<span className="tabular-nums">{m.conversationsOpen}</span>}
          sub={`${m.conversationsUnread} unread`}
          icon={<MessagesSquare className="h-5 w-5" />}
        />
        <StatCard
          label="Review queue"
          value={<span className="tabular-nums">{m.reviewQueue}</span>}
          sub="Facts awaiting human review"
          icon={<AlertTriangle className="h-5 w-5" />}
          accent={m.reviewQueue > 0}
        />
        <StatCard
          label="Upcoming appointments"
          value={<span className="tabular-nums">{m.upcomingAppointments}</span>}
          sub="Requested or confirmed"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatCard
          label="Approved facts"
          value={<span className="tabular-nums">{m.approvedFacts}</span>}
          sub="Live in the knowledge base"
          icon={<BadgeCheck className="h-5 w-5" />}
        />
        <StatCard
          label="Competitors"
          value={<span className="tabular-nums">{m.competitors}</span>}
          sub="Tracked on the map"
          icon={<MapIcon className="h-5 w-5" />}
        />
        <StatCard
          label="Won leads"
          value={<span className="tabular-nums">{m.wonLeads}</span>}
          sub="Closed-won lifetime"
          icon={<Trophy className="h-5 w-5" />}
        />
        <StatCard
          label="Auto-SEO articles"
          value={<span className="tabular-nums">{m.contentPublished}</span>}
          sub={`${m.contentApproved} approved · ${m.contentSuggested} to review`}
          icon={<Newspaper className="h-5 w-5" />}
          accent={m.contentSuggested > 0}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pipeline bars */}
        <Card className="lg:col-span-2">
          <CardHeader title="Pipeline" subtitle="Leads by stage" />
          <div className="flex flex-col gap-4 px-5 py-5">
            {m.stageCounts.map(({ stage, count }) => (
              <div key={stage} className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-3">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                  {STAGE_META[stage].label}
                </span>
                <ProgressBar value={count} max={maxStage} />
                <span className="text-right text-sm tabular-nums text-zinc-800">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Needs attention */}
        <Card>
          <CardHeader title="Needs attention" subtitle="Where a human is the bottleneck" />
          {needsAttention ? (
            <ul className="flex flex-col divide-y divide-zinc-200">
              {m.reviewQueue > 0 && (
                <li>
                  <Link
                    href="/crm/knowledge"
                    className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-white/[0.03]"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--elx-gold)]" />
                    <span className="text-sm text-zinc-800">
                      <span className="font-semibold text-[var(--elx-gold)] tabular-nums">
                        {m.reviewQueue}
                      </span>{" "}
                      {m.reviewQueue === 1 ? "fact" : "facts"} awaiting human review
                    </span>
                  </Link>
                </li>
              )}
              {m.conversationsUnread > 0 && (
                <li>
                  <Link
                    href="/crm/inbox"
                    className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-white/[0.03]"
                  >
                    <MessagesSquare className="mt-0.5 h-4 w-4 shrink-0 text-[var(--elx-gold)]" />
                    <span className="text-sm text-zinc-800">
                      <span className="font-semibold text-[var(--elx-gold)] tabular-nums">
                        {m.conversationsUnread}
                      </span>{" "}
                      unread {m.conversationsUnread === 1 ? "conversation" : "conversations"} in the
                      inbox
                    </span>
                  </Link>
                </li>
              )}
              {m.contentSuggested > 0 && (
                <li>
                  <Link
                    href="/crm/content"
                    className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-white/[0.03]"
                  >
                    <Newspaper className="mt-0.5 h-4 w-4 shrink-0 text-[var(--elx-gold)]" />
                    <span className="text-sm text-zinc-800">
                      <span className="font-semibold text-[var(--elx-gold)] tabular-nums">
                        {m.contentSuggested}
                      </span>{" "}
                      auto-SEO {m.contentSuggested === 1 ? "topic" : "topics"} awaiting proofread
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          ) : (
            <EmptyState
              title="All clear"
              hint="No facts awaiting review and no unread conversations."
              icon={<CheckCircle2 className="h-6 w-6" />}
            />
          )}
        </Card>
      </div>

      {/* Quick links */}
      <div className="mt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-3",
                "text-sm text-zinc-700 transition-colors hover:border-[var(--elx-gold)]/30 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <Icon className="h-4 w-4 text-zinc-500" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
