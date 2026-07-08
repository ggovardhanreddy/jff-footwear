import { PRICING_CONFIG } from "@/lib/pricing-config";
import { calculateOrderSummary } from "@/lib/pricing";
import type { CartItem } from "@/types";

/** Uses existing pricing engine with a representative cart item for custom orders. */
export function calculateCustomOrderPricing(quantity: number) {
  const unitMrp = 299;
  const unitDiscount = 180;
  const unitSelling = unitMrp - unitDiscount;

  const item: CartItem = {
    id: "custom",
    productId: "custom",
    slug: "custom",
    name: "Custom JFF Slipper",
    image: "",
    size: 0,
    quantity: Math.max(1, quantity),
    color: "Standard",
    pricing: {
      mrp: unitMrp,
      discount: unitDiscount,
      sellingPrice: unitSelling,
    },
  };

  const summary = calculateOrderSummary([item]);
  return {
    mrp: unitMrp,
    discount: unitDiscount,
    sellingPrice: unitSelling,
    platformFee: summary.platformFee,
    deliveryCharge: summary.deliveryCharge,
    grandTotal: summary.grandTotal,
    totalSavings: summary.totalSavings,
    cartSellingTotal: summary.cartSellingTotal,
    isFreeDelivery: summary.isFreeDelivery,
    freeDeliveryThreshold: PRICING_CONFIG.fees.freeDeliveryThreshold,
  };
}

/** Bulk discount tiers for wholesale calculator (display only). */
export function getBulkDiscountPercent(quantity: number): number {
  if (quantity >= 500) return 15;
  if (quantity >= 200) return 12;
  if (quantity >= 100) return 10;
  if (quantity >= 50) return 7;
  if (quantity >= 20) return 5;
  return 0;
}
