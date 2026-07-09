export { UpdateProvider, useUpdates } from "./UpdateProvider";
export type { UpdateStatus, UpdateInfo } from "./types";
export {
  checkAndDownloadUpdate,
  getLastChecked,
  isOnline,
  applyUpdateNow,
} from "./update-manager";
export {
  getOtaDiagnostics,
  isEmergencyLaunchActive,
  hasRuntimeVersionMismatch,
  NATIVE_CHANGE_PATHS,
} from "./native-detection";
export { logOtaEvent } from "./analytics";
