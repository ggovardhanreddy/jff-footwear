import type { Gender, ProductColor } from "./index";

export type CustomizerCategory =
  | "Orthopedic"
  | "Bathroom"
  | "Regular"
  | "Casual"
  | "Fashion";

export type CustomizerMaterial =
  | "EVA"
  | "PVC"
  | "Rubber"
  | "PU"
  | "Memory Foam";

export type SoleType = "Soft" | "Medium" | "Hard" | "Anti Slip";

export type StrapType =
  | "PVC Strap"
  | "Rubber Strap"
  | "Fabric Strap"
  | "Leather Strap"
  | "Printed Strap"
  | "Custom Strap";

export type PackagingType =
  | "Standard"
  | "Premium Box"
  | "Bulk Packing"
  | "Export Packing";

export type OrderType =
  | "Personal"
  | "Retail"
  | "Wholesale"
  | "Distributor"
  | "Export";

export type LogoPosition = "Top" | "Heel" | "Side" | "Strap";

export interface ProductCustomization {
  category: CustomizerCategory | "";
  gender: Gender | "";
  material: CustomizerMaterial | "";
  soleType: SoleType | "";
  strapType: StrapType | "";
  color: ProductColor | "";
  size: number | "";
  quantity: number;
  customLogo: boolean;
  logoFileName: string;
  logoPosition: LogoPosition | "";
  packaging: PackagingType | "";
  orderType: OrderType | "";
  specialInstructions: string;
  deliveryPincode: string;
  deliveryState: string;
  deliveryBy: string;
  /** Client-only data URL for logo preview — not persisted to storage */
  logoPreviewUrl: string;
}

export const EMPTY_CUSTOMIZATION: ProductCustomization = {
  category: "",
  gender: "",
  material: "",
  soleType: "",
  strapType: "",
  color: "",
  size: "",
  quantity: 1,
  customLogo: false,
  logoFileName: "",
  logoPosition: "",
  packaging: "",
  orderType: "",
  specialInstructions: "",
  deliveryPincode: "",
  deliveryState: "",
  deliveryBy: "",
  logoPreviewUrl: "",
};
