import { Text, Pressable, Linking } from "react-native";
import BusinessScreen from "@/components/BusinessScreen";
import { ROUTES } from "@jff/config/constants";

const SITE_URL = "https://jfffootwear.com";

export default function CompareScreen() {
  return (
    <BusinessScreen title="Compare Products">
      <Text className="mb-4 text-base leading-7 text-brand-muted dark:text-zinc-400">
        Side-by-side product comparison is available on the JFF website. Add styles from
        product pages, then compare category, material, sizes, and pricing.
      </Text>
      <Pressable
        className="rounded-2xl bg-brand-black py-4 dark:bg-white"
        onPress={() => Linking.openURL(`${SITE_URL}${ROUTES.compare}`)}
        accessibilityRole="button"
        accessibilityLabel="Open compare products on website"
      >
        <Text className="text-center font-semibold text-white dark:text-brand-black">
          Compare on Website
        </Text>
      </Pressable>
    </BusinessScreen>
  );
}
