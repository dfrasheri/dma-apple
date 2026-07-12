"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  DICT,
  LOCALES,
  LOCALE_COOKIE,
  DEFAULT_LOCALE,
  translate,
  isLocale,
  type Locale,
} from "@/lib/dictionaries";

export type { Locale };
export { LOCALES };

const LocaleCtx = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

function persistCookie(l: Locale) {
  // 1 year; readable by Server Components via next/headers cookies().
  document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
}

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  // The URL is the single source of truth for locale. Every language has its own
  // prefix (/en, /it, /de, /sq, /fr), so deriving the active locale straight from
  // the path keeps CLIENT components (useT) in lockstep with the SERVER render
  // (getT, which reads the same prefix) — on first load and on every client-side
  // navigation alike. Crucially, there is NO localStorage override: a stored
  // language must never win over the URL, or the two halves of the page desync
  // (e.g. /en showing Italian content).
  const pathname = usePathname();
  const seg = pathname.split("/")[1];
  const locale: Locale = isLocale(seg) ? seg : initialLocale;

  useEffect(() => {
    // Keep the cookie (for Server Components on un-prefixed requests) and the
    // <html lang> attribute in sync with the URL-derived locale.
    persistCookie(locale);
    document.documentElement.lang = locale;
  }, [locale]);

  // Kept for API compatibility with callers (LanguageSwitcher, SiteFooter): the
  // real switch is the navigation to /{l}/… which changes the pathname above.
  // Persisting the cookie here just makes the switch feel instant to the server.
  const setLocale = (l: Locale) => {
    if (DICT[l]) persistCookie(l);
  };

  return <LocaleCtx.Provider value={{ locale, setLocale }}>{children}</LocaleCtx.Provider>;
}

export function useLocale() {
  return useContext(LocaleCtx);
}

export function useT() {
  const { locale } = useLocale();
  return (key: string): string => translate(locale, key);
}
