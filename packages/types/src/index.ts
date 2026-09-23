export type Gender = "Men" | "Women" | "Kids" | "Unisex";

export type ProductCategory =
  | "Orthopedic"
  | "Regular"
  | "Bathroom"
  | "EVA"
  | "PVC"
  | "Rubber"
  | "Fashion"
  | "Casual"
  | "House"
  | "Outdoor";

export type Material = "EVA" | "PVC" | "Rubber" | "Memory Foam";

export type ProductColor =
  | "Black"
  | "Blue"
  | "White"
  | "Brown"
  | "Green"
  | "Red"
  | "Grey"
  | "Pink"
  | "Purple"
  | "Cream"
  | "Orange"
  | "Yellow"
  | "Navy"
  | "Standard";

export type SortOption = "newest" | "featured" | "name" | "trending" | "price-low" | "price-high";

export interface ProductPricing {
  mrp: number;
  discount: number;
  sellingPrice: number;
}

export type AddressType = "Home" | "Work";

export interface DeliveryAddress {
  fullName: string;
  mobile: string;
  alternativeMobile: string;
  flatHouse: string;
  area: string;
  pincode: string;
  city: string;
  district: string;
  state: string;
  country: string;
  postOffice: string;
  landmark: string;
  addressType: AddressType;
  isDefault: boolean;
}

export type DeliveryAddressErrors = Partial<Record<keyof DeliveryAddress, string>>;

export interface GeolocationAddress {
  area: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface DeliveryAvailability {
  available: boolean;
  checked: boolean;
  message: string;
}

export interface CodAvailability {
  available: boolean;
  checked: boolean;
  message: string;
}

export interface DeliveryEstimate {
  tier: "same_state" | "neighbouring" | "other";
  minDays: number;
  maxDays: number;
  label: string;
  deliveryBy: string;
}

export type CheckoutStep = "address" | "delivery" | "review";

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  size: number;
  quantity: number;
  color: string;
  pricing: ProductPricing;
}

export interface OrderSummaryBreakdown {
  subtotal: number;
  productDiscount: number;
  platformFee: number;
  deliveryCharge: number;
  couponDiscount: number;
  grandTotal: number;
  totalSavings: number;
  cartSellingTotal: number;
  itemCount: number;
  isFreeDelivery: boolean;
  taxNote: string;
  estimatedDelivery: string;
  estimatedDeliveryBy?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  gender: Gender;
  category: ProductCategory;
  material: Material;
  color: ProductColor;
  sizes: number[];
  imageFolder: string;
  images: string[];
  featured: boolean;
  newArrival: boolean;
  price?: number;
  /** Present only when calculated from stored reviews or wishlists. */
  socialProof?: ProductSocialProof | null;
}

/** Star counts for 1 through 5. Missing keys mean zero. */
export interface ReviewDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

/**
 * Aggregated product proof. `source: "demo"` is sample data and must be labeled
 * as such. Production displays use `database` only.
 */
export interface ProductSocialProof {
  ratingAverage: number | null;
  ratingCount: number;
  reviewCount: number;
  wishlistCount: number;
  reviewDistribution: ReviewDistribution;
  verifiedReviewCount: number;
  helpfulReviewCount: number;
  source: "database" | "demo";
}

/** API row calculated from reviews and wishlists. */
export interface ProductSocialProofApi {
  product_slug: string;
  rating_average: number | null;
  rating_count: number;
  review_count: number;
  wishlist_count: number;
  review_distribution: ReviewDistribution;
  verified_review_count: number;
  helpful_review_count: number;
}

export interface CustomerReview {
  id: string;
  productSlug: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  imageUrl?: string;
}

export interface ProductFilters {
  search: string;
  category: ProductCategory | "";
  material: Material | "";
  gender: Gender | "";
  color: ProductColor | "";
  size: number | "";
  sort: SortOption;
  featured: boolean;
  newArrival: boolean;
  trending: boolean;
  minPrice: number | "";
  maxPrice: number | "";
}

export interface ColorVariant {
  color: ProductColor;
  slug: string;
  image: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  productName: string;
  avatar: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface MaterialInfo {
  id: string;
  name: Material;
  slug: string;
  description: string;
  productCount: number;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ManufacturingStep {
  id: string;
  step: number;
  title: string;
  description: string;
  image: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}
