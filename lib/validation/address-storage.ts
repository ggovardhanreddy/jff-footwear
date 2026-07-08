import type { DeliveryAddress } from "@/types";

const ADDRESS_STORAGE_KEY = "jff-default-address";

export function loadSavedAddress(): DeliveryAddress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DeliveryAddress;
  } catch {
    return null;
  }
}

export function saveDefaultAddress(address: DeliveryAddress): void {
  if (typeof window === "undefined" || !address.isDefault) return;
  try {
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(address));
  } catch {
    // Ignore quota errors
  }
}
