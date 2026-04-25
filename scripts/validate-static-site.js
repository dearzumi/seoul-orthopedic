const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "index.html",
  "privacy.html",
  "non-covered.html",
  "clinic-info.html",
  "store-readiness.html",
  "styles.css",
  "app.js",
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest",
  "og-image.svg",
  "app-icon.svg",
  ".well-known/assetlinks.json",
  "offline.html",
  "sw.js",
];
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
  '<meta name="robots" content="index, follow',
  'name="keywords"',
  '<meta property="og:image" content="https://seoul-orthopedic.vercel.app/og-image.svg" />',
  '<meta name="twitter:card" content="summary_large_image" />',
  '<link rel="manifest" href="./site.webmanifest" />',
  '<meta name="mobile-web-app-capable" content="yes" />',
  '<meta name="apple-mobile-web-app-capable" content="yes" />',
  'src="./app.js"',
  './app.js',
  'class="skip-link"',
  'href="#app"',
  'id="app"',
  'iPhone 설치 방법',
  'Android 설치 방법',
  'data-install-button',
  'Android Chrome에서는 설치 가능할 때 아래 버튼이 활성화됩니다.',
  '공유 버튼',
  '앱 설치',
  'id="services"',
  'id="symptoms"',
  'id="programs"',
  'id="process"',
  'id="patient-guide"',
  'data-modal-open="symptomMemo"',
  '통증 메모 작성하기',
  'data-symptom-form',
  'data-symptom-output',
  'data-copy-symptom-memo',
  'href="#symptoms"',
  'href="#process"',
  'id="hours"',
  'class="clinic-calendar"',
  'data-calendar-grid',
  'data-modal-open="calendar"',
  'data-modal-layer',
  '병원 달력',
  '공휴일',
  '휴무',
  '초진 준비 체크리스트',
  '빠른 상담이 필요한 증상',
  '주차 · 지도 · 전화 안내',
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
  'class="mobile-tabbar"',
  'data-section-link',
  'id="site-sync"',
  '앱과 웹사이트를 하나로 연결했습니다',
  '웹사이트 열기',
  '서울정형외과 앱 열기',
  '증상별 진료 안내',
  '비수술 중심 치료 프로그램',
  '초진 전 확인하면 좋은 안내',
  '빠른 진료 상담이 필요한 증상',
  '의료기관 정보 · 비급여 · 개인정보 안내',
  'href="./privacy.html"',
  'href="./non-covered.html"',
  'href="./clinic-info.html"',
  'href="./store-readiness.html"',
  '초진부터 회복까지 한눈에',
  'application/ld+json',
  '"MedicalClinic"',
  '"LocalBusiness"',
];

for (const snippet of requiredSnippets) {
  if (!html.includes(snippet)) {
    throw new Error(`Expected index.html to include: ${snippet}`);
  }
}

const jsonLdMatch = html.match(
  /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/,
);

if (!jsonLdMatch) {
  throw new Error("Missing JSON-LD structured data");
}

JSON.parse(jsonLdMatch[1]);

const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "site.webmanifest"), "utf8"));
const serviceWorker = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const appScript = fs.readFileSync(path.join(root, "app.js"), "utf8");
const assetLinks = JSON.parse(
  fs.readFileSync(path.join(root, ".well-known", "assetlinks.json"), "utf8"),
);

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
const anchorLinks = [...html.matchAll(/\shref="#([^"]+)"/g)].map((match) => match[1]);

for (const anchor of anchorLinks) {
  if (!ids.has(anchor)) {
    throw new Error(`Missing target id for anchor link: #${anchor}`);
  }
}

const localAssetLinks = [
  ...html.matchAll(/\s(?:href|src)="\.\/([^"#?]+)(?:[?#][^"]*)?"/g),
].map((match) => match[1]);

for (const asset of localAssetLinks) {
  if (!fs.existsSync(path.join(root, asset))) {
    throw new Error(`Missing local asset referenced by index.html: ${asset}`);
  }
}

if (!robots.includes("Sitemap: https://seoul-orthopedic.vercel.app/sitemap.xml")) {
  throw new Error("robots.txt must reference sitemap.xml");
}

if (!sitemap.includes("<loc>https://seoul-orthopedic.vercel.app/</loc>")) {
  throw new Error("sitemap.xml must include canonical homepage");
}

for (const page of ["privacy", "non-covered", "clinic-info", "store-readiness"]) {
  if (!sitemap.includes(`<loc>https://seoul-orthopedic.vercel.app/${page}.html</loc>`)) {
    throw new Error(`sitemap.xml must include ${page}.html`);
  }
}

if (manifest.name !== "서울정형외과") {
  throw new Error("site.webmanifest must include the clinic name");
}

if (manifest.display !== "standalone" || manifest.start_url !== "/?source=pwa") {
  throw new Error("site.webmanifest must be configured for standalone app launch");
}

if (!Array.isArray(manifest.shortcuts) || manifest.shortcuts.length < 3) {
  throw new Error("site.webmanifest must include app shortcuts");
}

if (
  !Array.isArray(assetLinks) ||
  !assetLinks.some((entry) =>
    entry.target?.package_name === "com.seoulorthopedic.clinic" &&
    entry.target?.sha256_cert_fingerprints?.some((fingerprint) =>
      fingerprint.includes("F8:CB:64:7F"),
    ),
  )
) {
  throw new Error("assetlinks.json must map the website to the Android app package");
}

for (const shortcut of manifest.shortcuts) {
  const target = shortcut.url?.match(/^\/#(.+)$/)?.[1];

  if (target && !ids.has(target)) {
    throw new Error(`Missing target id for manifest shortcut: ${shortcut.url}`);
  }
}

if (!serviceWorker.includes("seoul-orthopedic-cache") || !serviceWorker.includes("/offline.html")) {
  throw new Error("sw.js must cache app shell and offline page");
}

if (!appScript.includes("navigator.serviceWorker.register")) {
  throw new Error("app.js must register the service worker");
}

for (const asset of ["/index.html", "/styles.css", "/app.js", "/offline.html", "/site.webmanifest"]) {
  if (!serviceWorker.includes(asset)) {
    throw new Error(`sw.js must cache ${asset}`);
  }
}

if (
  !appScript.includes("beforeinstallprompt") ||
  !appScript.includes("navigator.serviceWorker.register") ||
  !appScript.includes("installPromptEvent.prompt()") ||
  !appScript.includes("installButton.hidden = false") ||
  !appScript.includes("trackEvent") ||
  !appScript.includes("buildSymptomMemo")
) {
  throw new Error("app.js must handle install prompts, tracking, pain memo, and service worker registration");
}

console.log("Static site validation passed.");
