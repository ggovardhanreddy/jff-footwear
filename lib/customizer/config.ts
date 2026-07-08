import type {
  CustomizerCategory,
  CustomizerMaterial,
  LogoPosition,
  OrderType,
  PackagingType,
  SoleType,
  StrapType,
} from "@/types/customizer";
import { GENDERS, SIZE_RANGES } from "@/lib/constants";
import type { Gender, ProductColor } from "@/types";

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
    value: "Rubber",
    description: "Heavy-duty grip and longevity — built for outdoor use.",
  },
  {
    value: "PU",
    description: "Premium polyurethane finish with soft touch and lasting flexibility.",
  },
  {
    value: "Memory Foam",
    description: "Orthopedic support with pressure-relieving comfort.",
  },
];

export const SOLE_TYPES: SoleType[] = ["Soft", "Medium", "Hard", "Anti Slip"];

export const STRAP_TYPES: StrapType[] = [
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

export { GENDERS as CUSTOMIZER_GENDERS, SIZE_RANGES };

export function getSizesForGender(gender: Gender): number[] {
  return [...(SIZE_RANGES[gender] ?? SIZE_RANGES.Unisex)];
}
