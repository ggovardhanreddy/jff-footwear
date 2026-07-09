/**
 * Generate B2B product catalog CSV into public/downloads/.
 * Run via `npm run generate:catalog` or as part of prebuild.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildCatalogCsv } from "../lib/catalog";
import { products } from "@jff/shared/products";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../public/downloads");
const outFile = path.join(outDir, "jff-catalog.csv");

fs.mkdirSync(outDir, { recursive: true });
const csv = buildCatalogCsv(products);
fs.writeFileSync(outFile, csv, "utf8");

console.log(`Wrote ${products.length} products to ${outFile}`);
