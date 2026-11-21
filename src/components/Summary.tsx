"use client";
import { useState } from "react";
import { cart } from "@/lib/cart";
import { HAVALE_DISCOUNT_RATE, tl, type CartTotals } from "@/lib/pricing";

export default function Summary({ totals, coupon, showHavaleHint }: { totals: CartTotals; coupon: string; showHavaleHint?: boolean }) {
  const [code, setCode] = useState(coupon);
  return (
    <div className="card">
      <form className="row" style={{ gap: 8, flexWrap: "nowrap", marginBottom: 14 }} onSubmit={(e) => { e.preventDefault(); cart.setCoupon(code); }}>
        <input type="text" placeholder="Kupon kodu" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Kupon kodu" />
        <button className="btn sm" type="submit">Uygula</button>
      </form>
      {totals.couponError && <p className="err" role="alert">{totals.couponError}</p>}
      {totals.coupon && <p className="small" style={{ color: "var(--ok)" }}>✓ {totals.coupon.code}: {totals.coupon.label}</p>}
      <div className="sum">
        <div><span>Ara toplam</span><span>{tl(totals.subtotal)}</span></div>
        {totals.couponDiscount > 0 && <div><span>Kupon</span><span className="neg">−{tl(totals.couponDiscount)}</span></div>}
        <div><span>Kargo</span><span>{totals.shipping ? tl(totals.shipping) : "Ücretsiz"}</span></div>
        {totals.havaleDiscount > 0 && <div><span>Havale indirimi</span><span className="neg">−{tl(totals.havaleDiscount)}</span></div>}
        <div className="total"><span>Toplam</span><span>{tl(totals.total)}</span></div>
      </div>
      {showHavaleHint && <p className="small muted" style={{ margin: "8px 0 0" }}>Havale/EFT ile ödersen %{Math.round(HAVALE_DISCOUNT_RATE * 100)} indirim ödeme adımında düşülür.</p>}
    </div>
  );
}
