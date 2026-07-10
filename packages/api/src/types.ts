export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  theme: "light" | "dark" | "system";
  language: string;
  delivery_location: string | null;
  delivery_pincode: string | null;
  role?: "customer" | "admin" | "wholesale";
  is_wholesale?: boolean;
  created_at: string;
  updated_at: string;
};

export type AddressRow = {
  id: string;
  user_id: string;
  label: string | null;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  lat: number | null;
  lng: number | null;
  created_at: string;
};

export type OrderRow = {
  id: string;
  user_id: string | null;
  order_number: string;
  status: string;
  payment_method: string;
  payment_id: string | null;
  razorpay_order_id: string | null;
  subtotal: number;
  discount: number;
  delivery_charge: number;
  platform_fee: number;
  coins_redeemed: number;
  coins_earned: number;
  grand_total: number;
  coupon_code: string | null;
  shipping_address: unknown;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CoinLedgerRow = {
  id: string;
  user_id: string;
  delta: number;
  balance_after: number;
  reason: string;
  order_id: string | null;
  created_at: string;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  category: "offers" | "orders" | "rewards" | "recommendations" | "restock";
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  created_at: string;
};

export type PlaceOrderPayload = {
  items: Array<{
    product_slug: string;
    product_name: string;
    size?: string;
    color?: string;
    quantity: number;
    unit_price: number;
    mrp: number;
  }>;
  payment_method: "razorpay" | "cod" | "whatsapp" | "coins";
  coins_redeemed?: number;
  shipping_address?: unknown;
  coupon_code?: string;
  notes?: string;
  payment_id?: string;
  razorpay_order_id?: string;
};

export type ProductSeo = {
  title: string;
  description: string;
  keywords: string;
  metaDescription: string;
  searchTags: string[];
};

export type ProductSpecifications = {
  productType: string;
  category: string;
  color: string;
  secondaryColor: string;
  pattern: string;
  texture: string;
  material: string;
  soleMaterial: string;
  upperMaterial: string;
  strapMaterial: string;
  closure: string;
  toeStyle: string;
  heelType: string;
  weight: string;
  waterResistant: string;
  washable: string;
  grip: string;
  comfortLevel: string;
  usage: string;
  suitableFor: string[];
  season: string;
  gender: string;
  finish: string;
  [key: string]: string | string[] | undefined;
};

export type AiConfidenceMap = {
  color: number;
  material: number;
  pattern: number;
  productType: number;
  comfortCategory: number;
  sole: number;
  gender: number;
  usage: number;
  [key: string]: number;
};

export type AiProductAnalysis = {
  productName: string;
  shortDescription: string;
  longDescription: string;
  specifications: ProductSpecifications;
  features: string[];
  seo: ProductSeo;
  tags: string[];
  confidence: AiConfidenceMap;
};

export type AnalyzeProductImagesPayload = {
  imageUrls?: string[];
  /** Prefer inline images so the Edge Function does not need to re-fetch Storage URLs */
  images?: Array<{ mimeType: string; data: string }>;
  hints?: { gender?: string };
};

export type AnalyzeProductImagesResult = {
  analysis: AiProductAnalysis;
  needsReview: boolean;
  flagged: string[];
  raw?: unknown;
  error?: string;
};

export type CatalogProductInsert = {
  slug: string;
  name: string;
  description?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  category_id?: string | null;
  gender?: string | null;
  material?: string | null;
  color?: string | null;
  mrp: number;
  selling_price: number;
  featured?: boolean;
  new_arrival?: boolean;
  active?: boolean;
  stock_total?: number;
  features?: string[] | null;
  specifications?: ProductSpecifications | Record<string, unknown> | null;
  seo?: ProductSeo | Record<string, unknown> | null;
  tags?: string[] | null;
  ai_confidence?: AiConfidenceMap | Record<string, number> | null;
  ai_needs_review?: boolean;
  ai_raw?: unknown;
};
