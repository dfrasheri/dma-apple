"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALES, useLocale } from "@/lib/i18n";
import { isLocale } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const choose = async (code: typeof locale) => {
    if (code === locale) return;
    // Keep cookie + UI state in sync for an instant switch…
    setLocale(code);

    const segments = (pathname || "/").split("/");

    // Blog articles have a DIFFERENT slug per language, so we cannot just swap
    // the locale prefix — that keeps the old slug and lands on the wrong (or
    // untranslated) article. Resolve this article's slug in the target language
    // and navigate straight there. Blog data is imported lazily so only a real
    // language switch on a blog article pays for it (never the home page etc.).
    if (segments[2] === "blog" && segments[3] && segments[4]) {
      const [category, slug] = [segments[3], segments[4]];
      try {
        const { findPost, postAlternates } = await import("@/lib/blog-data");
        const post = findPost(category, slug);
        if (post) {
          const alt = postAlternates(post).find((p) => (p.locale ?? "en") === code);
          // Translated version → its own slug; no translation yet → localized
          // blog index, so we never show a half-translated article.
          router.push(alt ? `/${code}/blog/${alt.category}/${alt.slug}` : `/${code}/blog`);
          return;
        }
      } catch {
        // Fall through to the generic prefix swap below.
      }
    }

    // …every other page shares one path across locales, so swapping the prefix
    // gives the real, indexable URL (/it/care/... etc).
    if (isLocale(segments[1])) {
      segments[1] = code;
    } else {
      segments.splice(1, 0, code);
    }
    router.push(segments.join("/") || `/${code}`);
  };

  return (
    <div className={cn("flex items-center gap-1.5 text-[13px] tracking-[1px]", className)}>
      {LOCALES.map((l, i) => (
        <span key={l.code} className="flex items-center gap-1.5">
          {i > 0 && <span className="opacity-40">·</span>}
          <button
            type="button"
            onClick={() => void choose(l.code)}
            aria-label={l.name}
            aria-pressed={locale === l.code}
            className={cn(
              "transition-opacity hover:opacity-100",
              locale === l.code ? "font-semibold opacity-100 underline underline-offset-4" : "opacity-60",
            )}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}
