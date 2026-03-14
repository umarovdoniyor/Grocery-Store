import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
