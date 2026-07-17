/**
 * GET /api/tour-health — server-side reachability probe for the Tourmake 360°
 * tour. Iframes can't report HTTP status cross-origin, so the browser alone
 * cannot tell a healthy tour from a 502 page; this route fetches the tour
 * server-side and reports { ok }. VirtualTour only mounts the iframe when ok,
 * and shows a branded fallback (with auto-retry) otherwise — a Tourmake
 * outage must never surface as a raw gateway error inside the page.
 */
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TOUR_URL = "https://tourmake.net/en/tour/fc58c6776f2de688a8c88576cde2c0ad";
const PROBE_TIMEOUT_MS = 6000;

export async function GET() {
  let ok = false;
  let status = 0;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), PROBE_TIMEOUT_MS);
    const res = await fetch(TOUR_URL, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 (compatible; DMA-tour-health/1.0)" },
      // Always probe live — the route response itself is what gets cached.
      cache: "no-store",
    });
    clearTimeout(timer);
    ok = res.ok;
    status = res.status;
  } catch {
    ok = false;
  }
  return NextResponse.json(
    { ok, status },
    {
      headers: {
        // Shared 30s cache: at most ~2 upstream probes/minute regardless of
        // traffic, while an outage clears within half a minute of recovery.
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    },
  );
}
