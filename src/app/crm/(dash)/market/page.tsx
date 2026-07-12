import { Globe2, TrendingUp } from "lucide-react";

import { LegendChip } from "@/components/crm/LegendChip";
import {
  Badge,
  Card,
  EmptyState,
  ProgressBar,
  SectionHeading,
  StatCard,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
  eur
} from "@/components/crm/ui";
import { DEMAND_META } from "@/lib/crm/display";
import * as marketService from "@/lib/crm/services/market";

export default async function MarketPage() {
  const rows = await marketService.listMarket();

  // Service already sorts by affluenceIndex desc, first row with a value wins.
  const topCity = rows.find((r) => r.affluenceIndex != null) ?? rows[0] ?? null;
  const highDemandCount = rows.filter((r) => r.medicalTourismDemand === "high").length;

  return (
    <div>
      <SectionHeading
        title="Market intelligence"
        subtitle="Per-city affluence and medical-tourism demand for lead scoring and competitor context."
        action={<LegendChip provenance="sourced" cadence="annual" />}
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Highest affluence"
          value={topCity ? topCity.city : "-"}
          sub={
            topCity?.affluenceIndex != null
              ? `Affluence index ${topCity.affluenceIndex.toFixed(0)} / 100`
              : "No affluence data yet"
          }
          icon={<TrendingUp className="h-4 w-4" />}
          accent
        />
        <StatCard
          label="High-demand markets"
          value={<span className="tabular-nums">{highDemandCount}</span>}
          sub={`of ${rows.length} tracked ${rows.length === 1 ? "market" : "markets"}`}
          icon={<Globe2 className="h-4 w-4" />}
        />
      </div>

      <Card>
        {rows.length === 0 ? (
          <EmptyState
            title="No market data"
            hint="Market stats are sourced annually from Eurostat / market data feeds."
            icon={<Globe2 className="h-8 w-8" />}
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>City</TH>
                <TH>Country</TH>
                <TH className="w-44">Affluence index</TH>
                <TH className="text-right">Median income</TH>
                <TH className="text-right">Population</TH>
                <TH>Demand</TH>
                <TH>Top procedures</TH>
                <TH>Source</TH>
                <TH className="text-right">Year</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((row) => {
                const demand = row.medicalTourismDemand
                  ? DEMAND_META[row.medicalTourismDemand]
                  : null;
                const procedures = row.topProcedures ?? [];
                return (
                  <TR key={row.id}>
                    <TD className="font-medium text-zinc-900">{row.city}</TD>
                    <TD>{row.country ?? "-"}</TD>
                    <TD>
                      {row.affluenceIndex != null ? (
                        <div className="flex items-center gap-2">
                          <ProgressBar value={row.affluenceIndex} max={100} className="w-24" />
                          <span className="tabular-nums text-zinc-800">
                            {row.affluenceIndex.toFixed(0)}
                          </span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TD>
                    <TD className="text-right tabular-nums">{eur(row.medianIncome)}</TD>
                    <TD className="text-right tabular-nums">
                      {row.population != null ? row.population.toLocaleString() : "-"}
                    </TD>
                    <TD>
                      {demand ? (
                        <Badge className={demand.className}>{demand.label}</Badge>
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </TD>
                    <TD>
                      {procedures.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {procedures.map((proc) => (
                            <span
                              key={proc}
                              className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 ring-1 ring-inset ring-zinc-200"
                            >
                              {proc}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </TD>
                    <TD className="text-zinc-600">{row.source ?? "-"}</TD>
                    <TD className="text-right tabular-nums">{row.year}</TD>
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
