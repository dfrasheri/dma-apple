import type { ReactNode } from "react";
import { CrmShell } from "@/components/crm/CrmShell";

// CRM pages read the SQLite DB at request time, never statically prerender.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dental Med Austria CRM",
  robots: { index: false, follow: false }
};

export default function DashLayout({ children }: { children: ReactNode }) {
  return <CrmShell>{children}</CrmShell>;
}
