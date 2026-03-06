import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["ui-lib.com", "example.com", "www.example.com", "localhost"],
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
      }
    ]
  }
};

export default nextConfig;
