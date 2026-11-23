import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { CartItemSchema, priceItems, type LineDetail } from "@/lib/lines";
import { cartTotals, type CartTotals, type PaymentId } from "@/lib/pricing";

export const STATUSES = [
  { id: "odeme-bekliyor", label: "Ödeme bekleniyor" },
  { id: "odendi", label: "Ödeme alındı" },
  { id: "tasarim-onay", label: "Tasarım onayınızı bekliyor" },
  { id: "uretimde", label: "Üretimde" },
  { id: "kargoda", label: "Kargoya verildi" },
  { id: "teslim", label: "Teslim edildi" },
  { id: "iptal", label: "İptal edildi" },
] as const;
export type StatusId = (typeof STATUSES)[number]["id"];
export const statusLabel = (s: string) => STATUSES.find((x) => x.id === s)?.label ?? s;

const phone = z.string().trim().transform((s) => s.replace(/[^\d+]/g, "")).pipe(z.string().regex(/^(\+?90)?0?5\d{9}$/, "Geçerli bir cep telefonu girin."));

export const CheckoutSchema = z.object({
  items: z.array(CartItemSchema).min(1, "Sepetiniz boş.").max(30),
  coupon: z.string().max(30).optional().default(""),
  payment: z.enum(["havale", "kart"]),
  customer: z.object({
    name: z.string().trim().min(3, "Ad soyad girin.").max(80),
    email: z.string().trim().email("Geçerli bir e-posta girin.").max(120),
    phone,
    city: z.string().trim().min(2, "İl girin.").max(40),
    district: z.string().trim().min(2, "İlçe girin.").max(40),
    address: z.string().trim().min(10, "Açık adres girin.").max(400),
    invoice: z.string().trim().max(200).optional().default(""),
  }),
  note: z.string().trim().max(1000).optional().default(""),
  accepted: z.literal(true, { message: "Sözleşmeleri onaylamanız gerekiyor." }),
});
export type CheckoutInput = z.infer<typeof CheckoutSchema>;

export type OrderRow = {
  id: number;
  code: string;
  status: StatusId;
  payment: PaymentId;
  paid: boolean;
  customer: CheckoutInput["customer"];
  items: (Omit<LineDetail, "item"> & { item: unknown })[];
  totals: CartTotals & { couponCode: string };
  note: string | null;
  tracking: string | null;
  proof_url: string | null;
  proof_note: string | null;
  /** Tasarım onayı: bekliyor | revizyon | onaylandi */
  approval: "bekliyor" | "revizyon" | "onaylandi" | null;
  history: { at: string; status: string; by: string; note?: string }[];
  created_at: string;
  updated_at: string;
};

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newOrderCode() {
  let s = "";
  for (let i = 0; i < 7; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return `AH-${s}`;
}

function secret() {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 16) throw new Error("ADMIN_SECRET en az 16 karakter olmalı");
  return s;
}
/** Sipariş sayfası bağlantısı için imza: kodu bilen herkes değil, bağlantıyı alan görür. */
export function orderToken(code: string) {
  return createHmac("sha256", secret()).update(`order:${code}`).digest("base64url").slice(0, 22);
}
export function checkOrderToken(code: string, token: string | null | undefined) {
  if (!token) return false;
  const a = Buffer.from(orderToken(code));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function priceCheckout(input: CheckoutInput) {
  const lines = priceItems(input.items);
  const unavailable = lines.find((l) => !l.available);
  const totals = cartTotals(lines, input.coupon, input.payment);
  return { lines, totals, unavailable };
}

export async function createOrder(input: CheckoutInput) {
  const { lines, totals, unavailable } = priceCheckout(input);
  if (unavailable) throw new UserError(`"${unavailable.name}" için yeterli stok yok.`);
  if (totals.total <= 0) throw new UserError("Sipariş tutarı hesaplanamadı.");
  const sql = await db();
  const status: StatusId = "odeme-bekliyor";
  const history = [{ at: new Date().toISOString(), status, by: "müşteri" }];
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = newOrderCode();
    try {
      const rows = (await sql`INSERT INTO orders (code, status, payment, customer, items, totals, note, history)
        VALUES (${code}, ${status}, ${input.payment}, ${JSON.stringify(input.customer)}::jsonb, ${JSON.stringify(lines)}::jsonb,
                ${JSON.stringify({ ...totals, couponCode: totals.coupon?.code ?? "" })}::jsonb, ${input.note || null}, ${JSON.stringify(history)}::jsonb)
        RETURNING *`) as OrderRow[];
      return rows[0];
    } catch (e) {
      if (!String(e).includes("orders_code_key")) throw e;
    }
  }
  throw new Error("Sipariş kodu üretilemedi");
}

export async function getOrder(code: string): Promise<OrderRow | null> {
  if (!/^AH-[A-Z0-9]{7}$/.test(code)) return null;
  const sql = await db();
  const rows = (await sql`SELECT * FROM orders WHERE code = ${code}`) as OrderRow[];
  return rows[0] ?? null;
}

export async function setOrderStatus(code: string, status: StatusId, by: string, extra: { paid?: boolean; tracking?: string; note?: string } = {}) {
  const sql = await db();
  const entry = JSON.stringify([{ at: new Date().toISOString(), status, by, ...(extra.note ? { note: extra.note } : {}) }]);
  const rows = (await sql`UPDATE orders SET status = ${status},
      paid = COALESCE(${extra.paid ?? null}::boolean, paid),
      tracking = COALESCE(${extra.tracking ?? null}, tracking),
      history = history || ${entry}::jsonb, updated_at = now()
    WHERE code = ${code} RETURNING *`) as OrderRow[];
  return rows[0] ?? null;
}

export async function listOrders(limit = 100, status?: string) {
  const sql = await db();
  return (status
    ? await sql`SELECT * FROM orders WHERE status = ${status} ORDER BY created_at DESC LIMIT ${limit}`
    : await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT ${limit}`) as OrderRow[];
}

/** Yönetim: müşteriye tasarım önizlemesi gönder. */
export async function setProof(code: string, proofUrl: string, note: string) {
  const sql = await db();
  const entry = JSON.stringify([{ at: new Date().toISOString(), status: "tasarim-onay", by: "yönetim", note: "Tasarım önizlemesi gönderildi" }]);
  const rows = (await sql`UPDATE orders SET status = 'tasarim-onay', proof_url = ${proofUrl}, proof_note = ${note || null},
      approval = 'bekliyor', history = history || ${entry}::jsonb, updated_at = now()
    WHERE code = ${code} RETURNING *`) as OrderRow[];
  return rows[0] ?? null;
}

/** Müşteri: önizlemeyi onayla ya da revizyon iste. Yalnızca onay bekleyen siparişte çalışır. */
export async function answerProof(code: string, approve: boolean, message: string) {
  const sql = await db();
  const status = approve ? "uretimde" : "tasarim-onay";
  const note = approve ? "Müşteri tasarımı onayladı" : `Revizyon istendi: ${message}`;
  const entry = JSON.stringify([{ at: new Date().toISOString(), status, by: "müşteri", note }]);
  const rows = (await sql`UPDATE orders SET status = ${status}, approval = ${approve ? "onaylandi" : "revizyon"},
      history = history || ${entry}::jsonb, updated_at = now()
    WHERE code = ${code} AND status = 'tasarim-onay' AND approval = 'bekliyor' RETURNING *`) as OrderRow[];
  return rows[0] ?? null;
}

export class UserError extends Error {}
