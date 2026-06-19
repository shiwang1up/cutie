const { readdirSync, existsSync } = require("node:fs");
const { extname } = require("node:path");

// Local dev convenience: if NEXT_PUBLIC_PHOTOS isn't already set (i.e. you
// haven't run npm run upload and pasted blob URLs into .env.local), scan
// public/photos/ and build the map from real filenames. Production reads the
// env var set in the Vercel dashboard and skips this scan entirely.
if (!process.env.NEXT_PUBLIC_PHOTOS) {
  const dir = "public/photos";
  const ALLOWED = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
  const map = {};
  if (existsSync(dir)) {
    for (const file of readdirSync(dir).sort()) {
      if (!ALLOWED.has(extname(file).toLowerCase())) continue;
      const m = file.match(/^q(\d+)/i);
      if (!m) continue;
      const q = parseInt(m[1], 10);
      (map[q] ||= []).push(`/photos/${file}`);
    }
  }
  if (Object.keys(map).length > 0) {
    process.env.NEXT_PUBLIC_PHOTOS = JSON.stringify(map);
  }
}

/** @type {import('next').NextConfig} */
module.exports = { reactStrictMode: true };
