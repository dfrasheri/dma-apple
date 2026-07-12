"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { LocationIcon, MenuIcon, CloseIcon, ChevronDown } from "@/components/icons";
import { NAV, CARE, CLINIC, CONTACT } from "@/lib/site";
import { useT, useLocale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SearchBox } from "@/components/SearchBox";
import { cn } from "@/lib/utils";

function MegaPanel({ label }: { label: string }) {
  const list = label === "Care" ? CARE : CLINIC;
  const t = useT();
  const { locale } = useLocale();
  return (
    <div className="min-w-[260px] p-6">
      <ul className="space-y-2.5">
        {list.map((c) => (
          <li key={c.href}>
            <Link href={`/${locale}${c.href}`} className="block text-[16px] text-[#343434] hover:text-[#071522]">
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
  const rowRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const { locale } = useLocale();

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-[94px] overflow-visible transition-all duration-300",
        "bg-[#e6e6e6] shadow-[0_1px_0_rgba(0,0,0,0.06)]",
      )}
    >
      <div ref={rowRef} className="mx-auto flex h-full max-w-[1500px] items-center justify-between px-8">
        <Link
          href={`/${locale}`}
          data-nav-item
          className="transition-opacity duration-300 hover:opacity-80"
        >
          <img
            src="/images/dma/logo2.svg"
            alt="Dental Med Austria"
            className="h-[104px] w-auto lg:h-[180px]"
            style={{ transition: "opacity 300ms ease-out" }}
          />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV.map((item) => {
            const hasPanel = Boolean(item.children);
            return (
              <div key={item.label} data-nav-item className="group relative">
                <Link
                  href={`/${locale}${item.href}`}
                  className={cn(
                    "flex items-center gap-1 text-[22px] font-light transition-colors duration-300 hover:opacity-70",
                    "text-[#343434]",
                  )}
                >
                  {t("nav." + item.label.toLowerCase())}
                  {hasPanel && <ChevronDown className="mt-1 h-3.5 w-3.5 opacity-70" />}
                </Link>
                {hasPanel && (
                  <div className="invisible absolute left-1/2 top-[calc(100%+18px)] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="absolute -top-4 left-0 right-0 h-4" />
                    <div className="overflow-hidden bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
                      <MegaPanel label={item.label} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <div
            data-nav-item
            className={cn(
              "hidden items-center gap-5 transition-colors duration-300 lg:flex",
              "text-[#343434]",
            )}
          >
            <LanguageSwitcher />
            <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer" aria-label="Find us on the map" className="hover:opacity-70">
              <LocationIcon className="h-7 w-7" />
            </a>
            <SearchBox />
          </div>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "lg:hidden transition-colors duration-300",
              "text-[#343434]",
            )}
          >
            {open ? <CloseIcon className="h-8 w-8" /> : <MenuIcon className="h-8 w-8" />}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <div
        className={cn(
          "overflow-y-auto bg-[#e6e6e6] lg:hidden transition-[max-height] duration-500 ease-in-out",
          open ? "max-h-[calc(100vh-94px)]" : "max-h-0",
        )}
      >
        <nav className="px-8 py-4">
          {NAV.map((item) => (
            <div key={item.label} className="border-b border-black/10">
              <div className="flex items-center justify-between">
                <Link
                  href={`/${locale}${item.href}`}
                  onClick={() => setOpen(false)}
                  className="block py-4 text-[20px] font-light text-[#343434]"
                >
                  {t("nav." + item.label.toLowerCase())}
                </Link>
                {item.children && (
                  <button
                    aria-label={`Toggle ${item.label}`}
                    onClick={() => setAcc((a) => (a === item.label ? null : item.label))}
                    className="p-2 text-[#343434]"
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
                        <Link href={`/${locale}${c.href}`} onClick={() => setOpen(false)} className="block py-1.5 text-[16px] text-[#555]">
                          {c.tKey ? t(c.tKey) : c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          <div className="mt-2 flex items-center gap-2 py-4 text-[#343434]">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}
