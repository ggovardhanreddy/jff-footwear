export type UpdateStatus =
  | "idle"
  | "checking"
  | "downloading"
  | "downloaded"
  | "update-ready"
  | "up-to-date"
  | "offline"
  | "network-unavailable"
  | "timeout"
  | "error"
  | "recovery"
  | "native-rebuild-required";

export interface UpdateInfo {
  status: UpdateStatus;
  progress: number;
  errorMessage: string | null;
  lastChecked: string | null;
  channel: string | null;
  bundleId: string | null;
  runtimeVersion: string | null;
  releaseNotes: string | null;
  isManualCheck: boolean;
}

export const INITIAL_UPDATE_INFO: UpdateInfo = {
  status: "idle",
  progress: 0,
  errorMessage: null,
  lastChecked: null,
  channel: null,
  bundleId: null,
  runtimeVersion: null,
  releaseNotes: null,
  isManualCheck: false,
};
