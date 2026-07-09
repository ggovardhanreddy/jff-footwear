export const OTA_STORAGE_KEYS = {
  lastChecked: "jff-ota-last-checked",
  updateReady: "jff-ota-update-ready",
  postponed: "jff-ota-update-postponed",
  releaseNotes: "jff-ota-release-notes",
} as const;

export const OTA_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000;
export const OTA_LAUNCH_DELAY_MS = 1_500;
export const OTA_FETCH_TIMEOUT_MS = 45_000;
