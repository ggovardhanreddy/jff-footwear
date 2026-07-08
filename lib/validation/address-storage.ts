import type { DeliveryAddress } from "@/types";
import { EMPTY_DELIVERY_ADDRESS } from "@/lib/validation/address";

const ADDRESS_STORAGE_KEY = "jff-default-address";

export function loadSavedAddress(): DeliveryAddress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DeliveryAddress>;
    return { ...EMPTY_DELIVERY_ADDRESS, ...parsed };
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
