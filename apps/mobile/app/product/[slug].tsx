import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { getProductBySlug } from "@/lib/products";
import { resolveProductImage } from "@/lib/images";
import { formatINR, getProductPricing } from "@jff/utils/pricing";
import { useCart, useWishlist } from "@/lib/providers";
import { touchOfflineProduct } from "@/lib/offline/product-cache";
import ScreenShell from "@/components/ScreenShell";

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const product = getProductBySlug(slug ?? "");
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();

  useEffect(() => {
    if (product) touchOfflineProduct(product);
  }, [product]);

  if (!product) {
    return (
      <ScreenShell className="flex-1 items-center justify-center p-6">
        <Text className="text-brand-muted dark:text-zinc-400">Product not found.</Text>
      </ScreenShell>
    );
  }

  const pricing = getProductPricing(product);
  const image = product.images[0] ? resolveProductImage(product.images[0]) : undefined;
  const defaultSize = product.sizes[0] ?? 8;
  const saved = has(product.slug);

  return (
    <ScreenShell>
      <ScrollView className="flex-1">
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: 320 }}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        )}
        <View className="p-5">
          <Text className="text-2xl font-semibold text-brand-black dark:text-white">
            {product.name}
          </Text>
          <Text className="mt-1 text-brand-muted dark:text-zinc-400">
            {product.gender} · {product.category} · {product.material}
          </Text>
          <Text className="mt-3 text-xl font-semibold text-brand-black dark:text-white">
            {formatINR(pricing.sellingPrice)}
          </Text>
          <Text className="mt-4 text-base leading-6 text-brand-muted dark:text-zinc-300">
            {product.description}
          </Text>

          <Pressable
            onPress={() => toggle(product.slug)}
            className="mt-4 self-start rounded-2xl border border-black/10 px-4 py-3 dark:border-zinc-700"
          >
            <Text className={saved ? "font-semibold text-brand-accent" : "text-brand-muted dark:text-zinc-400"}>
              {saved ? "♥ Saved to wishlist" : "♡ Save to wishlist"}
            </Text>
          </Pressable>

          <Pressable
            className="mt-4 rounded-2xl bg-brand-black py-4 dark:bg-brand-blue"
            onPress={() =>
              addItem({
                id: `${product.slug}-${defaultSize}`,
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0] ?? "",
                size: defaultSize,
                quantity: 1,
                color: product.color,
                pricing,
              })
            }
          >
            <Text className="text-center font-semibold text-white">Add to Cart</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
