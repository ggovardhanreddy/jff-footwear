/**
 * Verify sitemap.xml and robots.txt after `next build` (static export).
 * Run: npm run verify:sitemap --workspace=@jff/web
 */
import fs from "fs";
import path from "path";
import { NOINDEX_PATHS } from "../lib/sitemap-config";

const OUT_DIR = path.join(process.cwd(), "out");
const SITEMAP_PATH = path.join(OUT_DIR, "sitemap.xml");
const ROBOTS_PATH = path.join(OUT_DIR, "robots.txt");
const MIN_URLS = 10;

function main(): void {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error("✗ sitemap.xml not found in out/. Run next build first.");
    process.exit(1);
  }

  const xml = fs.readFileSync(SITEMAP_PATH, "utf-8");
  const urlCount = (xml.match(/<loc>/g) ?? []).length;

  if (urlCount < MIN_URLS) {
    console.error(`✗ sitemap.xml has only ${urlCount} URLs (minimum ${MIN_URLS})`);
    process.exit(1);
  }

  for (const noindexPath of NOINDEX_PATHS) {
    if (xml.includes(`${noindexPath}/`) || xml.includes(`>${noindexPath}<`)) {
      console.error(`✗ sitemap.xml should not include noindex path: ${noindexPath}`);
      process.exit(1);
    }
  }

  if (!fs.existsSync(ROBOTS_PATH)) {
    console.warn("⚠ robots.txt not found in out/ (optional for static export)");
  } else {
    const robots = fs.readFileSync(ROBOTS_PATH, "utf-8");
    if (!robots.includes("sitemap")) {
      console.warn("⚠ robots.txt does not reference sitemap");
    }
    for (const noindexPath of NOINDEX_PATHS) {
      if (!robots.includes(noindexPath)) {
        console.warn(`⚠ robots.txt missing disallow for ${noindexPath}`);
      }
    }
  }

  console.log(`✓ sitemap.xml verified — ${urlCount} URLs`);
  console.log(`✓ noindex utility paths excluded (${NOINDEX_PATHS.length})`);
  console.log(`  Path: ${SITEMAP_PATH}`);
}

main();
