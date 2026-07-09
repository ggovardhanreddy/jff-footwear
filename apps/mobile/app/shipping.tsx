import { Text } from "react-native";
import { SHIPPING_TIMELINE, SHIPPING_DETAILS } from "@jff/shared/pages";
import BusinessScreen from "@/components/BusinessScreen";

export default function ShippingScreen() {
  return (
    <BusinessScreen title="Shipping & Delivery">
      {SHIPPING_TIMELINE.map((step) => (
        <Text
          key={step.step}
          className="mb-4 text-base leading-6 text-brand-black dark:text-white"
        >
          <Text className="font-semibold">
            {step.step}. {step.title}
          </Text>
          {"\n"}
          <Text className="text-brand-muted dark:text-zinc-400">{step.description}</Text>
        </Text>
      ))}
      {SHIPPING_DETAILS.map((detail) => (
        <Text
          key={detail.title}
          className="mb-4 text-base leading-6 text-brand-black dark:text-white"
        >
          <Text className="font-semibold">{detail.title}</Text>
          {"\n"}
          <Text className="text-brand-muted dark:text-zinc-400">{detail.description}</Text>
        </Text>
      ))}
    </BusinessScreen>
  );
}
