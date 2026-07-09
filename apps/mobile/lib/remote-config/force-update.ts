import type { AppRemoteConfig } from "@jff/config/app-remote-config";
import { isVersionBelow } from "@jff/utils/version";

export interface ForceUpdateEvaluation {
  required: boolean;
  reason: "below_minimum" | "force_flag" | null;
  currentVersion: string;
  config: AppRemoteConfig;
}

/**
 * Determine if a store update is required (blocks app usage).
 * OTA updates handle JS/UI changes; this is for native store builds only.
 */
export function evaluateForceUpdate(
  currentVersion: string,
  config: AppRemoteConfig
): ForceUpdateEvaluation {
  const base = {
    required: false as boolean,
    reason: null as ForceUpdateEvaluation["reason"],
    currentVersion,
    config,
  };

  if (!currentVersion) return base;

  if (isVersionBelow(currentVersion, config.minimumSupportedVersion)) {
    return { ...base, required: true, reason: "below_minimum" };
  }

  if (config.forceUpdate && isVersionBelow(currentVersion, config.latestVersion)) {
    return { ...base, required: true, reason: "force_flag" };
  }

  return base;
}

export function getForceUpdateMessage(config: AppRemoteConfig): string {
  return (
    config.message ??
    "A newer version of JFF Footwear is required to continue using the app."
  );
}
