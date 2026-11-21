"use client";
import Link from "next/link";
import { useMemo } from "react";
import { cart, useCart } from "@/lib/cart";
import { priceItems } from "@/lib/lines";
import { getProduct } from "@/data/catalog";
import { cartTotals, SHIPPING, tl } from "@/lib/pricing";
import PatchArt from "./PatchArt";
import Summary from "./Summary";

export default function CartView() {
  const { items, coupon } = useCart();
  const lines = useMemo(() => priceItems(items), [items]);
  const totals = cartTotals(lines, coupon, "kart");

  if (!items.length) {
    return (
      <div className="card center" style={{ padding: 40 }}>
        <h2>Sepetin boş</h2>
        <p className="muted">Kendi armanı tasarla ya da hazır koleksiyona göz at.</p>
        <div className="row" style={{ justifyContent: "center" }}>
          <Link href="/arma-tasarla" className="btn brand">Arma Tasarla</Link>
          <Link href="/urunler" className="btn ghost">Hazır armalar</Link>
        </div>
      </div>
    );
  }
  const toFree = SHIPPING.freeFrom - (totals.subtotal - totals.couponDiscount);

  return (
    <div className="grid" style={{ gridTemplateColumns: "minmax(0,1.6fr) minmax(280px,1fr)", gap: 24, alignItems: "start" }} data-cart>
      <div className="card">
        {lines.map((l) => {
          const it = l.item;
          const art = it.kind === "product" ? getProduct(it.slug)?.art : it.art;
          return (
            <div className="line" key={l.key}>
              <div className="thumb">{art && <PatchArt spec={art} />}</div>
              <div>
                <b>{it.kind === "product" ? <Link href={`/urun/${it.slug}`}>{l.name}</Link> : l.name}</b>
                <div className="small muted">{l.detail}</div>
                {!l.available && <div className="err">Stok yetersiz — adedi azaltın.</div>}
                {it.kind === "custom" && it.fileName && <div className="small muted">Dosya: {it.fileName}</div>}
                <div className="row" style={{ marginTop: 8 }}>
                  {it.kind === "product" ? (
                    <div className="qty">
                      <button aria-label="Azalt" onClick={() => cart.setQty(l.key, l.qty - 1)}>−</button>
                      <input type="number" value={l.qty} min={1} aria-label="Adet" onChange={(e) => cart.setQty(l.key, Number(e.target.value))} />
                      <button aria-label="Artır" onClick={() => cart.setQty(l.key, l.qty + 1)}>+</button>
                    </div>
                  ) : (
                    <span className="small">{l.qty} adet</span>
                  )}
                  <button className="btn ghost sm" onClick={() => cart.remove(l.key)}>Kaldır</button>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <b>{tl(l.total)}</b>
                <div className="small muted">{tl(l.unit)} / adet</div>
              </div>
            </div>
          );
        })}
        <p className="small muted" style={{ marginTop: 12 }}>Özel armayı değiştirmek için kaldırıp yeniden tasarlayabilirsin.</p>
      </div>
      <div className="grid" style={{ gap: 14 }}>
        <Summary key={coupon} totals={totals} coupon={coupon} showHavaleHint />
        {toFree > 0 && <div className="alert warn small">Ücretsiz kargo için {tl(toFree)} daha ekle.</div>}
        <Link href="/odeme" className="btn brand block">Ödemeye geç</Link>
        <Link href="/urunler" className="btn ghost block">Alışverişe devam</Link>
      </div>
    </div>
  );
}
