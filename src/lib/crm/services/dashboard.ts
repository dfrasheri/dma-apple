/**
 * Dashboard aggregation, the numbers behind the CRM home. Small data, so we
 * fetch-and-reduce in app rather than writing SQL aggregates.
 */
import { eq, isNull, and } from "drizzle-orm";
import { db } from "@/db/client";
import {
  appointments,
  competitors,
  conversations,
  leads,
  socialFacts
} from "@/db/schema";
import { LEAD_STAGES, OPEN_LEAD_STAGES, type LeadStage } from "../types";
import { listReviewQueue } from "./facts";

export type DashboardMetrics = {
  leadsTotal: number;
  openLeads: number;
  wonLeads: number;
  pipelineValue: number;
  stageCounts: { stage: LeadStage; count: number }[];
  conversationsOpen: number;
  conversationsUnread: number;
  reviewQueue: number;
  approvedFacts: number;
  upcomingAppointments: number;
  competitors: number;
};

export async function getDashboard(): Promise<DashboardMetrics> {
  const allLeads = db.select().from(leads).all();
  const stageCounts = LEAD_STAGES.map((stage) => ({
    stage,
    count: allLeads.filter((l) => l.stage === stage).length
  }));
  const open = allLeads.filter((l) => OPEN_LEAD_STAGES.includes(l.stage));
  const pipelineValue = open.reduce((s, l) => s + (l.valueEstimate ?? 0), 0);

  const convs = db.select().from(conversations).all();
  const reviewQueue = (await listReviewQueue()).length;

  const approvedFacts = db
    .select()
    .from(socialFacts)
    .where(and(eq(socialFacts.status, "approved"), isNull(socialFacts.supersededBy)))
    .all().length;

  const appts = db.select().from(appointments).all();
  const tNow = Date.now();
  const upcoming = appts.filter(
    (a) => a.scheduledFor.getTime() >= tNow && (a.status === "requested" || a.status === "confirmed")
  ).length;

  const competitorsCount = db.select().from(competitors).all().length;

  return {
    leadsTotal: allLeads.length,
    openLeads: open.length,
    wonLeads: allLeads.filter((l) => l.stage === "won").length,
    pipelineValue,
    stageCounts,
    conversationsOpen: convs.filter((c) => c.status === "open" || c.status === "pending").length,
    conversationsUnread: convs.filter((c) => c.unread).length,
    reviewQueue,
    approvedFacts,
    upcomingAppointments: upcoming,
    competitors: competitorsCount
  };
}
