/**
 * Auto-generate data/products.ts from public/images/products
 *
 * Usage:
 *   npm run generate
 *
 * Canonical catalog layout (images live in the Color folder):
 *
 *   products/Gender/Category/Color/*.png  → one product per Color folder
 *
 * Material SKU layout (one image = one product):
 *
 *   products/Unisex/EVA/D1.png  → one product per image file
 *
 * The scanner remains generic for other depths (jff-001, Future/Premium/…).
 *
 * Supported formats: png, jpg, jpeg, svg, webp
 * Ignores: .DS_Store and hidden files
 */

import fs from "fs";
import path from "path";
import {
  IMAGE_EXTENSIONS,
  scanProductImageFolders,
} from "../lib/loadImages";

const PRODUCTS_ROOT = path.join(process.cwd(), "public/images/products");
const OUTPUT_FILE = path.join(process.cwd(), "data/products.ts");

const GENDERS = ["Men", "Women", "Kids", "Unisex"] as const;
const CATEGORIES = [
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
const MATERIALS = ["EVA", "PVC", "Rubber", "Memory Foam"] as const;
const COLORS = [
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
] as const;

const SIZE_RANGES: Record<string, number[]> = {
  Women: [5, 6, 7, 8, 9, 10],
  Men: [5, 6, 7, 8, 9, 10, 11, 12],
  Kids: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  Unisex: [5, 6, 7, 8, 9, 10, 11, 12],
};

const MATERIAL_BY_CATEGORY: Record<string, string> = {
  Orthopedic: "Memory Foam",
  Bathroom: "PVC",
  Regular: "EVA",
  Fashion: "EVA",
  Outdoor: "Rubber",
  Casual: "EVA",
  House: "EVA",
  EVA: "EVA",
  PVC: "PVC",
  Rubber: "Rubber",
};

const CATEGORY_BY_MATERIAL: Record<string, string> = {
  EVA: "Regular",
  PVC: "Bathroom",
  Rubber: "Outdoor",
  "Memory Foam": "Orthopedic",
};

type Gender = (typeof GENDERS)[number];
type Category = (typeof CATEGORIES)[number];
type Material = (typeof MATERIALS)[number];
type Color = (typeof COLORS)[number];

interface GeneratedProduct {
  id: string;
  slug: string;
  name: string;
  gender: Gender;
  category: Category;
  material: Material;
  color: Color | "Standard";
  sizes: number[];
  images: string[];
  imageFolder: string;
  featured: boolean;
  newArrival: boolean;
  description: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function equalsToken(part: string, token: string): boolean {
  return part.trim().toLowerCase() === token.toLowerCase();
}

function matchFromList<T extends string>(
  part: string,
  list: readonly T[]
): T | undefined {
  return list.find((token) => equalsToken(part, token));
}

function formatPathSegment(segment: string): string {
  const gender = matchFromList(segment, GENDERS);
  if (gender) return gender;

  const category = matchFromList(segment, CATEGORIES);
  if (category) return category;

  const material = matchFromList(segment, MATERIALS);
  if (material) return material;

  const color = matchFromList(segment, COLORS);
  if (color) return color;

  if (/^jff-\d+$/i.test(segment)) {
    return segment.toUpperCase().replace("JFF-", "JFF ");
  }

  if (segment.toUpperCase() === segment && segment.length <= 4) {
    return segment.toUpperCase();
  }

  return segment
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function isCategoryOnlyPart(part: string): boolean {
  return Boolean(matchFromList(part, CATEGORIES)) && !matchFromList(part, MATERIALS);
}

interface PathMetadata {
  gender: Gender;
  category: Category;
  material: Material;
  color: Color | "Standard";
}

/**
 * Canonical layout: Gender / Category / Color / images
 * Example: Men/Orthopedic/Black/*.png
 */
function inferGenderCategoryColorLayout(parts: string[]): PathMetadata | null {
  if (parts.length !== 3) return null;

  const gender = matchFromList(parts[0], GENDERS);
  const color = matchFromList(parts[2], COLORS);
  if (!gender || !color) return null;

  const category =
    (matchFromList(parts[1], CATEGORIES) as Category | undefined) ?? "Regular";
  const material = (MATERIAL_BY_CATEGORY[category] || "EVA") as Material;

  return { gender, category, material, color };
}

/**
 * Alternate layout: Gender / Material / images
 * Example: Unisex/EVA/*.png
 */
function inferGenderMaterialLayout(parts: string[]): PathMetadata | null {
  if (parts.length !== 2) return null;

  const gender = matchFromList(parts[0], GENDERS);
  const material = matchFromList(parts[1], MATERIALS);
  if (!gender || !material) return null;

  const category = (CATEGORY_BY_MATERIAL[material] || "Regular") as Category;
  return { gender, category, material, color: "Standard" };
}

/** Token-based fallback for arbitrary folder depths. */
function inferFromPathTokens(parts: string[]): PathMetadata {
  let gender: Gender = "Unisex";
  let category: Category = "Regular";
  let material: Material = "EVA";
  let color: Color | "Standard" = "Standard";

  for (const part of parts) {
    const genderMatch = matchFromList(part, GENDERS);
    const materialMatch = matchFromList(part, MATERIALS);
    const categoryMatch = matchFromList(part, CATEGORIES);
    const colorMatch = matchFromList(part, COLORS);

    if (genderMatch) gender = genderMatch;
    if (materialMatch) material = materialMatch;
    if (categoryMatch && !materialMatch) category = categoryMatch;
    if (colorMatch) color = colorMatch;
  }

  const hasMaterial = parts.some((part) => matchFromList(part, MATERIALS));
  const hasCategory = parts.some((part) => isCategoryOnlyPart(part));

  if (!hasMaterial) {
    material = (MATERIAL_BY_CATEGORY[category] || "EVA") as Material;
  }

  if (!hasCategory && hasMaterial) {
    category = (CATEGORY_BY_MATERIAL[material] || category) as Category;
  }

  return { gender, category, material, color };
}

/**
 * Infer catalog metadata from folder path.
 * Prefers canonical Gender/Category/Color, then Gender/Material, then token scan.
 * Pass `imageStem` (e.g. D1) for Gender/Material SKU folders — one product per file.
 */
function inferFromFolderPath(
  parts: string[],
  imageStem?: string
): Omit<
  GeneratedProduct,
  | "slug"
  | "sizes"
  | "images"
  | "imageFolder"
  | "featured"
  | "newArrival"
  | "description"
> & { slugBase: string } {
  if (parts.length === 1 && /^jff-\d+$/i.test(parts[0])) {
    const num = parts[0].replace(/^jff-/i, "");
    const id = parts[0].toLowerCase();
    return {
      id,
      slugBase: id,
      name: `JFF ${num} Premium Slippers`,
      gender: "Unisex",
      category: "Regular",
      material: "EVA",
      color: "Standard",
    };
  }

  const metadata =
    inferGenderCategoryColorLayout(parts) ??
    inferGenderMaterialLayout(parts) ??
    inferFromPathTokens(parts);

  const idParts = parts.map((part) => part.toLowerCase());
  if (imageStem) idParts.push(imageStem.toLowerCase());
  const id = idParts.join("-");

  const nameParts = parts.map(formatPathSegment);
  if (imageStem) nameParts.push(imageStem.toUpperCase());
  const name = `JFF ${nameParts.join(" ")} Slippers`;

  return {
    id,
    slugBase: id,
    name,
    ...metadata,
  };
}

/** Gender/Material folders hold individual SKUs — one product per image file. */
function isGenderMaterialSkuFolder(parts: string[]): boolean {
  return inferGenderMaterialLayout(parts) !== null;
}

function buildDescription(
  product: Omit<GeneratedProduct, "description">
): string {
  const colorText =
    product.color !== "Standard" ? ` in ${product.color}` : "";
  return `Premium ${product.gender.toLowerCase()} ${product.category.toLowerCase()} slippers${colorText}, crafted from high-quality ${product.material}. Designed for all-day comfort with ergonomic support, slip-resistant sole, and durable construction. Ideal for wholesale and retail inquiries.`;
}

function uniqueSlug(base: string, used: Set<string>): string {
  let slug = slugify(base);
  let counter = 1;
  while (used.has(slug)) {
    slug = `${slugify(base)}-${counter++}`;
  }
  used.add(slug);
  return slug;
}

function scanProducts(): GeneratedProduct[] {
  if (!fs.existsSync(PRODUCTS_ROOT)) {
    console.warn(`Products directory not found: ${PRODUCTS_ROOT}`);
    return [];
  }

  const scanned = scanProductImageFolders(PRODUCTS_ROOT);
  const usedSlugs = new Set<string>();
  const products: GeneratedProduct[] = [];
  let productIndex = 0;

  scanned.forEach((folder) => {
    const splitByImage = isGenderMaterialSkuFolder(folder.relativeParts);

    const addProduct = (productImages: string[], imageStem?: string) => {
      const inferred = inferFromFolderPath(folder.relativeParts, imageStem);
      const slug = uniqueSlug(inferred.slugBase, usedSlugs);
      const sizes = SIZE_RANGES[inferred.gender] ?? SIZE_RANGES.Unisex;

      const base: Omit<GeneratedProduct, "description"> = {
        id: inferred.id,
        slug,
        name: inferred.name,
        gender: inferred.gender,
        category: inferred.category,
        material: inferred.material,
        color: inferred.color,
        sizes,
        images: productImages,
        imageFolder: folder.relativePath,
        featured: productIndex < 8,
        newArrival: productIndex >= scanned.length - 12,
      };

      products.push({
        ...base,
        description: buildDescription(base),
      });
      productIndex += 1;
    };

    if (splitByImage) {
      for (const imagePath of folder.images) {
        const stem = path.basename(imagePath, path.extname(imagePath));
        addProduct([imagePath], stem);
      }
      return;
    }

    addProduct(folder.images);
  });

  return products.sort((a, b) => a.slug.localeCompare(b.slug));
}

function serializeProduct(product: GeneratedProduct): string {
  return [
    "  {",
    `    id: ${JSON.stringify(product.id)},`,
    `    slug: ${JSON.stringify(product.slug)},`,
    `    name: ${JSON.stringify(product.name)},`,
    `    gender: ${JSON.stringify(product.gender)},`,
    `    category: ${JSON.stringify(product.category)},`,
    `    material: ${JSON.stringify(product.material)},`,
    `    color: ${JSON.stringify(product.color)},`,
    `    sizes: ${JSON.stringify(product.sizes)},`,
    `    images: ${JSON.stringify(product.images, null, 6).replace(/\n/g, "\n    ")},`,
    `    imageFolder: ${JSON.stringify(product.imageFolder)},`,
    `    featured: ${product.featured},`,
    `    newArrival: ${product.newArrival},`,
    `    description: ${JSON.stringify(product.description)},`,
    "  }",
  ].join("\n");
}

function writeProductsFile(products: GeneratedProduct[]): void {
  const content = `// Auto-generated by scripts/generate-products.ts — do not edit manually.
// Run \`npm run generate\` after adding folders under public/images/products.
//
// Supported image formats: ${IMAGE_EXTENSIONS.join(", ")}

import type { Product } from "@/types";

export const products: Product[] = [
${products.map(serializeProduct).join(",\n")}
];

export default products;
`;

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, content, "utf-8");
}

function main(): void {
  console.log(`Scanning ${PRODUCTS_ROOT}...`);
  console.log(`Formats: ${IMAGE_EXTENSIONS.join(", ")}`);

  const products = scanProducts();
  writeProductsFile(products);

  console.log(`✓ Generated ${products.length} products → data/products.ts`);
}

main();
