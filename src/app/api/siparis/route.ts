import { NextResponse } from "next/server";
import { CheckoutSchema, UserError, createOrder, orderToken } from "@/lib/orders";
import { dbConfigured } from "@/lib/db";
import { paytrConfigured } from "@/lib/paytr";
import { mailOrderCreated } from "@/lib/mail";

export async function POST(req: Request) {
  if (!dbConfigured()) return NextResponse.json({ error: "Sipariş sistemi henüz kurulmadı." }, { status: 503 });
  const body = await req.json().catch(() => null);
  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Bilgileri kontrol edin." }, { status: 400 });
  }
  if (parsed.data.payment === "kart" && !paytrConfigured()) {
    return NextResponse.json({ error: "Kartla ödeme şu an kapalı; havale/EFT seçin." }, { status: 400 });
  }
  try {
    const order = await createOrder(parsed.data);
    await mailOrderCreated(order);
    return NextResponse.json({ code: order.code, token: orderToken(order.code) });
  } catch (e) {
    if (e instanceof UserError) return NextResponse.json({ error: e.message }, { status: 400 });
    console.error("order create failed", e);
    return NextResponse.json({ error: "Sipariş kaydedilemedi, lütfen tekrar deneyin." }, { status: 500 });
  }
}
