"use client";

import { useEffect } from "react";
import { BASE_PATH } from "@/lib/paths";

/** Register service worker for PWA offline support */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const swUrl = `${BASE_PATH}/sw.js`;
    navigator.serviceWorker.register(swUrl).catch(() => {
      /* SW optional — fail silently on unsupported hosts */
    });
  }, []);

  return null;
}
