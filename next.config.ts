import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "https://space-z.ai",
    "https://*.space-z.ai",
    "https://chat.z.ai",
    "https://*.chat.z.ai",
  ],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
