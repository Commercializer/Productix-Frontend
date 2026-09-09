import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@productix/ui",
    "@productix/editor",
    "@productix/utils",
    "@productix/types",
    "@productix/api",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Default is "attachment", which makes crawlers (WhatsApp, etc.) treat an
    // og:image served through /_next/image as a file download instead of an
    // inline preview image. Safe here since remotePatterns only ever proxies
    // our own validated image uploads (see isAllowedImage in lib/r2.ts).
    contentDispositionType: "inline",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
