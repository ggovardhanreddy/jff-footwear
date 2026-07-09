import {
  BULK_DISCOUNT_TIERS,
  MOQ_BY_ORDER_TYPE,
  WHOLESALE_PRICING,
  type WholesaleOrderType,
} from "@jff/config/wholesale-config";

export function getMoqForOrderType(orderType: string): number {
  if (orderType in MOQ_BY_ORDER_TYPE) {
    return MOQ_BY_ORDER_TYPE[orderType as WholesaleOrderType];
  }
  return 1;
}

export interface MoqValidation {
  valid: boolean;
  moq: number;
  shortfall: number;
  message: string;
}

export function validateQuantityForOrderType(
  quantity: number,
  orderType: string
): MoqValidation {
  const moq = getMoqForOrderType(orderType);
  const qty = Math.max(0, Math.floor(quantity));
  const valid = !orderType || qty >= moq;
  const shortfall = valid ? 0 : moq - qty;

  return {
    valid,
    moq,
    shortfall,
    message: valid
      ? ""
      : `Minimum order for ${orderType} is ${moq} pairs (${shortfall} more required).`,
  };
}

export function getBulkDiscountPercent(quantity: number): number {
  for (const tier of BULK_DISCOUNT_TIERS) {
    if (quantity >= tier.minQty) return tier.percent;
  }
  return 0;
}

export type B2bPriceTier = "wholesale" | "distributor" | "export";

export function getWholesaleUnitPrice(
  retailSellingPrice: number,
  tier: B2bPriceTier = "wholesale"
): number {
  const multiplier =
    tier === "distributor"
      ? WHOLESALE_PRICING.distributorMultiplier
      : tier === "export"
        ? WHOLESALE_PRICING.exportMultiplier
        : WHOLESALE_PRICING.wholesaleMultiplier;

  return Math.max(1, Math.round(retailSellingPrice * multiplier));
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
