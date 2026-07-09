import { ScrollView, Text, View } from "react-native";
import { getAllProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import ScreenShell from "@/components/ScreenShell";

export default function ProductsScreen() {
  const products = getAllProducts();

  return (
    <ScreenShell>
      <ScrollView className="flex-1 px-5 pt-4">
        <Text className="mb-4 text-2xl font-semibold text-brand-black dark:text-white">
          All Products ({products.length})
        </Text>
        <View className="gap-4 pb-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
