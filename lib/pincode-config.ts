import { SHIPPING_CONFIG } from "@/config/shipping";

/**
 * PIN code API configuration — provider swappable via config/shipping.ts
 */
export const PINCODE_CONFIG = {
  activeProvider: SHIPPING_CONFIG.pincodeApi.provider,
  debounceMs: SHIPPING_CONFIG.pincodeApi.debounceMs,
  providers: {
    postalpincode: {
      id: "postalpincode" as const,
      label: "Postal PIN Code API",
      buildUrl: SHIPPING_CONFIG.pincodeApi.buildUrl,
    },
  },
  messages: {
    invalid: "Enter a valid 6-digit PIN code",
    notFound: "PIN code not found",
    networkError: "Network error — please try again or enter manually",
    loading: "Loading address...",
    manualFallback:
      "We couldn't find this PIN code. Please enter your address manually.",
  },
} as const;
