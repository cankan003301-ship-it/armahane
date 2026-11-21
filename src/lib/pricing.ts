/**
 * Armahane fiyat kuralları — sitedeki TÜM fiyatlar buradan hesaplanır.
 * Hem tarayıcıda (anlık fiyat) hem sunucuda (sipariş doğrulama) aynı fonksiyonlar çalışır,
 * böylece sayfalar arasında çelişkili fiyat olamaz ve müşteri fiyatı tarayıcıda değiştiremez.
 * Tutarlar TL cinsindendir; kuruş hesabı gerekirse toKurus kullanılır.
 */

export type BackingId = "dikis" | "utu" | "cirt";
export type EdgeId = "overlok" | "lazer";
export type ShapeId = "yuvarlak" | "dikdortgen" | "kalkan" | "ozel";
export type ArtworkId = "hazir" | "temizlik" | "sifirdan";
export type PaymentId = "havale" | "kart";

export const BACKINGS: { id: BackingId; label: string; hint: string; perUnit: number }[] = [
  { id: "dikis", label: "Dikilecek (düz)", hint: "Kalıcı ve en dayanıklı; terzi veya elde dikilir.", perUnit: 0 },
  { id: "utu", label: "Ütüyle yapışan", hint: "Tişört, kot, ceket için pratik.", perUnit: 15 },
  { id: "cirt", label: "Cırt cırt (velcro)", hint: "Takıp çıkarılır; çanta, yelek, üniforma.", perUnit: 30 },
];

export const EDGES: { id: EdgeId; label: string; hint: string; perUnit: number }[] = [
  { id: "overlok", label: "Overlok kenar", hint: "Klasik kalın sarma kenar. Yuvarlak ve dikdörtgende.", perUnit: 0 },
  { id: "lazer", label: "Lazer kesim", hint: "Tasarımın çizgisini takip eder; özel şekiller için.", perUnit: 15 },
];

export const SHAPES: { id: ShapeId; label: string }[] = [
  { id: "yuvarlak", label: "Yuvarlak" },
  { id: "dikdortgen", label: "Dikdörtgen" },
  { id: "kalkan", label: "Kalkan" },
  { id: "ozel", label: "Özel kesim" },
];

/** Dijitalleştirme (nakış makinesi dosyası hazırlama) — sipariş başına bir kez alınır. */
export const ARTWORKS: { id: ArtworkId; label: string; hint: string; fee: number }[] = [
  { id: "hazir", label: "Net logom var", hint: "Vektör (AI, SVG, PDF) veya yüksek çözünürlüklü PNG.", fee: 150 },
  { id: "temizlik", label: "Logom var, düzenlenmeli", hint: "Bulanık, fotoğraf veya karmaşık görsel.", fee: 300 },
  { id: "sifirdan", label: "Sıfırdan tasarım", hint: "Fikrini anlat, armayı biz çizelim.", fee: 600 },
];
/** Bu adet ve üzerinde dijitalleştirme ücreti alınmaz. */
export const ARTWORK_FREE_FROM_QTY = 100;

/** En uzun kenara göre birim fiyat basamakları (cm → TL). */
export const SIZE_TIERS: { maxCm: number; price: number }[] = [
  { maxCm: 5, price: 110 },
  { maxCm: 7, price: 135 },
  { maxCm: 9, price: 160 },
  { maxCm: 11, price: 195 },
  { maxCm: 13, price: 235 },
  { maxCm: 15, price: 280 },
  { maxCm: 18, price: 350 },
  { maxCm: 20, price: 410 },
];
export const MIN_CM = 3;
export const MAX_CM = 20;

export const INCLUDED_COLORS = 4;
export const EXTRA_COLOR_PER_UNIT = 8;
export const MAX_COLORS = 12;

export const QTY_DISCOUNTS: { minQty: number; rate: number }[] = [
  { minQty: 250, rate: 0.4 },
  { minQty: 100, rate: 0.32 },
  { minQty: 50, rate: 0.25 },
  { minQty: 25, rate: 0.18 },
  { minQty: 10, rate: 0.1 },
];
export const MAX_QTY = 5000;

export const EXPRESS_RATE = 0.2;
export const PRODUCTION_DAYS = { normal: "5–7 iş günü", express: "3 iş günü" };

export const SHIPPING = { flat: 120, freeFrom: 1000, carrier: "Yurtiçi / Aras Kargo" };
export const HAVALE_DISCOUNT_RATE = 0.03;

export type Coupon = { code: string; label: string; type: "percent" | "fixed"; value: number; minSubtotal: number };
export const COUPONS: Coupon[] = [
  { code: "HOSGELDIN10", label: "İlk siparişe %10", type: "percent", value: 0.1, minSubtotal: 300 },
  { code: "ARMA100", label: "1.500 TL üzeri 100 TL", type: "fixed", value: 100, minSubtotal: 1500 },
];

/* ------------------------------------------------------------------ */

export const round2 = (n: number) => Math.round(n * 100) / 100;
export const toKurus = (tl: number) => Math.round(tl * 100);
export const clampInt = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.round(Number.isFinite(n) ? n : min)));

