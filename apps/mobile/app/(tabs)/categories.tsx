import { Link } from "expo-router";
import { ScrollView, Text, Pressable, View } from "react-native";
import { GENDERS, PRODUCT_CATEGORIES } from "@jff/config/constants";
import ScreenShell from "@/components/ScreenShell";

export default function CategoriesScreen() {
  return (
    <ScreenShell>
      <ScrollView className="flex-1 px-5 pt-4">
        <Text className="mb-4 text-2xl font-semibold text-brand-black dark:text-white">
          Shop by Gender
        </Text>
        <View className="mb-8 flex-row flex-wrap gap-3">
          {GENDERS.map((gender) => (
            <Link key={gender} href={{ pathname: "/products", params: { gender } }} asChild>
              <Pressable className="rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-zinc-900 dark:border dark:border-zinc-800">
                <Text className="font-medium text-brand-black dark:text-white">{gender}</Text>
              </Pressable>
            </Link>
          ))}
        </View>

        <Text className="mb-4 text-2xl font-semibold text-brand-black dark:text-white">
          Categories
        </Text>
        <View className="flex-row flex-wrap gap-3 pb-8">
          {PRODUCT_CATEGORIES.map((category) => (
            <Link key={category} href={{ pathname: "/products", params: { category } }} asChild>
              <Pressable className="rounded-2xl border border-brand-accent/40 bg-white px-4 py-3 dark:bg-zinc-900 dark:border-brand-accent/60">
                <Text className="font-medium text-brand-black dark:text-white">{category}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
