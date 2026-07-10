"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  detectClientPlatform,
  resolveAppDownload,
  type AppDownloadAction,
  type ClientPlatform,
} from "@jff/config/app-download";
import { APP_LINKS, ROUTES } from "@/lib/constants";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallContextValue = {
  canInstall: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
  dismissedBanner: boolean;
  dismissBanner: () => void;
  promptInstall: () => Promise<"accepted" | "dismissed" | "unavailable">;
  /** Smart download: store when live, else PWA / install page for detected OS */
  openAppDownload: () => Promise<"store" | "accepted" | "dismissed" | "pwa" | "unavailable">;
  downloadAction: AppDownloadAction;
  platform: ClientPlatform;
  browseCount: number;
  trackProductView: () => void;
  shouldSuggestInstall: boolean;
};

const InstallContext = createContext<InstallContextValue | null>(null);
const DISMISS_KEY = "jff-install-dismissed";
const BROWSE_KEY = "jff-browse-count";

export function InstallProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const [browseCount, setBrowseCount] = useState(0);
  /** Always "unknown" until mount — avoids SSR/client UA mismatch */
  const [platform, setPlatform] = useState<ClientPlatform>("unknown");

  useEffect(() => {
    setPlatform(detectClientPlatform());
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      Boolean(navigator.standalone);
    setIsStandalone(standalone);
    setDismissedBanner(localStorage.getItem(DISMISS_KEY) === "1");
    setBrowseCount(Number(localStorage.getItem(BROWSE_KEY) || "0") || 0);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const downloadAction = useMemo(() => resolveAppDownload(platform), [platform]);

  const dismissBanner = useCallback(() => {
    setDismissedBanner(true);
    localStorage.setItem(DISMISS_KEY, "1");
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return "unavailable" as const;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return outcome;
  }, [deferredPrompt]);

  const openAppDownload = useCallback(async () => {
    const action = resolveAppDownload(platform);

    // Prefer native store when published
    if (action.kind === "store") {
      window.location.href = action.url;
      return "store" as const;
    }

    // Android Chrome PWA prompt when available
    if (platform === "android" && deferredPrompt) {
      const outcome = await promptInstall();
      return outcome === "unavailable" ? "pwa" : outcome;
    }

    // iOS / fallback → install hub with OS-specific steps
    if (window.location.pathname.replace(/\/$/, "") !== ROUTES.install.replace(/\/$/, "")) {
      window.location.href = `${ROUTES.install}?platform=${platform}`;
      return "pwa" as const;
    }

    return "unavailable" as const;
  }, [platform, deferredPrompt, promptInstall]);

  const trackProductView = useCallback(() => {
    setBrowseCount((prev) => {
      const next = prev + 1;
      localStorage.setItem(BROWSE_KEY, String(next));
      return next;
    });
  }, []);

  const canInstall = Boolean(deferredPrompt) && !isStandalone;
  const isInstalled = isStandalone;
  const shouldSuggestInstall =
    !isStandalone && !dismissedBanner && (browseCount >= 5 || canInstall || APP_LINKS.storesLive);

  return (
    <InstallContext.Provider
      value={{
        canInstall,
        isInstalled,
        isStandalone,
        deferredPrompt,
        dismissedBanner,
        dismissBanner,
        promptInstall,
        openAppDownload,
        downloadAction,
        platform,
        browseCount,
        trackProductView,
        shouldSuggestInstall,
      }}
    >
      {children}
    </InstallContext.Provider>
  );
}

export function useInstall() {
  const ctx = useContext(InstallContext);
  if (!ctx) throw new Error("useInstall must be used within InstallProvider");
  return ctx;
}
