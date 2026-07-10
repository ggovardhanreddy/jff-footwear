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

  if (error) {
    let message = error.message || "Edge Function request failed";
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === "function") {
      try {
        const payload = (await ctx.json()) as { error?: string; message?: string };
        if (payload?.error) message = String(payload.error);
        else if (payload?.message) message = String(payload.message);
      } catch {
        /* keep default message */
      }
    }
    // Some clients still put the error body on data
    if (message.includes("non-2xx") && data && typeof data === "object") {
      const payload = data as { error?: string; message?: string };
      if (payload.error) message = String(payload.error);
      else if (payload.message) message = String(payload.message);
    }
    return { data: (data as T) ?? null, error: message };
  }

  if (
    data &&
    typeof data === "object" &&
    "error" in (data as object) &&
    !(data as T & { analysis?: unknown }).analysis
  ) {
    return { data: data as T, error: String((data as { error: string }).error) };
  }

  return { data: data as T, error: null };
}
