import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { storageKeys } from "@jff/hooks";
import { storage } from "@/lib/storage";

export type NotificationCategory =
  | "offer"
  | "wholesale"
  | "order"
  | "announcement";

export interface PushPayload {
  title: string;
  body: string;
  category: NotificationCategory;
  data?: Record<string, string>;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "JFF Footwear",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  try {
    const token = await Notifications.getExpoPushTokenAsync(
      projectId && projectId !== "your-eas-project-id"
        ? { projectId }
        : undefined
    );
    storage.set(storageKeys.pushToken, token.data);
    return token.data;
  } catch {
    return null;
  }
}

export function getStoredPushToken(): string | null {
  return storage.getString(storageKeys.pushToken) ?? null;
}

export async function scheduleLocalNotification(payload: PushPayload): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: payload.title,
      body: payload.body,
      data: {
        category: payload.category,
        ...payload.data,
      },
    },
    trigger: null,
  });
}

export async function handleBackgroundMessage(payload: PushPayload): Promise<void> {
  await scheduleLocalNotification(payload);
}