export function sizeTierPrice(cm: number): number {
  const c = clampInt(cm, MIN_CM, MAX_CM);
  return (SIZE_TIERS.find((t) => c <= t.maxCm) ?? SIZE_TIERS[SIZE_TIERS.length - 1]).price;
}

export function qtyDiscountRate(qty: number): number {
  return QTY_DISCOUNTS.find((d) => qty >= d.minQty)?.rate ?? 0;
}

export function backingPrice(id: BackingId): number {
  return BACKINGS.find((b) => b.id === id)?.perUnit ?? 0;
}

export type CustomSpec = {
  cm: number;
  colors: number;
  qty: number;
  shape: ShapeId;
  backing: BackingId;
  edge: EdgeId;
  artwork: ArtworkId;
  express: boolean;
};

export type CustomQuote = {
  spec: CustomSpec;
  baseUnit: number;
  extrasUnit: number;
  discountRate: number;
  unit: number;
  setupFee: number;
  expressFee: number;
  total: number;
};

/** Özel arma fiyatı. Lazer kesim "özel" şekilde zorunludur. */
export function normalizeCustomSpec(s: Partial<CustomSpec>): CustomSpec {
  const shape: ShapeId = SHAPES.some((x) => x.id === s.shape) ? (s.shape as ShapeId) : "yuvarlak";
  const edge: EdgeId = shape === "ozel" || shape === "kalkan" ? "lazer" : s.edge === "lazer" ? "lazer" : "overlok";
  return {
    cm: clampInt(s.cm ?? 7, MIN_CM, MAX_CM),
    colors: clampInt(s.colors ?? 3, 1, MAX_COLORS),
    qty: clampInt(s.qty ?? 1, 1, MAX_QTY),
    shape,
    backing: BACKINGS.some((b) => b.id === s.backing) ? (s.backing as BackingId) : "dikis",
    edge,
    artwork: ARTWORKS.some((a) => a.id === s.artwork) ? (s.artwork as ArtworkId) : "hazir",
    express: Boolean(s.express),
  };
}

export function quoteCustom(input: Partial<CustomSpec>): CustomQuote {
  const spec = normalizeCustomSpec(input);
  const baseUnit = sizeTierPrice(spec.cm);
  const extraColors = Math.max(0, spec.colors - INCLUDED_COLORS) * EXTRA_COLOR_PER_UNIT;
  const edgeFee = EDGES.find((e) => e.id === spec.edge)?.perUnit ?? 0;
  const extrasUnit = extraColors + edgeFee + backingPrice(spec.backing);
  const discountRate = qtyDiscountRate(spec.qty);
  const unit = round2((baseUnit + extrasUnit) * (1 - discountRate));
  const artwork = ARTWORKS.find((a) => a.id === spec.artwork)!;
  const setupFee = spec.qty >= ARTWORK_FREE_FROM_QTY ? 0 : artwork.fee;
  const production = unit * spec.qty;
  const expressFee = spec.express ? round2(production * EXPRESS_RATE) : 0;
  return { spec, baseUnit, extrasUnit, discountRate, unit, setupFee, expressFee, total: round2(production + setupFee + expressFee) };
}

/* ------------------------------ Sepet ------------------------------ */

export type PricedLine = { name: string; unit: number; qty: number; fixed: number; total: number };

export type CartTotals = {
  subtotal: number;
  coupon: Coupon | null;
  couponError: string | null;
  couponDiscount: number;
  shipping: number;
  havaleDiscount: number;
  total: number;
};

export function findCoupon(code: string | undefined | null): Coupon | null {
  if (!code) return null;
  const c = code.trim().toLocaleUpperCase("tr-TR").replace(/İ/g, "I");
  return COUPONS.find((x) => x.code === c) ?? null;
}

export function cartTotals(lines: PricedLine[], couponCode: string | null | undefined, payment: PaymentId): CartTotals {
  const subtotal = round2(lines.reduce((s, l) => s + l.total, 0));
  let coupon = findCoupon(couponCode);
  let couponError: string | null = null;
  if (couponCode && couponCode.trim() && !coupon) couponError = "Kupon kodu geçersiz.";
  if (coupon && subtotal < coupon.minSubtotal) {
    couponError = `Bu kupon ${coupon.minSubtotal.toLocaleString("tr-TR")} TL ve üzeri siparişlerde geçerli.`;
    coupon = null;
  }
  const couponDiscount = coupon
    ? round2(Math.min(subtotal, coupon.type === "percent" ? subtotal * coupon.value : coupon.value))
    : 0;
  const afterCoupon = subtotal - couponDiscount;
  const shipping = subtotal === 0 || afterCoupon >= SHIPPING.freeFrom ? 0 : SHIPPING.flat;
  const havaleDiscount = payment === "havale" ? round2(afterCoupon * HAVALE_DISCOUNT_RATE) : 0;
  const total = round2(afterCoupon + shipping - havaleDiscount);
  return { subtotal, coupon, couponError, couponDiscount, shipping, havaleDiscount, total };
}

export const tl = (n: number) =>
  `${n.toLocaleString("tr-TR", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })} ₺`;
