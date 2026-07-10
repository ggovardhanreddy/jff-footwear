import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { brandDark, brandLight } from "@jff/ui/brand";

export default function ThemedStack() {
  const { resolved } = useTheme();
  const tokens = resolved === "dark" ? brandDark : brandLight;

  return (
    <>
      <StatusBar style={resolved === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: tokens.background },
          headerTintColor: tokens.text,
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: tokens.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Sign in" }} />
        <Stack.Screen name="product/[slug]" options={{ title: "Product" }} />
        <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
        <Stack.Screen name="search" options={{ title: "Search" }} />
        <Stack.Screen name="contact" options={{ title: "Contact" }} />
        <Stack.Screen name="faq" options={{ title: "FAQ" }} />
        <Stack.Screen name="gallery" options={{ title: "Gallery" }} />
        <Stack.Screen name="wholesale" options={{ title: "Wholesale" }} />
        <Stack.Screen name="distributor" options={{ title: "Distributor" }} />
        <Stack.Screen name="oem" options={{ title: "OEM" }} />
        <Stack.Screen name="dealer" options={{ title: "Dealer" }} />
        <Stack.Screen name="about" options={{ title: "About" }} />
        <Stack.Screen name="quality-commitment" options={{ title: "Quality" }} />
        <Stack.Screen name="size-guide" options={{ title: "Size Guide" }} />
        <Stack.Screen name="care-instructions" options={{ title: "Care" }} />
        <Stack.Screen name="returns" options={{ title: "Returns" }} />
        <Stack.Screen name="privacy-policy" options={{ title: "Privacy" }} />
        <Stack.Screen name="terms" options={{ title: "Terms" }} />
        <Stack.Screen name="shipping" options={{ title: "Shipping" }} />
        <Stack.Screen name="customize" options={{ title: "Customize" }} />
        <Stack.Screen name="collections" options={{ title: "Collections" }} />
        <Stack.Screen name="catalog" options={{ title: "Catalog" }} />
        <Stack.Screen name="compare" options={{ title: "Compare" }} />
        <Stack.Screen name="recently-viewed" options={{ title: "Recently Viewed" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>
    </>
  );
}
