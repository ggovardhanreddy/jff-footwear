/**
 * Auto-generate data/products.ts from public/images/products
 *
 * Usage:
 *   npm run generate
 *
 * Scans public/images/products recursively. Each folder that directly
 * contains image files becomes one product. Subfolders like `360/` are
 * merged into the parent product's image list (spin frames first).
 *
 * Supported formats: png, jpg, jpeg, svg, webp
 * Ignores: .DS_Store and hidden files
 */

import fs from "fs";
import path from "path";
import {
  findProductFolders,
  IMAGE_EXTENSIONS,
  loadImagesFromFolder,
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
  "PU",
  "Fashion",
  "Casual",
  "House",
  "Outdoor",
] as const;
const MATERIALS = ["EVA", "PVC", "Rubber", "PU", "Memory Foam"] as const;
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
  Fashion: "PU",
  Outdoor: "Rubber",
  Casual: "EVA",
  House: "EVA",
  EVA: "EVA",
  PVC: "PVC",
  Rubber: "Rubber",
  PU: "PU",
};

const CATEGORY_BY_MATERIAL: Record<string, string> = {
  EVA: "Regular",
  PVC: "Bathroom",
  Rubber: "Outdoor",
  PU: "Fashion",
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

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function inferFromFolderPath(
  parts: string[]
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
  let gender: Gender = "Unisex";
  let category: Category = "Regular";
  let material: Material = "EVA";
  let color: Color | "Standard" = "Standard";

  // Showcase folders: jff-001, jff-002, …
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

  for (const part of parts) {
    const normalized = capitalize(part);

    if ((GENDERS as readonly string[]).includes(normalized)) {
      gender = normalized as Gender;
    } else if ((CATEGORIES as readonly string[]).includes(normalized)) {
      category = normalized as Category;
    } else if (
      (MATERIALS as readonly string[]).includes(
        part.toUpperCase() === "PU" ? "PU" : normalized
      )
    ) {
      material = (part.toUpperCase() === "PU" ? "PU" : normalized) as Material;
    } else if ((COLORS as readonly string[]).includes(normalized)) {
      color = normalized as Color;
    }
  }

  const hasMaterial = parts.some((p) =>
    (MATERIALS as readonly string[]).includes(
      p.toUpperCase() === "PU" ? "PU" : capitalize(p)
    )
  );
  const hasCategory = parts.some((p) =>
    (CATEGORIES as readonly string[]).includes(capitalize(p))
  );

  if (!hasMaterial) {
    material = (MATERIAL_BY_CATEGORY[category] || "EVA") as Material;
  }

  if (gender === "Unisex" && hasMaterial && !hasCategory) {
    category = (CATEGORY_BY_MATERIAL[material] || "Regular") as Category;
  }

  const nameParts: string[] = [`JFF ${gender}`];
  if (color !== "Standard") nameParts.push(color);
  nameParts.push(category);
  if (gender === "Unisex" && hasMaterial) nameParts.push(`(${material})`);

  const id = parts.map((p) => p.toLowerCase()).join("-");

  return {
    id,
    slugBase: id,
    name: `${nameParts.join(" ")} Slippers`,
    gender,
    category,
    material,
    color,
  };
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

  const folders = findProductFolders(PRODUCTS_ROOT);
  const usedSlugs = new Set<string>();
  const products: GeneratedProduct[] = [];

  folders.forEach((folderPath, index) => {
    const relativeParts = path.relative(PRODUCTS_ROOT, folderPath).split(path.sep);
    const images = loadImagesFromFolder(folderPath, PRODUCTS_ROOT);

    if (images.length === 0) return;

    const inferred = inferFromFolderPath(relativeParts);
    const slug = uniqueSlug(inferred.slugBase, usedSlugs);
    const imageFolder = relativeParts.join("/");
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
      images,
      imageFolder,
      featured: index < 8,
      newArrival: index >= folders.length - 12,
    };

    products.push({
      ...base,
      description: buildDescription(base),
    });
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
