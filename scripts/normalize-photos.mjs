import {
  readdirSync, copyFileSync, mkdirSync, existsSync, statSync, unlinkSync,
} from "node:fs";
import { join, extname } from "node:path";
import { homedir } from "node:os";

const SRC = join(homedir(), "Downloads", "photos");
const DST = "public/photos";
const ALLOWED = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const LETTERS = "abcdefghijklmnopqrstuvwxyz";

if (!existsSync(SRC)) {
  console.error(`source folder not found: ${SRC}`);
  process.exit(1);
}
mkdirSync(DST, { recursive: true });

function normExt(p) {
  const e = extname(p).toLowerCase();
  return e === ".jpeg" ? ".jpg" : e;
}

// Read source: each subfolder name must start with the question number.
const buckets = {};
const folderNames = {};
for (const entry of readdirSync(SRC).sort()) {
  const full = join(SRC, entry);
  if (!statSync(full).isDirectory()) continue;
  const m = entry.match(/^(\d+)/);
  if (!m) {
    console.warn(`skipping "${entry}" — folder name doesn't start with a number`);
    continue;
  }
  const q = parseInt(m[1], 10);
  buckets[q] = readdirSync(full)
    .filter((f) => ALLOWED.has(extname(f).toLowerCase()))
    .sort()
    .map((f) => join(full, f));
  folderNames[q] = entry;
}

const qNums = Object.keys(buckets).map(Number).sort((a, b) => a - b);
console.log("\ndiscovered:");
for (const q of qNums) {
  console.log(`  q${String(q).padStart(2)}  (${folderNames[q]}): ${buckets[q].length}`);
}

// Clear any existing q* files in DST so stale leftovers don't accumulate.
for (const f of readdirSync(DST)) {
  if (/^q\d+/i.test(f)) {
    try { unlinkSync(join(DST, f)); } catch {}
  }
}

// Copy + rename: q<N>-a.ext, q<N>-b.ext, ...
console.log("\nwriting to public/photos/:");
for (const q of qNums) {
  for (let i = 0; i < buckets[q].length; i++) {
    const src = buckets[q][i];
    const letter = LETTERS[i] ?? `z${i}`;
    const dst = join(DST, `q${q}-${letter}${normExt(src)}`);
    copyFileSync(src, dst);
    console.log(`  q${q}-${letter}${normExt(src)}  ←  ${src.replace(SRC + "/", "")}`);
  }
}

console.log(`\n✓ ${qNums.length} questions copied.`);
console.log("burst cycles automatically when a question has fewer than the burst count.");
