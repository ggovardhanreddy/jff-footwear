import type { MetadataRoute } from "next";
import { products } from "@/data";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jfffootwear.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/products",
    "/about",
    "/gallery",
    "/faq",
    "/contact",
    "/categories",
    "/wholesale",
    "/oem",
    "/dealer",
    "/size-guide",
    "/care-instructions",
    "/shipping",
    "/returns",
    "/customize",
    "/privacy-policy",
    "/terms",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const productPages = products.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages];
}
