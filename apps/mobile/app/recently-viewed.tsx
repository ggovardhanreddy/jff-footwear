import { Text, Pressable, Linking } from "react-native";
import { Link } from "expo-router";
import BusinessScreen from "@/components/BusinessScreen";
import { ROUTES } from "@jff/config/constants";

const SITE_URL = "https://jfffootwear.com";

export default function RecentlyViewedScreen() {
  return (
    <BusinessScreen title="Recently Viewed">
      <Text className="mb-4 text-base leading-7 text-brand-muted dark:text-zinc-400">
        Your recently viewed styles sync on the website when you browse products there.
        Continue shopping in the app or open your history on the web.
      </Text>
      <Pressable
        className="mb-3 rounded-2xl bg-brand-black py-4 dark:bg-white"
        onPress={() => Linking.openURL(`${SITE_URL}${ROUTES.recentlyViewed}`)}
        accessibilityRole="button"
        accessibilityLabel="Open recently viewed on website"
      >
        <Text className="text-center font-semibold text-white dark:text-brand-black">
          View on Website
        </Text>
      </Pressable>
      <Link href="/products" asChild>
        <Pressable
          className="rounded-2xl border border-brand-black py-4 dark:border-white"
          accessibilityRole="button"
          accessibilityLabel="Browse all products"
        >
          <Text className="text-center font-semibold text-brand-black dark:text-white">
            Browse Products
          </Text>
        </Pressable>
      </Link>
    </BusinessScreen>
  );
}
