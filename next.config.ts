import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // better-sqlite3 is a native module — keep it external so it isn't bundled.
  serverExternalPackages: ["better-sqlite3"],
  async redirects() {
    return [
      // Friendly alias matching dentalmedtravel.com/our-clinic — the canonical
      // page lives under /clinic/. Covers bare and locale-prefixed forms.
      { source: "/our-clinic", destination: "/clinic/our-clinic", permanent: true },
      {
        source: "/:locale(en|sq|it|de|fr)/our-clinic",
        destination: "/:locale/clinic/our-clinic",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
