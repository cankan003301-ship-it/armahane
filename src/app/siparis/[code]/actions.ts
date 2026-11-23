"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { answerProof, checkOrderToken } from "@/lib/orders";
import { mailShop } from "@/lib/mail";
import { ipFrom, rateLimit } from "@/lib/ratelimit";

export async function respondProof(formData: FormData) {
  const code = String(formData.get("code") ?? "");
  const t = String(formData.get("t") ?? "");
  if (!checkOrderToken(code, t)) redirect("/siparis-takip");
  if (!(await rateLimit("onay", ipFrom(await headers()), 10, 600))) redirect(`/siparis/${code}?t=${t}&onay=hata#onay`);
  const approve = formData.get("karar") === "onay";
  const message = String(formData.get("mesaj") ?? "").trim().slice(0, 1000);
  if (!approve && message.length < 5) redirect(`/siparis/${code}?t=${t}&onay=mesaj#onay`);
  const o = await answerProof(code, approve, message);
  if (o) {
    await mailShop(
      approve ? `${code}: tasarım ONAYLANDI — üretime al` : `${code}: revizyon istendi`,
      approve ? `${o.customer.name} tasarımı onayladı. Sipariş durumu "Üretimde" oldu.` : `${o.customer.name} revizyon istedi:\n\n${message}`,
    );
  }
  redirect(`/siparis/${code}?t=${t}&onay=${approve ? "tamam" : "revizyon"}#onay`);
}
