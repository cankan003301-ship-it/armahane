import "server-only";
import { SITE } from "@/lib/site";
import { tl } from "@/lib/pricing";
import { orderToken, statusLabel, type OrderRow } from "@/lib/orders";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Resend ile e-posta. Anahtar yoksa sessizce atlar; e-posta hatası siparişi asla bozmaz. */
export async function sendMail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.MAIL_FROM || `${SITE.name} <onboarding@resend.dev>`, to, subject, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function orderHtml(o: OrderRow, intro: string) {
  const link = `${SITE.url}/siparis/${o.code}?t=${orderToken(o.code)}`;
  const rows = o.items
    .map((l) => `<tr><td style="padding:6px 0">${esc(l.name)} × ${l.qty}<br><small style="color:#777">${esc(l.detail)}</small></td><td align="right">${tl(l.total)}</td></tr>`)
    .join("");
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#222">
  <h2 style="margin:0 0 8px">${esc(SITE.name)}</h2><p>${intro}</p>
  <p><b>Sipariş kodu:</b> ${o.code}<br><b>Durum:</b> ${esc(statusLabel(o.status))}</p>
  <table width="100%" style="border-collapse:collapse;border-top:1px solid #ddd">${rows}
  <tr><td style="border-top:1px solid #ddd;padding-top:8px"><b>Toplam</b></td><td align="right" style="border-top:1px solid #ddd;padding-top:8px"><b>${tl(o.totals.total)}</b></td></tr></table>
  ${o.tracking ? `<p><b>Kargo takip:</b> ${esc(o.tracking)}</p>` : ""}
  <p><a href="${link}" style="background:#c8452c;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px">Siparişi görüntüle</a></p></div>`;
}

export async function mailOrderCreated(o: OrderRow) {
  const intro =
    o.payment === "havale"
      ? "Siparişiniz alındı. Havale/EFT bilgileri sipariş sayfanızda; açıklamaya sipariş kodunu yazmayı unutmayın."
      : "Siparişiniz alındı. Kart ödemesi tamamlanınca üretim sırasına alınır.";
  await sendMail(o.customer.email, `Siparişiniz alındı — ${o.code}`, orderHtml(o, intro));
  const notify = process.env.SHOP_NOTIFY_EMAIL;
  if (notify) await sendMail(notify, `Yeni sipariş ${o.code} — ${tl(o.totals.total)} (${o.payment})`, orderHtml(o, `Yeni sipariş: ${esc(o.customer.name)}, ${esc(o.customer.phone)}`));
}

export async function mailStatusChanged(o: OrderRow) {
  await sendMail(o.customer.email, `Sipariş ${o.code}: ${statusLabel(o.status)}`, orderHtml(o, `Siparişinizin durumu güncellendi: <b>${esc(statusLabel(o.status))}</b>.`));
}

export async function mailProofReady(o: OrderRow) {
  const link = `${SITE.url}/siparis/${o.code}?t=${orderToken(o.code)}#onay`;
  await sendMail(o.customer.email, `Tasarım önizlemeniz hazır — ${o.code}`,
    `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#222"><h2>${esc(SITE.name)}</h2>
    <p>Armanızın nakışa uyarlanmış önizlemesi hazır. Onayınızdan sonra üretime başlayacağız.</p>
    ${o.proof_url ? `<p><img src="${esc(o.proof_url)}" alt="Önizleme" style="max-width:100%;border-radius:8px"></p>` : ""}
    ${o.proof_note ? `<p>${esc(o.proof_note)}</p>` : ""}
    <p><a href="${link}" style="background:#c8452c;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px">Onayla veya revizyon iste</a></p></div>`);
}

export async function mailShop(subject: string, text: string) {
  const to = process.env.SHOP_NOTIFY_EMAIL;
  if (to) await sendMail(to, subject, `<p style="font-family:Arial,sans-serif;white-space:pre-wrap">${esc(text)}</p>`);
}
