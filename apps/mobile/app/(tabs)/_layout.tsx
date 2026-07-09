import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { brandDark, brandLight } from "@jff/ui/brand";
import BrandLogo from "@/components/brand/BrandLogo";

const TAB_LABELS: Record<string, string> = {
  "🏠": "Home",
  "👟": "Products",
  "📂": "Categories",
  "♥": "Wishlist",
  "🛒": "Cart",
  "☰": "More",
};

function TabIcon({ emoji }: { emoji: string }) {
  return (
    <Text
      style={{ fontSize: 18 }}
      accessibilityLabel={TAB_LABELS[emoji]}
      importantForAccessibility="yes"
    >
      {emoji}
    </Text>
  );
}

export default function TabLayout() {
  const { resolved } = useTheme();
  const tokens = resolved === "dark" ? brandDark : brandLight;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tokens.accent,
        tabBarInactiveTintColor: tokens.textMuted,
        tabBarStyle: {
          backgroundColor: tokens.background,
          borderTopColor: tokens.border,
        },
        headerStyle: { backgroundColor: tokens.background },
        headerTintColor: tokens.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: () => <BrandLogo width={72} height={28} />,
          tabBarIcon: () => <TabIcon emoji="🏠" />,
          tabBarAccessibilityLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarIcon: () => <TabIcon emoji="👟" />,
          tabBarAccessibilityLabel: "Products",
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: () => <TabIcon emoji="📂" />,
          tabBarAccessibilityLabel: "Categories",
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: () => <TabIcon emoji="♥" />,
          tabBarAccessibilityLabel: "Wishlist",
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: () => <TabIcon emoji="🛒" />,
          tabBarAccessibilityLabel: "Cart",
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: () => <TabIcon emoji="☰" />,
          tabBarAccessibilityLabel: "More",
        }}
      />
    </Tabs>
  );
}
