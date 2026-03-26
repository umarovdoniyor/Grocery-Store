import type { NextConfig } from "next";

// Derive backend host/port/protocol from the public API base URL so that
// Next.js Image Optimization accepts <img> src URLs that come from the API.
// Falls back to localhost:4001 for local development.
const apiBaseUrl = new URL(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001"
);

const nextConfig: NextConfig = {
  // Required for the lean Docker production image (Stage 3 in Dockerfile).
  output: "standalone",

  experimental: {
    // Prevents Turbopack from scanning entire barrel-export packages.
    // @mui/icons-material alone has 6 000+ exports — without this every
    // first compile compacts a massive filesystem cache (hence the 21 s message).
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "@mui/lab",
      "@mui/x-date-pickers",
      "@emotion/react",
      "@emotion/styled",
      "date-fns",
      "lodash"
    ]
  },
  images: {
    // Needed for local API media URLs during development.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-lib.com"
      },
      {
        protocol: "https",
        hostname: "example.com"
      },
      {
        protocol: "https",
        hostname: "www.example.com"
      },
      // Allow any localhost port in development (covers port changes and stale DB data).
      // In production this entry is harmless since images come from a real domain.
      {
        protocol: "http",
        hostname: "localhost"
      },
      // Backend API host — resolves from NEXT_PUBLIC_API_BASE_URL at build time.
      // Works for localhost in dev and for real domains in production.
      {
        protocol: apiBaseUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiBaseUrl.hostname,
        ...(apiBaseUrl.port ? { port: apiBaseUrl.port } : {})
      }
    ]
  }
};

export default nextConfig;
