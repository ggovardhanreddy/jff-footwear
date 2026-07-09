import { PRICING_CONFIG } from "@/lib/pricing-config";
import { calculateOrderSummary } from "@/lib/pricing";
import type { CartItem } from "@/types";
import type { ProductCustomization } from "@/types/customizer";
import type {
  CustomizerMaterial,
  PackagingType,
  SoleType,
  StrapType,
} from "@/types/customizer";
import { getBulkDiscountPercent } from "@jff/utils/wholesale";

export { getBulkDiscountPercent };

const BASE_MRP = 299;
const BASE_DISCOUNT = 180;

const MATERIAL_ADJUST: Record<
  CustomizerMaterial,
  { mrp: number; discount: number }
> = {
  EVA: { mrp: 0, discount: 0 },
  PVC: { mrp: -20, discount: -10 },
  Rubber: { mrp: 0, discount: 0 },
  PU: { mrp: 30, discount: 15 },
  "Memory Foam": { mrp: 50, discount: 25 },
};

const SOLE_ADJUST: Record<SoleType, number> = {
  Soft: 0,
  Medium: 0,
  Hard: 10,
  "Anti Slip": 15,
};

const STRAP_ADJUST: Record<StrapType, number> = {
  "PVC Strap": 0,
  "Rubber Strap": 0,
  "Fabric Strap": 10,
  "Leather Strap": 25,
  "Printed Strap": 15,
  "Custom Strap": 30,
};

const PACKAGING_SURCHARGE: Record<PackagingType, number> = {
  Standard: 0,
  "Premium Box": 12,
  "Bulk Packing": -5,
  "Export Packing": 20,
};

const LOGO_SURCHARGE_PER_PAIR = 25;

export interface CustomOrderPricing {
  mrp: number;
  discount: number;
  sellingPrice: number;
  optionSurcharge: number;
  quantity: number;
  cartSellingTotal: number;
  bulkDiscountPercent: number;
  bulkDiscountAmount: number;
  platformFee: number;
  deliveryCharge: number;
  grandTotal: number;
  totalSavings: number;
  isFreeDelivery: boolean;
  freeDeliveryThreshold: number;
  perPairBreakdown: {
    material: string;
    sole: string;
    strap: string;
    packaging: string;
    branding: string;
  };
}

function unitPricing(config: ProductCustomization) {
  const materialAdj = config.material
    ? MATERIAL_ADJUST[config.material]
    : { mrp: 0, discount: 0 };
  const soleAdj = config.soleType ? SOLE_ADJUST[config.soleType] : 0;
  const strapAdj = config.strapType ? STRAP_ADJUST[config.strapType] : 0;
  const packagingAdj = config.packaging
    ? PACKAGING_SURCHARGE[config.packaging]
    : 0;
  const logoAdj = config.customLogo ? LOGO_SURCHARGE_PER_PAIR : 0;

  const mrp = BASE_MRP + materialAdj.mrp + soleAdj + strapAdj;
  const discount = BASE_DISCOUNT + materialAdj.discount;
  const sellingBase = Math.max(49, mrp - discount);
  const optionSurcharge = packagingAdj + logoAdj;
  const sellingPrice = sellingBase + optionSurcharge;

  return {
    mrp,
    discount,
    sellingPrice,
    optionSurcharge,
    perPairBreakdown: {
      material: config.material || "—",
      sole: config.soleType ? `+₹${soleAdj}` : "—",
      strap: config.strapType ? `+₹${strapAdj}` : "—",
      packaging: config.packaging
        ? packagingAdj >= 0
          ? `+₹${packagingAdj}`
          : `₹${packagingAdj}`
        : "—",
      branding: config.customLogo ? `+₹${logoAdj}` : "—",
    },
  };
}

/** Full pricing pipeline with option surcharges and bulk discounts */
export function calculateCustomOrderPricing(
  config: ProductCustomization
): CustomOrderPricing {
  const quantity = Math.max(1, config.quantity);
  const unit = unitPricing(config);

  const item: CartItem = {
    id: "custom",
    productId: "custom",
    slug: "custom",
    name: "Custom JFF Slipper",
    image: "",
    size: typeof config.size === "number" ? config.size : 0,
    quantity,
    color: config.color || "Standard",
    pricing: {
      mrp: unit.mrp,
      discount: unit.mrp - unit.sellingPrice,
      sellingPrice: unit.sellingPrice,
    },
  };

  const summary = calculateOrderSummary([item]);
  const bulkDiscountPercent = getBulkDiscountPercent(quantity);
  const bulkDiscountAmount = Math.round(
    (summary.cartSellingTotal * bulkDiscountPercent) / 100
  );
  const grandTotal = summary.grandTotal - bulkDiscountAmount;
  const totalSavings =
    summary.totalSavings + bulkDiscountAmount + unit.optionSurcharge * quantity;

  return {
    mrp: unit.mrp,
    discount: unit.mrp - unit.sellingPrice + unit.optionSurcharge,
    sellingPrice: unit.sellingPrice,
    optionSurcharge: unit.optionSurcharge,
    quantity,
    cartSellingTotal: summary.cartSellingTotal,
    bulkDiscountPercent,
    bulkDiscountAmount,
    platformFee: summary.platformFee,
    deliveryCharge: summary.deliveryCharge,
    grandTotal,
    totalSavings,
    isFreeDelivery: summary.isFreeDelivery,
    freeDeliveryThreshold: PRICING_CONFIG.fees.freeDeliveryThreshold,
    perPairBreakdown: unit.perPairBreakdown,
  };
}
