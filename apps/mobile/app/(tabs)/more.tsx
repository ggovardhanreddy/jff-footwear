import { Link } from "expo-router";
import { ScrollView, Text, Pressable, View } from "react-native";
import ScreenShell from "@/components/ScreenShell";
import { BUSINESS_PAGES } from "@jff/config/business-pages";

const extraLinks = [
  { href: "/collections", label: "Collections" },
  { href: "/compare", label: "Compare Products" },
  { href: "/recently-viewed", label: "Recently Viewed" },
  { href: "/settings", label: "Settings" },
  { href: "/search", label: "Search" },
  { href: "/gallery", label: "Gallery" },
] as const;

export default function MoreScreen() {
  return (
    <ScreenShell>
      <ScrollView className="flex-1 px-5 pt-4">
        <Text className="mb-2 text-2xl font-semibold text-brand-black dark:text-white">
          More
        </Text>
        <Text className="mb-6 text-sm text-brand-muted dark:text-zinc-400">
          Company information, wholesale programmes, and customer support.
        </Text>

        <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-muted dark:text-zinc-500">
          Business Pages
        </Text>
        <View className="mb-8 gap-3">
          {BUSINESS_PAGES.map((link) => (
            <Link key={link.href} href={link.href} asChild>
              <Pressable className="rounded-2xl bg-white px-4 py-4 dark:border dark:border-zinc-800 dark:bg-zinc-900">
                <Text className="font-medium text-brand-black dark:text-white">
                  {link.label}
                </Text>
                <Text className="mt-1 text-sm text-brand-muted dark:text-zinc-400">
                  {link.description}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>

        <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-muted dark:text-zinc-500">
          App
        </Text>
        <View className="gap-3 pb-8">
          {extraLinks.map((link) => (
            <Link key={link.href} href={link.href} asChild>
              <Pressable className="rounded-2xl bg-white px-4 py-4 dark:border dark:border-zinc-800 dark:bg-zinc-900">
                <Text className="font-medium text-brand-black dark:text-white">
                  {link.label}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
