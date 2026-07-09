import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppState, View, StyleSheet } from "react-native";
import * as Application from "expo-application";
import type { AppRemoteConfig } from "@jff/config/app-remote-config";
import { ForceUpdateScreen } from "@/components/updates/ForceUpdateScreen";
import { loadRemoteAppConfig } from "./fetch-remote-config";
import {
  evaluateForceUpdate,
  type ForceUpdateEvaluation,
} from "./force-update";

interface ForceUpdateContextValue {
  evaluation: ForceUpdateEvaluation | null;
  config: AppRemoteConfig | null;
  isChecking: boolean;
  recheck: () => Promise<void>;
}

const ForceUpdateContext = createContext<ForceUpdateContextValue | null>(null);

export function ForceUpdateGate({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppRemoteConfig | null>(null);
  const [evaluation, setEvaluation] = useState<ForceUpdateEvaluation | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const currentVersion = Application.nativeApplicationVersion ?? "1.0.0";

  const runCheck = useCallback(async () => {
    if (__DEV__) return;

    setIsChecking(true);
    try {
      const remoteConfig = await loadRemoteAppConfig();
      setConfig(remoteConfig);
      setEvaluation(evaluateForceUpdate(currentVersion, remoteConfig));
    } catch {
      setEvaluation(null);
    } finally {
      setIsChecking(false);
    }
  }, [currentVersion]);

  useEffect(() => {
    void runCheck();
  }, [runCheck]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") void runCheck();
    });
    return () => sub.remove();
  }, [runCheck]);

  const value = useMemo<ForceUpdateContextValue>(
    () => ({
      evaluation,
      config,
      isChecking,
      recheck: runCheck,
    }),
    [evaluation, config, isChecking, runCheck]
  );

  const forceRequired = !__DEV__ && evaluation?.required === true;

  return (
    <ForceUpdateContext.Provider value={value}>
      {children}
      {forceRequired && evaluation && (
        <View style={StyleSheet.absoluteFill} pointerEvents="auto">
          <ForceUpdateScreen config={evaluation.config} currentVersion={currentVersion} />
        </View>
      )}
    </ForceUpdateContext.Provider>
  );
}

export function useForceUpdate(): ForceUpdateContextValue {
  const ctx = useContext(ForceUpdateContext);
  if (!ctx) throw new Error("useForceUpdate must be used within ForceUpdateGate");
  return ctx;
}
