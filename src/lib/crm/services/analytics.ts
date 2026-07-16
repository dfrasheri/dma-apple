/**
 * Chat analytics, the numbers behind /crm/insights. Answers the owner's three
 * questions: WHAT do people ask, on WHICH platform, and WHEN are they willing
 * to send the X-ray / 3D scan the free treatment plan needs.
 *
 * Small data, so we fetch once and reduce in app (same style as dashboard.ts).
 * The full message history is loaded (not just the window) so scan depth and
 * time-to-scan can see turns that predate the reporting window.
 */
import { db } from "@/db/client";
import { messages, type Message } from "@/db/schema";
import { CHANNELS, type Channel } from "../types";

/**
 * Intents the website bot classifies inbound messages into (chat-bot.ts
 * `ChatIntent`, persisted on inbound webchat messages as `meta.intent`).
 * Meta-channel bot replies also carry `meta.intent` (pipeline.ts).
 */
export const CHAT_INTENTS = [
  "price",
  "booking",
  "safety",
  "location",
  "doctor",
  "tourism",
  "knowledge",
  "fallback"
] as const;
export type ChatIntentKey = (typeof CHAT_INTENTS)[number];

export type IntentBreakdown = {
  intent: string;
  count: number;
  /** Up to 3 most recent inbound bodies carrying this intent. */
  examples: string[];
};

export type TopQuestion = { question: string; count: number };

export type ChannelStat = {
  channel: Channel;
  /** All messages (in + out) on the channel within the window. */
  messages: number;
  /** Inbound contact messages only. */
  inbound: number;
  /** Distinct conversations with at least one message in the window. */
  conversations: number;
};

export type DailyTrendPoint = {
  /** Local YYYY-MM-DD. */
  date: string;
  /** Inbound contact messages per channel that day. */
  counts: Record<Channel, number>;
  total: number;
};

export const DEPTH_BUCKETS = ["1st", "2nd", "3rd", "4-5th", "6+"] as const;
export type DepthBucket = (typeof DEPTH_BUCKETS)[number];

export type ScanStats = {
  /** Scan/X-ray events (inbound messages with meta.imageReceived) in window. */
  total: number;
  /** Index 0-23, local hour the scan arrived. */
  byHour: number[];
  /** Monday-first weekday distribution. */
  byWeekday: { day: string; count: number }[];
  /** Which user turn (1st, 2nd, …) of the conversation carried the scan. */
  byDepth: { bucket: DepthBucket; count: number }[];
  /** Median minutes from the conversation's first message to the scan. */
  medianMinutesToScan: number | null;
  /** Scans sent right after a bot turn whose intent was price/booking. */
  afterPriceOffer: number;
  /** Scans sent in any other context. */
  otherwise: number;
};

