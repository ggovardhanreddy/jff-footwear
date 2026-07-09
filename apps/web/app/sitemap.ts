import type { MetadataRoute } from "next";
import { products } from "@/data";
import { getAllCollections } from "@/lib/collections";
import {
  SITEMAP_STATIC_PATHS,
  getSitemapChangeFrequency,
  getSitemapPriority,
} from "@/lib/sitemap-config";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.jffstores.com";

/** Set once per static export build. */
const BUILD_DATE = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = SITEMAP_STATIC_PATHS.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: BUILD_DATE,
    changeFrequency: getSitemapChangeFrequency(path),
    priority: getSitemapPriority(path),
  }));

  const collectionPages = getAllCollections().map((collection) => ({
    url: `${siteUrl}/collections/${collection.slug}`,
    lastModified: BUILD_DATE,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const productPages = products.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: BUILD_DATE,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...collectionPages, ...productPages];
}
