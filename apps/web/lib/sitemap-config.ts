/** Paths excluded from sitemap and blocked in robots.txt (session/utility pages). */
export const NOINDEX_PATHS = [
  "/cart",
  "/checkout",
  "/wishlist",
  "/compare",
  "/search",
  "/recently-viewed",
] as const;

export type NoIndexPath = (typeof NOINDEX_PATHS)[number];

/** Indexable static routes for sitemap.xml (no trailing slash — sitemap builder adds siteUrl). */
export const SITEMAP_STATIC_PATHS = [
  "",
  "/products",
  "/collections",
  "/categories",
  "/gallery",
  "/about",
  "/quality-commitment",
  "/faq",
  "/contact",
  "/wholesale",
  "/distributor",
  "/catalog",
  "/oem",
  "/dealer",
  "/customize",
  "/size-guide",
  "/care-instructions",
  "/shipping",
  "/returns",
  "/privacy-policy",
  "/terms",
] as const;

const PRIORITY_OVERRIDES: Record<string, number> = {
  "": 1,
  "/products": 0.9,
  "/contact": 0.85,
  "/wholesale": 0.85,
  "/about": 0.8,
  "/faq": 0.75,
  "/privacy-policy": 0.5,
  "/terms": 0.5,
};

const CHANGE_FREQUENCY_OVERRIDES: Record<
  string,
  "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
> = {
  "": "weekly",
  "/products": "daily",
  "/privacy-policy": "yearly",
  "/terms": "yearly",
};

export function getSitemapPriority(path: string): number {
  return PRIORITY_OVERRIDES[path] ?? 0.7;
}

export function getSitemapChangeFrequency(
  path: string
): "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" {
  return CHANGE_FREQUENCY_OVERRIDES[path] ?? "weekly";
}
