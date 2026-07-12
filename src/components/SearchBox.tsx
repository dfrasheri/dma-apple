"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { NAV } from "@/lib/site";
import { CATALOGUE_SERVICES, CATALOGUE_CATEGORIES } from "@/lib/catalogue";
import { SearchIcon, CloseIcon } from "@/components/icons";
import { useT, useLocale } from "@/lib/i18n";
import { locServiceName, locCategoryLabel } from "@/lib/catalogue-names-sq";

/**
 * Site search in the nav. Click the magnifier to open a panel; typing filters
 * every page AND the full treatment catalogue, then clicking a result navigates.
 *
 * Matching is synonym-aware: number words become digits and connector words are
 * dropped, so "all in 4", "all on four" and "all-on-4" all find "All-on-4".
 * Client-side, no backend.
 */
const STOP = new Set(["on", "in", "of", "the", "a", "an", "and", "for", "to", "with", "or"]);
const NUM: Record<string, string> = {
  one: "1", two: "2", three: "3", four: "4", five: "5",
  six: "6", seven: "7", eight: "8", nine: "9", ten: "10"
};

/** Lowercase, split, map number words → digits, drop connector stopwords. */
function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => NUM[w] ?? w)
    .filter((w) => !STOP.has(w));
}

type Entry = { label: string; sub?: string; href: string; terms: string };

export function SearchBox() {
  const t = useT();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo<Entry[]>(() => {
    const out: Entry[] = [];
    const seen = new Set<string>();
    const add = (label: string, href: string, extra = "", sub?: string) => {
      const key = href + "|" + label;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ label, sub, href: `/${locale}${href}`, terms: tokens(`${label} ${extra}`).join(" ") });
    };
    // nav pages
    for (const g of NAV) {
      add(t("nav." + g.label.toLowerCase()), g.href);
      for (const c of g.children ?? []) add(c.tKey ? t(c.tKey) : c.label, c.href);
    }
    // full treatment catalogue
    for (const s of CATALOGUE_SERVICES) {
      const cat = CATALOGUE_CATEGORIES.find((c) => c.slug === s.category);
      add(
        locServiceName(s.slug, s.name, locale),
        `/catalogue/${s.slug}`,
        `${s.name} ${s.slug.replace(/-/g, " ")} ${s.brands.join(" ")}`,
        locCategoryLabel(cat?.slug, cat?.label ?? "", locale),
      );
    }
    for (const c of CATALOGUE_CATEGORIES)
      add(locCategoryLabel(c.slug, c.label, locale), "/catalogue", `${c.label} ${c.blurb}`, "Category");
    return out;
  }, [t, locale]);

  const results = useMemo(() => {
    const qt = tokens(q);
    if (qt.length === 0) return [];
    const scored = index
      .map((e) => {
        const hit = qt.every((tok) => e.terms.includes(tok));
        // prefer matches that start the label (name matches over brand/slug hits)
        const labelHit = tokens(e.label).some((w) => w.startsWith(qt[0]));
        return { e, ok: hit, score: (hit ? 1 : 0) + (labelHit ? 1 : 0) };
      })
      .filter((r) => r.ok)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    return scored.map((r) => r.e);
  }, [q, index]);

  useEffect(() => {
    // Single source of truth for "clear the query whenever the panel
    // closes", regardless of which of the several close paths triggered it.
    if (open) inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else setQ("");
  }, [open]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-label={open ? "Close search" : "Search"}
        onClick={() => setOpen((o) => !o)}
        className="hover:opacity-70"
      >
        {open ? <CloseIcon className="h-7 w-7" /> : <SearchIcon className="h-7 w-7" />}
      </button>

      {open && (
        <div className="material-panel absolute right-0 top-[calc(100%+14px)] w-[320px] overflow-hidden rounded-lg text-[#343434]">
          <div className="flex items-center gap-2 border-b border-[#ececec] px-3.5 py-3">
            <SearchIcon className="h-4 w-4 text-[#9a9a9a]" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search treatments…"
              aria-label="Search the site"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#9a9a9a]"
            />
          </div>

          {q.trim() && (
            <ul className="max-h-[340px] overflow-y-auto py-1">
              {results.length > 0 ? (
                results.map((r) => (
                  <li key={r.href + r.label}>
                    <Link
                      href={r.href}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 hover:bg-[#f4f4f4]"
                    >
                      <span className="block text-[15px] leading-tight">{r.label}</span>
                      {r.sub && (
                        <span className="block text-[11px] uppercase tracking-[0.6px] text-[#9a9a9a]">
                          {r.sub}
                        </span>
                      )}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-[14px] text-[#9a9a9a]">No results</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
