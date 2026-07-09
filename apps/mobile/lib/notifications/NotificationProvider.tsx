import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { mapWebPathToMobile } from "@jff/utils/deep-links";
import { registerForPushNotifications } from "@/lib/notifications";

function navigateFromNotificationData(data: Record<string, unknown> | undefined): void {
  if (!data) return;

  const path = typeof data.path === "string" ? data.path : undefined;
  const slug = typeof data.slug === "string" ? data.slug : undefined;

  if (slug) {
    router.push(`/product/${slug}`);
    return;
  }

  if (path) {
    router.push(mapWebPathToMobile(path) as never);
  }
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const receivedListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotifications().catch(() => {});

    receivedListener.current = Notifications.addNotificationReceivedListener(() => {
      // Foreground display handled by setNotificationHandler
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        navigateFromNotificationData(
          response.notification.request.content.data as Record<string, unknown>
        );
      }
    );

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        navigateFromNotificationData(
          response.notification.request.content.data as Record<string, unknown>
        );
      }
    });

    return () => {
      receivedListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return <>{children}</>;
}
