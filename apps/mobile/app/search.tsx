import { useState } from "react";
import { ScrollView, TextInput, Text, View } from "react-native";
import { searchProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const results = searchProducts(query);

  return (
    <ScrollView className="flex-1 bg-brand-cream px-5 pt-4" keyboardShouldPersistTaps="handled">
      <TextInput
        className="mb-4 rounded-xl border border-brand-light bg-white px-4 py-3 text-brand-black"
        placeholder="Search slippers, categories, colors..."
        value={query}
        onChangeText={setQuery}
        autoFocus
      />
      <Text className="mb-4 text-brand-muted">{results.length} results</Text>
      <View className="gap-4 pb-8">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>
    </ScrollView>
  );
}
