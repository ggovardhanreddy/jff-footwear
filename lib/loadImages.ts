import fs from "fs";
import path from "path";
import { isExcludedProductImage } from "./productViews";

export const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg", ".webp"] as const;

export type ImageExtension = (typeof IMAGE_EXTENSIONS)[number];

/** Subfolders ignored during product scan (not products, not merged into gallery). */
const IGNORED_SUBFOLDERS = new Set(["360"]);

export interface ScannedProductFolder {
  /** Absolute path on disk. */
  absolutePath: string;
  /** Path relative to the products root, POSIX-style (`Men/Regular/Black`). */
  relativePath: string;
  /** Path segments relative to the products root. */
  relativeParts: string[];
  /** Web paths for images in this folder (`/images/products/...`). */
  images: string[];
}

export function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext as ImageExtension);
}

export function shouldIgnoreEntry(name: string): boolean {
  return name === ".DS_Store" || name.startsWith(".");
}

function toWebPath(
  dir: string,
  filename: string,
  publicProductsRoot: string,
  webBasePath: string
): string {
  const relative = path.relative(publicProductsRoot, dir);
  return `${webBasePath}/${relative.split(path.sep).join("/")}/${filename}`;
}

/**
 * Collect visible product image paths from a folder (direct files only).
 * Ignores `360/` spin sequences — they are not shown in the gallery.
 */
export function loadImagesFromFolder(
  folderAbsolutePath: string,
  publicProductsRoot: string,
  webBasePath = "/images/products"
): string[] {
  if (!fs.existsSync(folderAbsolutePath)) return [];

  const entries = fs.readdirSync(folderAbsolutePath, { withFileTypes: true });

  return entries
    .filter(
      (entry) =>
        entry.isFile() && !shouldIgnoreEntry(entry.name) && isImageFile(entry.name)
    )
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((filename) =>
      toWebPath(folderAbsolutePath, filename, publicProductsRoot, webBasePath)
    )
    .filter((src) => !isExcludedProductImage(src));
}

/**
 * Generic recursive scanner.
 *
 * Canonical catalog layout:
 *   Gender/Category/Color/*.png  → one product per Color folder (image gallery)
 *
 * Material SKU layout:
 *   Gender/Material/D1.png       → one product per image file
 *
 * - Walks every folder under `rootDir` at unlimited depth.
 * - Ignores `.DS_Store` and hidden entries.
 * - Detects supported image files anywhere in the tree.
 * - Groups images by their nearest parent folder (direct image files only).
 * - Skips `360/` spin frame folders entirely.
 */
export function scanProductImageFolders(
  rootDir: string,
  webBasePath = "/images/products"
): ScannedProductFolder[] {
  const productFolders: ScannedProductFolder[] = [];

  function walk(currentDir: string) {
    if (!fs.existsSync(currentDir)) return;

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    const directImages = entries.filter(
      (entry) =>
        entry.isFile() && !shouldIgnoreEntry(entry.name) && isImageFile(entry.name)
    );
    const subdirs = entries.filter(
      (entry) =>
        entry.isDirectory() &&
        !shouldIgnoreEntry(entry.name) &&
        !IGNORED_SUBFOLDERS.has(entry.name)
    );

    if (directImages.length > 0) {
      const relativePath = path.relative(rootDir, currentDir);
      const relativeParts =
        relativePath.length > 0 ? relativePath.split(path.sep) : [];
      const images = loadImagesFromFolder(currentDir, rootDir, webBasePath);

      productFolders.push({
        absolutePath: currentDir,
        relativePath: relativeParts.join("/"),
        relativeParts,
        images,
      });
    }

    for (const subdir of subdirs) {
      walk(path.join(currentDir, subdir.name));
    }
  }

  walk(rootDir);
  return productFolders.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

/** @deprecated Use `scanProductImageFolders` instead. */
export function findProductFolders(rootDir: string): string[] {
  return scanProductImageFolders(rootDir).map((folder) => folder.absolutePath);
}
