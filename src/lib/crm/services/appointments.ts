/**
 * Appointments / bookings service, consultations linked to contacts & leads.
 */
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import {
  appointments,
  contacts,
  leads,
  type Appointment,
  type Contact,
  type Lead
} from "@/db/schema";
import type { AppointmentCreateInput, AppointmentUpdateInput } from "../schemas";

const now = () => new Date();

export type AppointmentWithRefs = Appointment & {
  contact: Contact | null;
  lead: Lead | null;
};

function join() {
  return db
    .select()
    .from(appointments)
    .leftJoin(contacts, eq(appointments.contactId, contacts.id))
    .leftJoin(leads, eq(appointments.leadId, leads.id));
}

const map = (r: { appointments: Appointment; contacts: Contact | null; leads: Lead | null }): AppointmentWithRefs => ({
  ...r.appointments,
  contact: r.contacts,
  lead: r.leads
});

export async function listAppointments(): Promise<AppointmentWithRefs[]> {
  return join().orderBy(asc(appointments.scheduledFor)).all().map(map);
}

export async function getAppointment(id: string): Promise<AppointmentWithRefs | null> {
  const row = join().where(eq(appointments.id, id)).get();
  return row ? map(row) : null;
}

export async function createAppointment(input: AppointmentCreateInput): Promise<AppointmentWithRefs | null> {
  const row = db
    .insert(appointments)
    .values({
      contactId: input.contactId ?? null,
      leadId: input.leadId ?? null,
      service: input.service ?? null,
      scheduledFor: new Date(input.scheduledFor),
      durationMin: input.durationMin,
      channel: input.channel ?? null,
      location: input.location ?? null,
      notes: input.notes ?? null,
      status: "requested"
    })
    .returning()
    .get();
  return getAppointment(row.id);
}

export async function updateAppointment(
  id: string,
  patch: AppointmentUpdateInput
): Promise<AppointmentWithRefs | null> {
  const set: Partial<Appointment> = { updatedAt: now() };
  if (patch.status !== undefined) set.status = patch.status;
  if (patch.service !== undefined) set.service = patch.service;
  if (patch.notes !== undefined) set.notes = patch.notes;
  if (patch.scheduledFor !== undefined) set.scheduledFor = new Date(patch.scheduledFor);
  db.update(appointments).set(set).where(eq(appointments.id, id)).run();
  return getAppointment(id);
}

export async function deleteAppointment(id: string): Promise<void> {
  db.delete(appointments).where(eq(appointments.id, id)).run();
}

export async function upcomingCount(): Promise<number> {
  const rows = db.select().from(appointments).orderBy(desc(appointments.scheduledFor)).all();
  const t = Date.now();
  return rows.filter(
    (a) => a.scheduledFor.getTime() >= t && (a.status === "requested" || a.status === "confirmed")
  ).length;
}
