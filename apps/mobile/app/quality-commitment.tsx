import { Text } from "react-native";
import { QUALITY_COMMITMENT } from "@jff/shared/pages";
import BusinessScreen from "@/components/BusinessScreen";

export default function QualityCommitmentScreen() {
  return (
    <BusinessScreen title="Quality Commitment">
      <Text className="mb-2 text-base font-semibold text-brand-black dark:text-white">
        {QUALITY_COMMITMENT.subtitle}
      </Text>
      <Text className="mb-6 text-base leading-7 text-brand-muted dark:text-zinc-400">
        {QUALITY_COMMITMENT.description}
      </Text>
      {QUALITY_COMMITMENT.items.map((item) => (
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
