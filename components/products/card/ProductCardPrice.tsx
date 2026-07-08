import PriceCard from "@/components/pricing/PriceCard";
import { getProductPricing } from "@/lib/pricing";
import type { Product } from "@/types";

interface ProductCardPriceProps {
  price?: number;
  product?: Pick<Product, "slug">;
  className?: string;
}

/** @deprecated Use PriceCard with getProductPricing instead. */
export default function ProductCardPrice({
  price,
  product,
  className,
}: ProductCardPriceProps) {
  const pricing =
    product != null
      ? getProductPricing(product)
      : price != null
        ? { mrp: price, discount: 0, sellingPrice: price }
        : getProductPricing();

  return <PriceCard pricing={pricing} variant="compact" className={className} />;
}
