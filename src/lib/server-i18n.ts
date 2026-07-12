import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  translate,
  type Locale,
} from "@/lib/dictionaries";

/**
 * Resolve the active locale. Primary source is the `x-dma-locale` request
 * header injected by middleware from the URL prefix (/en, /it, /de, /sq), so
 * every locale has its own indexable URL. Falls back to the cookie, then the
 * default, for any request that bypasses the middleware rewrite.
 */
export async function getLocale(): Promise<Locale> {
  const h = await headers();
  const fromHeader = h.get("x-dma-locale");
  if (isLocale(fromHeader)) return fromHeader;

  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** The clean (locale-stripped) request path, e.g. "/care/dental-implants". */
export async function getPath(): Promise<string> {
  const h = await headers();
  return h.get("x-dma-path") || "/";
}

/** Translator bound to the request's locale, for use in Server Components. */
export async function getT(): Promise<(key: string) => string> {
  const locale = await getLocale();
  return (key: string) => translate(locale, key);
}
