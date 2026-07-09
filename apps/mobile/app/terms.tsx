import { Text } from "react-native";
import { TERMS_SECTIONS } from "@jff/shared/pages";
import BusinessScreen from "@/components/BusinessScreen";

export default function TermsScreen() {
  return (
    <BusinessScreen title="Terms & Conditions">
      {TERMS_SECTIONS.map((section) => (
        <Text
          key={section.id}
          className="mb-5 text-base leading-6 text-brand-black dark:text-white"
        >
          <Text className="font-semibold">{section.title}</Text>
          {"\n"}
          {section.paragraphs?.map((paragraph) => (
            <Text key={paragraph.slice(0, 24)} className="text-brand-muted dark:text-zinc-400">
              {paragraph}
              {"\n\n"}
            </Text>
          ))}
          {section.list?.map((item) => (
            <Text key={item} className="text-brand-muted dark:text-zinc-400">
              • {item}
              {"\n"}
            </Text>
          ))}
        </Text>
      ))}
    </BusinessScreen>
  );
}
