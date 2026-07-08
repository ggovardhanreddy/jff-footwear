"use client";

import type { Product } from "@/types";
import {
  ProductViewTracker,
  ProductFAQ,
  FrequentlyBoughtTogether,
  RecentlyViewedStrip,
  ShippingCalculator,
  GSTInvoiceOption,
  CareInstructions,
  SizeGuide,
} from "@/components/features";
import ProductCarousel from "@/components/features/discovery/ProductCarousel";
import {
  getTrendingProducts,
  getRecentlyPurchasedPlaceholder,
} from "@/lib/product-sections";
import { getRelatedProducts } from "@/lib/utils";
import { products } from "@/data/products";

interface ProductPageSectionsProps {
  product: Product;
}

export default function ProductPageSections({
  product,
}: ProductPageSectionsProps) {
  const related = getRelatedProducts(products, product);
  const trending = getTrendingProducts(4).filter((p) => p.id !== product.id);

  return (
    <>
      <ProductViewTracker product={product} />

      <div className="mt-24 space-y-24">
        <GSTInvoiceOption />
        <ShippingCalculator />
        <div className="grid gap-8 lg:grid-cols-2">
          <SizeGuide />
          <CareInstructions />
        </div>
        <FrequentlyBoughtTogether product={product} />
        <ProductFAQ product={product} />
        {related.length > 0 && (
          <ProductCarousel
            title="Related Products"
            subtitle="You may also like"
            products={related}
            horizontal={false}
          />
        )}
        <ProductCarousel
          title="Trending Products"
          products={trending}
        />
        <ProductCarousel
          title="Recently Purchased"
          subtitle="Popular with buyers"
          products={getRecentlyPurchasedPlaceholder(4)}
        />
        <RecentlyViewedStrip excludeSlug={product.slug} />
      </div>
    </>
  );
}
