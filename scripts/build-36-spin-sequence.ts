/**
 * Build a 36-frame (10° step) spin sequence for Product360Viewer.
 *
 * Maps each 10° slot to the nearest source frame from:
 *   - 8 named studio angles (front, front-left, …), or
 *   - F1–F11 numbered rotation set
 *
 * Output: public/images/products/<target>/360/r01.png … r36.png
 *
 * Usage:
 *   npx tsx scripts/build-36-spin-sequence.ts jff-001
 *   npx tsx scripts/build-36-spin-sequence.ts Men/Bathroom/Black jff-001
 */

import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "public/images/products");

const STUDIO_ANGLES: { angle: number; name: string }[] = [
  { angle: 0, name: "front" },
  { angle: 45, name: "front-left" },
  { angle: 90, name: "left" },
  { angle: 135, name: "back-left" },
  { angle: 180, name: "back" },
  { angle: 225, name: "back-right" },
  { angle: 270, name: "right" },
  { angle: 315, name: "front-right" },
];

function nearestAngleIndex(target: number, angles: number[]): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < angles.length; i++) {
    const raw = Math.abs(target - angles[i]);
    const dist = Math.min(raw, 360 - raw);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

function findSourceFile(dir: string, baseName: string): string | null {
  for (const ext of [".png", ".jpg", ".jpeg", ".webp"]) {
    const file = path.join(dir, `${baseName}${ext}`);
    if (fs.existsSync(file)) return file;
  }
  return null;
}

function buildFromStudio(sourceDir: string, outDir: string): boolean {
  const sources: { angle: number; path: string }[] = [];

  for (const { angle, name } of STUDIO_ANGLES) {
    const file = findSourceFile(sourceDir, name);
    if (file) sources.push({ angle, path: file });
  }

  if (sources.length < 4) return false;

  fs.mkdirSync(outDir, { recursive: true });
  const angles = sources.map((s) => s.angle);

  for (let n = 1; n <= 36; n++) {
    const targetAngle = (n - 1) * 10;
    const idx = nearestAngleIndex(targetAngle, angles);
    const src = sources[idx].path;
    const dest = path.join(outDir, `r${String(n).padStart(2, "0")}.png`);
    fs.copyFileSync(src, dest);
  }

  console.log(`  ✓ Built 36 frames from ${sources.length} studio angles`);
  return true;
}

function buildFromFSequence(sourceDir: string, outDir: string): boolean {
  const frames: { angle: number; path: string }[] = [];

  for (let i = 1; i <= 36; i++) {
    const file = findSourceFile(sourceDir, `F${i}`);
    if (file) {
      frames.push({ angle: ((i - 1) * 360) / 36, path: file });
    }
  }

  if (frames.length < 11) {
    const numbered: { angle: number; path: string }[] = [];
    for (let i = 1; i <= 11; i++) {
      const file = findSourceFile(sourceDir, `F${i}`);
      if (file) numbered.push({ angle: ((i - 1) * 360) / 11, path: file });
    }
    if (numbered.length < 8) return false;
    frames.splice(0, frames.length, ...numbered);
  }

  fs.mkdirSync(outDir, { recursive: true });
  const angles = frames.map((f) => f.angle);

  for (let n = 1; n <= 36; n++) {
    const targetAngle = (n - 1) * 10;
    const idx = nearestAngleIndex(targetAngle, angles);
    const src = frames[idx].path;
    const dest = path.join(outDir, `r${String(n).padStart(2, "0")}.png`);
    fs.copyFileSync(src, dest);
  }

  console.log(`  ✓ Built 36 frames from ${frames.length} F-sequence sources`);
  return true;
}

function copyGeneratedAssets(assetsDir: string, outDir: string): number {
  if (!fs.existsSync(assetsDir)) return 0;
  fs.mkdirSync(outDir, { recursive: true });
  let copied = 0;
  for (let n = 1; n <= 36; n++) {
    const name = `r${String(n).padStart(2, "0")}.png`;
    const src = path.join(assetsDir, name);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(outDir, name));
      copied++;
    }
  }
  if (copied > 0) console.log(`  ✓ Copied ${copied} AI-generated frames`);
  return copied;
}

function main() {
  const [sourceArg, targetArg] = process.argv.slice(2);
  const targetFolder = targetArg ?? sourceArg ?? "jff-001";
  const sourceFolder = targetArg ? sourceArg : targetFolder;

  const sourceDir = path.join(ROOT, sourceFolder);
  const targetDir = path.join(ROOT, targetFolder);
  const outDir = path.join(targetDir, "360");
  const assetsDir = path.join(
    process.env.HOME ?? "",
    ".cursor/projects/Users-govardhan-reddy-g-94gmail-com-Projects-jff-footwear/assets"
  );

  console.log(`Building 36-frame spin (10° steps):\n  source: ${sourceDir}\n  output: ${outDir}\n`);

  if (!buildFromStudio(sourceDir, outDir)) {
    if (!buildFromFSequence(sourceDir, outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
      console.log("  ℹ No studio/F source — filling from assets only");
    }
  }

  const aiCount = copyGeneratedAssets(assetsDir, outDir);

  const finalCount = fs.readdirSync(outDir).filter((f) => /^r\d{2}\.png$/i.test(f)).length;
  if (finalCount < 36) {
    console.error(`Only ${finalCount}/36 frames available.`);
    process.exit(1);
  }

  console.log(`\nDone — 36 frames at r01.png (0°) … r36.png (350°)${aiCount > 0 ? ` (${aiCount} AI frames applied)` : ""}`);
  console.log("Run `npm run generate` to refresh products.ts");
}

main();
