/**
 * UI display metadata, human labels + Tailwind badge classes for every CRM
 * enum. Tuned for the dark obsidian+gold admin shell. Pure data; icon
 * resolution lives in the `ChannelIcon` component.
 */
import type {
  AppointmentStatus,
  Channel,
  ContentChannel,
  ContentFormat,
  ContentTopicStatus,
  ConversationStatus,
  FactStatus,
  FactType,
  LeadSource,
  LeadStage
} from "./types";

export type Meta = { label: string; className: string };

// NOTE: explicit class strings (not template literals) so Tailwind's JIT keeps them.
export const STAGE_META: Record<LeadStage, Meta & { order: number }> = {
  new: { label: "New", order: 0, className: "bg-sky-400/10 text-sky-700 ring-1 ring-inset ring-sky-400/30" },
  qualified: { label: "Qualified", order: 1, className: "bg-cyan-400/10 text-cyan-700 ring-1 ring-inset ring-cyan-400/30" },
  consult: { label: "Consult", order: 2, className: "bg-violet-400/10 text-violet-700 ring-1 ring-inset ring-violet-400/30" },
  proposal: { label: "Proposal", order: 3, className: "bg-amber-400/10 text-amber-700 ring-1 ring-inset ring-amber-400/30" },
  won: { label: "Won", order: 4, className: "bg-emerald-400/10 text-emerald-700 ring-1 ring-inset ring-emerald-400/30" },
  lost: { label: "Lost", order: 5, className: "bg-rose-400/10 text-rose-700 ring-1 ring-inset ring-rose-400/30" }
};

export const SOURCE_META: Record<LeadSource, Meta> = {
  web_form: { label: "Web form", className: "bg-teal-400/10 text-teal-700 ring-1 ring-inset ring-teal-400/30" },
  instagram: { label: "Instagram", className: "bg-fuchsia-400/10 text-fuchsia-700 ring-1 ring-inset ring-fuchsia-400/30" },
  whatsapp: { label: "WhatsApp", className: "bg-emerald-400/10 text-emerald-700 ring-1 ring-inset ring-emerald-400/30" },
  messenger: { label: "Messenger", className: "bg-blue-400/10 text-blue-700 ring-1 ring-inset ring-blue-400/30" },
  webchat: { label: "Web chat", className: "bg-sky-400/10 text-sky-700 ring-1 ring-inset ring-sky-400/30" },
  email: { label: "Email", className: "bg-slate-400/10 text-slate-700 ring-1 ring-inset ring-slate-400/30" },
  referral: { label: "Referral", className: "bg-amber-400/10 text-amber-700 ring-1 ring-inset ring-amber-400/30" },
  walk_in: { label: "Walk-in", className: "bg-indigo-400/10 text-indigo-700 ring-1 ring-inset ring-indigo-400/30" },
  other: { label: "Other", className: "bg-slate-400/10 text-slate-700 ring-1 ring-inset ring-slate-400/30" }
};

export const CHANNEL_META: Record<Channel, Meta> = {
  instagram: { label: "Instagram", className: "bg-fuchsia-400/10 text-fuchsia-700 ring-1 ring-inset ring-fuchsia-400/30" },
  whatsapp: { label: "WhatsApp", className: "bg-emerald-400/10 text-emerald-700 ring-1 ring-inset ring-emerald-400/30" },
  messenger: { label: "Messenger", className: "bg-blue-400/10 text-blue-700 ring-1 ring-inset ring-blue-400/30" },
  webchat: { label: "Web chat", className: "bg-sky-400/10 text-sky-700 ring-1 ring-inset ring-sky-400/30" },
  email: { label: "Email", className: "bg-slate-400/10 text-slate-700 ring-1 ring-inset ring-slate-400/30" }
};

export const CONVERSATION_STATUS_META: Record<ConversationStatus, Meta> = {
  open: { label: "Open", className: "bg-emerald-400/10 text-emerald-700 ring-1 ring-inset ring-emerald-400/30" },
  pending: { label: "Pending", className: "bg-amber-400/10 text-amber-700 ring-1 ring-inset ring-amber-400/30" },
  snoozed: { label: "Snoozed", className: "bg-violet-400/10 text-violet-700 ring-1 ring-inset ring-violet-400/30" },
  closed: { label: "Closed", className: "bg-slate-400/10 text-slate-700 ring-1 ring-inset ring-slate-400/30" }
};

export const FACT_STATUS_META: Record<FactStatus, Meta> = {
  pending_review: { label: "Pending review", className: "bg-amber-400/10 text-amber-700 ring-1 ring-inset ring-amber-400/30" },
  approved: { label: "Approved", className: "bg-emerald-400/10 text-emerald-700 ring-1 ring-inset ring-emerald-400/30" },
  rejected: { label: "Rejected", className: "bg-rose-400/10 text-rose-700 ring-1 ring-inset ring-rose-400/30" },
  retired: { label: "Retired", className: "bg-slate-400/10 text-slate-600 ring-1 ring-inset ring-slate-400/20 line-through" }
};

