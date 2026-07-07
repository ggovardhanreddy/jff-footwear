import fs from "fs";
import path from "path";
import { findProductFolders, loadImagesFromFolder } from "../lib/loadImages";

const ROOT = path.join(process.cwd(), "public/images/products");
const OUTPUT = path.join(process.cwd(), "data/products.ts");

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

interface InferredProduct {
  id: string;
  name: string;
  slug: string;
  gender: Gender;
  category: Category;
  material: Material;
  color: Color | "Standard";
  sizes: number[];
  imageFolder: string;
  images: string[];
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

function inferFromPath(
  parts: string[]
): Omit<
  InferredProduct,
  | "sizes"
  | "imageFolder"
  | "images"
  | "featured"
  | "newArrival"
  | "description"
  | "slug"
> & { slugBase: string } {
  let gender: Gender = "Unisex";
  let category: Category = "Regular";
  let material: Material = "EVA";
  let color: Color | "Standard" = "Standard";

  if (parts.length === 1 && /^jff-\d+$/i.test(parts[0])) {
    const num = parts[0].replace(/^jff-/i, "");
    return {
      id: parts[0].toLowerCase(),
      slugBase: parts[0].toLowerCase(),
      name: `JFF ${num} Premium Slippers`,
      gender: "Unisex",
      category: "Regular",
      material: "EVA",
      color: "Standard",
    };
  }

  for (const part of parts) {
    const normalized = capitalize(part);
    if ((GENDERS as readonly string[]).includes(normalized))
      gender = normalized as Gender;
    else if ((CATEGORIES as readonly string[]).includes(normalized))
      category = normalized as Category;
    else if (
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
  const name = `${nameParts.join(" ")} Slippers`;
  const id = parts.map((p) => p.toLowerCase()).join("-");

  return { id, slugBase: id, name, gender, category, material, color };
}

function buildDescription(
  product: Omit<InferredProduct, "description">
): string {
  const colorText =
    product.color !== "Standard" ? ` in ${product.color}` : "";
  return `Premium ${product.gender.toLowerCase()} ${product.category.toLowerCase()} slippers${colorText}, crafted from high-quality ${product.material}. Designed for all-day comfort with ergonomic support, slip-resistant sole, and durable construction. Ideal for wholesale and retail inquiries.`;
}

function generateProducts(): InferredProduct[] {
  const folders = findProductFolders(ROOT);
  const usedSlugs = new Set<string>();
  const products: InferredProduct[] = [];

  folders.forEach((folderPath, index) => {
    const relativeParts = path.relative(ROOT, folderPath).split(path.sep);
    const images = loadImagesFromFolder(folderPath, ROOT);
    if (images.length === 0) return;

    const inferred = inferFromPath(relativeParts);
    let slug = slugify(inferred.slugBase);
    let counter = 1;
    while (usedSlugs.has(slug)) {
      slug = `${slugify(inferred.slugBase)}-${counter++}`;
    }
    usedSlugs.add(slug);

    const imageFolder = relativeParts.join("/");
    const sizes = SIZE_RANGES[inferred.gender] || SIZE_RANGES.Unisex;

    const base = {
      ...inferred,
      slug,
      sizes,
      imageFolder,
      images,
      featured: index < 8,
      newArrival: index >= folders.length - 12,
    };

    products.push({
      ...base,
      description: buildDescription(base),
    });
  });

  return products;
}

function serializeProduct(product: InferredProduct): string {
  const lines = [
    "  {",
    `    id: ${JSON.stringify(product.id)},`,
    `    name: ${JSON.stringify(product.name)},`,
    `    slug: ${JSON.stringify(product.slug)},`,
    `    gender: ${JSON.stringify(product.gender)},`,
    `    category: ${JSON.stringify(product.category)},`,
    `    material: ${JSON.stringify(product.material)},`,
    `    color: ${JSON.stringify(product.color)},`,
    `    sizes: ${JSON.stringify(product.sizes)},`,
    `    imageFolder: ${JSON.stringify(product.imageFolder)},`,
    `    images: ${JSON.stringify(product.images, null, 6).replace(/\n/g, "\n    ")},`,
    `    featured: ${product.featured},`,
    `    newArrival: ${product.newArrival},`,
    `    description: ${JSON.stringify(product.description)},`,
    "  }",
  ];
  return lines.join("\n");
}

function main() {
  console.log(`Scanning ${ROOT}...`);
  const products = generateProducts();

  const fileContent = `// Auto-generated by scripts/generate-products.ts — do not edit manually.
// Run \`npm run generate\` to regenerate after adding product image folders.

import type { Product } from "@/types";

export const products: Product[] = [
${products.map(serializeProduct).join(",\n")}
];

export default products;
`;

  fs.writeFileSync(OUTPUT, fileContent, "utf-8");
  console.log(`✓ Generated ${products.length} products → data/products.ts`);
}

main();
