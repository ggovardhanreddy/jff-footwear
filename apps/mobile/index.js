// Custom entry so Expo Router works in this monorepo (EAS Bundle JS).
// https://docs.expo.dev/router/reference/troubleshooting/
import "@expo/metro-runtime";
import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
