import { queryKeys } from "./query-keys";

/** Shared TanStack Query options for pincode lookup */
export function createPincodeQueryOptions(
  pincode: string,
  fetcher: (pin: string) => Promise<unknown>
) {
  return {
    queryKey: queryKeys.pincode(pincode),
    queryFn: () => fetcher(pincode),
    enabled: /^\d{6}$/.test(pincode),
    staleTime: 1000 * 60 * 30,
  };
}

/** Shared TanStack Query options for product detail */
export function createProductQueryOptions(
  slug: string,
  fetcher: (s: string) => Promise<unknown>
) {
  return {
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => fetcher(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 10,
  };
}
