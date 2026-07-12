import type { Metadata } from "next";
import { Bodoni_Moda, Roboto } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { MotionPreferenceSync } from "@/components/MotionPreferenceSync";
import { PublicChrome } from "@/components/PublicChrome";
import { LocaleProvider } from "@/lib/i18n";
import { getLocale } from "@/lib/server-i18n";
import { headers } from "next/headers";
import { clinicJsonLd, websiteJsonLd, SITE_URL, META, buildAlternates } from "@/lib/seo";
import { DEFAULT_LOCALE } from "@/lib/dictionaries";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const h = await headers();
  const path = h.get("x-dma-path") || "/";
  const meta = META[locale] ?? META[DEFAULT_LOCALE];
  const alternates = buildAlternates(locale, path);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: meta.title, template: "%s" },
    description: meta.description,
    alternates,
    openGraph: {
      type: "website",
      siteName: "Dental Med Austria",
      locale,
      url: alternates.canonical,
      title: meta.title,
      description: meta.description,
      images: [{ url: "/images/dma/interiors/reception-wide.jpg", width: 2000, height: 1333, alt: "Reception of Dental Med Austria dental clinic in Tirana, Albania" }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/images/dma/interiors/reception-wide.jpg"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${bodoni.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={[clinicJsonLd, websiteJsonLd]} />
        <MotionPreferenceSync />
        <LocaleProvider initialLocale={locale}>
          {children}
          <PublicChrome />
        </LocaleProvider>
      </body>
    </html>
  );
}
