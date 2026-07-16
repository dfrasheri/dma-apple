"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { AnimatePresence, motion } from "motion/react";
import { LocationIcon, MenuIcon, CloseIcon, ChevronDown } from "@/components/icons";
import { NAV, CARE, CLINIC, CONTACT } from "@/lib/site";
import { useT, useLocale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SearchBox } from "@/components/SearchBox";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { useScrolledPast } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";

function MegaPanel({ label }: { label: string }) {
  const list = label === "Care" ? CARE : CLINIC;
  const t = useT();
  const { locale } = useLocale();
  return (
    <div className="min-w-[268px] p-6">
      <ul className="space-y-1">
        {list.map((c) => (
          <li key={c.href}>
            <Link
              href={`/${locale}${c.href}`}
              className="group/mp flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[15.5px] text-[#2a2018] transition-colors hover:bg-[#f4ecdd] hover:text-[#9a7638]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#c6a15b] opacity-0 transition-opacity group-hover/mp:opacity-100" />
              {c.tKey ? t(c.tKey) : c.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [acc, setAcc] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const { locale } = useLocale();
  const prefersReducedMotion = usePrefersReducedMotion();
  const scrolled = useScrolledPast(40);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-nav-item]", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.15,
      });
    }, el);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-[94px] overflow-visible transition-all duration-300",
        scrolled ? "material-chrome" : "border-b border-[#c6a15b]/20 bg-[#fbf7f2]",
      )}
    >
      <div ref={rowRef} className="mx-auto flex h-full max-w-[1500px] items-center justify-between px-6 sm:px-8">
        <Link href={`/${locale}`} data-nav-item className="transition-opacity duration-300 hover:opacity-80">
          <img
            src="/images/dma/logo2.svg"
            alt="Dental Med Austria"
            className="h-[92px] w-auto lg:h-[168px]"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" onMouseLeave={() => setHovered(null)}>
          {NAV.map((item) => {
            const hasPanel = Boolean(item.children);
            return (
              <div
                key={item.label}
                data-nav-item
                className="group relative"
                onMouseEnter={() => setHovered(item.label)}
              >
                <Link
                  href={`/${locale}${item.href}`}
                  className="relative flex items-center gap-1 py-2 text-[17px] font-medium tracking-[-0.01em] text-[#2a2018] transition-colors duration-200 hover:text-[#9a7638]"
                >
                  {t("nav." + item.label.toLowerCase())}
                  {hasPanel && <ChevronDown className="mt-0.5 h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover:rotate-180" />}
                  {hovered === item.label && !prefersReducedMotion && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-[#c6a15b]"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                </Link>
                {hasPanel && (
                  <div className="invisible absolute left-1/2 top-[calc(100%+16px)] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="absolute -top-4 left-0 right-0 h-4" />
                    <div className="material-panel overflow-hidden rounded-2xl">
                      <MegaPanel label={item.label} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 sm:gap-5">
          <div data-nav-item className="hidden items-center gap-5 text-[#2a2018] lg:flex">
            <LanguageSwitcher />
            <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer" aria-label="Find us on the map" className="transition-colors hover:text-[#9a7638]">
              <LocationIcon className="h-6 w-6" />
            </a>
            <SearchBox />
            <Link
              href={`/${locale}/contact`}
              className="gold-shimmer-host inline-flex items-center justify-center rounded-full bg-[#c6a15b] px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#241c15] shadow-[0_8px_22px_-8px_rgba(198,161,91,0.6)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              {t("nav.contact")}
            </Link>
          </div>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="text-[#2a2018] transition-colors duration-200 hover:text-[#9a7638] lg:hidden"
          >
            {open ? <CloseIcon className="h-8 w-8" /> : <MenuIcon className="h-8 w-8" />}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.15, ease: "easeOut" }
                : { type: "spring", bounce: 0, duration: 0.4 }
            }
            style={{ maxHeight: "calc(100vh - 94px)" }}
            className="material-sheet overflow-y-auto lg:hidden"
          >
            <nav className="px-7 py-4">
              {NAV.map((item) => (
                <div key={item.label} className="border-b border-[#c6a15b]/20">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/${locale}${item.href}`}
                      onClick={() => setOpen(false)}
                      className="block py-4 font-serif text-[22px] font-medium text-[#2a2018]"
                    >
                      {t("nav." + item.label.toLowerCase())}
                    </Link>
                    {item.children && (
                      <button
                        aria-label={`Toggle ${item.label}`}
                        onClick={() => setAcc((a) => (a === item.label ? null : item.label))}
                        className="p-2 text-[#9a7638]"
                      >
                        <ChevronDown className={cn("h-5 w-5 transition-transform", acc === item.label && "rotate-180")} />
                      </button>
                    )}
                  </div>
                  {item.children && (
                    <div className={cn("overflow-hidden transition-[max-height] duration-300", acc === item.label ? "max-h-[600px]" : "max-h-0")}>
                      <ul className="pb-3 pl-4">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={`/${locale}${c.href}`} onClick={() => setOpen(false)} className="block py-2 text-[15.5px] text-[#6e6152]">
                              {c.tKey ? t(c.tKey) : c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              <Link
                href={`/${locale}/contact`}
                onClick={() => setOpen(false)}
                className="mt-5 flex items-center justify-center rounded-full bg-[#c6a15b] px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#241c15]"
              >
                {t("nav.contact")}
              </Link>
              <div className="mt-4 flex items-center gap-2 py-2 text-[#2a2018]">
                <LanguageSwitcher />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
