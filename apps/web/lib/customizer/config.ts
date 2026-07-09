import type {
  CustomizerCategory,
  CustomizerMaterial,
  LogoPosition,
  OrderType,
  PackagingType,
  ProductCustomization,
  SoleType,
  StrapType,
} from "@/types/customizer";
import type { ProductColor } from "@/types";
import { GENDERS, SIZE_RANGES } from "@/lib/constants";
import { BULK_DISCOUNT_TIERS } from "@jff/config/wholesale-config";
import { validateQuantityForOrderType } from "@jff/utils/wholesale";

export { getSizesForGender } from "./sizes";
export { BULK_DISCOUNT_TIERS };

export const CUSTOMIZER_STEPS = [
  { id: 1, key: "category", label: "Category" },
  { id: 2, key: "gender", label: "Gender" },
  { id: 3, key: "material", label: "Material" },
  { id: 4, key: "soleType", label: "Sole Type" },
  { id: 5, key: "strapType", label: "Strap Type" },
  { id: 6, key: "color", label: "Color" },
  { id: 7, key: "size", label: "Size" },
  { id: 8, key: "quantity", label: "Quantity" },
  { id: 9, key: "branding", label: "Branding" },
  { id: 10, key: "packaging", label: "Packaging" },
  { id: 11, key: "orderType", label: "Order Type" },
  { id: 12, key: "delivery", label: "Delivery" },
  { id: 13, key: "review", label: "Review" },
] as const;

export const CUSTOMIZER_CATEGORIES: CustomizerCategory[] = [
  "Orthopedic",
  "Bathroom",
  "Regular",
  "Casual",
  "Fashion",
];

export const CUSTOMIZER_MATERIALS: {
  value: CustomizerMaterial;
  description: string;
}[] = [
  {
    value: "EVA",
    description: "Lightweight cushioned sole — ideal for everyday comfort.",
  },
  {
    value: "PVC",
    description: "Water-resistant and economical — great for bathroom use.",
  },
  {
    value: "Rubber",
    description: "Heavy-duty grip and longevity — built for outdoor use.",
  },
  {
    value: "PU",
    description: "Premium polyurethane finish with soft touch and flexibility.",
  },
  {
    value: "Memory Foam",
    description: "Orthopedic support with pressure-relieving comfort.",
  },
];

export const SOLE_TYPES: SoleType[] = [
  "Soft",
  "Medium",
  "Hard",
  "Anti Slip",
];

export const STRAP_TYPES: StrapType[] = [
  "PVC Strap",
  "Rubber Strap",
  "Fabric Strap",
  "Leather Strap",
  "Printed Strap",
  "Custom Strap",
];

export const CUSTOMIZER_COLORS: ProductColor[] = [
  "Black",
  "White",
  "Blue",
  "Brown",
  "Red",
  "Green",
  "Yellow",
  "Orange",
  "Purple",
  "Pink",
  "Grey",
  "Cream",
  "Navy",
];

export const PACKAGING_TYPES: PackagingType[] = [
  "Standard",
  "Premium Box",
  "Bulk Packing",
  "Export Packing",
];

export const ORDER_TYPES: OrderType[] = [
  "Personal",
  "Retail",
  "Wholesale",
  "Distributor",
  "Export",
];

export const LOGO_POSITIONS: LogoPosition[] = [
  "Top",
  "Heel",
  "Side",
  "Strap",
];

export const LOGO_MAX_BYTES = 1_500_000;

export const CUSTOMIZER_STORAGE_KEY = "jff-customizer-config";

export { GENDERS as CUSTOMIZER_GENDERS, SIZE_RANGES };

export function getStepTitle(step: number): string {
  const titles: Record<number, string> = {
    1: "Select Category",
    2: "Select Gender",
    3: "Select Material",
    4: "Select Sole Type",
    5: "Select Strap Type",
    6: "Select Color",
    7: "Select Size",
    8: "Enter Quantity",
    9: "Custom Branding",
    10: "Choose Packaging",
    11: "Order Type",
    12: "Delivery Estimate",
    13: "Review Your Order",
  };
  return titles[step] ?? "";
}

export function canProceedStep(
  step: number,
  config: ProductCustomization
): boolean {
  switch (step) {
    case 1:
      return !!config.category;
    case 2:
      return !!config.gender;
    case 3:
      return !!config.material;
    case 4:
      return !!config.soleType;
    case 5:
      return !!config.strapType;
    case 6:
      return !!config.color;
    case 7:
      return config.size !== "";
    case 8:
      return config.quantity >= 1;
    case 9:
      return !config.customLogo || !!config.logoPosition;
    case 10:
      return !!config.packaging;
    case 11:
      return (
        !!config.orderType &&
        validateQuantityForOrderType(config.quantity, config.orderType).valid
      );
    case 12:
      return /^\d{6}$/.test(config.deliveryPincode) && !!config.deliveryBy;
    case 13:
      return true;
    default:
      return false;
  }
}

/** Fields safe to persist (excludes logo data URL) */
export function serializeCustomization(
  config: ProductCustomization
): Omit<ProductCustomization, "logoPreviewUrl"> {
  const { logoPreviewUrl: _, ...rest } = config;
  return rest;
}
