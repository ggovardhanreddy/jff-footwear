"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

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
  platform: "android" | "ios" | "desktop" | "unknown";
  browseCount: number;
  trackProductView: () => void;
  shouldSuggestInstall: boolean;
};

const InstallContext = createContext<InstallContextValue | null>(null);
const DISMISS_KEY = "jff-install-dismissed";
const BROWSE_KEY = "jff-browse-count";

function detectPlatform(): InstallContextValue["platform"] {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Macintosh|Windows|Linux/i.test(ua)) return "desktop";
  return "unknown";
}

export function InstallProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const [browseCount, setBrowseCount] = useState(0);
  /** Always "unknown" until mount — avoids SSR/client UA mismatch */
  const [platform, setPlatform] = useState<InstallContextValue["platform"]>("unknown");

  useEffect(() => {
    setPlatform(detectPlatform());
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
    !isStandalone && !dismissedBanner && (browseCount >= 5 || canInstall);

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
