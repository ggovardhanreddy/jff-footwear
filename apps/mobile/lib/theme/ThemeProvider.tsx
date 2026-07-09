import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Appearance, type ColorSchemeName } from "react-native";
import { useColorScheme } from "nativewind";
import * as SplashScreen from "expo-splash-screen";
import { storageKeys } from "@jff/hooks";
import { storage } from "@/lib/storage";
import type { ResolvedTheme } from "@jff/ui/brand";

export type ThemePreference = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: ThemePreference;
  resolved: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

SplashScreen.preventAutoHideAsync().catch(() => {});

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === "system") {
    const system = Appearance.getColorScheme();
    return system === "dark" ? "dark" : "light";
  }
  return preference;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { setColorScheme } = useColorScheme();
  const [theme, setThemeState] = useState<ThemePreference>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = storage.getString(storageKeys.theme) as ThemePreference | undefined;
    if (stored === "light" || stored === "dark" || stored === "system") {
      setThemeState(stored);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const next = resolveTheme(theme);
    setResolved(next);
    setColorScheme(next);
    storage.set(storageKeys.theme, theme);
    SplashScreen.hideAsync().catch(() => {});
  }, [theme, ready, setColorScheme]);

  useEffect(() => {
    if (theme !== "system") return;
    const handler = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      const next = colorScheme === "dark" ? "dark" : "light";
      setResolved(next);
      setColorScheme(next);
    };
    const sub = Appearance.addChangeListener(handler);
    return () => sub.remove();
  }, [theme, setColorScheme]);

  const setTheme = useCallback((next: ThemePreference) => setThemeState(next), []);

  const value = useMemo(
    () => ({ theme, resolved, setTheme }),
    [theme, resolved, setTheme]
  );

  if (!ready) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
