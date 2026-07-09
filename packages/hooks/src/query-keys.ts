/** TanStack Query keys shared across web and mobile. */

export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["products", "list", filters ?? {}] as const,
    detail: (slug: string) => ["products", "detail", slug] as const,
    search: (q: string) => ["products", "search", q] as const,
  },
  pincode: (pin: string) => ["pincode", pin] as const,
  delivery: {
    estimate: (pin: string) => ["delivery", "estimate", pin] as const,
    cod: (pin: string) => ["delivery", "cod", pin] as const,
  },
  categories: ["categories"] as const,
} as const;

export const storageKeys = {
  cart: "jff-cart",
  wishlist: "jff-wishlist",
  recentlyViewed: "jff-recently-viewed",
  compare: "jff-compare",
  searchHistory: "jff-search-history",
  offlineProducts: "jff-offline-products",
  theme: "jff-theme",
  coupon: "jff-coupon",
  pushToken: "jff-push-token",
} as const;
