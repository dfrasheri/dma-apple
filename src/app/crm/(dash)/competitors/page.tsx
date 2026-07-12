// lucide-react v1 dropped the Instagram brand glyph → alias the camera icon.
import { ExternalLink, Camera as Instagram, Star, ShieldOff } from "lucide-react";
import * as competitorsService from "@/lib/crm/services/competitors";
import { handleFromUrl } from "@/lib/crm/ig-parse";
import {
  SectionHeading,
  Card,
  CardHeader,
  Table,
  THead,
  TH,
  TBody,
  TR,
  TD,
  EmptyState
} from "@/components/crm/ui";
import { LegendChip } from "@/components/crm/LegendChip";
import { MapPanel } from "./_components/MapPanel";
import { ResolveIgButton } from "./_components/ResolveIgButton";

const PRICE_SOURCE_LABEL: Record<string, string> = {
  website: "website",
  market_sampling: "market sampling",
  client_report: "client report",
  estimate: "estimate"
};

export default async function CompetitorsPage() {
  const competitors = await competitorsService.listCompetitors();

  return (
    <div>
      <SectionHeading
        title="Competitor map"
        subtitle="Public competitor intelligence for the Albanian aesthetics market"
      />

      {/* Public / private split callout */}
      <Card className="mb-6 p-5">
        <div className="flex items-start gap-3">
          <ShieldOff className="mt-0.5 h-5 w-5 shrink-0 text-[var(--elx-gold)]" />
          <div className="space-y-3 text-sm text-zinc-700">
            <p>
              We <span className="font-medium text-zinc-900">display public data only</span>, a
              competitor&apos;s website and the public Instagram <em>profile</em> URL parsed from
              that site. We deliberately do <span className="font-medium text-zinc-900">not</span>{" "}
              harvest private IG data (followers, engagement, individual posts).
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-zinc-500">
                Private-data harvest
              </span>
              <LegendChip crossed />
              <span className="text-xs text-zinc-500">- out of scope by design (ToS / anti-bot).</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-zinc-500">Price bands</span>
              <LegendChip provenance="transformed" cadence="manual" />
              <span className="text-xs text-zinc-500">, ESTIMATED &amp; human-maintained, never scraped or presented as live.
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Map */}
      <div className="mb-6">
        <MapPanel competitors={competitors} />
      </div>

      {/* Table */}
      <Card>
        <CardHeader title="Competitors" subtitle={`${competitors.length} tracked`} />
        {competitors.length === 0 ? (
          <EmptyState
            title="No competitors yet"
            hint="Competitors are sourced from OpenStreetMap and human-curated."
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Location</TH>
                <TH>Website</TH>
                <TH>Instagram</TH>
                <TH>Price band</TH>
                <TH className="text-right">Rating</TH>
                <TH>Services</TH>
              </TR>
            </THead>
            <TBody>
              {competitors.map((c) => {
                const handle = handleFromUrl(c.instagramUrl);
                const location = [c.city, c.country].filter(Boolean).join(", ");
                return (
                  <TR key={c.id}>
                    <TD className="font-medium text-zinc-900">{c.name}</TD>
                    <TD>{location || "-"}</TD>
                    <TD>
                      {c.website ? (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[var(--elx-gold)] hover:underline"
                        >
                          {prettyHost(c.website)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        "-"
                      )}
                    </TD>
                    <TD>
                      {c.instagramUrl && handle ? (
                        <a
                          href={c.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-zinc-800 hover:text-[var(--elx-gold)] hover:underline"
                        >
                          <Instagram className="h-3.5 w-3.5" />
                          {handle}
                        </a>
                      ) : (
                        <ResolveIgButton id={c.id} />
                      )}
                    </TD>
                    <TD>
                      {c.priceBand ? (
                        <div className="space-y-0.5">
                          <span
                            title="Estimated, human-maintained, never scraped"
                            className="inline-flex items-center gap-1 tabular-nums text-zinc-800"
                          >
                            <span aria-hidden className="text-amber-700">
                              ✎
                            </span>
                            {c.priceBand}
                          </span>
                          {c.priceSource && (
                            <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                              {PRICE_SOURCE_LABEL[c.priceSource] ?? c.priceSource}
                            </div>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TD>
                    <TD className="text-right">
                      {c.rating != null ? (
                        <span className="inline-flex items-center gap-1 tabular-nums text-zinc-800">
                          <Star className="h-3.5 w-3.5 text-[var(--elx-gold)]" />
                          {c.rating.toFixed(1)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TD>
                    <TD>
                      {c.services && c.services.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {c.services.map((s) => (
                            <span
                              key={s}
                              className="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
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

/** Strip scheme + www for a compact website label. */
function prettyHost(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
  }
}
