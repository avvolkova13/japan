import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  ...(process.env.GITHUB_PAGES === "true"
    ? { basePath: "/japan", assetPrefix: "/japan/" }
    : {}),
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    imageSizes: [32, 48, 64, 96, 128, 256, 384, 480, 512],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.GITHUB_PAGES === "true" ? "/japan" : "",
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
