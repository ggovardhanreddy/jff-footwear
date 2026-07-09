import { Text } from "react-native";
import { CARE_INSTRUCTIONS } from "@jff/shared/pages";
import BusinessScreen from "@/components/BusinessScreen";

export default function CareInstructionsScreen() {
  return (
    <BusinessScreen title="Care Instructions">
      {CARE_INSTRUCTIONS.map((item) => (
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
