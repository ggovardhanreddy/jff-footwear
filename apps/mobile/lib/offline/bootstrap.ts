import { useEffect } from "react";
import { seedOfflineCatalog } from "./product-cache";

/** Seed bundled catalog into MMKV on first launch for offline wishlist metadata */
export function useOfflineBootstrap(): void {
  useEffect(() => {
    seedOfflineCatalog();
  }, []);
}
