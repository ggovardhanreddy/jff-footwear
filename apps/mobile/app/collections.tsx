import { Text, Pressable, Linking } from "react-native";
import BusinessScreen from "@/components/BusinessScreen";
import { ROUTES } from "@jff/config/constants";

const SITE_URL = "https://www.jffstores.com";

const COLLECTIONS = [
  {
    slug: "featured",
    title: "Featured Collection",
    description: "Hand-picked standout styles for everyday comfort.",
  },
  {
    slug: "new-arrivals",
    title: "New Arrivals",
    description: "Fresh styles recently added to the catalogue.",
  },
  {
    slug: "best-sellers",
    title: "Best Sellers",
    description: "Top-performing styles trusted across India.",
  },
  {
    slug: "trending",
    title: "Trending Now",
    description: "What buyers are browsing and ordering right now.",
  },
] as const;

export default function CollectionsScreen() {
  return (
    <BusinessScreen title="Collections">
      <Text className="mb-6 text-base leading-7 text-brand-muted dark:text-zinc-400">
        Browse curated JFF collections on the website or shop all products in the app.
      </Text>
      {COLLECTIONS.map((collection) => (
        <Pressable
          key={collection.slug}
          className="mb-4 rounded-2xl bg-white px-4 py-4 dark:border dark:border-zinc-800 dark:bg-zinc-900"
          onPress={() => Linking.openURL(`${SITE_URL}${ROUTES.collection(collection.slug)}`)}
          accessibilityRole="button"
          accessibilityLabel={`Open ${collection.title} on website`}
        >
          <Text className="font-semibold text-brand-black dark:text-white">{collection.title}</Text>
          <Text className="mt-1 text-sm text-brand-muted dark:text-zinc-400">
            {collection.description}
          </Text>
        </Pressable>
      ))}
    </BusinessScreen>
  );
}
