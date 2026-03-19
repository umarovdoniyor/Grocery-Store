import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      {
        protocol: "http",
        hostname: "localhost"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3007"
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3007"
      }
    ]
  }
};

export default nextConfig;
