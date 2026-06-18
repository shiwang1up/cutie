import { put } from "@vercel/blob";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req) {
  const filename = req.headers.get("x-filename") || `clip-${Date.now()}.webm`;
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const data = await req.arrayBuffer();
  const result = await put(`reactions/${safe}`, data, {
    access: "public",
    contentType: "video/webm",
    addRandomSuffix: false,
  });
  return Response.json({ url: result.url });
}
