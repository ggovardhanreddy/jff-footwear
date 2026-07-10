import { SHIPPING_CONFIG } from "./shipping";

/** Product pricing configuration — fees sync with config/shipping.ts */
export const PRICING_CONFIG = {
  currency: "INR" as const,
  locale: "en-IN" as const,

  /** Default product pricing when no per-product override exists. */
  defaultProduct: {
    mrp: 299,
    sellingPrice: 120,
  },

  /** Per-slug overrides (optional). */
  productOverrides: {} as Record<string, { mrp?: number; sellingPrice?: number }>,

  fees: {
    platformFee: SHIPPING_CONFIG.PLATFORM_FEE,
    deliveryCharge: SHIPPING_CONFIG.DELIVERY_CHARGE,
    freeDeliveryThreshold: SHIPPING_CONFIG.FREE_DELIVERY_THRESHOLD,
  },

  deliveryRules: [
    {
      id: "free-over-threshold",
      minCartValue: SHIPPING_CONFIG.FREE_DELIVERY_THRESHOLD,
      charge: 0,
    },
    {
      id: "standard",
      minCartValue: 0,
      charge: SHIPPING_CONFIG.DELIVERY_CHARGE,
    },
  ] as const,

  /** Optional per-item delivery surcharge (future use). */
  perItemDeliverySurcharge: 0,

  coupon: {
    enabled: true,
    codes: {
      JFF20: { type: "flat" as const, discount: 20, label: "₹20 off" },
      WELCOME10: { type: "percent" as const, discount: 10, label: "10% off" },
    } as Record<string, { type: "flat" | "percent"; discount: number; label: string }>,
  },

  estimatedDelivery: {
    minDays: 3,
    maxDays: 5,
    label: "3–5 business days",
  },

  taxNote: "Inclusive of all taxes",

  /** Coins earned ≈ 5% of selling price (floored). */
  coinsEarnRate: 0.05,
} as const;

export type PricingConfig = typeof PRICING_CONFIG;
