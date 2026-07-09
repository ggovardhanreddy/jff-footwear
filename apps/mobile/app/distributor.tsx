import { ScrollView, Text, Pressable, Linking } from "react-native";
import { MOQ_BY_ORDER_TYPE } from "@jff/config/wholesale-config";
import { WHATSAPP_NUMBER } from "@jff/config/constants";
import { buildWhatsAppUrl } from "@jff/utils/wholesale";

export default function DistributorScreen() {
  return (
    <ScrollView className="flex-1 bg-brand-cream px-5 pt-4 pb-8">
      <Text className="mb-2 text-2xl font-semibold text-brand-black">
        Distributor Enquiry
      </Text>
      <Text className="mb-4 text-base leading-6 text-brand-muted">
        Apply for territorial distribution with volume pricing. Distributor MOQ is{" "}
        {MOQ_BY_ORDER_TYPE.Distributor}+ pairs per order.
      </Text>

      <Text className="mb-2 font-semibold text-brand-black">We support</Text>
      <Text className="mb-1 text-sm text-brand-muted">• Regional territory partnerships</Text>
      <Text className="mb-1 text-sm text-brand-muted">• Volume pricing and logistics</Text>
      <Text className="mb-4 text-sm text-brand-muted">• GST invoicing and catalog access</Text>

      <Pressable
        className="rounded-2xl bg-brand-black py-4"
        onPress={() =>
          Linking.openURL(
            buildWhatsAppUrl(
              WHATSAPP_NUMBER,
              [
                "Hello JFF, I am interested in becoming a distributor.",
                "",
                "Company:",
                "Territory / States:",
                "Est. monthly volume:",
                "Distribution channels:",
                "",
              ].join("\n")
            )
          )
        }
      >
        <Text className="text-center font-semibold text-white">
          Submit Distributor Enquiry
        </Text>
      </Pressable>
    </ScrollView>
  );
}
