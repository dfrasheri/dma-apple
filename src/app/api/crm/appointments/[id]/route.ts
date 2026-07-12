import { guard, ok, parseBody, notFound } from "@/lib/crm/http";
import { appointmentUpdateSchema } from "@/lib/crm/schemas";
import * as appointmentsService from "@/lib/crm/services/appointments";

export const runtime = "nodejs";

export const PATCH = guard(async (req, { params }) => {
  const { id } = await params;
  const body = await parseBody(req, appointmentUpdateSchema);
  const r = await appointmentsService.updateAppointment(id, body);
  return r ? ok(r) : notFound("Appointment");
});

export const DELETE = guard(async (_req, { params }) => {
  const { id } = await params;
  await appointmentsService.deleteAppointment(id);
  return ok({ id });
});
