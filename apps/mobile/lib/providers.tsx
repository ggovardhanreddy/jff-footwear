import React, { useState, useEffect, useCallback, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { CartItem } from "@jff/types";
import { getJson, setJson, storageKeys } from "@/lib/storage";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { NetworkProvider } from "@/lib/network/NetworkProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 2,
    },
  },
});

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  count: number;
}

interface WishlistContextValue {
  slugs: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
}

export const CartContext = React.createContext<CartContextValue | null>(null);
export const WishlistContext = React.createContext<WishlistContextValue | null>(null);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => getJson(storageKeys.cart, []));
  const [slugs, setSlugs] = useState<string[]>(() => getJson(storageKeys.wishlist, []));

  useEffect(() => {
    setJson(storageKeys.cart, items);
  }, [items]);

  useEffect(() => {
    setJson(storageKeys.wishlist, slugs);
  }, [slugs]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
        return next;
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const toggleWishlist = useCallback((slug: string) => {
    setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const cartValue = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      count: items.reduce((n, i) => n + i.quantity, 0),
    }),
    [items, addItem, removeItem, updateQuantity, clear]
  );

  const wishlistValue = useMemo<WishlistContextValue>(
    () => ({
      slugs,
      toggle: toggleWishlist,
      has: (slug: string) => slugs.includes(slug),
    }),
    [slugs, toggleWishlist]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NetworkProvider>
            <QueryClientProvider client={queryClient}>
              <CartContext.Provider value={cartValue}>
                <WishlistContext.Provider value={wishlistValue}>
                  {children}
                </WishlistContext.Provider>
              </CartContext.Provider>
            </QueryClientProvider>
          </NetworkProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within AppProviders");
  return ctx;
}

export function useWishlist() {
  const ctx = React.useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within AppProviders");
  return ctx;
}
