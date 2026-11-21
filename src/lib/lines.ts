/**
 * Sepet satırlarının fiyatlandırılması. Tarayıcı ve sunucu aynı kodu kullanır;
 * sunucu siparişi kaydederken fiyatı her zaman burada yeniden hesaplar.
 */
import { z } from "zod";
import { getProduct } from "@/data/catalog";
import {
  BACKINGS, backingPrice, clampInt, quoteCustom, round2, qtyDiscountRate,
  type BackingId, type CustomSpec, type PricedLine,
} from "@/lib/pricing";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/);
/** Yalnızca kendi Vercel Blob depomuza yüklenen dosyalar kabul edilir. */
const blobUrl = z.string().max(500).regex(/^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//);

export const ArtSchema = z.object({
  shape: z.enum(["yuvarlak", "kalkan", "dikdortgen", "ozel"]),
  bg: hex, border: hex, fg: hex, accent: hex.optional(),
  icon: z.enum(["dag", "ates", "pusula", "kanat", "ay", "simsek", "lale", "nazar", "cay", "yildiz", "capa", "dalga", "fener", "kalp", "gunes", "yok"]),
  text: z.string().max(22).optional(),
  sub: z.string().max(22).optional(),
  imageUrl: blobUrl.optional(),
});

export const CustomSpecSchema = z.object({
  cm: z.number(), colors: z.number(), qty: z.number(),
  shape: z.enum(["yuvarlak", "dikdortgen", "kalkan", "ozel"]),
  backing: z.enum(["dikis", "utu", "cirt"]),
  edge: z.enum(["overlok", "lazer"]),
  artwork: z.enum(["hazir", "temizlik", "sifirdan"]),
  express: z.boolean(),
});

export const CartItemSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("product"),
    key: z.string().max(120),
    slug: z.string().max(80),
    backing: z.enum(["dikis", "utu", "cirt"]),
    qty: z.number().int().min(1).max(999),
  }),
  z.object({
    kind: z.literal("custom"),
    key: z.string().max(120),
    spec: CustomSpecSchema,
    art: ArtSchema,
    note: z.string().max(1000).optional(),
    fileUrl: blobUrl.optional(),
    fileName: z.string().max(200).optional(),
  }),
]);

export type CartItem = z.infer<typeof CartItemSchema>;
export type ProductItem = Extract<CartItem, { kind: "product" }>;
export type CustomItem = Extract<CartItem, { kind: "custom" }>;

export type LineDetail = PricedLine & { key: string; detail: string; item: CartItem; available: boolean };

/** Hazır ürünlerde aynı üründen 10+ alınca adet indirimi uygulanır (özel armayla aynı basamaklar). */
export function productUnit(base: number, backing: BackingId, qty: number) {
  return round2((base + backingPrice(backing)) * (1 - qtyDiscountRate(qty)));
}

export function priceItem(item: CartItem): LineDetail {
  if (item.kind === "product") {
    const p = getProduct(item.slug);
    const qty = clampInt(item.qty, 1, 999);
    const backingLabel = BACKINGS.find((b) => b.id === item.backing)?.label ?? "";
    if (!p) return { key: item.key, name: "Ürün bulunamadı", unit: 0, qty, fixed: 0, total: 0, detail: "", item, available: false };
    const unit = productUnit(p.price, item.backing, qty);
    const available = p.stock >= qty;
    return {
      key: item.key, name: p.name, unit, qty, fixed: 0, total: round2(unit * qty),
      detail: `${p.sizeCm} cm · ${backingLabel}${qtyDiscountRate(qty) ? ` · %${qtyDiscountRate(qty) * 100} adet indirimi` : ""}`,
      item, available,
    };
  }
  const q = quoteCustom(item.spec as CustomSpec);
  const backingLabel = BACKINGS.find((b) => b.id === q.spec.backing)?.label ?? "";
  return {
    key: item.key,
    name: `Özel arma${item.art.text ? ` — ${item.art.text}` : ""}`,
    unit: q.unit, qty: q.spec.qty, fixed: round2(q.setupFee + q.expressFee), total: q.total,
    detail: `${q.spec.cm} cm · ${q.spec.colors} renk · ${backingLabel}${q.spec.express ? " · Ekspres" : ""}${q.setupFee ? ` · dijitalleştirme ${q.setupFee} ₺` : ""}`,
    item, available: true,
  };
}

export function priceItems(items: CartItem[]) {
  return items.map(priceItem);
}
