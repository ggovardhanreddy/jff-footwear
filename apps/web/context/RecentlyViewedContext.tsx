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

const STORAGE_KEY = "jff-recently-viewed";
const MAX_ITEMS = 12;

export interface RecentlyViewedItem {
  slug: string;
  name: string;
  image: string;
  viewedAt: number;
}

interface RecentlyViewedContextValue {
  items: RecentlyViewedItem[];
  track: (item: Omit<RecentlyViewedItem, "viewedAt">) => void;
  clear: () => void;
}

const RecentlyViewedContext =
  createContext<RecentlyViewedContextValue | null>(null);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStorage<RecentlyViewedItem[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(STORAGE_KEY, items);
  }, [items, hydrated]);

  const track = useCallback(
    (item: Omit<RecentlyViewedItem, "viewedAt">) => {
      setItems((prev) => {
        const filtered = prev.filter((i) => i.slug !== item.slug);
        return [{ ...item, viewedAt: Date.now() }, ...filtered].slice(
          0,
          MAX_ITEMS
        );
      });
    },
    []
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, track, clear }),
    [items, track, clear]
  );

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed(): RecentlyViewedContextValue {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx)
    throw new Error(
      "useRecentlyViewed must be used within RecentlyViewedProvider"
    );
  return ctx;
}
