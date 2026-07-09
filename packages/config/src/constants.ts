import type { ProductColor, ProductFilters } from "@jff/types";

export const COLOR_MAP: Record<ProductColor, string> = {
  Black: "#1a1a1a",
  Blue: "#2563eb",
  Red: "#dc2626",
  Pink: "#ec4899",
  Green: "#16a34a",
  Grey: "#6b7280",
  Brown: "#92400e",
  White: "#f5f5f5",
  Navy: "#1e3a5f",
  Orange: "#ea580c",
  Yellow: "#eab308",
  Purple: "#9333ea",
  Cream: "#f5f0e6",
  Standard: "#9ca3af",
};

export const WHATSAPP_NUMBER = "918106407372";

export const COMPANY = {
  name: "JFF",
  fullName: "JFF Footwear",
  tagline: "Crafted Comfort. Every Step.",
  email: "govardhan.reddy.g.94@gmail.com",
  phone: "+91 81064 07372",
  founded: "January 2021",
  foundedYear: "2021",
  address:
    "Plot 42, Rayachoty, Annamayya District, Andhra Pradesh – 516269, India",
  locationShort: "Rayachoty, Andhra Pradesh",
  description:
    "JFF Footwear is an Indian slipper manufacturer specializing in comfortable, durable, and stylish footwear for everyday use.",
  businessHours: "Monday – Saturday: 9:00 AM – 6:00 PM IST",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/categories", label: "Categories" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

/** Core app routes (static pages). */
export const ROUTES = {
  home: "/",
  products: "/products",
  product: (slug: string) => `/products/${slug}`,
  categories: "/categories",
  collections: "/collections",
  collection: (slug: string) => `/collections/${slug}`,
  search: "/search",
  recentlyViewed: "/recently-viewed",
  gallery: "/gallery",
  about: "/about",
  qualityCommitment: "/quality-commitment",
  contact: "/contact",
  faq: "/faq",
  cart: "/cart",
  checkout: "/checkout",
  wishlist: "/wishlist",
  customize: "/customize",
  compare: "/compare",
  wholesale: "/wholesale",
  distributor: "/distributor",
  catalog: "/catalog",
  oem: "/oem",
  dealer: "/dealer",
  sizeGuide: "/size-guide",
  careInstructions: "/care-instructions",
  shipping: "/shipping",
  returns: "/returns",
  privacy: "/privacy-policy",
  terms: "/terms",
} as const;

export const PRODUCT_CATEGORIES = [
  "Orthopedic",
  "Regular",
  "Bathroom",
  "Rubber",
  "Fashion",
  "Casual",
  "House",
  "Outdoor",
] as const;

export const MATERIALS = ["Rubber", "Memory Foam"] as const;

export const GENDERS = ["Men", "Women", "Kids", "Unisex"] as const;

export const COLORS = [
  "Black",
  "Blue",
  "White",
  "Brown",
  "Green",
  "Red",
  "Grey",
  "Pink",
  "Purple",
  "Cream",
  "Orange",
  "Yellow",
  "Navy",
  "Standard",
] as const;

export const SIZE_RANGES = {
  Women: [5, 6, 7, 8, 9, 10],
  Men: [5, 6, 7, 8, 9, 10, 11, 12],
  Kids: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  Unisex: [5, 6, 7, 8, 9, 10, 11, 12],
} as const;

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "trending", label: "Trending" },
  { value: "name", label: "Name (A–Z)" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
] as const;

export const DEFAULT_FILTERS: ProductFilters = {
  search: "",
  category: "",
  material: "",
  gender: "",
  color: "",
  size: "",
  sort: "featured",
  featured: false,
  newArrival: false,
  trending: false,
  minPrice: "",
  maxPrice: "",
};

export const MATERIAL_INFO = [
  {
    id: "rubber",
    name: "Rubber" as const,
    slug: "rubber",
    description: "Durable and grippy — ideal for everyday and outdoor use.",
  },
  {
    id: "memory-foam",
    name: "Memory Foam" as const,
    slug: "memory-foam",
    description: "Soft, supportive cushioning for extended comfort.",
  },
];

/** Verified statistics only — do not add invented figures. */
export const STATS = [
  { value: "2021", label: "Founded" },
  { value: "100+", label: "Employees" },
  { value: "200,000+", label: "Production Capacity" },
  { value: "Rayachoty", label: "Location", sublabel: "Andhra Pradesh" },
] as const;
