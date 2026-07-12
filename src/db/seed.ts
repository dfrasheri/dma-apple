/**
 * Seed the CRM with a realistic demo dataset and exercise the real service layer
 * (so scoring, activity logging, extraction, reconcile and the HIL gate all run
 * exactly as they do in the app). Re-runnable: clears every table first.
 *
 * Run with: `npm run seed`
 */
import { db } from "./client";
import {
  appointments,
  competitors,
  contacts,
  conversations,
  leadActivities,
  leads,
  marketStats,
  messages,
  socialFacts,
  socialPosts,
  teamMembers
} from "./schema";
import {
  appointmentsService,
  competitorsService,
  factsService,
  inboxService,
  leadsService,
  marketService,
  teamService
} from "../lib/crm/services";
import { SEED_POSTS } from "../lib/crm/connectors/demo-feed";

function clear() {
  // children first, then parents
  for (const t of [
    messages,
    leadActivities,
    socialFacts,
    appointments,
    conversations,
    leads,
    socialPosts,
    contacts,
    competitors,
    marketStats,
    teamMembers
  ]) {
    db.delete(t).run();
  }
}

const daysFromNow = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString();

async function main() {
  clear();

  // ── market intelligence (seed BEFORE leads so scoring can use it) ───────────
  const markets: Parameters<typeof marketService.upsertMarket>[0][] = [
    { city: "London", country: "UK", affluenceIndex: 86, medianIncome: 52000, population: 8900000, medicalTourismDemand: "high", topProcedures: ["Veneers", "Hair transplant"], source: "Eurostat 2025", year: 2026 },
    { city: "Dubai", country: "UAE", affluenceIndex: 92, medianIncome: 64000, population: 3500000, medicalTourismDemand: "high", topProcedures: ["EBOO", "Aesthetics"], source: "World Bank 2025", year: 2026 },
    { city: "Zurich", country: "Switzerland", affluenceIndex: 96, medianIncome: 85000, population: 430000, medicalTourismDemand: "high", topProcedures: ["Longevity", "MCT"], source: "OECD 2025", year: 2026 },
    { city: "Manchester", country: "UK", affluenceIndex: 62, medianIncome: 38000, population: 550000, medicalTourismDemand: "medium", topProcedures: ["Laser liposuction"], source: "Eurostat 2025", year: 2026 },
    { city: "Milan", country: "Italy", affluenceIndex: 74, medianIncome: 41000, population: 1400000, medicalTourismDemand: "medium", topProcedures: ["Veneers"], source: "Eurostat 2025", year: 2026 },
    { city: "Paris", country: "France", affluenceIndex: 80, medianIncome: 49000, population: 2100000, medicalTourismDemand: "high", topProcedures: ["Rhinoplasty"], source: "Eurostat 2025", year: 2026 },
    { city: "Stockholm", country: "Sweden", affluenceIndex: 84, medianIncome: 51000, population: 980000, medicalTourismDemand: "medium", topProcedures: ["Hair transplant"], source: "Eurostat 2025", year: 2026 },
    { city: "Bucharest", country: "Romania", affluenceIndex: 45, medianIncome: 18000, population: 1800000, medicalTourismDemand: "low", topProcedures: ["LESC"], source: "Eurostat 2025", year: 2026 }
  ];
  for (const m of markets) await marketService.upsertMarket(m);

  // ── team roster (seed BEFORE leads so intake round-robin has coordinators) ──
  teamService.createMember({ name: "Arta Hoxha", email: "arta@dentalmedaustria.com", role: "coordinator", active: true });
  teamService.createMember({ name: "Besnik Rama", email: "besnik@dentalmedaustria.com", role: "coordinator", active: true });
  // Founder & Managing Director, leadership role, not a treating clinician.
  teamService.createMember({ name: "Dr. Mentor Zeqja", email: "info@dentalmedaustria.com", role: "admin", active: true });

  // ── leads (created via the service → scored + timeline) ──────────────────────
  const seedLeads: {
    lead: Parameters<typeof leadsService.createLead>[0];
    stage?: "qualified" | "consult" | "proposal" | "won" | "lost";
    lostReason?: string;
  }[] = [
    { lead: { name: "Sofia Rossi", email: "sofia.rossi@example.com", phone: "+44 7700 900111", city: "London", country: "UK", service: "LAV", source: "web_form", valueEstimate: 590, message: "Interested in the LAV protocol, please call after 5pm." }, stage: "proposal" },
    { lead: { name: "James Carter", email: "j.carter@example.com", phone: "+44 7700 900222", city: "Manchester", country: "UK", service: "Laser Liposuction", source: "instagram", valueEstimate: 2200 }, stage: "qualified" },
    { lead: { name: "Aisha Khan", email: "aisha.khan@example.com", phone: "+971 50 123 4567", city: "Dubai", country: "UAE", service: "EBOO", source: "whatsapp", valueEstimate: 1500, message: "Want to book EBOO during my Tirana visit in July." }, stage: "consult" },
    { lead: { name: "Lukas Meier", email: "lukas.meier@example.com", phone: "+41 79 123 45 67", city: "Zurich", country: "Switzerland", service: "MCT", source: "referral", valueEstimate: 250 }, stage: "won" },
    { lead: { name: "Elena Popa", email: "elena.popa@example.com", city: "Bucharest", country: "Romania", service: "LESC", source: "webchat" } },
    { lead: { name: "Marco Bianchi", email: "marco.bianchi@example.com", phone: "+39 333 1234567", city: "Milan", country: "Italy", service: "Veneers", source: "email", valueEstimate: 3000 } },
    { lead: { name: "Nadia Haddad", email: "nadia.haddad@example.com", phone: "+33 6 12 34 56 78", city: "Paris", country: "France", service: "Rhinoplasty", source: "instagram", valueEstimate: 4000 }, stage: "consult" },
    { lead: { name: "Olof Berg", email: "olof.berg@example.com", city: "Stockholm", country: "Sweden", service: "Hair transplant", source: "web_form", valueEstimate: 3500 }, stage: "lost", lostReason: "Chose a local clinic" }
  ];

  const createdLeads = [];
  for (const s of seedLeads) {
    const lead = await leadsService.createLead(s.lead);
    if (s.stage) await leadsService.updateLead(lead.id, { stage: s.stage, lostReason: s.lostReason });
    createdLeads.push(lead);
  }

  // ── competitors (map) ────────────────────────────────────────────────────────
  await competitorsService.createCompetitor({ name: "Bosphorus Smile Clinic", city: "Istanbul", country: "Türkiye", lat: 41.04, lng: 28.99, website: "https://bosphorussmile.com", priceBand: "€2,000–3,500", priceSource: "market_sampling", services: ["Hollywood smile", "Dental implants"], rating: 4.5 });
  await competitorsService.createCompetitor({ name: "Estetik İstanbul", city: "Istanbul", country: "Türkiye", lat: 41.01, lng: 28.95, website: "https://estetikistanbul.com", priceBand: "€1,500–3,000", priceSource: "website", services: ["Rhinoplasty", "Hair transplant"], rating: 4.2 });
  await competitorsService.createCompetitor({ name: "Clinica Sorriso Milano", city: "Milan", country: "Italy", lat: 45.46, lng: 9.19, website: "https://clinicasorriso.it", priceBand: "€2,500–4,000", priceSource: "market_sampling", services: ["Veneers"], rating: 4.6 });
  await competitorsService.createCompetitor({ name: "London Aesthetic Lab", city: "London", country: "UK", lat: 51.51, lng: -0.14, website: "https://londonaestheticlab.co.uk", priceBand: "£3,000–6,000", priceSource: "estimate", services: ["Laser liposuction", "Fillers"], rating: 4.3 });

  // ── knowledge base: ingest demo posts, then HIL-approve a couple ────────────
  const recon = await factsService.reconcile(SEED_POSTS, "full");
  // Approve the high-stakes facts a human would clear (leaving the ambiguous one queued).
  const pending = await factsService.listReviewQueue();
  for (const f of pending) {
    const isIstanbulPrice = f.type === "price" && f.city?.toLowerCase() === "istanbul";
    const isMilanPromo = f.type === "promo" && f.city?.toLowerCase() === "milan";
    if (isIstanbulPrice || isMilanPromo) {
      await factsService.reviewFact(f.id, "approve", "seed");
    }
  }

  // ── inbox: inbound messages across channels ─────────────────────────────────
  const ig = await inboxService.recordInbound({ channel: "instagram", externalId: "IGT_5001", body: "Hi! When is the open day in Venice? 😊", contact: { name: "Giulia Conti", handle: "giulia.conti" } });
  await inboxService.sendMessage({ conversationId: ig.conversation.id, body: "Hi Giulia! Let me check that for you right away ✨", author: "agent" });
  await inboxService.recordInbound({ channel: "whatsapp", externalId: "WA_5002", body: "How much are dental implants in Istanbul?", contact: { name: "Tom Becker", phone: "+49 151 23456789" } });
  await inboxService.recordInbound({ channel: "webchat", externalId: "WC_5003", body: "Hello, do you offer veneers? How long do they last?", contact: { name: "Website visitor" } });
  await inboxService.recordInbound({ channel: "messenger", externalId: "MS_5004", body: "Where is your clinic located?", contact: { name: "Paula Núñez", handle: "paula.nunez" } });

  // ── appointments ────────────────────────────────────────────────────────────
  const aisha = createdLeads.find((l) => l.contact?.name === "Aisha Khan");
  const james = createdLeads.find((l) => l.contact?.name === "James Carter");
  const lukas = createdLeads.find((l) => l.contact?.name === "Lukas Meier");
  if (aisha) await appointmentsService.createAppointment({ leadId: aisha.id, contactId: aisha.contactId, service: "EBOO", scheduledFor: daysFromNow(5), durationMin: 60, channel: "whatsapp", location: "Tirana clinic" });
  if (james) await appointmentsService.createAppointment({ leadId: james.id, contactId: james.contactId, service: "Laser Liposuction", scheduledFor: daysFromNow(12), durationMin: 60, channel: "instagram" });
  if (lukas) {
    const appt = await appointmentsService.createAppointment({ leadId: lukas.id, contactId: lukas.contactId, service: "MCT", scheduledFor: daysFromNow(-9), durationMin: 60 });
    if (appt) await appointmentsService.updateAppointment(appt.id, { status: "completed" });
  }

  // ── summary ──────────────────────────────────────────────────────────────────
  const approved = await factsService.listFacts({ status: "approved" });
  const queue = await factsService.listReviewQueue();
  console.log("✓ Seed complete");
  console.log(`  leads: ${createdLeads.length}`);
  console.log(`  reconcile: +${recon.inserted} inserted, ${recon.updated} updated, ${recon.retired} retired`);
  console.log(`  facts approved: ${approved.length}, review queue: ${queue.length}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
