import { useState } from "react";
import { ScrollView, Text, View, Pressable, ActivityIndicator, Modal } from "react-native";
import * as Application from "expo-application";
import * as Updates from "expo-updates";
import { useUpdates } from "@/lib/updates/UpdateProvider";
import { getLastChecked, getStoredReleaseNotes } from "@/lib/updates/update-manager";
import { useTheme, type ThemePreference } from "@/lib/theme/ThemeProvider";
import ScreenShell from "@/components/ScreenShell";
import {
  getStoredPushToken,
  registerForPushNotifications,
  scheduleLocalNotification,
} from "@/lib/notifications";

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between border-b border-brand-light py-4 dark:border-white/10">
      <Text className="text-sm text-brand-muted dark:text-zinc-400">{label}</Text>
      <Text className="max-w-[60%] text-right text-sm font-medium text-brand-black dark:text-white">
        {value}
      </Text>
    </View>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  try {
    return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export default function SettingsScreen() {
  const { info, checkForUpdates } = useUpdates();
  const { theme, setTheme } = useTheme();
  const [showNotes, setShowNotes] = useState(false);
  const [lastChecked, setLastChecked] = useState(getLastChecked());
  const [pushToken, setPushToken] = useState(getStoredPushToken());

  const appVersion = Application.nativeApplicationVersion ?? "1.0.0";
  const buildNumber = Application.nativeBuildVersion ?? "—";
  const channel = Updates.channel ?? (__DEV__ ? "development" : "production");
  const runtimeVersion = Updates.runtimeVersion ?? "—";
  const bundleId = Updates.updateId ?? info.bundleId ?? "—";
  const releaseNotes =
    info.releaseNotes ?? getStoredReleaseNotes() ?? "No release notes available.";

  const isChecking = info.status === "checking" || info.status === "downloading";

  async function handleCheck() {
    await checkForUpdates(true);
    setLastChecked(getLastChecked());
  }

  async function handleEnableNotifications() {
    const token = await registerForPushNotifications();
    setPushToken(token);
  }

  async function handleTestNotification() {
    await scheduleLocalNotification({
      title: "JFF Footwear",
      body: "Push notifications are working on this device.",
      category: "announcement",
      data: { path: "/products" },
    });
  }

  return (
    <ScreenShell>
      <ScrollView className="flex-1 px-5 pt-4">
        <Text className="mb-2 text-2xl font-semibold text-brand-black dark:text-white">
          Settings
        </Text>

        <Text className="mb-2 text-sm font-medium text-brand-muted dark:text-zinc-400">
          Appearance
        </Text>
        <View className="mb-6 flex-row gap-2">
          {THEME_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => setTheme(opt.value)}
              className={`flex-1 rounded-2xl py-3 ${
                theme === opt.value
                  ? "bg-brand-blue dark:bg-brand-blue-dark"
                  : "bg-white dark:bg-white/10"
              }`}
            >
              <Text
                className={`text-center text-sm font-semibold ${
                  theme === opt.value ? "text-white" : "text-brand-black dark:text-white"
                }`}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="mb-2 text-sm font-medium text-brand-muted dark:text-zinc-400">
          Notifications
        </Text>
        <View className="mb-6 overflow-hidden rounded-2xl bg-white px-4 dark:bg-white/10">
          <InfoRow
            label="Push Status"
            value={pushToken ? "Enabled" : "Not enabled"}
          />
          {!pushToken ? (
            <Pressable onPress={handleEnableNotifications} className="py-4">
              <Text className="text-center font-semibold text-brand-blue dark:text-brand-blue-dark">
                Enable Push Notifications
              </Text>
            </Pressable>
          ) : (
            <Pressable onPress={handleTestNotification} className="py-4">
              <Text className="text-center font-medium text-brand-black dark:text-white">
                Send Test Notification
              </Text>
            </Pressable>
          )}
        </View>

        <View className="mb-6 overflow-hidden rounded-2xl bg-white px-4 dark:bg-white/10">
          <InfoRow label="App Version" value={appVersion} />
          <InfoRow label="Build Number" value={String(buildNumber)} />
          <InfoRow label="OTA Channel" value={channel} />
          <InfoRow label="Runtime Version" value={runtimeVersion} />
          <InfoRow
            label="Bundle Version"
            value={bundleId.length > 16 ? bundleId.slice(0, 16) + "…" : bundleId}
          />
          <InfoRow label="Last Update Check" value={formatDate(lastChecked)} />
        </View>

        <Pressable
          onPress={handleCheck}
          disabled={isChecking}
          className={`mb-3 rounded-2xl py-4 ${isChecking ? "bg-brand-muted/30" : "bg-brand-black dark:bg-brand-blue"}`}
        >
          {isChecking ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center font-semibold text-white">Check for Updates</Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => setShowNotes(true)}
          className="mb-8 rounded-2xl border border-brand-blue py-4 dark:border-brand-blue-dark"
        >
          <Text className="text-center font-medium text-brand-black dark:text-white">
            View Release Notes
          </Text>
        </Pressable>
      </ScrollView>

      <Modal visible={showNotes} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-brand-black/40 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 dark:bg-zinc-900">
            <Text className="text-lg font-bold text-brand-black dark:text-white">
              Release Notes
            </Text>
            <Text className="mt-4 text-base leading-6 text-brand-muted dark:text-zinc-300">
              {releaseNotes}
            </Text>
            <Pressable
              onPress={() => setShowNotes(false)}
              className="mt-6 rounded-2xl bg-brand-black py-3 dark:bg-brand-blue"
            >
              <Text className="text-center font-semibold text-white">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenShell>
  );
}
