import { CalendarClock, CalendarX2, MapPin } from "lucide-react";
import * as appointmentsService from "@/lib/crm/services/appointments";
import type { AppointmentWithRefs } from "@/lib/crm/services/appointments";
import {
  Badge,
  Card,
  CardHeader,
  EmptyState,
  SectionHeading,
  StatCard,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
  formatDate
} from "@/components/crm/ui";
import { APPOINTMENT_STATUS_META } from "@/lib/crm/display";
import { ChannelIcon } from "@/components/crm/ChannelIcon";
import { StatusControl } from "./_components/StatusControl";

const DATE_TIME_OPTS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit"
};

function AppointmentTable({ rows }: { rows: AppointmentWithRefs[] }) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>When</TH>
          <TH>Contact</TH>
          <TH>Service</TH>
          <TH>Channel</TH>
          <TH>Location</TH>
          <TH>Status</TH>
          <TH className="text-right">Set status</TH>
        </TR>
      </THead>
      <TBody>
        {rows.map((appt) => (
          <TR key={appt.id}>
            <TD className="whitespace-nowrap text-zinc-900 tabular-nums">
              {formatDate(appt.scheduledFor, DATE_TIME_OPTS)}
            </TD>
            <TD className="text-zinc-900">{appt.contact?.name ?? "-"}</TD>
            <TD>{appt.service ?? "-"}</TD>
            <TD>
              {appt.channel ? (
                <span className="inline-flex items-center gap-1.5 text-zinc-700">
                  <ChannelIcon channel={appt.channel} className="h-4 w-4" />
                </span>
              ) : (
                "-"
              )}
            </TD>
            <TD>
              {appt.location ? (
                <span className="inline-flex items-center gap-1.5 text-zinc-700">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  {appt.location}
                </span>
              ) : (
                "-"
              )}
            </TD>
            <TD>
              <Badge className={APPOINTMENT_STATUS_META[appt.status].className}>
                {APPOINTMENT_STATUS_META[appt.status].label}
              </Badge>
            </TD>
            <TD className="text-right">
              <StatusControl id={appt.id} status={appt.status} />
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}

export default async function AppointmentsPage() {
  const appointments = await appointmentsService.listAppointments();
  // Server Component, re-run fresh per request -- "now" is meant to be the
  // real current time on every load, not a value to memoize/cache.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  const upcoming = appointments.filter((a) => a.scheduledFor.getTime() >= now);
  const past = appointments
    .filter((a) => a.scheduledFor.getTime() < now)
    .sort((a, b) => b.scheduledFor.getTime() - a.scheduledFor.getTime());

  const activeUpcoming = upcoming.filter(
    (a) => a.status === "requested" || a.status === "confirmed"
  ).length;

  return (
    <div>
      <SectionHeading
        title="Appointments"
        subtitle="Consultations and bookings linked to contacts and leads."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Upcoming"
          value={upcoming.length}
          sub={`${activeUpcoming} awaiting / confirmed`}
          icon={<CalendarClock className="h-5 w-5" />}
          accent
        />
        <StatCard
          label="Past"
          value={past.length}
          icon={<CalendarX2 className="h-5 w-5" />}
        />
        <StatCard label="Total" value={appointments.length} />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader title="Upcoming" subtitle={`${upcoming.length} scheduled`} />
          {upcoming.length ? (
            <AppointmentTable rows={upcoming} />
          ) : (
            <EmptyState
              title="No upcoming appointments"
              hint="New bookings will appear here as they are scheduled."
              icon={<CalendarClock className="h-8 w-8" />}
            />
          )}
        </Card>

        <Card>
          <CardHeader title="Past" subtitle={`${past.length} historic`} />
          {past.length ? (
            <AppointmentTable rows={past} />
          ) : (
            <EmptyState
              title="No past appointments"
              icon={<CalendarX2 className="h-8 w-8" />}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
