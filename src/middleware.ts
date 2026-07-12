import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/lib/dictionaries";
import { CRM_COOKIE, verifySessionEdge } from "@/lib/crm/auth-edge";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * CRM staff gate (no i18n). `/crm/*` pages require a valid signed session
 * cookie; `/crm/login` is always open. CRM *APIs* live under `/api/crm/*`,
 * which the matcher excludes from middleware, those self-gate via `guard()`
 * in each route handler. Unauthenticated CRM pages redirect to the login.
 */
async function crmGate(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  if (pathname === "/crm/login") return NextResponse.next();

  const valid = await verifySessionEdge(req.cookies.get(CRM_COOKIE)?.value);
  if (valid) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/crm/login";
  url.search = `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

/**
 * Country -> locale for first-visit detection. Deterministic by design: the
 * same visitor location always resolves to the same language, unlike
 * Accept-Language (which depends on OS/browser settings and can differ
 * across a visitor's own devices or browsers). Albanian-speaking countries
 * first, then this site's other supported languages; every other country
 * (including markets with no dedicated locale here, e.g. UK/US/HU) falls
 * through to DEFAULT_LOCALE.
 */
const COUNTRY_LOCALE: Record<string, string> = {
  AL: "sq", XK: "sq", MK: "sq",
  IT: "it", SM: "it",
  DE: "de", AT: "de", CH: "de", LI: "de",
  FR: "fr", BE: "fr", LU: "fr", MC: "fr",
};

/**
 * Best-guess locale for a request with no /xx prefix: cookie (an explicit
 * earlier choice always wins) -> geolocated country (Vercel injects
 * x-vercel-ip-country at the edge on every plan, absent only outside Vercel
 * e.g. local dev) -> Accept-Language (dev fallback) -> default.
 */
function detectLocale(req: NextRequest): string {
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const country = req.headers.get("x-vercel-ip-country");
  if (country && COUNTRY_LOCALE[country]) return COUNTRY_LOCALE[country];

  const header = req.headers.get("accept-language");
  if (header) {
    for (const part of header.split(",")) {
      const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
      if (isLocale(code)) return code;
    }
  }
  return DEFAULT_LOCALE;
}

/**
 * Path-based i18n. Every language gets its own indexable URL:
 *   /en/care/...  /it/care/...  /de/care/...  /sq/care/...
 *
 * - URL already prefixed with a valid locale  → rewrite to the underlying
 *   route and expose locale + clean path to Server Components via headers
 *   (x-dma-locale / x-dma-path). The browser URL keeps the prefix, so Google
 *   indexes a distinct URL per language and hreflang/canonical work.
 * - URL without a locale prefix                → 307 redirect to the detected
 *   locale so there is never an un-prefixed, ambiguous URL in the index.
 */
const ADMIN_TOOLS = ["/crm"];
function isAdminPath(pathname: string): boolean {
  return ADMIN_TOOLS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") || "";
  // The staff tools live on their own subdomain (crm.dentalmedaustria.com, or
  // crm.localhost:<port> in dev). Detected by the "crm." host prefix.
  const isAdminHost = host.startsWith("crm.");
  const adminPath = isAdminPath(pathname);

  // ── Admin subdomain: ONLY the staff CRM lives here ──
  if (isAdminHost) {
    if (!adminPath) {
      // Root or any marketing path on the admin host → the CRM dashboard.
      const url = req.nextUrl.clone();
      url.pathname = "/crm";
      url.search = "";
      return NextResponse.redirect(url);
    }
    // CRM is session-gated.
    if (pathname === "/crm" || pathname.startsWith("/crm/")) return crmGate(req);
    return NextResponse.next();
  }

  // ── Public host: the staff tools are NOT served here → move them to crm.* ────
  if (adminPath) {
    const url = req.nextUrl.clone();
    url.host = "crm." + host.replace(/^www\./, "");
    return NextResponse.redirect(url);
  }

  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (isLocale(maybeLocale)) {
    const rest = "/" + segments.slice(2).join("/");
    const cleanPath = rest === "/" ? "/" : rest.replace(/\/+$/, "");

    const url = req.nextUrl.clone();
    url.pathname = cleanPath || "/";

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-dma-locale", maybeLocale);
    requestHeaders.set("x-dma-path", cleanPath || "/");

    const res = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    res.cookies.set(LOCALE_COOKIE, maybeLocale, {
      path: "/",
      maxAge: ONE_YEAR,
      sameSite: "lax",
    });
    return res;
  }

  const locale = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except API routes, Next internals, the admin panel,
  // and any file with an extension (favicon, images, robots.txt, sitemap.xml…).
  matcher: ["/((?!api|_next|admin|.*\\..*).*)"],
};

// Touch LOCALES so the configured set stays the single source of truth.
export const SUPPORTED_LOCALES = LOCALES.map((l) => l.code);
