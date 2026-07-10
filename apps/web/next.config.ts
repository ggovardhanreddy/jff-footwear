import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
  compress: true,
  transpilePackages: [
    "@jff/types",
    "@jff/config",
    "@jff/utils",
    "@jff/shared",
    "@jff/hooks",
    "@jff/ui",
    "@jff/api",
  ],
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/features",
        destination: "/about/",
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "yet-another-react-lightbox"],
  },
};

export default nextConfig;
