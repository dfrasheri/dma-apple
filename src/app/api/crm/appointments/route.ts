import { guard, ok, parseBody, created } from "@/lib/crm/http";
import { appointmentCreateSchema } from "@/lib/crm/schemas";
import type { AppointmentCreateInput } from "@/lib/crm/schemas";
import * as appointmentsService from "@/lib/crm/services/appointments";

export const runtime = "nodejs";

export const GET = guard(async () => ok(await appointmentsService.listAppointments()));

export const POST = guard(async (req) => {
  const body = await parseBody(req, appointmentCreateSchema);
  const input: AppointmentCreateInput = { ...body, durationMin: body.durationMin ?? 60 };
  return created(await appointmentsService.createAppointment(input));
});
