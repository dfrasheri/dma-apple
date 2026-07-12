import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // better-sqlite3 is a native module — keep it external so it isn't bundled.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
