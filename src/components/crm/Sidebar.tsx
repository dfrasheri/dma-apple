"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  CalendarRange,
  Database,
  LayoutDashboard,
  LineChart,
  LogOut,
  Map,
  MessagesSquare,
  Network,
  Share2,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/crm", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/crm/leads", label: "Leads", icon: Users },
  { href: "/crm/affiliates", label: "Affiliates", icon: Share2 },
  { href: "/crm/inbox", label: "Inbox", icon: MessagesSquare },
  { href: "/crm/insights", label: "Insights", icon: LineChart },
  { href: "/crm/knowledge", label: "Knowledge", icon: Database },
  { href: "/crm/content", label: "Content", icon: CalendarRange },
  { href: "/crm/competitors", label: "Competitors", icon: Map },
  { href: "/crm/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/crm/market", label: "Market", icon: BarChart3 },
  { href: "/crm/legend", label: "Data legend", icon: Network }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/crm/auth", { method: "DELETE" });
    router.push("/crm/login");
    router.refresh();
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-[#0f6e56] px-3 py-5 text-[#e1f5ee]">
      <Link href="/crm" className="mb-5 px-2">
        <span className="font-display text-xl font-semibold tracking-wide text-white">
          Dental Med Austria
        </span>
        <span className="ml-1.5 align-middle text-[10px] uppercase tracking-[0.2em] text-[#9fe1cb]">
          CRM
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-white/15 font-medium text-white shadow-[inset_3px_0_0_#5dcaa5]"
                  : "text-[#9fe1cb] hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={signOut}
        className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#9fe1cb] transition-colors hover:bg-white/10 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  );
}
