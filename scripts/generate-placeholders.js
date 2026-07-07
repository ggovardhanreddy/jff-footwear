const fs = require("fs");
const path = require("path");

const VIEWS = ["main", "front", "side", "top", "bottom"];
const LIFESTYLE = ["lifestyle-1", "lifestyle-2"];

const COLOR_PALETTES = [
  { bg: "#1a1a1a", accent: "#c8a96e", slipper: "#2d2d2d" },
  { bg: "#f5f0e6", accent: "#0a0a0a", slipper: "#d4c4a8" },
  { bg: "#1e3a5f", accent: "#c8a96e", slipper: "#2a4a6f" },
  { bg: "#141414", accent: "#ffffff", slipper: "#3a3a3a" },
  { bg: "#faf8f5", accent: "#c8a96e", slipper: "#e8e4dc" },
];

function createSlipperSvg(view, palette, productId, label) {
  const { bg, accent, slipper } = palette;

  let slipperPath = "";
  switch (view) {
    case "main":
    case "front":
      slipperPath = `
        <ellipse cx="400" cy="380" rx="220" ry="80" fill="${slipper}" opacity="0.9"/>
        <path d="M200 380 Q280 280 400 300 Q520 280 600 380 L580 420 Q400 460 220 420 Z" fill="${accent}" opacity="0.15"/>
        <path d="M220 400 Q300 340 400 350 Q500 340 580 400" stroke="${accent}" stroke-width="3" fill="none" opacity="0.6"/>
        <ellipse cx="400" cy="365" rx="180" ry="50" fill="${slipper}" opacity="0.5"/>
      `;
      break;
    case "side":
      slipperPath = `
        <path d="M250 400 Q300 300 450 290 Q550 285 580 380 L570 420 Q450 440 280 420 Z" fill="${slipper}"/>
        <path d="M280 410 Q350 350 450 345 Q520 342 560 385" stroke="${accent}" stroke-width="2" fill="none" opacity="0.5"/>
        <rect x="250" y="400" width="330" height="25" rx="8" fill="${slipper}" opacity="0.7"/>
      `;
      break;
    case "top":
      slipperPath = `
        <ellipse cx="400" cy="350" rx="200" ry="120" fill="${slipper}"/>
        <ellipse cx="400" cy="350" rx="160" ry="90" fill="${accent}" opacity="0.1"/>
        <path d="M250 350 Q400 280 550 350" stroke="${accent}" stroke-width="2" fill="none" opacity="0.4"/>
      `;
      break;
    case "bottom":
      slipperPath = `
        <ellipse cx="400" cy="360" rx="210" ry="100" fill="#333"/>
        <ellipse cx="400" cy="360" rx="180" ry="75" fill="#444"/>
        <g opacity="0.3">
          ${Array.from({ length: 8 }, (_, i) => {
            const x = 280 + i * 35;
            return `<rect x="${x}" y="340" width="20" height="40" rx="3" fill="#222"/>`;
          }).join("")}
        </g>
      `;
      break;
    default:
      slipperPath = `
        <ellipse cx="400" cy="380" rx="220" ry="80" fill="${slipper}" opacity="0.9"/>
        <path d="M220 400 Q300 340 400 350 Q500 340 580 400" stroke="${accent}" stroke-width="3" fill="none" opacity="0.6"/>
      `;
  }

  const isLifestyle = view.startsWith("lifestyle");
  const lifestyleExtra = isLifestyle
    ? `<rect width="800" height="600" fill="url(#grad)"/>
       <text x="400" y="520" text-anchor="middle" fill="${accent}" font-family="system-ui" font-size="14" opacity="0.5">Lifestyle</text>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg}"/>
      <stop offset="100%" style="stop-color:${slipper}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="${bg}"/>
  ${lifestyleExtra}
  ${slipperPath}
  <text x="400" y="80" text-anchor="middle" fill="${accent}" font-family="system-ui, sans-serif" font-size="18" font-weight="600" letter-spacing="4">JFF</text>
  <text x="400" y="110" text-anchor="middle" fill="${accent}" font-family="system-ui, sans-serif" font-size="11" opacity="0.6" letter-spacing="2">${label.toUpperCase()}</text>
  <text x="400" y="540" text-anchor="middle" fill="${accent}" font-family="system-ui, sans-serif" font-size="10" opacity="0.4">${productId}</text>
</svg>`;
}

const productsFile = path.join(__dirname, "..", "data", "products.json");
if (!fs.existsSync(productsFile)) {
  console.error("Run generate:products first");
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsFile, "utf8"));
const imagesDir = path.join(__dirname, "..", "public", "images", "products");

products.forEach((product, index) => {
  const dir = path.join(imagesDir, product.id);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const palette = COLOR_PALETTES[index % COLOR_PALETTES.length];

  VIEWS.forEach((view) => {
    const svg = createSlipperSvg(view, palette, product.id, view);
    fs.writeFileSync(path.join(dir, `${view}.svg`), svg);
  });

  LIFESTYLE.forEach((view) => {
    const svg = createSlipperSvg(view, palette, product.id, view);
    fs.writeFileSync(path.join(dir, `${view}.svg`), svg);
  });
});

// Brand assets
const brandDir = path.join(__dirname, "..", "public", "images");
if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });

const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <text x="10" y="45" fill="#0a0a0a" font-family="system-ui, sans-serif" font-size="42" font-weight="800" letter-spacing="6">JFF</text>
</svg>`;
fs.writeFileSync(path.join(brandDir, "logo.svg"), logoSvg);

const heroSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="hero" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a"/>
      <stop offset="50%" style="stop-color:#1a1a1a"/>
      <stop offset="100%" style="stop-color:#141414"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#hero)"/>
  <ellipse cx="960" cy="700" rx="400" ry="150" fill="#c8a96e" opacity="0.08"/>
  <path d="M660 700 Q760 500 960 520 Q1160 500 1260 700 L1220 780 Q960 840 700 780 Z" fill="#2d2d2d" opacity="0.6"/>
  <path d="M700 740 Q820 620 960 630 Q1100 620 1220 740" stroke="#c8a96e" stroke-width="2" fill="none" opacity="0.4"/>
  <text x="960" y="200" text-anchor="middle" fill="#c8a96e" font-family="system-ui" font-size="24" letter-spacing="12" opacity="0.8">CRAFTED COMFORT</text>
  <text x="960" y="320" text-anchor="middle" fill="#ffffff" font-family="system-ui" font-size="120" font-weight="800" letter-spacing="20">JFF</text>
  <text x="960" y="400" text-anchor="middle" fill="#ffffff" font-family="system-ui" font-size="28" opacity="0.6" letter-spacing="6">EVERY STEP MATTERS</text>
</svg>`;
fs.writeFileSync(path.join(brandDir, "hero-banner.svg"), heroSvg);

const ogSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <text x="600" y="300" text-anchor="middle" fill="#c8a96e" font-family="system-ui" font-size="100" font-weight="800" letter-spacing="16">JFF</text>
  <text x="600" y="380" text-anchor="middle" fill="#ffffff" font-family="system-ui" font-size="24" opacity="0.7" letter-spacing="4">Premium Slippers Manufacturer</text>
</svg>`;
fs.writeFileSync(path.join(brandDir, "og-default.svg"), ogSvg);

console.log(`Generated images for ${products.length} products`);
