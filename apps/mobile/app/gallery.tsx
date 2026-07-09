import { ScrollView, Text } from "react-native";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function GalleryScreen() {
  const products = getFeaturedProducts(12);

  return (
    <ScrollView className="flex-1 bg-brand-cream px-5 pt-4">
      <Text className="mb-4 text-2xl font-semibold text-brand-black">Gallery</Text>
      <Text className="mb-4 text-brand-muted">Featured styles from our catalog.</Text>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ScrollView>
  );
}
