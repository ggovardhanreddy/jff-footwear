import type { MetadataRoute } from "next";
import { NOINDEX_PATHS } from "@/lib/sitemap-config";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.jffstores.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...NOINDEX_PATHS],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
