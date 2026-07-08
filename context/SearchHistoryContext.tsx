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

const STORAGE_KEY = "jff-search-history";
const MAX = 10;

interface SearchHistoryContextValue {
  recent: string[];
  add: (query: string) => void;
  clear: () => void;
}

const SearchHistoryContext =
  createContext<SearchHistoryContextValue | null>(null);

export function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const [recent, setRecent] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRecent(readStorage<string[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(STORAGE_KEY, recent);
  }, [recent, hydrated]);

  const add = useCallback((query: string) => {
    const q = query.trim();
    if (!q) return;
    setRecent((prev) => [q, ...prev.filter((r) => r !== q)].slice(0, MAX));
  }, []);

  const clear = useCallback(() => setRecent([]), []);

  const value = useMemo(
    () => ({ recent, add, clear }),
    [recent, add, clear]
  );

  return (
    <SearchHistoryContext.Provider value={value}>
      {children}
    </SearchHistoryContext.Provider>
  );
}

export function useSearchHistory(): SearchHistoryContextValue {
  const ctx = useContext(SearchHistoryContext);
  if (!ctx)
    throw new Error(
      "useSearchHistory must be used within SearchHistoryProvider"
    );
  return ctx;
}