export type ChatAnalytics = {
  rangeDays: number;
  /** ISO timestamp of the window start. */
  since: string;
  /** Inbound contact messages in the window, all channels. */
  inboundTotal: number;
  intents: IntentBreakdown[];
  topQuestions: TopQuestion[];
  channels: ChannelStat[];
  /** Length of the daily trend, min(rangeDays, 30). */
  trendDays: number;
  daily: DailyTrendPoint[];
  scans: ScanStats;
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const DAY_MS = 86_400_000;

const zeroByChannel = (): Record<Channel, number> => ({
  instagram: 0,
  whatsapp: 0,
  messenger: 0,
  webchat: 0,
  email: 0
});

/** Local-timezone YYYY-MM-DD (toISOString would shift days near midnight). */
function dayKey(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** lowercase, trim, collapse whitespace, strip trailing punctuation, cap 120. */
function normalizeQuestion(body: string): string {
  return body
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[\s.!?…;:,]+$/u, "")
    .slice(0, 120);
}

function intentOf(m: Message): string | null {
  const raw = m.meta?.["intent"];
  return typeof raw === "string" && raw.trim() ? raw : null;
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const v = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  return Math.round(v * 10) / 10;
}

export async function getChatAnalytics(opts?: { days?: number }): Promise<ChatAnalytics> {
  const days = Math.max(1, Math.floor(opts?.days ?? 90));
  const sinceMs = Date.now() - days * DAY_MS;

  // One chronological fetch; everything below is in-memory reduction.
  const all = db.select().from(messages).orderBy(messages.createdAt).all();
  const inWindow = all.filter((m) => m.createdAt.getTime() >= sinceMs);
  const inbound = inWindow.filter((m) => m.direction === "in" && m.author === "contact");

  // ── 1a. intents ────────────────────────────────────────────────────────────
  const intentAcc = new Map<string, { count: number; examples: string[] }>();
  const slot = (key: string) => {
    let s = intentAcc.get(key);
    if (!s) {
      s = { count: 0, examples: [] };
      intentAcc.set(key, s);
    }
    return s;
  };
  for (const key of CHAT_INTENTS) slot(key);
  slot("unknown");
  // Newest first, so `examples` naturally collects the 3 most recent bodies.
  for (let i = inbound.length - 1; i >= 0; i--) {
    const m = inbound[i];
    const s = slot(intentOf(m) ?? "unknown");
    s.count += 1;
    const body = m.body.trim();
    if (body && s.examples.length < 3) s.examples.push(body.slice(0, 160));
  }
  const fixed = new Set<string>([...CHAT_INTENTS, "unknown"]);
  const intents: IntentBreakdown[] = [
    ...CHAT_INTENTS.map((k) => ({ intent: k, ...slot(k) })),
    // Any other intent string observed in the data (e.g. "greeting") gets its
    // own honest row rather than being folded into "unknown".
    ...[...intentAcc.entries()]
      .filter(([k]) => !fixed.has(k))
      .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
      .map(([k, v]) => ({ intent: k, ...v })),
    { intent: "unknown", ...slot("unknown") }
  ];

  // ── 1b. top literal questions ─────────────────────────────────────────────
  const qCounts = new Map<string, number>();
  for (const m of inbound) {
    const q = normalizeQuestion(m.body);
    if (!q) continue;
    qCounts.set(q, (qCounts.get(q) ?? 0) + 1);
  }
  const topQuestions: TopQuestion[] = [...qCounts.entries()]
    .map(([question, count]) => ({ question, count }))
    .sort((a, b) => b.count - a.count || a.question.localeCompare(b.question))
    .slice(0, 20);

  // ── 2. platforms ──────────────────────────────────────────────────────────
  const channels: ChannelStat[] = CHANNELS.map((channel) => {
    const chMsgs = inWindow.filter((m) => m.channel === channel);
    return {
      channel,
      messages: chMsgs.length,
      inbound: chMsgs.filter((m) => m.direction === "in" && m.author === "contact").length,
      conversations: new Set(chMsgs.map((m) => m.conversationId)).size
    };
  });

  const trendDays = Math.min(days, 30);
  const byDay = new Map<string, DailyTrendPoint>();
  const daily: DailyTrendPoint[] = [];
  for (let i = trendDays - 1; i >= 0; i--) {
    const point: DailyTrendPoint = {
      date: dayKey(new Date(Date.now() - i * DAY_MS)),
      counts: zeroByChannel(),
      total: 0
    };
    byDay.set(point.date, point);
    daily.push(point);
  }
  for (const m of inbound) {
    const point = byDay.get(dayKey(m.createdAt));
    if (!point) continue;
    point.counts[m.channel] += 1;
    point.total += 1;
  }

  // ── 3. scan willingness ───────────────────────────────────────────────────
  const byConv = new Map<string, Message[]>();
  for (const m of all) {
    const thread = byConv.get(m.conversationId);
    if (thread) thread.push(m);
    else byConv.set(m.conversationId, [m]);
  }

  const scanEvents = inWindow.filter(
    (m) => m.direction === "in" && m.meta?.["imageReceived"] === true
  );

  const byHour: number[] = new Array<number>(24).fill(0);
  const weekdayCounts: number[] = new Array<number>(7).fill(0);
  const depthCounts: Record<DepthBucket, number> = {
    "1st": 0,
    "2nd": 0,
    "3rd": 0,
    "4-5th": 0,
    "6+": 0
  };
  const minutesToScan: number[] = [];
  let afterPriceOffer = 0;
  let otherwise = 0;

  for (const scan of scanEvents) {
    byHour[scan.createdAt.getHours()] += 1;
    weekdayCounts[(scan.createdAt.getDay() + 6) % 7] += 1; // Monday-first

    const thread = byConv.get(scan.conversationId) ?? [];
    const idx = thread.findIndex((m) => m.id === scan.id);
    const before = idx >= 0 ? thread.slice(0, idx) : [];

    // Which user turn carried the scan? (prior contact messages + this one)
    const position =
      before.filter((m) => m.direction === "in" && m.author === "contact").length + 1;
    const bucket: DepthBucket =
      position === 1
        ? "1st"
        : position === 2
          ? "2nd"
          : position === 3
            ? "3rd"
            : position <= 5
              ? "4-5th"
              : "6+";
    depthCounts[bucket] += 1;

    const first = thread[0];
    if (first) {
      minutesToScan.push(
        Math.max(0, (scan.createdAt.getTime() - first.createdAt.getTime()) / 60_000)
      );
    }

    // Did the scan follow the free-plan offer? Look at the nearest preceding
    // bot turn; price/booking intents are where the bot pitches the plan.
    let lastBot: Message | undefined;
    for (let i = before.length - 1; i >= 0; i--) {
      const m = before[i];
      if (m.direction === "out" && m.author === "bot") {
        lastBot = m;
        break;
      }
    }
    const botIntent = lastBot ? intentOf(lastBot) : null;
    if (botIntent === "price" || botIntent === "booking") afterPriceOffer += 1;
    else otherwise += 1;
  }

  return {
    rangeDays: days,
    since: new Date(sinceMs).toISOString(),
    inboundTotal: inbound.length,
    intents,
    topQuestions,
    channels,
    trendDays,
    daily,
    scans: {
      total: scanEvents.length,
      byHour,
      byWeekday: WEEKDAYS.map((day, i) => ({ day, count: weekdayCounts[i] })),
      byDepth: DEPTH_BUCKETS.map((bucket) => ({ bucket, count: depthCounts[bucket] })),
      medianMinutesToScan: median(minutesToScan),
      afterPriceOffer,
      otherwise
    }
  };
}
