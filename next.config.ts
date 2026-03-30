import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "72.56.126.156",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "cdn.autotoj.tj",
      },
      {
        protocol: "https",
        hostname: "api.autotoj.tj",
      },
    ],
  },
};

export default nextConfig;
