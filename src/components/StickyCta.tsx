"use client";

import { motion } from "motion/react";
import { useScrolledPast } from "@/hooks/useScroll";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { CalendarIcon, ArrowRight, InstagramIcon, GoogleIcon, PhoneIcon, MailIcon } from "@/components/icons";
import { CONTACT } from "@/lib/site";
import { useT } from "@/lib/i18n";

/**
 * Conversion "chaser" bar: once the visitor scrolls into the content it follows
 * them with the three contact actions that actually convert dental-tourism
 * leads, click-to-call, click-to-email (appointment) and the social/maps
 * proof links. tel:/mailto: links double as the crawlable NAP signals local
 * SEO expects to find on every page.
 */
export function StickyCta() {
  const show = useScrolledPast(700);
  const t = useT();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      animate={{ y: show ? "0%" : "100%" }}
      transition={
        prefersReducedMotion
          ? { duration: 0.2, ease: "easeOut" }
          : { type: "spring", bounce: 0, duration: 0.4 }
      }
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#c6a15b]/40 bg-[#241c15]/95 text-[#fbf7f2] backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-5 sm:gap-7">
          <a
            href={CONTACT.phoneHref}
            className="group inline-flex items-center gap-2.5 text-[15px] uppercase tracking-[1.5px]"
            aria-label={`${t("sticky.call")} ${CONTACT.phone}`}
          >
            <PhoneIcon className="h-5 w-5 shrink-0" />
            <span className="hidden md:inline">{CONTACT.phone}</span>
            <span className="md:hidden">{t("sticky.call")}</span>
          </a>
          <a
            href={CONTACT.emailHref}
            className="group hidden items-center gap-2.5 text-[15px] uppercase tracking-[1.5px] sm:inline-flex"
          >
            <CalendarIcon className="h-5 w-5 shrink-0" />
            <span className="truncate">{t("sticky.appointment")}</span>
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href={CONTACT.emailHref}
            className="inline-flex items-center gap-2.5 text-[15px] uppercase tracking-[1.5px] sm:hidden"
            aria-label={t("sticky.email")}
          >
            <MailIcon className="h-5 w-5 shrink-0" />
            {t("sticky.email")}
          </a>
        </div>
        <div className="flex shrink-0 items-center gap-5">
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-70">
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer" aria-label="Find us on Google Maps" className="hover:opacity-70">
            <GoogleIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
