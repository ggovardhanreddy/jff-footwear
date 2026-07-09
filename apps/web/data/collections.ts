export type CollectionFilter =
  | "featured"
  | "newArrivals"
  | "bestSellers"
  | "trending"
  | "category"
  | "material"
  | "gender";

export interface Collection {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  image: string;
  filter: CollectionFilter;
  /** Used when filter is category, material, or gender */
  value?: string;
}

export const collections: Collection[] = [
  {
    id: "col-featured",
    slug: "featured",
    name: "Featured",
    title: "Featured Collection",
    description:
      "Hand-picked standout styles — our most popular slippers for everyday comfort.",
    image: "/images/categories/fashion.svg",
    filter: "featured",
  },
  {
    id: "col-new",
    slug: "new-arrivals",
    name: "New Arrivals",
    title: "New Arrivals",
    description: "Fresh styles recently added to the JFF catalogue.",
    image: "/images/categories/casual.svg",
    filter: "newArrivals",
  },
  {
    id: "col-bestsellers",
    slug: "best-sellers",
    name: "Best Sellers",
    title: "Best Sellers",
    description: "Top-performing styles trusted by retailers and buyers across India.",
    image: "/images/categories/regular.svg",
    filter: "bestSellers",
  },
  {
    id: "col-trending",
    slug: "trending",
    name: "Trending Now",
    title: "Trending Collection",
    description: "What buyers are browsing and ordering right now.",
    image: "/images/categories/men.svg",
    filter: "trending",
  },
  {
    id: "col-orthopedic",
    slug: "orthopedic-comfort",
    name: "Orthopedic Comfort",
    title: "Orthopedic Comfort",
    description: "Supportive slippers designed for all-day foot comfort.",
    image: "/images/categories/orthopedic.svg",
    filter: "category",
    value: "Orthopedic",
  },
  {
    id: "col-bathroom",
    slug: "bathroom-essentials",
    name: "Bathroom Essentials",
    title: "Bathroom Essentials",
    description: "Water-friendly slippers for wet areas and daily bathroom use.",
    image: "/images/categories/bathroom.svg",
    filter: "category",
    value: "Bathroom",
  },
  {
    id: "col-memory",
    slug: "memory-foam",
    name: "Memory Foam",
    title: "Memory Foam Collection",
    description: "Cushioned memory foam slippers for premium everyday comfort.",
    image: "/images/categories/women.svg",
    filter: "material",
    value: "Memory Foam",
  },
  {
    id: "col-kids",
    slug: "kids",
    name: "Kids",
    title: "Kids Collection",
    description: "Safe, durable slippers sized for children.",
    image: "/images/categories/kids.svg",
    filter: "gender",
    value: "Kids",
  },
];
