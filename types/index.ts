export type Gender = "Men" | "Women" | "Kids" | "Unisex";

export type ProductCategory =
  | "Orthopedic"
  | "Regular"
  | "Bathroom"
  | "EVA"
  | "PVC"
  | "Rubber"
  | "PU"
  | "Fashion"
  | "Casual"
  | "House"
  | "Outdoor";

export type Material =
  | "EVA"
  | "PVC"
  | "Rubber"
  | "PU"
  | "Memory Foam";

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

export type SortOption = "newest" | "featured" | "name";

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
