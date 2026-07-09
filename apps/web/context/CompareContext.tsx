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
import type { Product } from "@/types";

const STORAGE_KEY = "jff-compare";
const MAX_COMPARE = 4;

interface CompareContextValue {
  slugs: string[];
  count: number;
  isComparing: (slug: string) => boolean;
  toggle: (product: Product) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSlugs(readStorage<string[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(STORAGE_KEY, slugs);
  }, [slugs, hydrated]);

  const isComparing = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs]
  );

  const toggle = useCallback((product: Product) => {
    setSlugs((prev) => {
      if (prev.includes(product.slug))
        return prev.filter((s) => s !== product.slug);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, product.slug];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const clear = useCallback(() => setSlugs([]), []);

  const value = useMemo(
    () => ({
      slugs,
      count: slugs.length,
      isComparing,
      toggle,
      remove,
      clear,
    }),
    [slugs, isComparing, toggle, remove, clear]
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
