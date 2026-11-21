import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

const TYPES: Record<string, string> = {
  "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/svg+xml": "svg", "application/pdf": "pdf",
};
const MAX = 4 * 1024 * 1024;

/** Müşteri logosu yükleme (Vercel Blob). Dosya adı rastgele; içerik türü beyaz listede. */
export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "Dosya yükleme şu an kapalı." }, { status: 503 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: "PNG, JPG, WEBP, SVG veya PDF yükleyin." }, { status: 415 });
  if (file.size > MAX) return NextResponse.json({ error: "Dosya en fazla 4 MB olabilir." }, { status: 413 });
  const blob = await put(`logolar/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`, file, {
    access: "public", contentType: file.type, addRandomSuffix: false,
  });
  return NextResponse.json({ url: blob.url });
}
