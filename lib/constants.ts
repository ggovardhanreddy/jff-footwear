import type { ProductColor, ProductFilters } from "@/types";

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
  address: "Plot 42, Industrial Estate, Surat, Gujarat 395010, India",
  founded: "1998",
  description:
    "JFF is a leading manufacturer of premium slippers, delivering comfort, durability, and style to customers worldwide.",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
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
  gallery: "/gallery",
  about: "/about",
  contact: "/contact",
  faq: "/faq",
  cart: "/cart",
  checkout: "/checkout",
} as const;

export const PRODUCT_CATEGORIES = [
  "Orthopedic",
  "Regular",
  "Bathroom",
  "EVA",
  "PVC",
  "Rubber",
  "Fashion",
  "Casual",
  "House",
  "Outdoor",
] as const;

export const MATERIALS = ["EVA", "PVC", "Rubber", "Memory Foam"] as const;

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
  { value: "name", label: "Name (A–Z)" },
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
};

export const MATERIAL_INFO = [
  {
    id: "eva",
    name: "EVA" as const,
    slug: "eva",
    description: "Lightweight, cushioned, and flexible — ideal for everyday comfort.",
  },
  {
    id: "pvc",
    name: "PVC" as const,
    slug: "pvc",
    description: "Water-resistant and durable — perfect for bathroom and wet areas.",
  },
  {
    id: "rubber",
    name: "Rubber" as const,
    slug: "rubber",
    description: "Heavy-duty grip and longevity — built for outdoor use.",
  },
  {
    id: "memory-foam",
    name: "Memory Foam" as const,
    slug: "memory-foam",
    description: "Orthopedic support with pressure-relieving comfort.",
  },
];

export const STATS = [
  { value: "25+", label: "Years of Excellence" },
  { value: "73+", label: "Product Styles" },
  { value: "30+", label: "Countries Exported" },
  { value: "2M+", label: "Pairs Annually" },
];
