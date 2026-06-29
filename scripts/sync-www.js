const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dest = path.join(root, "www");

const skip = new Set([
  ".git",
  "node_modules",
  "www",
  "android",
  ".github",
  "scripts",
  "package.json",
  "package-lock.json",
  "capacitor.config.json",
  ".gitignore",
  "README.md",
]);

const copy = (src, dst) => {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      if (skip.has(name)) continue;
      copy(path.join(src, name), path.join(dst, name));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
};

if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}
fs.mkdirSync(dest, { recursive: true });

for (const name of fs.readdirSync(root)) {
  if (skip.has(name)) continue;
  copy(path.join(root, name), path.join(dest, name));
}

console.log("Synced site files to www/");
