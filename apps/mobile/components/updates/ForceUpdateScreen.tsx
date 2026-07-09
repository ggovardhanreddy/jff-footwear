import { Platform, Linking, BackHandler, View, Text, Pressable, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import Animated, { FadeIn } from "react-native-reanimated";
import type { AppRemoteConfig } from "@jff/config/app-remote-config";
import { getForceUpdateMessage } from "@/lib/remote-config/force-update";

interface ForceUpdateScreenProps {
  config: AppRemoteConfig;
  currentVersion: string;
}

export function ForceUpdateScreen({ config, currentVersion }: ForceUpdateScreenProps) {
  const storeUrl = Platform.OS === "ios" ? config.iosStoreUrl : config.androidStoreUrl;

  function handleUpdateNow() {
    void Linking.openURL(storeUrl);
  }

  function handleExit() {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
    }
  }

  return (
    <View className="flex-1 bg-brand-cream">
      <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />

      <Animated.View
        entering={FadeIn.duration(400)}
        className="flex-1 items-center justify-center px-8"
      >
        <View
          className="w-full max-w-sm items-center rounded-3xl border border-white/50 bg-white/90 p-8 shadow-2xl"
          style={styles.card}
        >
          <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-brand-accent/20">
            <Text style={{ fontSize: 40 }}>⬆️</Text>
          </View>

          <Text className="text-center text-2xl font-bold text-brand-black">Update Required</Text>

          <Text className="mt-4 text-center text-base leading-6 text-brand-muted">
            {getForceUpdateMessage(config)}
          </Text>

          <Text className="mt-4 text-center text-xs text-brand-muted">
            Current: v{currentVersion} · Required: v
            {config.forceUpdate ? config.latestVersion : config.minimumSupportedVersion}
          </Text>

          <Pressable
            onPress={handleUpdateNow}
            className="mt-8 w-full rounded-2xl bg-brand-black py-4 active:opacity-90"
          >
            <Text className="text-center text-base font-semibold text-white">Update Now</Text>
          </Pressable>

          {Platform.OS === "android" && (
            <Pressable onPress={handleExit} className="mt-3 w-full rounded-2xl py-4 active:opacity-70">
              <Text className="text-center text-base font-medium text-brand-muted">Exit App</Text>
            </Pressable>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#0a0a0a",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
});
