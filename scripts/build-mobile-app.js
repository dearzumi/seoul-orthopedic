const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const filesToCopy = [
  "index.html",
  "offline.html",
  "styles.css",
  "app.js",
  "sw.js",
  "site.webmanifest",
  "og-image.svg",
  "app-icon.svg",
  "robots.txt",
  "sitemap.xml",
];

const directoriesToCopy = [".well-known"];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of filesToCopy) {
  const source = path.join(root, file);
  const target = path.join(dist, file);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing file for mobile app build: ${file}`);
  }

  fs.copyFileSync(source, target);
}

for (const directory of directoriesToCopy) {
  const source = path.join(root, directory);
  const target = path.join(dist, directory);

  if (fs.existsSync(source)) {
    fs.cpSync(source, target, { recursive: true });
  }
}

console.log(`Mobile app web assets copied to ${path.relative(root, dist)}/`);
