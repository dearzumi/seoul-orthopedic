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
  'id="hours"',
  'id="doctor"',
  'id="facilities"',
  'id="location"',
  'id="parking"',
  'id="faq"',
  'id="contact"',
  'https://naver.me/Ffs07ccV',
  'https://map.kakao.com/link/search/',
  'https://blog.naver.com/prf42',
  'https://www.youtube.com/@prf4245',
  'tel:0555458275',
  'application/ld+json',
];

for (const snippet of requiredSnippets) {
  if (!html.includes(snippet)) {
    throw new Error(`Expected index.html to include: ${snippet}`);
  }
}

console.log("Static site validation passed.");
