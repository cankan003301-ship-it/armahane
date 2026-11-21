import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE } from "@/lib/site";
import { toKurus } from "@/lib/pricing";
import type { OrderRow } from "@/lib/orders";

/**
 * PayTR iFrame API.
 * Akış: sunucu token alır → müşteri /odeme/kart/[kod] sayfasında PayTR iframe'inde öder →
 * PayTR, Bildirim URL'ine (/api/paytr/bildirim) sonucu POST eder; sipariş YALNIZCA bu bildirimle "ödendi" olur.
 * PayTR Mağaza Paneli > Ayarlar > Bildirim URL: https://<site>/api/paytr/bildirim
 */

export function paytrConfigured() {
  return Boolean(process.env.PAYTR_MERCHANT_ID && process.env.PAYTR_MERCHANT_KEY && process.env.PAYTR_MERCHANT_SALT);
}

function creds() {
  const id = process.env.PAYTR_MERCHANT_ID!;
  const key = process.env.PAYTR_MERCHANT_KEY!;
  const salt = process.env.PAYTR_MERCHANT_SALT!;
  return { id, key, salt, test: process.env.PAYTR_TEST_MODE === "0" ? "0" : "1" };
}

const hmac = (data: string, key: string) => createHmac("sha256", key).update(data).digest("base64");

/** PayTR'de merchant_oid yalnızca harf/rakam olabilir. */
export const toOid = (code: string) => code.replace(/[^A-Za-z0-9]/g, "");
export const fromOid = (oid: string) => (oid.startsWith("AH") ? `AH-${oid.slice(2)}` : oid);

export async function paytrToken(order: OrderRow, userIp: string, okUrl: string, failUrl: string) {
  const c = creds();
  const oid = toOid(order.code);
  const amount = String(toKurus(order.totals.total));
  const basket = Buffer.from(
    JSON.stringify(order.items.map((l) => [l.name.slice(0, 60), (l.total / Math.max(1, l.qty)).toFixed(2), l.qty])),
  ).toString("base64");
  const noInstallment = "0";
  const maxInstallment = "0";
  const currency = "TL";
  const hashStr = `${c.id}${userIp}${oid}${order.customer.email}${amount}${basket}${noInstallment}${maxInstallment}${currency}${c.test}`;
  const token = hmac(hashStr + c.salt, c.key);

  const body = new URLSearchParams({
    merchant_id: c.id,
    user_ip: userIp,
    merchant_oid: oid,
    email: order.customer.email,
    payment_amount: amount,
    paytr_token: token,
    user_basket: basket,
    debug_on: c.test === "1" ? "1" : "0",
    no_installment: noInstallment,
    max_installment: maxInstallment,
    user_name: order.customer.name,
    user_address: `${order.customer.address} ${order.customer.district}/${order.customer.city}`.slice(0, 400),
    user_phone: order.customer.phone,
    merchant_ok_url: okUrl,
    merchant_fail_url: failUrl,
    timeout_limit: "30",
    currency,
    test_mode: c.test,
    lang: "tr",
  });

  const res = await fetch("https://www.paytr.com/odeme/api/get-token", { method: "POST", body, cache: "no-store" });
  const data = (await res.json().catch(() => null)) as { status?: string; token?: string; reason?: string } | null;
  if (!data || data.status !== "success" || !data.token) throw new Error(`PayTR token alınamadı: ${data?.reason ?? res.status}`);
  return data.token;
}

/** Bildirim (callback) doğrulaması. */
export function verifyCallback(p: { merchant_oid: string; status: string; total_amount: string; hash: string }) {
  const c = creds();
  const expected = Buffer.from(hmac(`${p.merchant_oid}${c.salt}${p.status}${p.total_amount}`, c.key));
  const got = Buffer.from(p.hash || "");
  return expected.length === got.length && timingSafeEqual(expected, got);
}

export const paytrSiteUrls = (code: string, token: string) => ({
  ok: `${SITE.url}/siparis/${code}?t=${token}&odeme=basarili`,
  fail: `${SITE.url}/siparis/${code}?t=${token}&odeme=basarisiz`,
});
