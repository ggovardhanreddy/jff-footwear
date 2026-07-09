import * as Updates from "expo-updates";

/** Paths that require a native rebuild instead of OTA (mirrors CI deploy-main.yml). */
export const NATIVE_CHANGE_PATHS = [
  "apps/mobile/app.config.ts",
  "apps/mobile/eas.json",
  "apps/mobile/package.json",
  "apps/mobile/babel.config.js",
  "apps/mobile/metro.config.js",
  "apps/mobile/assets/",
  "apps/mobile/ios/",
  "apps/mobile/android/",
  "package-lock.json",
] as const;

export interface OtaDiagnostics {
  isEnabled: boolean;
  isEmergencyLaunch: boolean;
  isEmbeddedLaunch: boolean;
  runtimeVersion: string | null;
  channel: string | null;
  updateId: string | null;
  manifestRuntimeVersion: string | null;
}

export function getOtaDiagnostics(): OtaDiagnostics {
  const manifest = Updates.manifest as
    | { runtimeVersion?: string; metadata?: Record<string, unknown> }
    | null;

  return {
    isEnabled: Updates.isEnabled,
    isEmergencyLaunch: Updates.isEmergencyLaunch,
    isEmbeddedLaunch: Updates.isEmbeddedLaunch,
    runtimeVersion: Updates.runtimeVersion ?? null,
    channel: Updates.channel ?? null,
    updateId: Updates.updateId ?? null,
    manifestRuntimeVersion:
      typeof manifest?.runtimeVersion === "string" ? manifest.runtimeVersion : null,
  };
}

/**
 * True when the app recovered from a failed OTA load (rolled back to embedded bundle).
 * User should restart; if persistent, a native store update may be required.
 */
export function isEmergencyLaunchActive(): boolean {
  return !__DEV__ && Updates.isEnabled && Updates.isEmergencyLaunch;
}

/**
 * Runtime mismatch between embedded app and downloaded manifest —
 * Expo normally prevents applying incompatible updates server-side.
 */
export function hasRuntimeVersionMismatch(): boolean {
  const { runtimeVersion, manifestRuntimeVersion } = getOtaDiagnostics();
  if (!runtimeVersion || !manifestRuntimeVersion) return false;
  return runtimeVersion !== manifestRuntimeVersion;
}
