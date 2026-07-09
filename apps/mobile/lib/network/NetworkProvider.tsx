import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AppState, type AppStateStatus } from "react-native";
import * as Network from "expo-network";

interface NetworkContextValue {
  isOnline: boolean;
  isInternetReachable: boolean | null;
  refresh: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

async function readNetworkState(): Promise<{
  isOnline: boolean;
  isInternetReachable: boolean | null;
}> {
  try {
    const state = await Network.getNetworkStateAsync();
    const connected = state.isConnected ?? false;
    const reachable = state.isInternetReachable ?? null;
    return {
      isOnline: connected && reachable !== false,
      isInternetReachable: reachable,
    };
  } catch {
    return { isOnline: true, isInternetReachable: null };
  }
}

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);

  const refresh = useCallback(async () => {
    const next = await readNetworkState();
    setIsOnline(next.isOnline);
    setIsInternetReachable(next.isInternetReachable);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 15_000);

    const onAppState = (state: AppStateStatus) => {
      if (state === "active") refresh();
    };
    const sub = AppState.addEventListener("change", onAppState);

    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, [refresh]);

  const value = useMemo(
    () => ({ isOnline, isInternetReachable, refresh }),
    [isOnline, isInternetReachable, refresh]
  );

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork(): NetworkContextValue {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
}
