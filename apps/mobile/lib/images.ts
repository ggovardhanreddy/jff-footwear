import Constants from "expo-constants";

const base =
  process.env.EXPO_PUBLIC_WEB_ASSET_BASE_URL ??
  Constants.expoConfig?.extra?.webAssetBaseUrl ??
  "https://www.jffstores.com";

/** Resolve a web-relative product image path to an absolute URL for mobile. */
export function resolveProductImage(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/$/, "")}${normalized}`;
}
