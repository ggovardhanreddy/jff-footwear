import "../global.css";
import { AppProviders } from "@/lib/providers";
import { ForceUpdateGate } from "@/lib/remote-config";
import { UpdateProvider } from "@/lib/updates";
import AppShell from "@/components/AppShell";

export default function RootLayout() {
  return (
    <AppProviders>
      <ForceUpdateGate>
        <UpdateProvider>
          <AppShell />
        </UpdateProvider>
      </ForceUpdateGate>
    </AppProviders>
  );
}
