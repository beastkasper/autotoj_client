import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a minimal standalone server (.next/standalone/server.js) for a small
  // production Docker image that runs `node server.js` instead of `next start`.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
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
