import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetwork } from "@/lib/network/NetworkProvider";

export default function OfflineBanner() {
  const { isOnline } = useNetwork();
  const insets = useSafeAreaInsets();

  if (isOnline) return null;

  return (
    <View
      className="absolute left-0 right-0 z-50 bg-amber-500 px-4 py-2"
      style={{ top: insets.top }}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text className="text-center text-xs font-semibold text-amber-950">
        You&apos;re offline — cart &amp; wishlist are saved on this device
      </Text>
    </View>
  );
}
