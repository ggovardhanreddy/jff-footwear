import { SHIPPING_CONFIG } from "@/config/shipping";
import { PRICING_CONFIG } from "@/lib/pricing-config";
import type { CartItem, OrderSummaryBreakdown, ProductPricing } from "@/types";
import type { Product } from "@/types";

export function formatINR(amount: number): string {
  return new Intl.NumberFormat(PRICING_CONFIG.locale, {
    style: "currency",
    currency: PRICING_CONFIG.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatINRSigned(amount: number): string {
  const formatted = formatINR(Math.abs(amount));
  if (amount < 0) return `-${formatted}`;
  if (amount > 0 && !formatted.startsWith("-")) return formatted;
  return formatted;
}

/** Resolve MRP, discount, and selling price for a product. */
export function getProductPricing(product?: Pick<Product, "slug"> | null): ProductPricing {
  const override = product?.slug
    ? PRICING_CONFIG.productOverrides[product.slug]
    : undefined;

  const mrp = override?.mrp ?? PRICING_CONFIG.defaultProduct.mrp;
  const sellingPrice =
    override?.sellingPrice ?? PRICING_CONFIG.defaultProduct.sellingPrice;
  const discount = Math.max(0, mrp - sellingPrice);

  return { mrp, discount, sellingPrice };
}

function getDeliveryCharge(cartSellingTotal: number, itemCount: number): number {
  const { perItemDeliverySurcharge } = PRICING_CONFIG;
  const threshold = SHIPPING_CONFIG.FREE_DELIVERY_THRESHOLD;
  const standardCharge = SHIPPING_CONFIG.DELIVERY_CHARGE;

  const charge =
    cartSellingTotal >= threshold ? 0 : standardCharge;

  return charge + perItemDeliverySurcharge * itemCount;
}

export function resolveCouponDiscount(
  code: string,
  cartSellingTotal: number
): number {
  const normalized = code.trim().toUpperCase();
  if (!normalized || !PRICING_CONFIG.coupon.enabled) return 0;

  const coupon = PRICING_CONFIG.coupon.codes[normalized];
  if (!coupon) return 0;

  return Math.min(coupon.discount, cartSellingTotal);
}

/** Compute full order summary from cart line items. */
export function calculateOrderSummary(
  items: CartItem[],
  couponCode = ""
): OrderSummaryBreakdown {
  const subtotal = items.reduce((sum, item) => sum + item.pricing.mrp * item.quantity, 0);
  const productDiscount = items.reduce(
    (sum, item) => sum + item.pricing.discount * item.quantity,
    0
  );
  const cartSellingTotal = items.reduce(
    (sum, item) => sum + item.pricing.sellingPrice * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const platformFee =
    items.length > 0 ? SHIPPING_CONFIG.PLATFORM_FEE : 0;

  const standardDelivery = SHIPPING_CONFIG.DELIVERY_CHARGE;
  const deliveryCharge = getDeliveryCharge(cartSellingTotal, itemCount);
  const deliverySavings =
    deliveryCharge === 0 && cartSellingTotal > 0 ? standardDelivery : 0;

  const couponDiscount = resolveCouponDiscount(couponCode, cartSellingTotal);

  const grandTotal = Math.max(
    0,
    cartSellingTotal + platformFee + deliveryCharge - couponDiscount
  );

  const totalSavings = productDiscount + couponDiscount + deliverySavings;

  const isFreeDelivery =
    cartSellingTotal >= SHIPPING_CONFIG.FREE_DELIVERY_THRESHOLD;

  return {
    subtotal,
    productDiscount,
    platformFee,
    deliveryCharge,
    couponDiscount,
    grandTotal,
    totalSavings,
    cartSellingTotal,
    itemCount,
    isFreeDelivery,
    taxNote: PRICING_CONFIG.taxNote,
    estimatedDelivery: PRICING_CONFIG.estimatedDelivery.label,
  };
}
