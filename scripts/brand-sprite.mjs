/**
 * Builds public/brand-sprite.svg from the simple-icons keys referenced by the
 * arsenal data (`icon: "siFoo"`). Tiles reference symbols with <use>, so the
 * 124 brand paths ship once, in one cacheable file, instead of inline in the
 * HTML and in the JavaScript bundle. Run through `npm run icons` (also prebuild).
 */
import { readFileSync, writeFileSync } from "node:fs";
import * as simpleIcons from "simple-icons";

const sources = ["data/arsenal.ts", "data/fr/arsenal.ts"];
const keys = new Set();
for (const file of sources) {
  for (const match of readFileSync(file, "utf8").matchAll(/icon: "(si[A-Za-z0-9]+)"/g)) keys.add(match[1]);
}

const missing = [...keys].filter((key) => !(key in simpleIcons));
if (missing.length > 0) {
  console.error(`brand-sprite: unknown simple-icons keys: ${missing.join(", ")}`);
  process.exit(1);
}

const symbols = [...keys]
  .sort()
  .map((key) => `<symbol id="${key}" viewBox="0 0 24 24"><path d="${simpleIcons[key].path}"/></symbol>`)
  .join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`;
writeFileSync("public/brand-sprite.svg", svg);
console.log(`brand-sprite: ${keys.size} symbols, ${(svg.length / 1024).toFixed(0)} KB -> public/brand-sprite.svg`);
