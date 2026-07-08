/**
 * Central pricing & checkout configuration.
 * Adjust values here — no hardcoded prices elsewhere in the app.
 */

export const PRICING_CONFIG = {
  currency: "INR" as const,
  locale: "en-IN" as const,

  /** Default product pricing when no per-product override exists. */
  defaultProduct: {
    mrp: 299,
    sellingPrice: 120,
  },

  /** Per-slug overrides (optional). */
  productOverrides: {} as Record<
    string,
    { mrp?: number; sellingPrice?: number }
  >,

  fees: {
    platformFee: 10,
    deliveryCharge: 40,
    freeDeliveryThreshold: 499,
  },

  /**
   * Delivery charge tiers (evaluated in order; first match wins).
   * `cartValue` = sum of selling prices × qty before fees.
   */
  deliveryRules: [
    {
      id: "free-over-threshold",
      minCartValue: 499,
      charge: 0,
    },
    {
      id: "standard",
      minCartValue: 0,
      charge: 40,
    },
  ] as const,

  /** Optional per-item delivery surcharge (future use). */
  perItemDeliverySurcharge: 0,

  coupon: {
    enabled: true,
    codes: {
      JFF20: { discount: 20, label: "₹20 off" },
      WELCOME10: { discount: 10, label: "10% off (flat ₹10)" },
    } as Record<string, { discount: number; label: string }>,
  },

  estimatedDelivery: {
    minDays: 3,
    maxDays: 5,
    label: "3–5 business days",
  },

  taxNote: "Inclusive of all taxes",
} as const;

export type PricingConfig = typeof PRICING_CONFIG;
