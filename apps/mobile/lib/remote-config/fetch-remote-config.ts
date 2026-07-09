import Constants from "expo-constants";
import { z } from "zod";
import {
  DEFAULT_APP_REMOTE_CONFIG,
  REMOTE_APP_CONFIG_PATH,
  type AppRemoteConfig,
} from "@jff/config/app-remote-config";
import { storage } from "@/lib/storage";

const CACHE_KEY = "jff-remote-app-config";
const CACHE_TS_KEY = "jff-remote-app-config-ts";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const remoteConfigSchema = z.object({
  minimumSupportedVersion: z.string().min(1),
  latestVersion: z.string().min(1),
  forceUpdate: z.boolean(),
  message: z.string().optional(),
  iosStoreUrl: z.string().url(),
  androidStoreUrl: z.string().url(),
});

function getConfigUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_REMOTE_CONFIG_URL;
  if (explicit) return explicit;

  const base =
    process.env.EXPO_PUBLIC_WEB_ASSET_BASE_URL ??
    Constants.expoConfig?.extra?.webAssetBaseUrl ??
    "https://ggovardhanreddy.github.io/jff-footwear";

  return `${base.replace(/\/$/, "")}${REMOTE_APP_CONFIG_PATH}`;
}

function readCache(): AppRemoteConfig | null {
  const raw = storage.getString(CACHE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AppRemoteConfig;
    const result = remoteConfigSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

function writeCache(config: AppRemoteConfig): void {
  storage.set(CACHE_KEY, JSON.stringify(config));
  storage.set(CACHE_TS_KEY, String(Date.now()));
}

function isCacheFresh(): boolean {
  const ts = storage.getString(CACHE_TS_KEY);
  if (!ts) return false;
  return Date.now() - Number(ts) < CACHE_TTL_MS;
}

async function fetchRemoteConfig(): Promise<AppRemoteConfig | null> {
  const url = getConfigUrl();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json", "Cache-Control": "no-cache" },
    });

    if (!response.ok) return null;

    const json: unknown = await response.json();
    const result = remoteConfigSchema.safeParse(json);
    if (!result.success) return null;

    writeCache(result.data);
    return result.data;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Load remote app configuration.
 * Always attempts a network fetch; falls back to cache, then defaults.
 */
export async function loadRemoteAppConfig(options?: {
  preferCache?: boolean;
}): Promise<AppRemoteConfig> {
  if (options?.preferCache && isCacheFresh()) {
    const cached = readCache();
    if (cached) return cached;
  }

  const remote = await fetchRemoteConfig();
  if (remote) return remote;

  const cached = readCache();
  if (cached) return cached;

  return DEFAULT_APP_REMOTE_CONFIG;
}

export function getCachedRemoteConfig(): AppRemoteConfig {
  return readCache() ?? DEFAULT_APP_REMOTE_CONFIG;
}

export { getConfigUrl };
