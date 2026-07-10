import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (browserClient) return browserClient;

  browserClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );
  return browserClient;
}

export async function invokeEdgeFunction<T>(
  name: string,
  body: unknown
): Promise<{ data: T | null; error: string | null }> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return { data: null, error: "Supabase is not configured" };
  }

  const { data, error } = await client.functions.invoke(name, {
    body: body as Record<string, unknown>,
  });
  if (error) return { data: null, error: error.message };
  return { data: data as T, error: null };
}
