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
    <div className={cn("flex items-center gap-1.5 text-[13px] uppercase tracking-[0.14em]", className)}>
      {LOCALES.map((l, i) => (
        <span key={l.code} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-[#c6a15b]/50" aria-hidden>·</span>}
          <button
            type="button"
            onClick={() => void choose(l.code)}
            aria-label={l.name}
            aria-pressed={locale === l.code}
            className={cn(
              "transition-colors duration-300",
              locale === l.code
                ? "font-semibold text-[#9a7638] underline decoration-[#c6a15b] underline-offset-4"
                : "text-[#6e6152] hover:text-[#9a7638]",
            )}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}
