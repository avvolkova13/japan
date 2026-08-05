import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    imageSizes: [32, 48, 64, 96, 128, 256, 384, 480, 512],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
