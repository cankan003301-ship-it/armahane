import { fromOid, verifyCallback } from "@/lib/paytr";
import { getOrder, setOrderStatus } from "@/lib/orders";
import { toKurus } from "@/lib/pricing";
import { mailStatusChanged } from "@/lib/mail";

/** PayTR ödeme bildirimi. PayTR "OK" cevabı alana kadar tekrar dener; bu yüzden işlem idempotent. */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const p = {
    merchant_oid: String(form?.get("merchant_oid") ?? ""),
    status: String(form?.get("status") ?? ""),
    total_amount: String(form?.get("total_amount") ?? ""),
    hash: String(form?.get("hash") ?? ""),
  };
  if (!verifyCallback(p)) return new Response("PAYTR notification failed: bad hash", { status: 400 });

  const order = await getOrder(fromOid(p.merchant_oid));
  if (!order) return new Response("OK"); // bilinmeyen sipariş: tekrar denemesin
  if (order.paid || order.status === "iptal") return new Response("OK");

  if (p.status === "success") {
    // total_amount taksit farkı içerebilir; sipariş tutarından az olamaz.
    if (Number(p.total_amount) < toKurus(order.totals.total)) {
      await setOrderStatus(order.code, order.status, "paytr", { note: `Tutar uyuşmazlığı: ${p.total_amount} kuruş` });
      return new Response("OK");
    }
    const updated = await setOrderStatus(order.code, "odendi", "paytr", { paid: true });
    if (updated) await mailStatusChanged(updated);
  } else {
    const reason = String(form?.get("failed_reason_msg") ?? "");
    await setOrderStatus(order.code, "odeme-bekliyor", "paytr", { note: `Ödeme başarısız${reason ? `: ${reason}` : ""}` });
  }
  return new Response("OK");
}
