const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const requiredFiles = ["index.html", "styles.css"];
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    throw new Error(`Missing required file: ${file}`);
  }
}

const requiredSnippets = [
  '<html lang="ko">',
  '<meta property="og:url" content="https://seoul-orthopedic.vercel.app/" />',
  'href="./styles.css"',
  'id="services"',
  'id="location"',
  'id="contact"',
  'https://map.naver.com/p/search/',
  'https://map.kakao.com/link/search/',
];

for (const snippet of requiredSnippets) {
  if (!html.includes(snippet)) {
    throw new Error(`Expected index.html to include: ${snippet}`);
  }
}

console.log("Static site validation passed.");
