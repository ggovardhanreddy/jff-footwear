import { Text, Pressable, Linking } from "react-native";
import { Link } from "expo-router";
import BusinessScreen from "@/components/BusinessScreen";
import { ROUTES } from "@jff/config/constants";

const SITE_URL = "https://jffstores.com";

export default function CustomizeScreen() {
  return (
    <BusinessScreen title="Customize Your Slippers">
      <Text className="mb-4 text-base leading-7 text-brand-muted dark:text-zinc-400">
        The full product configurator — materials, sole, branding, packaging, and live pricing — is
        available on the JFF website. Configure your order and place it via WhatsApp.
      </Text>
      <Pressable
        className="mb-3 rounded-2xl bg-brand-black py-4 dark:bg-white"
        onPress={() => Linking.openURL(`${SITE_URL}${ROUTES.customize}`)}
        accessibilityRole="button"
        accessibilityLabel="Open product configurator on website"
      >
        <Text className="text-center font-semibold text-white dark:text-brand-black">
          Open on Website
        </Text>
      </Pressable>
      <Link href="/contact" asChild>
        <Pressable
          className="rounded-2xl border border-brand-black py-4 dark:border-white"
          accessibilityRole="button"
          accessibilityLabel="Contact JFF for customization help"
        >
          <Text className="text-center font-semibold text-brand-black dark:text-white">
            Contact for Help
          </Text>
        </Pressable>
      </Link>
    </BusinessScreen>
  );
}
