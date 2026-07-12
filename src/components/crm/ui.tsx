/**
 * Shared CRM UI primitives, dark obsidian+gold admin styling. Server components
 * (no client hooks) so they can be used anywhere. Import these across modules so
 * every page looks consistent.
 */
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Surface card. */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-zinc-200 bg-white shadow-sm", className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 border-b border-zinc-200 px-5 py-4", className)}>
      <div>
        <h3 className="font-display text-sm font-semibold tracking-wide text-zinc-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-zinc-600">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Headline KPI. */
export function StatCard({
  label,
  value,
  sub,
  icon,
  accent
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  accent?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">{label}</span>
        {icon && <span className={cn("text-zinc-500", accent && "text-[var(--elx-gold)]")}>{icon}</span>}
      </div>
      <div className={cn("mt-2 font-display text-3xl font-semibold", accent ? "text-[var(--elx-gold)]" : "text-zinc-900")}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-zinc-600">{sub}</div>}
    </Card>
  );
}

/** Pill / badge. Pass a className from the *_META maps in display.ts. */
export function Badge({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", className)}>
      {children}
    </span>
  );
}

export function SectionHeading({
  title,
  subtitle,
  action,
  className
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 flex flex-wrap items-end justify-between gap-3", className)}>
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  icon
}: {
  title: string;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      {icon && <div className="text-zinc-500">{icon}</div>}
      <p className="font-medium text-zinc-700">{title}</p>
      {hint && <p className="max-w-sm text-sm text-zinc-500">{hint}</p>}
    </div>
  );
}

// ── table primitives ─────────────────────────────────────────────────────────
export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full text-left text-sm", className)}>{children}</table>
    </div>
  );
}
export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500">
      {children}
    </thead>
  );
}
export function TH({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn("px-4 py-2.5 font-medium", className)}>{children}</th>;
}
export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-zinc-200">{children}</tbody>;
}
export function TR({ children, className }: { children: ReactNode; className?: string }) {
  return <tr className={cn("transition-colors hover:bg-white/[0.03]", className)}>{children}</tr>;
}
export function TD({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 text-zinc-700", className)}>{children}</td>;
}

// ── misc ─────────────────────────────────────────────────────────────────────
export function KeyValue({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-xs uppercase tracking-wider text-zinc-500">{label}</span>
      <span className="text-sm text-zinc-800">{value}</span>
    </div>
  );
}

export function ProgressBar({ value, max = 100, className }: { value: number; max?: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-zinc-200", className)}>
      <div className="h-full rounded-full bg-[var(--elx-gold)]" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Confidence meter coloured by band (green/amber/red). */
export function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = value >= 0.85 ? "bg-emerald-400" : value >= 0.6 ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-200">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs tabular-nums text-zinc-600">{pct}%</span>
    </div>
  );
}

export function formatDate(d?: Date | string | null, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }): string {
  if (!d) return "-";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", opts).format(date);
}

export function relativeTime(d?: Date | string | null): string {
  if (!d) return "-";
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = Date.now() - date.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export function eur(n?: number | null): string {
  if (n == null) return "-";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}
