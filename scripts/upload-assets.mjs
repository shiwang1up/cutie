import { put } from "@vercel/blob";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!TOKEN) {
  console.error("Missing BLOB_READ_WRITE_TOKEN.");
  console.error("Copy it from Vercel → your project → Storage → Blob → .env.local tab,");
  console.error("paste into .env.local, then run:");
  console.error("  export $(grep BLOB_READ_WRITE_TOKEN .env.local) && npm run upload");
  process.exit(1);
}

const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const PHOTOS_DIR = "public/photos";
const photosByQ = {};

if (existsSync(PHOTOS_DIR)) {
  const files = readdirSync(PHOTOS_DIR).sort();
  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!MIME[ext]) continue;
    const m = file.match(/^q(\d+)/i);
    if (!m) {
      console.warn(`skipping ${file} — name doesn't start with qN`);
      continue;
    }
    const qNum = parseInt(m[1], 10);
    const data = readFileSync(join(PHOTOS_DIR, file));
    process.stdout.write(`uploading ${file}... `);
    const res = await put(`assets/${file}`, data, {
      access: "public",
      contentType: MIME[ext],
      addRandomSuffix: false,
      token: TOKEN,
      allowOverwrite: true,
    });
    console.log("ok");
    (photosByQ[qNum] ||= []).push(res.url);
  }
}

const CURSOR_PATH = "public/cursor.png";
let cursorUrl = null;
if (existsSync(CURSOR_PATH)) {
  process.stdout.write(`uploading cursor.png... `);
  const data = readFileSync(CURSOR_PATH);
  const res = await put("assets/cursor.png", data, {
    access: "public",
    contentType: "image/png",
    addRandomSuffix: false,
    token: TOKEN,
    allowOverwrite: true,
  });
  console.log("ok");
  cursorUrl = res.url;
}

console.log("\n=== paste these into Vercel → Project → Settings → Environment Variables ===\n");
if (Object.keys(photosByQ).length > 0) {
  console.log(`NEXT_PUBLIC_PHOTOS='${JSON.stringify(photosByQ)}'`);
}
if (cursorUrl) {
  console.log(`NEXT_PUBLIC_CURSOR_URL='${cursorUrl}'`);
}
console.log("\n(then redeploy)");
