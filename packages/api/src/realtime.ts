import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";

export type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

export type SubscribeTableOptions = {
  /** Unique channel name suffix (defaults to table) */
  channelName?: string;
  event?: RealtimeEvent;
  filter?: string;
  onChange: () => void;
};

/**
 * Subscribe to postgres_changes on a public table.
 * Returns an unsubscribe function. No-ops if client is null.
 */
export function subscribeTable(
  client: SupabaseClient | null,
  table: string,
  options: SubscribeTableOptions
): () => void {
  if (!client) return () => undefined;

  const event = options.event ?? "*";
  const channelName = options.channelName ?? `jff:${table}`;

  const channel: RealtimeChannel = client
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event,
        schema: "public",
        table,
        ...(options.filter ? { filter: options.filter } : {}),
      },
      () => {
        options.onChange();
      }
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}

/**
 * Subscribe to multiple tables; any change triggers onChange once (debounced lightly).
 */
export function subscribeTables(
  client: SupabaseClient | null,
  tables: string[],
  onChange: () => void,
  debounceMs = 150
): () => void {
  if (!client || !tables.length) return () => undefined;

  let timer: ReturnType<typeof setTimeout> | null = null;
  const flush = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      onChange();
    }, debounceMs);
  };

  const unsubs = tables.map((table, index) =>
    subscribeTable(client, table, {
      channelName: `jff:multi:${table}:${index}`,
      onChange: flush,
    })
  );

  return () => {
    if (timer) clearTimeout(timer);
    unsubs.forEach((u) => u());
  };
}
