import { NextResponse } from "next/server";
import { adminConfigured } from "@/lib/admin";
import { dbConfigured } from "@/lib/db";
import { paytrConfigured } from "@/lib/paytr";
import { SITE } from "@/lib/site";

/** Kurulum kontrolü: hangi entegrasyonların açık olduğunu gösterir. Hiçbir gizli değer döndürmez. */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    veritabani: dbConfigured(),
    yonetim: adminConfigured(),
    paytr: paytrConfigured(),
    paytrTestModu: process.env.PAYTR_TEST_MODE !== "0",
    dosyaYukleme: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    eposta: Boolean(process.env.RESEND_API_KEY),
    havale: Boolean(process.env.BANK_IBAN),
    saticiBilgisi: Boolean(SITE.seller.title && SITE.seller.address),
    whatsapp: Boolean(SITE.whatsapp),
    siteUrl: SITE.url,
  });
}
