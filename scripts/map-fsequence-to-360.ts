/**
 * Maps F1–F11 product photography to named 360° studio filenames.
 *
 * Assumes frames were shot counter-clockwise starting at front (F1 = 0°).
 * Target angles (CCW): 0, 45, 90, 135, 180, 225, 270, 315
 *
 * Usage:
 *   npx tsx scripts/map-fsequence-to-360.ts Men/Bathroom/Black jff-001
 */

import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "public/images/products");

/** CCW rotation filenames aligned with Product360Viewer. */
export const STUDIO_360_MAP = [
  { angle: 0, file: "front.png", frame: 1 },
  { angle: 45, file: "front-left.png", frame: 2 },
  { angle: 90, file: "left.png", frame: 4 },
  { angle: 135, file: "back-left.png", frame: 5 },
  { angle: 180, file: "back.png", frame: 6 },
  { angle: 225, file: "back-right.png", frame: 8 },
  { angle: 270, file: "right.png", frame: 9 },
  { angle: 315, file: "front-right.png", frame: 11 },
] as const;

function copyFrame(
  sourceDir: string,
  targetDir: string,
  frameNum: number,
  targetName: string
) {
  const src = path.join(sourceDir, `F${frameNum}.png`);
  const dest = path.join(targetDir, targetName);
  if (!fs.existsSync(src)) {
    console.warn(`  ⚠ Missing ${src}`);
    return false;
  }
  fs.copyFileSync(src, dest);
  console.log(`  ✓ F${frameNum}.png → ${targetName}`);
  return true;
}

function main() {
  const [sourceFolder, targetFolder = sourceFolder] = process.argv.slice(2);
  if (!sourceFolder) {
    console.error(
      "Usage: npx tsx scripts/map-fsequence-to-360.ts <source-folder> [target-folder]"
    );
    process.exit(1);
  }

  const sourceDir = path.join(ROOT, sourceFolder);
  const targetDir = path.join(ROOT, targetFolder);

  if (!fs.existsSync(sourceDir)) {
    console.error(`Source not found: ${sourceDir}`);
    process.exit(1);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  console.log(`Mapping 360° sequence:\n  ${sourceDir}\n  → ${targetDir}\n`);

  for (const { angle, file, frame } of STUDIO_360_MAP) {
    copyFrame(sourceDir, targetDir, frame, file);
    console.log(`    (${angle}°)`);
  }

  // Use F6 top-down for top view when available
  copyFrame(sourceDir, targetDir, 6, "top.png");
  // F7 often shows sole — fallback if present
  if (!copyFrame(sourceDir, targetDir, 7, "bottom.png")) {
    console.log("  ℹ No F7 for bottom — add bottom.png manually");
  }

  copyFrame(sourceDir, targetDir, 1, "main.png");
  console.log("\nDone. Run `npm run generate` to refresh products.ts");
}

main();
