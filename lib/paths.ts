/** Base path for GitHub Pages (`/jff-footwear`) or empty for local/root deploy. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Shown when a product has no photos or an image fails to load. */
export const SOLD_OUT_IMAGE = "/images/sold-out.svg";

/** Default social / SEO fallback image. */
export const DEFAULT_OG_IMAGE = "/images/og-default.svg";

/** Prefix public asset paths with the deployment base path. */
export function assetPath(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (BASE_PATH && normalized.startsWith(BASE_PATH)) return normalized;
  return `${BASE_PATH}${normalized}`;
}
