import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: frontendRoot,
  /** Mera/WebAuthn is browser-only; keep it out of the server bundle. */
  serverExternalPackages: ["@category-labs/mera"],
  turbopack: {
    root: frontendRoot,
  },
};

export default nextConfig;
