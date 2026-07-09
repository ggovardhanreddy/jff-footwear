import { Text } from "react-native";
import { RETURN_POLICY_ITEMS } from "@jff/shared/pages";
import BusinessScreen from "@/components/BusinessScreen";

export default function ReturnsScreen() {
  return (
    <BusinessScreen title="Returns & Exchanges">
      {RETURN_POLICY_ITEMS.map((item) => (
        <Text
          key={item.id}
          className="mb-4 text-base leading-6 text-brand-black dark:text-white"
        >
          <Text className="font-semibold">{item.title}</Text>
          {"\n"}
          <Text className="text-brand-muted dark:text-zinc-400">{item.description}</Text>
        </Text>
      ))}
    </BusinessScreen>
  );
}
