import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { storage } from "@/lib/storage";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isMobileSupabaseConfigured(): boolean {
  return Boolean(url && anon);
}

const mmkvAuthStorage = {
  getItem: (key: string) => {
    return storage.getString(key) ?? null;
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};

let client: SupabaseClient | null = null;

export function getMobileSupabase(): SupabaseClient | null {
  if (!isMobileSupabaseConfigured()) return null;
  if (client) return client;

  client = createClient(url, anon, {
    auth: {
      storage: mmkvAuthStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  return client;
}
