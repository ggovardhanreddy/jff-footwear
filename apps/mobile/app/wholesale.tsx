import { ScrollView, Text, Pressable, Linking } from "react-native";
import { WHOLESALE_FEATURES } from "@jff/shared/pages";
import { ABOUT_US } from "@jff/shared/company";
import {
  BULK_DISCOUNT_TIERS,
  MOQ_BY_ORDER_TYPE,
  CATALOG_PATHS,
} from "@jff/config/wholesale-config";
import { ROUTES } from "@jff/config/constants";
import { Link } from "expo-router";

const SITE_URL = "https://www.jffstores.com";

export default function WholesaleScreen() {
  return (
    <ScrollView className="flex-1 bg-brand-cream px-5 pt-4 pb-8">
      <Text className="mb-2 text-2xl font-semibold text-brand-black">Wholesale</Text>
      <Text className="mb-4 text-base leading-6 text-brand-muted">{ABOUT_US}</Text>

      <Text className="mb-2 font-semibold text-brand-black">MOQ by order type</Text>
      {Object.entries(MOQ_BY_ORDER_TYPE).map(([type, moq]) => (
        <Text key={type} className="mb-1 text-sm text-brand-muted">
          {type}: {moq}+ pairs
        </Text>
      ))}

      <Text className="mb-2 mt-4 font-semibold text-brand-black">Volume discounts</Text>
      {BULK_DISCOUNT_TIERS.map((tier) => (
        <Text key={tier.minQty} className="mb-1 text-sm text-brand-muted">
          {tier.label}: {tier.percent}% off
        </Text>
      ))}

      {WHOLESALE_FEATURES.map((feature) => (
        <Text key={feature.id} className="mb-4 mt-2 text-base leading-6 text-brand-black">
          <Text className="font-semibold">{feature.title}</Text>
          {"\n"}
          <Text className="text-brand-muted">{feature.description}</Text>
        </Text>
      ))}

      <Link href="/distributor" asChild>
        <Pressable className="mb-3 rounded-2xl border border-brand-black py-4">
          <Text className="text-center font-semibold text-brand-black">Distributor Enquiry</Text>
        </Pressable>
      </Link>

      <Pressable
        className="mb-3 rounded-2xl bg-brand-black py-4"
        onPress={() =>
          Linking.openURL(
            `https://wa.me/917780307058?text=${encodeURIComponent(
              "Hello JFF, I would like a wholesale / bulk order quote."
            )}`
          )
        }
      >
        <Text className="text-center font-semibold text-white">Request Bulk Quote</Text>
      </Pressable>

      <Pressable
        className="rounded-2xl border border-black/10 bg-white py-4"
        onPress={() => Linking.openURL(`${SITE_URL}${CATALOG_PATHS.csv}`)}
      >
        <Text className="text-center font-semibold text-brand-black">
          Download Product Catalog (CSV)
        </Text>
      </Pressable>

      <Text className="mt-4 text-xs text-brand-muted">
        Full B2B forms and pricing calculator on {SITE_URL}
        {ROUTES.wholesale}
      </Text>
    </ScrollView>
  );
}
