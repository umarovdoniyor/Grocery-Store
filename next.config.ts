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
    // When running in local Docker, the Next.js image optimizer is inside
    // the container and cannot reach localhost:4001 (the host's backend port).
    // Setting unoptimized=true makes the browser fetch images directly, which
    // works because the host browser CAN reach localhost:4001.
    // Set NEXT_IMAGE_UNOPTIMIZED=true as a build arg in docker-compose for local runs.
    // Leave it unset for production (real domain images optimize fine server-side).
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === "true",
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
