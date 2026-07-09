/** B2B order types — aligned with product customizer OrderType */
export type WholesaleOrderType =
  | "Personal"
  | "Retail"
  | "Wholesale"
  | "Distributor"
  | "Export";

/** Minimum order quantity (pairs) by order type */
export const MOQ_BY_ORDER_TYPE: Record<WholesaleOrderType, number> = {
  Personal: 1,
  Retail: 12,
  Wholesale: 50,
  Distributor: 200,
  Export: 500,
};

/** Volume discount tiers applied on top of base pricing */
export const BULK_DISCOUNT_TIERS = [
  { minQty: 500, percent: 15, label: "500+ pairs" },
  { minQty: 200, percent: 12, label: "200+ pairs" },
  { minQty: 100, percent: 10, label: "100+ pairs" },
  { minQty: 50, percent: 7, label: "50+ pairs" },
  { minQty: 20, percent: 5, label: "20+ pairs" },
] as const;

export type BulkDiscountTier = (typeof BULK_DISCOUNT_TIERS)[number];

/** Indicative B2B price multipliers on retail selling price */
export const WHOLESALE_PRICING = {
  wholesaleMultiplier: 0.82,
  distributorMultiplier: 0.75,
  exportMultiplier: 0.7,
} as const;

export const CATALOG_PATHS = {
  csv: "/downloads/jff-catalog.csv",
} as const;

export const WHOLESALE_CONFIG = {
  moq: MOQ_BY_ORDER_TYPE,
  bulkDiscountTiers: BULK_DISCOUNT_TIERS,
  pricing: WHOLESALE_PRICING,
  catalog: CATALOG_PATHS,
} as const;
