import { ScrollView, Text, View } from "react-native";
import { useWishlist } from "@/lib/providers";
import { getProductBySlug } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import ScreenShell from "@/components/ScreenShell";
import { useNetwork } from "@/lib/network/NetworkProvider";

export default function WishlistScreen() {
  const { slugs } = useWishlist();
  const { isOnline } = useNetwork();
  const products = slugs.map(getProductBySlug).filter(Boolean);

  return (
    <ScreenShell>
      <ScrollView className="flex-1 px-5 pt-4">
        <Text className="mb-1 text-2xl font-semibold text-brand-black dark:text-white">
          Wishlist
        </Text>
        {!isOnline && (
          <Text className="mb-3 text-xs text-amber-700 dark:text-amber-400">
            Offline — showing saved items from this device
          </Text>
        )}
        {products.length === 0 ? (
          <Text className="text-brand-muted dark:text-zinc-400">
            Save products you love — they stay on this device even without internet.
          </Text>
        ) : (
          <View className="gap-4 pb-8">
            {products.map((product) => product && <ProductCard key={product.id} product={product} />)}
          </View>
        )}
      </ScrollView>
    </ScreenShell>
  );
}
