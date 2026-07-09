import { Text, Linking, Pressable } from "react-native";
import { COMPANY, WHATSAPP_NUMBER } from "@jff/config/constants";
import BusinessScreen from "@/components/BusinessScreen";

export default function ContactScreen() {
  return (
    <BusinessScreen title="Contact Us">
      <Text className="mb-2 text-brand-black dark:text-white">{COMPANY.fullName}</Text>
      <Text className="mb-2 text-brand-muted dark:text-zinc-400">{COMPANY.address}</Text>
      <Text className="mb-2 text-brand-muted dark:text-zinc-400">{COMPANY.phone}</Text>
      <Text className="mb-2 text-brand-muted dark:text-zinc-400">{COMPANY.email}</Text>
      <Text className="mb-6 text-sm text-brand-muted dark:text-zinc-400">
        {COMPANY.businessHours}
      </Text>
      <Pressable
        className="rounded-2xl bg-green-600 py-4"
        onPress={() => Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}`)}
      >
        <Text className="text-center font-semibold text-white">Chat on WhatsApp</Text>
      </Pressable>
    </BusinessScreen>
  );
}
