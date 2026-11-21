"use client";
import { useState } from "react";
import Link from "next/link";
import { cart } from "@/lib/cart";
import { productUnit } from "@/lib/lines";
import { BACKINGS, QTY_DISCOUNTS, qtyDiscountRate, tl, type BackingId } from "@/lib/pricing";

export default function AddToCart({ slug, price, stock }: { slug: string; price: number; stock: number }) {
  const [backing, setBacking] = useState<BackingId>("utu");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const unit = productUnit(price, backing, qty);
  const rate = qtyDiscountRate(qty);
  const next = [...QTY_DISCOUNTS].reverse().find((d) => d.minQty > qty);
  const out = stock <= 0;

  function add() {
    cart.add({ kind: "product", key: `${slug}|${backing}`, slug, backing, qty });
    setAdded(true);
  }

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div>
        <div className="label" style={{ marginBottom: 8 }}>Arka yüzey</div>
        <div className="chips" role="group" aria-label="Arka yüzey">
          {BACKINGS.map((b) => (
            <button key={b.id} className="chip" aria-pressed={backing === b.id} onClick={() => setBacking(b.id)}>
              {b.label} {b.perUnit ? `+${b.perUnit} ₺` : ""}
              <small>{b.hint}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="row">
        <div className="qty" aria-label="Adet">
          <button aria-label="Azalt" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <input type="number" inputMode="numeric" min={1} max={Math.max(1, stock)} value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(Math.max(1, stock), Number(e.target.value) || 1)))} aria-label="Adet" />
          <button aria-label="Artır" onClick={() => setQty((q) => Math.min(Math.max(1, stock), q + 1))}>+</button>
        </div>
        <div>
          <div className="price">{tl(unit * qty)}</div>
          <div className="small muted">Birim {tl(unit)}{rate ? ` · %${rate * 100} adet indirimi` : ""}</div>
        </div>
      </div>
      {next && <div className="small muted">{next.minQty} adet ve üzerinde %{Math.round(next.rate * 100)} indirim.</div>}
      <button className="btn brand block" onClick={add} disabled={out}>{out ? "Tükendi" : "Sepete ekle"}</button>
      {added && (
        <div className="alert ok" role="status">
          Sepete eklendi. <Link href="/sepet" className="link">Sepete git →</Link>
        </div>
      )}
    </div>
  );
}