export const FACT_TYPE_META: Record<FactType, Meta> = {
  open_day: { label: "Open day", className: "bg-amber-400/10 text-amber-700 ring-1 ring-inset ring-amber-400/30" },
  price: { label: "Price", className: "bg-emerald-400/10 text-emerald-700 ring-1 ring-inset ring-emerald-400/30" },
  promo: { label: "Promo", className: "bg-fuchsia-400/10 text-fuchsia-700 ring-1 ring-inset ring-fuchsia-400/30" },
  location: { label: "Location", className: "bg-sky-400/10 text-sky-700 ring-1 ring-inset ring-sky-400/30" },
  service: { label: "Service", className: "bg-teal-400/10 text-teal-700 ring-1 ring-inset ring-teal-400/30" },
  general: { label: "General", className: "bg-slate-400/10 text-slate-700 ring-1 ring-inset ring-slate-400/30" }
};

export const APPOINTMENT_STATUS_META: Record<AppointmentStatus, Meta> = {
  requested: { label: "Requested", className: "bg-amber-400/10 text-amber-700 ring-1 ring-inset ring-amber-400/30" },
  confirmed: { label: "Confirmed", className: "bg-emerald-400/10 text-emerald-700 ring-1 ring-inset ring-emerald-400/30" },
  completed: { label: "Completed", className: "bg-teal-400/10 text-teal-700 ring-1 ring-inset ring-teal-400/30" },
  no_show: { label: "No-show", className: "bg-rose-400/10 text-rose-700 ring-1 ring-inset ring-rose-400/30" },
  cancelled: { label: "Cancelled", className: "bg-slate-400/10 text-slate-600 ring-1 ring-inset ring-slate-400/20" }
};

export function confidenceBand(c: number): Meta {
  if (c >= 0.85) return { label: "High", className: "text-emerald-700" };
  if (c >= 0.6) return { label: "Medium", className: "text-amber-700" };
  return { label: "Low", className: "text-rose-700" };
}

export const DEMAND_META: Record<string, Meta> = {
  high: { label: "High", className: "bg-emerald-400/10 text-emerald-700 ring-1 ring-inset ring-emerald-400/30" },
  medium: { label: "Medium", className: "bg-amber-400/10 text-amber-700 ring-1 ring-inset ring-amber-400/30" },
  low: { label: "Low", className: "bg-slate-400/10 text-slate-700 ring-1 ring-inset ring-slate-400/30" }
};

// ── content engine ────────────────────────────────────────────────────────────
/** SEO = gold (rank) · GEO = teal (cited by AI engines). */
export const CONTENT_CHANNEL_META: Record<ContentChannel, Meta> = {
  seo: { label: "SEO", className: "bg-amber-400/10 text-amber-700 ring-1 ring-inset ring-amber-400/30" },
  geo: { label: "GEO", className: "bg-teal-400/10 text-teal-700 ring-1 ring-inset ring-teal-400/30" }
};

export const CONTENT_STATUS_META: Record<ContentTopicStatus, Meta> = {
  suggested: { label: "Suggested", className: "bg-sky-400/10 text-sky-700 ring-1 ring-inset ring-sky-400/30" },
  approved: { label: "Approved", className: "bg-emerald-400/10 text-emerald-700 ring-1 ring-inset ring-emerald-400/30" },
  scheduled: { label: "Scheduled", className: "bg-violet-400/10 text-violet-700 ring-1 ring-inset ring-violet-400/30" },
  published: { label: "Published", className: "bg-teal-400/10 text-teal-700 ring-1 ring-inset ring-teal-400/30" },
  rejected: { label: "Rejected", className: "bg-rose-400/10 text-rose-700 ring-1 ring-inset ring-rose-400/30" }
};

export const CONTENT_FORMAT_META: Record<ContentFormat, Meta> = {
  listicle: { label: "Listicle", className: "bg-amber-400/10 text-amber-700 ring-1 ring-inset ring-amber-400/30" },
  best_clinics: { label: "Best-of", className: "bg-yellow-400/10 text-yellow-700 ring-1 ring-inset ring-yellow-400/30" },
  cost_guide: { label: "Cost guide", className: "bg-lime-400/10 text-lime-700 ring-1 ring-inset ring-lime-400/30" },
  how_to: { label: "How-to", className: "bg-sky-400/10 text-sky-700 ring-1 ring-inset ring-sky-400/30" },
  comparison: { label: "Comparison", className: "bg-cyan-400/10 text-cyan-700 ring-1 ring-inset ring-cyan-400/30" },
  qa: { label: "Q&A", className: "bg-teal-400/10 text-teal-700 ring-1 ring-inset ring-teal-400/30" },
  definitive_guide: { label: "Guide", className: "bg-violet-400/10 text-violet-700 ring-1 ring-inset ring-violet-400/30" }
};

export const MARKET_LABELS: Record<string, string> = {
  switzerland: "🇨🇭 Switzerland",
  germany: "🇩🇪 Germany",
  austria: "🇦🇹 Austria",
  italy: "🇮🇹 Italy",
  uk: "🇬🇧 UK",
  diaspora: "🌍 Diaspora"
};

export const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  sq: "SQ",
  it: "IT",
  de: "DE",
  fr: "FR"
};
