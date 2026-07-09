import type { ReactNode } from "react";
import { ScrollView, Text } from "react-native";
import ScreenShell from "@/components/ScreenShell";

interface BusinessScreenProps {
  title: string;
  children: ReactNode;
}

export default function BusinessScreen({ title, children }: BusinessScreenProps) {
  return (
    <ScreenShell>
      <ScrollView className="flex-1 px-5 pt-4 pb-8">
        <Text className="mb-4 text-2xl font-semibold text-brand-black dark:text-white">
          {title}
        </Text>
        {children}
      </ScrollView>
    </ScreenShell>
  );
}
