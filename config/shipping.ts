/**
 * Shipping, delivery, and COD configuration.
 * Replace pincode lists with a logistics API when integrating production.
 */

export const SHIPPING_CONFIG = {
  FREE_DELIVERY_THRESHOLD: 499,
  DELIVERY_CHARGE: 40,
  PLATFORM_FEE: 10,

  /** Origin warehouse state for delivery estimates */
  WAREHOUSE_STATE: "Andhra Pradesh",

  /**
   * Supported delivery PIN codes. Empty = allow all valid PINs (demo mode).
   * Populate for production restriction.
   */
  SUPPORTED_DELIVERY_PINCODES: [] as string[],

  /**
   * Supported COD PIN codes. Empty = mirror delivery availability (demo mode).
   */
  SUPPORTED_COD_PINCODES: [] as string[],

  /** When pincode lists are empty, allow nationwide delivery (demo) */
  ALLOW_ALL_DELIVERY_WHEN_LIST_EMPTY: true,

  /** When COD list is empty, enable COD wherever delivery is available (demo) */
  ALLOW_COD_WHEN_LIST_EMPTY: true,

  deliveryEstimate: {
    sameState: { minDays: 2, maxDays: 3, label: "2–3 Days" },
    neighbouring: { minDays: 3, maxDays: 5, label: "3–5 Days" },
    other: { minDays: 5, maxDays: 7, label: "5–7 Days" },
  },

  neighbouringStates: {
    "Andhra Pradesh": [
      "Telangana",
      "Karnataka",
      "Tamil Nadu",
      "Odisha",
      "Puducherry",
    ],
    Telangana: ["Andhra Pradesh", "Karnataka", "Maharashtra", "Chhattisgarh", "Odisha"],
    Karnataka: ["Andhra Pradesh", "Telangana", "Tamil Nadu", "Kerala", "Maharashtra"],
  } as Record<string, string[]>,

  messages: {
    deliveryUnavailable:
      "Sorry, we currently do not deliver to this PIN Code.",
    codAvailable: "Cash on Delivery Available",
    codUnavailable: "Cash on Delivery Not Available",
    deliveryAvailable: "Delivery Available",
    deliveryChecking: "Checking delivery availability...",
  },

  location: {
    nominatimUrl: "https://nominatim.openstreetmap.org/reverse",
    userAgent: "JFF-Footwear-Checkout/1.0",
  },

  pincodeApi: {
    provider: "postalpincode" as const,
    buildUrl: (pincode: string) =>
      `https://api.postalpincode.in/pincode/${pincode}`,
    debounceMs: 400,
  },
} as const;

export type ShippingConfig = typeof SHIPPING_CONFIG;
