"use client";

import { useEffect, useRef } from "react";
import { getSupabaseBrowserClient, subscribeTables } from "@jff/api";

/**
 * Re-run `onRefresh` whenever any of the listed tables change via Supabase Realtime.
 * `tables` is compared by joined key; pass a stable `onRefresh` (e.g. useCallback).
 */
export function useRealtimeRefresh(tables: string[], onRefresh: () => void) {
  const tablesKey = tables.join(",");
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    const list = tablesKey.split(",").filter(Boolean);
    return subscribeTables(client, list, () => {
      onRefreshRef.current();
    });
  }, [tablesKey]);
}
