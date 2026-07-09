import * as Network from "expo-network";
import * as Updates from "expo-updates";
import { storage } from "@/lib/storage";
import { logOtaEvent } from "./analytics";
import { OTA_FETCH_TIMEOUT_MS, OTA_STORAGE_KEYS } from "./constants";
import {
  getOtaDiagnostics,
  hasRuntimeVersionMismatch,
  isEmergencyLaunchActive,
} from "./native-detection";
import type { UpdateStatus } from "./types";

export interface UpdateCheckResult {
  status: UpdateStatus;
  errorMessage?: string;
  releaseNotes?: string | null;
}

function isUpdatesEnabled(): boolean {
  return !__DEV__ && Updates.isEnabled;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Update check timed out")), ms)
    ),
  ]);
}

export function getLastChecked(): string | null {
  return storage.getString(OTA_STORAGE_KEYS.lastChecked) ?? null;
}

export function getStoredReleaseNotes(): string | null {
  return storage.getString(OTA_STORAGE_KEYS.releaseNotes) ?? null;
}

function setLastChecked(): void {
  storage.set(OTA_STORAGE_KEYS.lastChecked, new Date().toISOString());
}

export function markUpdateReady(notes?: string): void {
  storage.set(OTA_STORAGE_KEYS.updateReady, "true");
  if (notes) storage.set(OTA_STORAGE_KEYS.releaseNotes, notes);
}

export function clearUpdateReady(): void {
  storage.delete(OTA_STORAGE_KEYS.updateReady);
}

export function isUpdateReadyStored(): boolean {
  return storage.getString(OTA_STORAGE_KEYS.updateReady) === "true";
}

export function wasUpdatePostponed(): boolean {
  return storage.getString(OTA_STORAGE_KEYS.postponed) === "true";
}

export function markUpdatePostponed(): void {
  storage.set(OTA_STORAGE_KEYS.postponed, "true");
  logOtaEvent("restart_later", {
    channel: Updates.channel,
    runtimeVersion: Updates.runtimeVersion,
    updateId: Updates.updateId,
  });
}

export function clearUpdatePostponed(): void {
  storage.delete(OTA_STORAGE_KEYS.postponed);
}

export async function isOnline(): Promise<boolean> {
  try {
    const state = await Network.getNetworkStateAsync();
    return Boolean(state.isConnected && state.isInternetReachable !== false);
  } catch {
    return false;
  }
}

export async function applyUpdateNow(): Promise<void> {
  logOtaEvent("restart_accepted", {
    channel: Updates.channel,
    runtimeVersion: Updates.runtimeVersion,
    updateId: Updates.updateId,
  });
  clearUpdateReady();
  clearUpdatePostponed();
  await Updates.reloadAsync();
}

function extractReleaseNotes(): string | null {
  const manifest = Updates.manifest as { metadata?: { message?: string } } | null;
  return manifest?.metadata?.message ?? getStoredReleaseNotes();
}

export async function checkAndDownloadUpdate(options: {
  manual?: boolean;
  onProgress?: (progress: number) => void;
  onStatusChange?: (status: UpdateStatus) => void;
}): Promise<UpdateCheckResult> {
  const { manual = false, onProgress, onStatusChange } = options;

  if (!isUpdatesEnabled()) {
    onStatusChange?.("up-to-date");
    return { status: "up-to-date" };
  }

  if (isEmergencyLaunchActive()) {
    logOtaEvent("emergency_launch", getOtaDiagnostics());
    onStatusChange?.("recovery");
    return {
      status: "recovery",
      errorMessage:
        "A recent update could not be applied. You're on the last stable version.",
    };
  }

  if (hasRuntimeVersionMismatch()) {
    logOtaEvent("runtime_mismatch", getOtaDiagnostics());
    onStatusChange?.("native-rebuild-required");
    return {
      status: "native-rebuild-required",
      errorMessage:
        "This app version requires an update from the App Store or Google Play.",
    };
  }

  const online = await isOnline();
  if (!online) {
    logOtaEvent("network_unavailable", { manual, channel: Updates.channel });
    onStatusChange?.("offline");
    return { status: "offline" };
  }

  try {
    onStatusChange?.("checking");
    logOtaEvent("update_check", {
      manual,
      channel: Updates.channel,
      runtimeVersion: Updates.runtimeVersion,
    });

    const checkResult = await withTimeout(Updates.checkForUpdateAsync(), OTA_FETCH_TIMEOUT_MS);
    setLastChecked();

    if (!checkResult.isAvailable) {
      onProgress?.(100);
      onStatusChange?.("up-to-date");
      return { status: "up-to-date" };
    }

    logOtaEvent("update_available", { manual, channel: Updates.channel });
    logOtaEvent("download_started", { manual, channel: Updates.channel });

    onStatusChange?.("downloading");
    onProgress?.(20);

    let progress = 20;
    const progressTimer = setInterval(() => {
      progress = Math.min(90, progress + 5);
      onProgress?.(progress);
    }, 300);

    try {
      await withTimeout(Updates.fetchUpdateAsync(), OTA_FETCH_TIMEOUT_MS);
    } finally {
      clearInterval(progressTimer);
    }

    const notes = extractReleaseNotes();
    onProgress?.(100);
    onStatusChange?.("downloaded");
    markUpdateReady(notes ?? undefined);

    logOtaEvent("download_completed", {
      manual,
      channel: Updates.channel,
      updateId: Updates.updateId,
    });

    onStatusChange?.("update-ready");
    return { status: "update-ready", releaseNotes: notes };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    const isTimeout = message.includes("timed out");
    logOtaEvent(isTimeout ? "timeout" : "update_failed", {
      manual,
      channel: Updates.channel,
      message,
    });
    onStatusChange?.(isTimeout ? "timeout" : "error");
    return {
      status: isTimeout ? "timeout" : "error",
      errorMessage: isTimeout ? "Update timed out. Will retry later." : message,
    };
  }
}
