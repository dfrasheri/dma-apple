"use client";

import { usePathname } from "next/navigation";
import { ChatWidgetLazy } from "./ChatWidgetLazy";
import { WhatsAppFab } from "./WhatsAppFab";
import { CookieConsent } from "./CookieConsent";
import { SmoothScroll } from "./fx/SmoothScroll";

// Visitor-facing widgets (chatbot, WhatsApp, cookie banner) belong ONLY on the
// public marketing site. The staff CRM is internal and must never show the
// customer chatbot etc.
const ADMIN_PREFIXES = ["/crm"];

export function PublicChrome() {
  const pathname = usePathname() || "/";
  const isAdmin = ADMIN_PREFIXES.some((a) => pathname === a || pathname.startsWith(a + "/"));
  if (isAdmin) return null;
  return (
    <>
      <SmoothScroll />
      <ChatWidgetLazy />
      <WhatsAppFab />
      <CookieConsent />
    </>
  );
}
