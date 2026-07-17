import { CalendarRange, CheckCircle2, Globe2, Languages, Sparkles } from "lucide-react";

import { LegendChip } from "@/components/crm/LegendChip";
import { SectionHeading, StatCard } from "@/components/crm/ui";
import * as content from "@/lib/crm/services/content";
import { ContentBoard, type PublishedPostRef } from "./ContentBoard";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const [latest, calendars, livePosts] = await Promise.all([
    content.getLatestCalendar(),
    content.listCalendars(),
    content.listPublishedPosts()
  ]);

  // Slim, serializable refs so the board can render live /{locale}/blog/… links.
  const publishedRefs: PublishedPostRef[] = livePosts.flatMap((p) =>
    p.topicId
      ? [{ topicId: p.topicId, locale: p.locale, category: p.category, slug: p.slug }]
      : []
  );

  const topics = latest?.topics ?? [];
  const seo = topics.filter((t) => t.channel === "seo").length;
  const geo = topics.filter((t) => t.channel === "geo").length;
  const approved = topics.filter(
    (t) => t.status === "approved" || t.status === "scheduled"
  ).length;
  const published = topics.filter((t) => t.status === "published").length;

  return (
    <div>
      <SectionHeading
        title="Content engine"
        subtitle="An auto-generated, multilingual SEO + GEO blog calendar. Generate a month, approve topics, draft the articles, then publish them straight to the blog."
        action={<LegendChip provenance="derived" cadence="monthly" />}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="Topics this month"
          value={<span className="tabular-nums">{topics.length}</span>}
          sub={latest ? monthLabel(latest.year, latest.month) : "Nothing generated yet"}
          icon={<CalendarRange className="h-4 w-4" />}
          accent
        />
        <StatCard
          label="SEO / GEO"
          value={
            <span className="tabular-nums">
              {seo} / {geo}
            </span>
          }
          sub="listicles vs AI-engine"
          icon={<Sparkles className="h-4 w-4" />}
        />
        <StatCard
          label="Languages"
          value={<span className="tabular-nums">{latest?.locales.length ?? 0}</span>}
          sub="per topic"
          icon={<Languages className="h-4 w-4" />}
        />
        <StatCard
          label="Approved"
          value={<span className="tabular-nums">{approved}</span>}
          sub="incl. scheduled"
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <StatCard
          label="Published"
          value={<span className="tabular-nums">{published}</span>}
          sub="live on the blog"
          icon={<Globe2 className="h-4 w-4" />}
        />
      </div>

      <ContentBoard initial={latest} calendars={calendars} published={publishedRefs} />
    </div>
  );
}

function monthLabel(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric"
  });
}
