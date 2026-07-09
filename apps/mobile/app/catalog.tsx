import { Text, Pressable, Linking } from "react-native";
import { CATALOG_PATHS } from "@jff/config/wholesale-config";
import BusinessScreen from "@/components/BusinessScreen";

const SITE_URL = "https://jffstores.com";

export default function CatalogScreen() {
  return (
    <BusinessScreen title="Product Catalog">
      <Text className="mb-4 text-base leading-7 text-brand-muted dark:text-zinc-400">
        Download the full JFF slipper catalog for wholesale and retail planning. The CSV includes
        product names, categories, materials, and reference details.
      </Text>
      <Pressable
        className="rounded-2xl bg-brand-black py-4 dark:bg-white"
        onPress={() => Linking.openURL(`${SITE_URL}${CATALOG_PATHS.csv}`)}
        accessibilityRole="button"
        accessibilityLabel="Download product catalog CSV"
      >
        <Text className="text-center font-semibold text-white dark:text-brand-black">
          Download Catalog (CSV)
        </Text>
      </Pressable>
    </BusinessScreen>
  );
}
