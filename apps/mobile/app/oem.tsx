import { Text, Pressable, Linking } from "react-native";
import { OEM_FEATURES, OEM_INTRO } from "@jff/shared/pages";
import { WHATSAPP_NUMBER } from "@jff/config/constants";
import { buildWhatsAppUrl } from "@jff/utils/wholesale";
import { Link } from "expo-router";
import ScreenShell from "@/components/ScreenShell";

export default function OemScreen() {
  return (
    <ScreenShell>
      <Text className="mb-2 px-5 pt-4 text-2xl font-semibold text-brand-black dark:text-white">
        OEM / Private Label
      </Text>
      <Text className="mb-4 px-5 text-base leading-6 text-brand-muted dark:text-zinc-400">
        {OEM_INTRO}
      </Text>
      {OEM_FEATURES.map((feature) => (
        <Text
          key={feature.id}
          className="mb-4 px-5 text-base leading-6 text-brand-black dark:text-white"
        >
          <Text className="font-semibold">{feature.title}</Text>
          {"\n"}
          <Text className="text-brand-muted dark:text-zinc-400">{feature.description}</Text>
        </Text>
      ))}

      <Pressable
        className="mx-5 mb-3 rounded-2xl bg-brand-black py-4 dark:bg-white"
        onPress={() =>
          Linking.openURL(
            buildWhatsAppUrl(
              WHATSAPP_NUMBER,
              "Hello JFF, I am interested in private label / OEM manufacturing.\n\nBrand:\nProduct type:\nTarget MOQ:\nTimeline:"
            )
          )
        }
        accessibilityRole="button"
        accessibilityLabel="Request OEM quote on WhatsApp"
      >
        <Text className="text-center font-semibold text-white dark:text-brand-black">
          Request OEM Quote
        </Text>
      </Pressable>

      <Link href="/customize" asChild>
        <Pressable
          className="mx-5 mb-8 rounded-2xl border border-brand-black py-4 dark:border-white"
          accessibilityRole="button"
          accessibilityLabel="Open product configurator"
        >
          <Text className="text-center font-semibold text-brand-black dark:text-white">
            Open Product Configurator
          </Text>
        </Pressable>
      </Link>
    </ScreenShell>
  );
}
