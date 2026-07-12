import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

/**
 * The CRM admin shell, full-viewport obsidian surface with the sidebar and a
 * scrollable content area. Wraps every authenticated `/crm/*` page (see the
 * route-group layout). The marketing Header/Footer are suppressed by SiteChrome.
 */
export function CrmShell({ children }: { children: ReactNode }) {
  return (
    <div className="crm-surface flex min-h-screen text-zinc-800">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[var(--elx-gold)]/50 to-transparent" />
        <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">{children}</div>
      </div>
    </div>
  );
}
