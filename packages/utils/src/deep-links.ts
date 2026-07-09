/**
 * Map website paths to Expo Router mobile paths.
 * Web uses /products/[slug]; mobile uses /product/[slug].
 */
export function normalizePathname(path: string): string {
  let pathname = path.trim();

  if (!pathname) return "/";

  try {
    if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
      pathname = new URL(pathname).pathname;
    }
  } catch {
    // keep raw path
  }

  if (!pathname.startsWith("/")) {
    pathname = `/${pathname}`;
  }

  // Strip trailing slash (except root)
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  return pathname;
}

/** Convert a web URL path to a mobile expo-router path */
export function mapWebPathToMobile(path: string): string {
  const pathname = normalizePathname(path);

  if (pathname.startsWith("/products/")) {
    const slug = pathname.slice("/products/".length);
    return slug ? `/product/${slug}` : "/products";
  }

  // Tab routes — mobile tab screens live at root level in file router
  const tabRoutes = [
    "/",
    "/products",
    "/categories",
    "/wishlist",
    "/cart",
    "/search",
    "/checkout",
    "/settings",
    "/wholesale",
    "/oem",
    "/dealer",
    "/distributor",
    "/contact",
    "/about",
    "/quality-commitment",
    "/size-guide",
    "/care-instructions",
    "/returns",
    "/privacy-policy",
    "/terms",
    "/faq",
    "/gallery",
    "/shipping",
    "/customize",
    "/collections",
    "/catalog",
    "/compare",
    "/recently-viewed",
  ] as const;

  if (tabRoutes.includes(pathname as (typeof tabRoutes)[number])) {
    return pathname;
  }

  return pathname;
}

/** Build a universal link for a product (website format) */
export function productUniversalLink(
  slug: string,
  siteUrl = "https://jfffootwear.com"
): string {
  return `${siteUrl.replace(/\/$/, "")}/products/${slug}`;
}

/** Build a custom scheme deep link for the mobile app */
export function productAppDeepLink(slug: string, scheme = "jff"): string {
  return `${scheme}://product/${slug}`;
}
