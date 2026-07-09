import { Text } from "react-native";
import { ABOUT_US, MISSION, VISION } from "@jff/shared/company";
import BusinessScreen from "@/components/BusinessScreen";

export default function AboutScreen() {
  return (
    <BusinessScreen title="About Us">
      <Text className="mb-6 text-base leading-7 text-brand-muted dark:text-zinc-400">
        {ABOUT_US}
      </Text>
      <Text className="mb-2 text-lg font-semibold text-brand-black dark:text-white">
        Our Mission
      </Text>
      <Text className="mb-6 text-base leading-7 text-brand-muted dark:text-zinc-400">
        {MISSION}
      </Text>
      <Text className="mb-2 text-lg font-semibold text-brand-black dark:text-white">
        Our Vision
      </Text>
      <Text className="text-base leading-7 text-brand-muted dark:text-zinc-400">
        {VISION}
      </Text>
    </BusinessScreen>
  );
}
