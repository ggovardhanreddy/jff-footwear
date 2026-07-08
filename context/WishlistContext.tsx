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
import { readStorage, writeStorage } from "@/lib/storage";
import { getProductPricing } from "@/lib/pricing";
import { getProductMainImage } from "@/lib/utils";
import type { CartItem, Product } from "@/types";

const STORAGE_KEY = "jff-wishlist";

export interface WishlistItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  color: string;
  pricing: CartItem["pricing"];
  savedAt: number;
}

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  isWishlisted: (slug: string) => boolean;
  toggle: (product: Product) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function toWishlistItem(product: Product): WishlistItem {
  return {
    id: product.slug,
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: getProductMainImage(product),
    color: product.color,
    pricing: getProductPricing(product),
    savedAt: Date.now(),
  };
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStorage<WishlistItem[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(STORAGE_KEY, items);
  }, [items, hydrated]);

  const isWishlisted = useCallback(
    (slug: string) => items.some((i) => i.slug === slug),
    [items]
  );

  const toggle = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.slug === product.slug);
      if (exists) return prev.filter((i) => i.slug !== product.slug);
      return [toWishlistItem(product), ...prev];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      isWishlisted,
      toggle,
      remove,
      clear,
    }),
    [items, isWishlisted, toggle, remove, clear]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
