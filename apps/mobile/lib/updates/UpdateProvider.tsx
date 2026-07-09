import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState, type AppStateStatus } from "react-native";
import * as Updates from "expo-updates";
import { UpdateModal } from "@/components/updates/UpdateModal";
import { useForceUpdate } from "@/lib/remote-config";
import {
  OTA_CHECK_INTERVAL_MS,
  OTA_LAUNCH_DELAY_MS,
} from "./constants";
import {
  applyUpdateNow,
  checkAndDownloadUpdate,
  isUpdateReadyStored,
  markUpdatePostponed,
  getLastChecked,
  getStoredReleaseNotes,
  wasUpdatePostponed,
  clearUpdatePostponed,
  clearUpdateReady,
} from "./update-manager";
import { isEmergencyLaunchActive } from "./native-detection";
import { INITIAL_UPDATE_INFO, type UpdateInfo } from "./types";

interface UpdateContextValue {
  info: UpdateInfo;
  checkForUpdates: (manual?: boolean) => Promise<void>;
  restartNow: () => Promise<void>;
  postponeRestart: () => void;
  dismissStatus: () => void;
}

const UpdateContext = createContext<UpdateContextValue | null>(null);

export function UpdateProvider({ children }: { children: React.ReactNode }) {
  const { evaluation: forceEvaluation } = useForceUpdate();
  const forceBlocked = forceEvaluation?.required === true;
  const [info, setInfo] = useState<UpdateInfo>({
    ...INITIAL_UPDATE_INFO,
    lastChecked: getLastChecked(),
    channel: Updates.channel ?? null,
  });
  const [showModal, setShowModal] = useState(false);

  const appState = useRef(AppState.currentState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCheckingRef = useRef(false);

  const updateInfo = useCallback((patch: Partial<UpdateInfo>) => {
    setInfo((prev) => ({ ...prev, ...patch }));
  }, []);

  const runCheck = useCallback(
    async (manual = false) => {
      if (isCheckingRef.current || forceBlocked) return;
      if (__DEV__ || !Updates.isEnabled) {
        updateInfo({ status: "up-to-date", isManualCheck: manual });
        return;
      }

      isCheckingRef.current = true;
      updateInfo({ isManualCheck: manual, errorMessage: null });

      if (manual) {
        setShowModal(true);
      }

      const result = await checkAndDownloadUpdate({
        manual,
        onProgress: (progress) => updateInfo({ progress }),
        onStatusChange: (status) => updateInfo({ status }),
      });

      updateInfo({
        status: result.status,
        errorMessage: result.errorMessage ?? null,
        lastChecked: getLastChecked(),
        channel: Updates.channel ?? null,
        bundleId: Updates.updateId ?? null,
        runtimeVersion: Updates.runtimeVersion ?? null,
        releaseNotes: result.releaseNotes ?? getStoredReleaseNotes(),
      });

      if (result.status === "update-ready" || result.status === "downloaded") {
        setShowModal(true);
      } else if (
        manual ||
        result.status === "recovery" ||
        result.status === "native-rebuild-required"
      ) {
        setShowModal(true);
      }

      isCheckingRef.current = false;
    },
    [updateInfo, forceBlocked]
  );

  const restartNow = useCallback(async () => {
    setShowModal(false);
    await applyUpdateNow();
  }, []);

  const postponeRestart = useCallback(() => {
    markUpdatePostponed();
    setShowModal(false);
    updateInfo({ status: "idle", progress: 0 });
  }, [updateInfo]);

  const dismissStatus = useCallback(() => {
    setShowModal(false);
    if (info.status === "up-to-date" || info.status === "error" || info.status === "offline" || info.status === "timeout") {
      updateInfo({ status: "idle", progress: 0, errorMessage: null });
    }
  }, [info.status, updateInfo]);

  // Launch check — async, non-blocking
  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled || forceBlocked) return;

    const timer = setTimeout(() => {
      if (isEmergencyLaunchActive()) {
        updateInfo({ status: "recovery", progress: 0 });
        setShowModal(true);
        return;
      }

      // User chose "Later" — expo applies downloaded bundle on cold start silently
      if (wasUpdatePostponed()) {
        clearUpdatePostponed();
        clearUpdateReady();
        return;
      }
      if (isUpdateReadyStored()) {
        updateInfo({ status: "update-ready", progress: 100 });
        setShowModal(true);
        return;
      }
      void runCheck(false);
    }, OTA_LAUNCH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [runCheck, updateInfo, forceBlocked]);

  // App resume check
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      const wasBackground =
        appState.current === "background" || appState.current === "inactive";
      appState.current = next;

      if (wasBackground && next === "active" && !forceBlocked) {
        if (isUpdateReadyStored()) {
          updateInfo({ status: "update-ready", progress: 100 });
          setShowModal(true);
        } else {
          void runCheck(false);
        }
      }
    });
    return () => sub.remove();
  }, [runCheck, updateInfo, forceBlocked]);

  // Periodic background check every 6 hours while app is open
  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled || forceBlocked) return;

    intervalRef.current = setInterval(() => {
      if (AppState.currentState === "active") {
        void runCheck(false);
      }
    }, OTA_CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [runCheck, forceBlocked]);

  const value = useMemo<UpdateContextValue>(
    () => ({
      info,
      checkForUpdates: runCheck,
      restartNow,
      postponeRestart,
      dismissStatus,
    }),
    [info, runCheck, restartNow, postponeRestart, dismissStatus]
  );

  return (
    <UpdateContext.Provider value={value}>
      {children}
      <UpdateModal
        visible={showModal}
        info={info}
        onRestart={restartNow}
        onLater={postponeRestart}
        onDismiss={dismissStatus}
      />
    </UpdateContext.Provider>
  );
}

export function useUpdates(): UpdateContextValue {
  const ctx = useContext(UpdateContext);
  if (!ctx) throw new Error("useUpdates must be used within UpdateProvider");
  return ctx;
}
