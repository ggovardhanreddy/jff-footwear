import { Text } from "react-native";
import { faqs } from "@jff/shared/content";
import BusinessScreen from "@/components/BusinessScreen";

export default function FaqScreen() {
  return (
    <BusinessScreen title="FAQs">
      {faqs.map((item) => (
        <Text
          key={item.question}
          className="mb-4 text-base leading-6 text-brand-black dark:text-white"
        >
          <Text className="font-semibold">{item.question}</Text>
          {"\n"}
          <Text className="text-brand-muted dark:text-zinc-400">{item.answer}</Text>
        </Text>
      ))}
    </BusinessScreen>
  );
}
