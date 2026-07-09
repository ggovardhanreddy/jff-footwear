import { Link } from "expo-router";
import { ScrollView, Text, View, Pressable } from "react-native";
import { ABOUT_US, MISSION } from "@jff/shared/company";
import { COMPANY } from "@jff/config/constants";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import BrandLogo from "@/components/brand/BrandLogo";
import ScreenShell from "@/components/ScreenShell";

export default function HomeScreen() {
  const featured = getFeaturedProducts(6);

  return (
    <ScreenShell>
      <ScrollView className="flex-1">
        <View className="px-5 pt-6 pb-4">
          <BrandLogo width={96} height={36} />
          <Text className="mt-4 text-xs uppercase tracking-widest text-brand-muted dark:text-zinc-400">
            Since Jan 2021
          </Text>
          <Text className="mt-2 text-3xl font-semibold text-brand-black dark:text-white">
            {COMPANY.fullName}
          </Text>
          <Text className="mt-3 text-base leading-6 text-brand-muted dark:text-zinc-400">
            {MISSION}
          </Text>
        </View>

        <View className="px-5">
          <View className="flex-row flex-wrap gap-3">
            <Link href="/search" asChild>
              <Pressable className="rounded-2xl bg-brand-black px-4 py-3 dark:bg-brand-blue">
                <Text className="font-medium text-white">Search Products</Text>
              </Pressable>
            </Link>
            <Link href="/wholesale" asChild>
              <Pressable className="rounded-2xl border border-brand-accent px-4 py-3 dark:border-brand-blue-dark">
                <Text className="font-medium text-brand-black dark:text-white">Wholesale</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        <View className="mt-8 px-5">
          <Text className="mb-4 text-xl font-semibold text-brand-black dark:text-white">
            Featured
          </Text>
          <View className="gap-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        </View>

        <View className="mt-8 px-5 pb-10">
          <Text className="text-lg font-semibold text-brand-black dark:text-white">About JFF</Text>
          <Text className="mt-2 text-base leading-6 text-brand-muted dark:text-zinc-400">
            {ABOUT_US}
          </Text>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
