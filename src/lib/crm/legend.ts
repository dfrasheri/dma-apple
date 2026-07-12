/**
 * The data-provenance legend + architecture lanes.
 *
 * This is the machine-readable version of the draw.io reference: every data
 * object tagged ◆ sourced / ✚ derived / ✎ transformed, with a cadence and an
 * explicit HIL gate where one exists. Rendered by `/crm/legend` and surfaced
 * inline as `LegendChip`s. Keeping it here (not in the page) means the chart and
 * the UI chips can never disagree.
 */
import type { Cadence, Provenance } from "./types";

export const PROVENANCE_META: Record<
  Provenance,
  { glyph: string; label: string; description: string; className: string }
> = {
  sourced: {
    glyph: "◆",
    label: "Sourced",
    description: "Used as-is, OSM, Eurostat, a public IG post.",
    className: "text-sky-300 ring-sky-400/30 bg-sky-400/10"
  },
  derived: {
    glyph: "✚",
    label: "Derived",
    description: "Created by us, a lead score, a parsed IG handle, an extracted fact.",
    className: "text-emerald-300 ring-emerald-400/30 bg-emerald-400/10"
  },
  transformed: {
    glyph: "✎",
    label: "Transformed",
    description: "Algorithmic, geocoding, classification, OCR, an estimated band.",
    className: "text-amber-300 ring-amber-400/30 bg-amber-400/10"
  }
};

export const CADENCE_META: Record<Cadence, { label: string; className: string }> = {
  realtime: { label: "real-time", className: "text-[var(--elx-gold)]" },
  webhook: { label: "webhook", className: "text-emerald-300" },
  hourly: { label: "hourly", className: "text-cyan-300" },
  daily: { label: "daily", className: "text-sky-300" },
  weekly: { label: "weekly", className: "text-violet-300" },
  monthly: { label: "monthly", className: "text-fuchsia-300" },
  annual: { label: "annual", className: "text-amber-300" },
  manual: { label: "manual", className: "text-slate-300" },
  once: { label: "one-time", className: "text-slate-300" }
};

export type LaneNode = {
  label: string;
  provenance?: Provenance;
  cadence?: Cadence;
  /** A human must confirm before this data is trusted/served. */
  hil?: boolean;
  /** Drawn struck-through: deliberately out of scope (illegal / ToS). */
  crossed?: boolean;
  note?: string;
};

export type Lane = {
  id: string;
  title: string;
  subtitle: string;
  nodes: LaneNode[];
};

/** Top-to-bottom lanes: Channels → Connectors → Processing → Stores → Serving → HIL. */
export const LANES: Lane[] = [
  {
    id: "channels",
    title: "Channels",
    subtitle: "Where messages & signals originate",
    nodes: [
      { label: "IG DM", cadence: "webhook" },
      { label: "WhatsApp", cadence: "webhook" },
      { label: "Messenger", cadence: "webhook" },
      { label: "Web chat", cadence: "webhook" },
      { label: "Email", cadence: "webhook" },
      { label: "Website form", provenance: "sourced", cadence: "realtime" },
      { label: "IG posts (own accounts)", provenance: "sourced", cadence: "webhook" },
      { label: "OSM / Overpass", provenance: "sourced", cadence: "weekly" },
      { label: "Eurostat / market data", provenance: "sourced", cadence: "annual" }
    ]
  },
  {
    id: "connectors",
    title: "Connectors",
    subtitle: "Official APIs + webhooks (no scraping)",
    nodes: [
      { label: "Meta Graph (IG/Messenger)", note: "App review + Business account" },
      { label: "WhatsApp Business API", note: "Templates outside 24h window" },
      { label: "IG Graph (own media)", note: "Token after one-time auth" },
      { label: "Website fetch → IG-URL parse", provenance: "derived", cadence: "monthly" },
      { label: "Private-data harvest (followers/engagement)", crossed: true, note: "Out of scope, ToS / anti-bot" }
    ]
  },
  {
    id: "processing",
    title: "Processing / Agents",
    subtitle: "Where raw input becomes structured data",
    nodes: [
      { label: "Lead scoring", provenance: "derived", cadence: "realtime" },
      { label: "Fact extraction (LLM)", provenance: "derived", cadence: "webhook" },
      { label: "OCR (image overlays)", provenance: "transformed", cadence: "webhook" },
      { label: "Geocoding / classification", provenance: "transformed", cadence: "webhook" },
      { label: "Reconcile + supersede (by post_id)", provenance: "derived", cadence: "hourly" },
      { label: "Bot reply (RAG-free for facts)", provenance: "derived", cadence: "realtime" }
    ]
  },
  {
    id: "stores",
    title: "Stores",
    subtitle: "The database of record",
    nodes: [
      { label: "Contacts / Leads", provenance: "derived", cadence: "realtime" },
      { label: "Conversations / Messages", provenance: "sourced", cadence: "realtime" },
      { label: "Competitors", provenance: "sourced", cadence: "weekly" },
      { label: "Competitor price band", provenance: "transformed", cadence: "manual", note: "ESTIMATED, never scraped" },
      { label: "Social posts", provenance: "sourced", cadence: "webhook" },
      { label: "Social facts (+confidence)", provenance: "derived", cadence: "webhook", hil: true },
      { label: "Market stats", provenance: "sourced", cadence: "annual" }
    ]
  },
  {
    id: "hil",
    title: "Human-in-the-loop gate",
    subtitle: "The correctness guarantee",
    nodes: [
      {
        label: "Fact review queue",
        hil: true,
        note: "Low-confidence / conflicting high-stakes facts wait here for a human before the bot may state them."
      }
    ]
  },
  {
    id: "serving",
    title: "Serving",
    subtitle: "How trusted data reaches people",
    nodes: [
      { label: "Omnichannel bot", provenance: "derived", cadence: "realtime" },
      { label: "Competitor map", provenance: "sourced", cadence: "weekly" },
      { label: "CRM dashboards", provenance: "derived", cadence: "realtime" },
      { label: "Staff inbox (handoff)", cadence: "realtime" }
    ]
  }
];
