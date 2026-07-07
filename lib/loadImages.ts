import fs from "fs";
import path from "path";

export const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg", ".webp"] as const;

export type ImageExtension = (typeof IMAGE_EXTENSIONS)[number];

export function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext as ImageExtension);
}

export function shouldIgnoreEntry(name: string): boolean {
  return name === ".DS_Store" || name.startsWith(".");
}

/**
 * Load all image paths from a folder relative to the public products directory.
 * Returns web-accessible paths like `/images/products/Men/Bathroom/Black/E1.png`.
 */
export function loadImagesFromFolder(
  folderAbsolutePath: string,
  publicProductsRoot: string,
  webBasePath = "/images/products"
): string[] {
  if (!fs.existsSync(folderAbsolutePath)) return [];

  const entries = fs.readdirSync(folderAbsolutePath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && !shouldIgnoreEntry(entry.name) && isImageFile(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((filename) => {
      const relative = path.relative(publicProductsRoot, folderAbsolutePath);
      return `${webBasePath}/${relative.split(path.sep).join("/")}/${filename}`;
    });
}

/**
 * Recursively find all product folders — directories that directly contain images.
 * Ignores .DS_Store and empty folders.
 */
export function findProductFolders(rootDir: string): string[] {
  const productFolders: string[] = [];

  function walk(currentDir: string) {
    if (!fs.existsSync(currentDir)) return;

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    const imageFiles = entries.filter(
      (e) => e.isFile() && !shouldIgnoreEntry(e.name) && isImageFile(e.name)
    );
    const subdirs = entries.filter((e) => e.isDirectory() && !shouldIgnoreEntry(e.name));

    if (imageFiles.length > 0) {
      productFolders.push(currentDir);
      return;
    }

    for (const subdir of subdirs) {
      walk(path.join(currentDir, subdir.name));
    }
  }

  walk(rootDir);
  return productFolders.sort();
}
