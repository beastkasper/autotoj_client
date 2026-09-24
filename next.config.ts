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
      // Сидовые объявления бэкенда ссылаются на picsum — без этого хоста
      // оптимизатор изображений отвечает 400 на половину выдачи.
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
