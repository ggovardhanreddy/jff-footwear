import { ScrollView, Text, Pressable, Linking } from "react-native";
import DealerForm from "@/components/business/DealerForm";
import { COMPANY } from "@jff/config/constants";

export default function DealerScreen() {
  return (
    <ScrollView className="flex-1 bg-brand-cream px-5 pt-4 pb-8">
      <Text className="mb-2 text-2xl font-semibold text-brand-black">Become a Dealer</Text>
      <Text className="mb-6 text-base leading-6 text-brand-muted">
        Partner with {COMPANY.fullName}. Complete the form below and our team will review
        your application on WhatsApp.
      </Text>
      <DealerForm />
    </ScrollView>
  );
}
