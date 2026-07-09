"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions {
  pageSize?: number;
  total: number;
}

export function useInfiniteScroll<T>(
  items: T[],
  { pageSize = 12, total }: UseInfiniteScrollOptions
) {
  const [visible, setVisible] = useState(pageSize);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    setVisible((v) => Math.min(v + pageSize, total));
  }, [pageSize, total]);

  useEffect(() => {
    setVisible(pageSize);
  }, [items, pageSize]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visible >= total) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, total, loadMore]);

  return {
    visibleItems: items.slice(0, visible),
    hasMore: visible < total,
    sentinelRef,
    loadMore,
  };
}
