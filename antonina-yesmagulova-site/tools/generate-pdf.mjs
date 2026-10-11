import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.join(root, "dist", "index.html");
const output = path.join(root, "dist", "Antonina_Yesmagulova.pdf");

const candidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

const browser = candidates.find((candidate) => existsSync(candidate));

if (!browser) {
  console.error("Chrome or Edge was not found. Set CHROME_PATH and try again.");
  process.exit(1);
}

const args = [
  "--headless=new",
  "--disable-gpu",
  "--disable-extensions",
  "--allow-file-access-from-files",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=10000",
  "--no-pdf-header-footer",
  `--print-to-pdf=${output}`,
  pathToFileURL(input).href,
];

const result = spawnSync(browser, args, { stdio: "inherit" });

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`PDF created: ${output}`);
