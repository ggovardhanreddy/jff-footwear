import { APP_LINKS, ROUTES } from "./constants";

export type ClientPlatform = "ios" | "android" | "desktop" | "unknown";

export type AppDownloadAction = {
  kind: "store" | "pwa";
  platform: ClientPlatform;
  url: string;
  label: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
};

/** Placeholder / empty store URLs are treated as not published yet. */
export function isLiveStoreUrl(url: string | undefined | null): boolean {
  if (!url || !/^https?:\/\//i.test(url)) return false;
  if (/id0000000000/i.test(url)) return false;
  if (/placeholder|example\.com|your-/i.test(url)) return false;
  return true;
}

export function detectClientPlatform(userAgent?: string): ClientPlatform {
  const ua = userAgent ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");
  if (!ua) return "unknown";
  if (/iPad|iPhone|iPod/i.test(ua)) return "ios";
  // iPadOS 13+ may report as Macintosh with touch
  if (/Macintosh/i.test(ua) && typeof navigator !== "undefined" && navigator.maxTouchPoints > 1) {
    return "ios";
  }
  if (/Android/i.test(ua)) return "android";
  if (/Macintosh|Windows|Linux|CrOS/i.test(ua)) return "desktop";
  return "unknown";
}

export function getStoreUrl(platform: "ios" | "android"): string | null {
  if (!APP_LINKS.storesLive) return null;
  const url = platform === "ios" ? APP_LINKS.appStore : APP_LINKS.playStore;
  return isLiveStoreUrl(url) ? url : null;
}

/**
 * Resolve the best download / install action for the visitor's device.
 * Prefers native stores when live; otherwise routes to the PWA install flow.
 */
export function resolveAppDownload(platform: ClientPlatform): AppDownloadAction {
  const installPath = APP_LINKS.installPath || ROUTES.install;

  if (platform === "ios") {
    const store = getStoreUrl("ios");
    if (store) {
      return {
        kind: "store",
        platform,
        url: store,
        label: "Download on the App Store",
        secondaryLabel: "Or install free web app",
        secondaryUrl: installPath,
      };
    }
    return {
      kind: "pwa",
      platform,
      url: installPath,
      label: "Install on iPhone",
      secondaryLabel: "App Store coming soon",
    };
  }

  if (platform === "android") {
    const store = getStoreUrl("android");
    if (store) {
      return {
        kind: "store",
        platform,
        url: store,
        label: "Get it on Google Play",
        secondaryLabel: "Or install free web app",
        secondaryUrl: installPath,
      };
    }
    return {
      kind: "pwa",
      platform,
      url: installPath,
      label: "Install on Android",
      secondaryLabel: "Play Store coming soon",
    };
  }

  // Desktop / unknown — send to install hub (shows both options + QR)
  return {
    kind: "pwa",
    platform,
    url: installPath,
    label: "Get the JFF App",
    secondaryLabel: "Scan QR on your phone",
  };
}
