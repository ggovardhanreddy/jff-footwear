export type CommerceEvent =
  | "search"
  | "view_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "wishlist"
  | "begin_checkout"
  | "purchase"
  | "coupon_applied"
  | "filter_used"
  | "sort_used";

type CommerceParams = Record<string, string | number | boolean | undefined>;

/** Dispatches a commerce event. No vendor is attached until one is configured. */
export function trackCommerce(event: CommerceEvent, params: CommerceParams = {}) {
  if (typeof window === "undefined") return;
  const detail = { event, ...params };
  window.dispatchEvent(new CustomEvent("jff:commerce", { detail }));
}
