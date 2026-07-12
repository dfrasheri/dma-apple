import { MapPin } from "lucide-react";
import type { Competitor } from "@/db/schema";
import { Card, CardHeader, EmptyState } from "@/components/crm/ui";

/**
 * Dependency-free "map": a plain inline SVG that normalises competitor lat/lng
 * into the viewBox and plots a gold dot + label for each. No tiles, no external
 * libraries, just enough to show relative clustering of the competitor set.
 *
 * Server component (no client hooks needed).
 */

type Located = Competitor & { lat: number; lng: number };

const W = 800;
const H = 460;
const PAD = 48;

export function MapPanel({ competitors }: { competitors: Competitor[] }) {
  const located = competitors.filter(
    (c): c is Located => typeof c.lat === "number" && typeof c.lng === "number"
  );

  if (located.length === 0) {
    return (
      <Card>
        <CardHeader title="Competitor map" subtitle="Plotted by coordinates (lat / lng)" />
        <EmptyState
          icon={<MapPin className="h-6 w-6" />}
          title="No mapped competitors yet"
          hint="Add lat / lng to a competitor to see it plotted here."
        />
      </Card>
    );
  }

  const lats = located.map((c) => c.lat);
  const lngs = located.map((c) => c.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Guard against a zero-span (single point or a perfectly aligned set).
  const latSpan = maxLat - minLat || 1;
  const lngSpan = maxLng - minLng || 1;

  // lng → x (left→right), lat → y (north is up, so invert).
  const toX = (lng: number) => PAD + ((lng - minLng) / lngSpan) * (W - PAD * 2);
  const toY = (lat: number) => PAD + ((maxLat - lat) / latSpan) * (H - PAD * 2);

  const gridX = Array.from({ length: 5 }, (_, i) => PAD + (i / 4) * (W - PAD * 2));
  const gridY = Array.from({ length: 4 }, (_, i) => PAD + (i / 3) * (H - PAD * 2));

  return (
    <Card>
      <CardHeader
        title="Competitor map"
        subtitle={`${located.length} of ${competitors.length} competitor${
          competitors.length === 1 ? "" : "s"
        } have coordinates`}
      />
      <div className="p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full rounded-lg border border-zinc-200 bg-white"
          role="img"
          aria-label="Map plotting competitors by latitude and longitude"
        >
          {/* faint grid */}
          {gridX.map((x) => (
            <line key={`gx-${x}`} x1={x} y1={PAD} x2={x} y2={H - PAD} stroke="white" strokeOpacity={0.06} strokeWidth={1} />
          ))}
          {gridY.map((y) => (
            <line key={`gy-${y}`} x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="white" strokeOpacity={0.06} strokeWidth={1} />
          ))}
          {/* frame */}
          <rect
            x={PAD}
            y={PAD}
            width={W - PAD * 2}
            height={H - PAD * 2}
            fill="none"
            stroke="white"
            strokeOpacity={0.1}
            strokeWidth={1}
          />

          {located.map((c) => {
            const x = toX(c.lng);
            const y = toY(c.lat);
            const labelLeft = x > W / 2;
            return (
              <g key={c.id}>
                <circle cx={x} cy={y} r={9} fill="var(--elx-gold)" fillOpacity={0.18} />
                <circle cx={x} cy={y} r={4} fill="var(--elx-gold)" />
                <text
                  x={labelLeft ? x - 9 : x + 9}
                  y={y + 3.5}
                  textAnchor={labelLeft ? "end" : "start"}
                  className="fill-zinc-200"
                  style={{ fontSize: "11px" }}
                >
                  {c.name}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-2 text-xs text-zinc-500">
          Schematic plot of relative positions, not a geographic projection.
        </p>
      </div>
    </Card>
  );
}
