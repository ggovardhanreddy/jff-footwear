import OfflineBanner from "@/components/network/OfflineBanner";
import ThemedStack from "@/components/navigation/ThemedStack";
import { NotificationProvider } from "@/lib/notifications/NotificationProvider";
import { useOfflineBootstrap } from "@/lib/offline/bootstrap";

export default function AppShell() {
  useOfflineBootstrap();

  return (
    <NotificationProvider>
      <OfflineBanner />
      <ThemedStack />
    </NotificationProvider>
  );
}
