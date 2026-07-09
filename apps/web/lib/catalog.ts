/**
 * Build product catalog CSV rows for B2B download.
 * Used by generate-catalog script and catalog page preview.
 */
import { products } from "@jff/shared/products";
import { getProductPricing } from "@jff/utils/pricing";
import { getWholesaleUnitPrice } from "@jff/utils/wholesale";
import type { Product } from "@jff/types";

const HEADERS = [
  "SKU",
  "Name",
  "Category",
  "Gender",
  "Material",
  "Color",
  "Sizes",
  "MRP (INR)",
  "Retail Price (INR)",
  "Wholesale Price (INR)",
  "Distributor Price (INR)",
  "Featured",
  "New Arrival",
] as const;

function escapeCsv(value: string | number | boolean): string {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function productToCatalogRow(product: Product): string[] {
  const pricing = getProductPricing(product);
  const wholesale = getWholesaleUnitPrice(pricing.sellingPrice, "wholesale");
  const distributor = getWholesaleUnitPrice(pricing.sellingPrice, "distributor");

  return [
    product.slug,
    product.name,
    product.category,
    product.gender,
    product.material,
    product.color,
    product.sizes.join(";"),
    String(pricing.mrp),
    String(pricing.sellingPrice),
    String(wholesale),
    String(distributor),
    product.featured ? "Yes" : "No",
    product.newArrival ? "Yes" : "No",
  ];
}

export function buildCatalogCsv(productList: Product[] = products): string {
  const lines = [
    HEADERS.join(","),
    ...productList.map((product) =>
      productToCatalogRow(product).map(escapeCsv).join(",")
    ),
  ];
  return lines.join("\n");
}

export const CATALOG_HEADERS = HEADERS;
