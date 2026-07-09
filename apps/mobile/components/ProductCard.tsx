import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import type { Product } from "@jff/types";
import { formatINR, getProductPricing } from "@jff/utils/pricing";
import { resolveProductImage } from "@/lib/images";
import { useWishlist } from "@/lib/providers";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const pricing = getProductPricing(product);
  const image = product.images[0] ? resolveProductImage(product.images[0]) : undefined;
  const { has, toggle } = useWishlist();

  return (
    <View className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-zinc-900 dark:shadow-none dark:border dark:border-zinc-800">
      <Link href={`/product/${product.slug}`} asChild>
        <Pressable>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: 180 }}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <View className="h-44 items-center justify-center bg-brand-light dark:bg-zinc-800">
              <Text className="text-brand-muted dark:text-zinc-400">No image</Text>
            </View>
          )}
          <View className="p-4">
            <Text className="text-lg font-semibold text-brand-black dark:text-white">
              {product.name}
            </Text>
            <Text className="text-sm text-brand-muted dark:text-zinc-400">
              {product.gender} · {product.category} · {product.color}
            </Text>
            <Text className="mt-2 text-base font-semibold text-brand-black dark:text-white">
              {formatINR(pricing.sellingPrice)}
            </Text>
          </View>
        </Pressable>
      </Link>
      <Pressable onPress={() => toggle(product.slug)} className="px-4 pb-4">
        <Text
          className={
            has(product.slug)
              ? "text-brand-accent"
              : "text-brand-muted dark:text-zinc-400"
          }
        >
          {has(product.slug) ? "♥ Saved" : "♡ Save to wishlist"}
        </Text>
      </Pressable>
    </View>
  );
}
