import { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import type { UpdateInfo } from "@/lib/updates/types";

interface UpdateModalProps {
  visible: boolean;
  info: UpdateInfo;
  onRestart: () => void;
  onLater: () => void;
  onDismiss: () => void;
}

function RocketIcon() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-brand-accent/20">
      <Text style={{ fontSize: 32 }}>🚀</Text>
    </Animated.View>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <View className="mt-4 h-2 w-full overflow-hidden rounded-full bg-brand-light">
      <Animated.View
        className="h-full rounded-full bg-brand-accent"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </View>
  );
}

function StatusContent({ info }: { info: UpdateInfo }) {
  switch (info.status) {
    case "checking":
      return (
        <>
          <ActivityIndicator size="large" color="#c8a96e" />
          <Text className="mt-4 text-center text-base text-brand-muted">
            Checking for updates…
          </Text>
        </>
      );
    case "downloading":
      return (
        <>
          <RocketIcon />
          <Text className="text-center text-lg font-semibold text-brand-black">
            Downloading update…
          </Text>
          <ProgressBar progress={info.progress} />
        </>
      );
    case "downloaded":
    case "update-ready":
      return (
        <>
          <RocketIcon />
          <Text className="text-center text-xl font-bold text-brand-black">
            🚀 New Update Ready
          </Text>
          <Text className="mt-3 text-center text-base leading-6 text-brand-muted">
            The latest improvements have been downloaded.{"\n"}
            Restart now to use the newest version.
          </Text>
        </>
      );
    case "up-to-date":
      return (
        <>
          <Text className="text-4xl">✓</Text>
          <Text className="mt-3 text-center text-lg font-semibold text-brand-black">
            You&apos;re up to date
          </Text>
          <Text className="mt-2 text-center text-sm text-brand-muted">
            JFF Footwear is running the latest version.
          </Text>
        </>
      );
    case "offline":
    case "network-unavailable":
      return (
        <>
          <Text className="text-4xl">📡</Text>
          <Text className="mt-3 text-center text-lg font-semibold text-brand-black">
            You&apos;re offline
          </Text>
          <Text className="mt-2 text-center text-sm text-brand-muted">
            Update check skipped. Will retry when online.
          </Text>
        </>
      );
    case "timeout":
      return (
        <>
          <Text className="text-4xl">⏱</Text>
          <Text className="mt-3 text-center text-lg font-semibold text-brand-black">
            Request timed out
          </Text>
          <Text className="mt-2 text-center text-sm text-brand-muted">
            Will retry automatically later.
          </Text>
        </>
      );
    case "recovery":
      return (
        <>
          <Text className="text-4xl">🔄</Text>
          <Text className="mt-3 text-center text-lg font-semibold text-brand-black">
            Update recovery
          </Text>
          <Text className="mt-2 text-center text-sm text-brand-muted">
            {info.errorMessage ??
              "A recent update could not be applied. You're running the last stable version."}
          </Text>
        </>
      );
    case "native-rebuild-required":
      return (
        <>
          <Text className="text-4xl">📲</Text>
          <Text className="mt-3 text-center text-lg font-semibold text-brand-black">
            App update required
          </Text>
          <Text className="mt-2 text-center text-sm text-brand-muted">
            {info.errorMessage ??
              "Please update JFF Footwear from the App Store or Google Play to continue receiving updates."}
          </Text>
        </>
      );
    case "error":
      return (
        <>
          <Text className="text-4xl">⚠️</Text>
          <Text className="mt-3 text-center text-lg font-semibold text-brand-black">
            Update failed
          </Text>
          <Text className="mt-2 text-center text-sm text-brand-muted">
            {info.errorMessage ?? "Something went wrong. Please try again later."}
          </Text>
        </>
      );
    default:
      return null;
  }
}

export function UpdateModal({
  visible,
  info,
  onRestart,
  onLater,
  onDismiss,
}: UpdateModalProps) {
  const showActions = info.status === "update-ready" || info.status === "downloaded";
  const showDismiss =
    info.status === "up-to-date" ||
    info.status === "error" ||
    info.status === "offline" ||
    info.status === "network-unavailable" ||
    info.status === "timeout" ||
    info.status === "recovery" ||
    info.status === "native-rebuild-required";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <Animated.View
        entering={FadeIn.duration(280)}
        exiting={FadeOut.duration(200)}
        style={StyleSheet.absoluteFill}
        className="items-center justify-center px-6"
      >
        <BlurView
          intensity={Platform.OS === "ios" ? 40 : 80}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
        <View
          style={styles.overlay}
          className="absolute inset-0 bg-brand-black/30"
        />

        <Animated.View
          entering={FadeIn.delay(80).duration(320)}
          className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/40 bg-white/85 p-6 shadow-2xl"
          style={styles.card}
        >
          <View className="items-center">
            <StatusContent info={info} />
          </View>

          {showActions && (
            <View className="mt-6 gap-3">
              <Pressable
                onPress={onRestart}
                className="rounded-2xl bg-brand-black py-4 active:opacity-90"
              >
                <Text className="text-center text-base font-semibold text-white">
                  Restart Now
                </Text>
              </Pressable>
              <Pressable
                onPress={onLater}
                className="rounded-2xl border border-brand-accent/50 bg-white/60 py-4 active:opacity-80"
              >
                <Text className="text-center text-base font-medium text-brand-black">
                  Later
                </Text>
              </Pressable>
            </View>
          )}

          {showDismiss && (
            <Pressable onPress={onDismiss} className="mt-6 rounded-2xl bg-brand-black py-4">
              <Text className="text-center text-base font-semibold text-white">OK</Text>
            </Pressable>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(10, 10, 10, 0.35)",
  },
  card: {
    shadowColor: "#0a0a0a",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
});
