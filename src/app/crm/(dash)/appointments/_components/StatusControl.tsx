"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { APPOINTMENT_STATUSES, type AppointmentStatus } from "@/lib/crm/types";
import { APPOINTMENT_STATUS_META } from "@/lib/crm/display";

export function StatusControl({ id, status }: { id: string; status: AppointmentStatus }) {
  const router = useRouter();
  const [value, setValue] = useState<AppointmentStatus>(status);
  const [saving, setSaving] = useState(false);

  async function change(next: AppointmentStatus) {
    const prev = value;
    setValue(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/crm/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next })
      });
      if (!res.ok) {
        setValue(prev);
        return;
      }
      router.refresh();
    } catch {
      setValue(prev);
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={value}
      disabled={saving}
      onChange={(e) => change(e.target.value as AppointmentStatus)}
      className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-[var(--elx-gold)]/50 focus:outline-none disabled:opacity-50"
    >
      {APPOINTMENT_STATUSES.map((s) => (
        <option key={s} value={s} className="bg-zinc-900 text-zinc-900">
          {APPOINTMENT_STATUS_META[s].label}
        </option>
      ))}
    </select>
  );
}
