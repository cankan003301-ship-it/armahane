import { test } from "node:test";
import assert from "node:assert/strict";
import { cartTotals, findCoupon, normalizeCustomSpec, quoteCustom, sizeTierPrice, SHIPPING, type PricedLine } from "../src/lib/pricing.ts";

const line = (total: number): PricedLine => ({ name: "x", unit: total, qty: 1, fixed: 0, total });

test("boyut basamakları yukarı yuvarlanır ve sınırlanır", () => {
  assert.equal(sizeTierPrice(5), 110);
  assert.equal(sizeTierPrice(5.4), 110);
  assert.equal(sizeTierPrice(6), 135);
  assert.equal(sizeTierPrice(1), 110);
  assert.equal(sizeTierPrice(99), 410);
});

test("tek adet özel arma: dijitalleştirme eklenir", () => {
  const q = quoteCustom({ cm: 7, colors: 4, qty: 1, backing: "dikis", artwork: "hazir" });
  assert.equal(q.unit, 135);
  assert.equal(q.setupFee, 150);
  assert.equal(q.total, 285);
});

test("adet indirimi, ekstra renk ve arka yüzey", () => {
  const q = quoteCustom({ cm: 7, colors: 6, qty: 50, backing: "cirt", artwork: "hazir" });
  // (135 + 2*8 + 30) * 0.75
  assert.equal(q.unit, 135.75);
  assert.equal(q.total, 135.75 * 50 + 150);
});

test("100+ adette dijitalleştirme ücretsiz, ekspres %20", () => {
  const q = quoteCustom({ cm: 5, colors: 3, qty: 100, artwork: "sifirdan", express: true, backing: "dikis" });
  assert.equal(q.setupFee, 0);
  assert.equal(q.unit, 74.8); // 110 * 0.68
  assert.equal(q.expressFee, 1496);
});

test("kalkan ve özel şekil lazer kesime zorlanır; geçersiz değerler düzeltilir", () => {
  assert.equal(normalizeCustomSpec({ shape: "kalkan", edge: "overlok" }).edge, "lazer");
  const s = normalizeCustomSpec({ qty: -5, cm: 1000, colors: 0, shape: "x" as never, backing: "y" as never });
  assert.deepEqual([s.qty, s.cm, s.colors, s.shape, s.backing], [1, 20, 1, "yuvarlak", "dikis"]);
});

test("kupon, kargo eşiği ve havale indirimi", () => {
  const t = cartTotals([line(400)], "hosgeldin10", "kart");
  assert.equal(t.couponDiscount, 40);
  assert.equal(t.shipping, SHIPPING.flat);
  assert.equal(t.total, 360 + SHIPPING.flat);
  const h = cartTotals([line(1200)], "", "havale");
  assert.equal(h.shipping, 0);
  assert.equal(h.havaleDiscount, 36);
  assert.equal(h.total, 1164);
});

test("kupon alt limiti ve geçersiz kupon", () => {
  assert.equal(cartTotals([line(1000)], "ARMA100", "kart").couponDiscount, 0);
  assert.match(cartTotals([line(1000)], "ARMA100", "kart").couponError ?? "", /1\.500/);
  assert.equal(cartTotals([line(100)], "YOK", "kart").couponError, "Kupon kodu geçersiz.");
  assert.equal(findCoupon("  hoşgeldin10 ".replace("ş", "s")), findCoupon("HOSGELDIN10"));
});

test("boş sepette kargo yok", () => {
  assert.equal(cartTotals([], "", "kart").total, 0);
});
