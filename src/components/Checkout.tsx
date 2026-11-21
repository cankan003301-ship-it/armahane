"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cart, useCart } from "@/lib/cart";
import { priceItems } from "@/lib/lines";
import { cartTotals, HAVALE_DISCOUNT_RATE, type PaymentId } from "@/lib/pricing";
import Summary from "./Summary";

type Field = "name" | "email" | "phone" | "city" | "district" | "address" | "invoice";
const FIELDS: { k: Field; label: string; type?: string; auto?: string; full?: boolean; optional?: boolean; area?: boolean }[] = [
  { k: "name", label: "Ad soyad", auto: "name" },
  { k: "phone", label: "Cep telefonu", type: "tel", auto: "tel" },
  { k: "email", label: "E-posta", type: "email", auto: "email", full: true },
  { k: "city", label: "İl", auto: "address-level1" },
  { k: "district", label: "İlçe", auto: "address-level2" },
  { k: "address", label: "Açık adres", auto: "street-address", full: true, area: true },
  { k: "invoice", label: "Kurumsal fatura (unvan, vergi dairesi ve no)", full: true, optional: true },
];

export default function Checkout({ cardEnabled, ready }: { cardEnabled: boolean; ready: boolean }) {
  const router = useRouter();
  const { items, coupon } = useCart();
  const [payment, setPayment] = useState<PaymentId>(cardEnabled ? "kart" : "havale");
  const [c, setC] = useState<Record<Field, string>>({ name: "", email: "", phone: "", city: "", district: "", address: "", invoice: "" });
  const [note, setNote] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lines = useMemo(() => priceItems(items), [items]);
  const totals = cartTotals(lines, coupon, payment);

  if (!items.length) {
    return <div className="card center"><p>Sepetin boş.</p><Link className="btn brand" href="/arma-tasarla">Arma Tasarla</Link></div>;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!accepted) return setError("Ön bilgilendirme formu ve mesafeli satış sözleşmesini onaylayın.");
    setBusy(true);
    try {
      const res = await fetch("/api/siparis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, coupon, payment, customer: c, note, accepted }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Sipariş oluşturulamadı.");
      cart.clear();
      router.push(payment === "kart" ? `/odeme/kart/${data.code}?t=${data.token}` : `/siparis/${data.code}?t=${data.token}&yeni=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid" style={{ gridTemplateColumns: "minmax(0,1.6fr) minmax(280px,1fr)", gap: 24, alignItems: "start" }} data-cart>
      <div className="grid" style={{ gap: 16 }}>
        <section className="card">
          <h2 className="eyebrow">Teslimat bilgileri</h2>
          <div className="grid g2" style={{ gap: "0 14px" }}>
            {FIELDS.map((f) => (
              <label key={f.k} className="field" style={f.full ? { gridColumn: "1 / -1" } : undefined}>
                <span className="label">{f.label}{f.optional ? <span className="muted"> (isteğe bağlı)</span> : ""}</span>
                {f.area ? (
                  <textarea required autoComplete={f.auto} value={c[f.k]} onChange={(e) => setC({ ...c, [f.k]: e.target.value })} maxLength={400} />
                ) : (
                  <input type={f.type ?? "text"} required={!f.optional} autoComplete={f.auto} value={c[f.k]} maxLength={f.k === "invoice" ? 200 : 120}
                    onChange={(e) => setC({ ...c, [f.k]: e.target.value })} />
                )}
              </label>
            ))}
            <label className="field" style={{ gridColumn: "1 / -1" }}>
              <span className="label">Sipariş notu <span className="muted">(isteğe bağlı)</span></span>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} placeholder="Teslim tarihi, renk kodları vb." />
            </label>
          </div>
        </section>
        <section className="card">
          <h2 className="eyebrow">Ödeme yöntemi</h2>
          <div className="chips">
            {cardEnabled && (
              <button type="button" className="chip" aria-pressed={payment === "kart"} onClick={() => setPayment("kart")}>
                Kredi / banka kartı<small>PayTR güvenli ödeme · taksit seçenekleri</small>
              </button>
            )}
            <button type="button" className="chip" aria-pressed={payment === "havale"} onClick={() => setPayment("havale")}>
              Havale / EFT · %{Math.round(HAVALE_DISCOUNT_RATE * 100)} indirim<small>IBAN bilgisi sipariş sonrası gösterilir</small>
            </button>
          </div>
        </section>
      </div>
      <div className="grid" style={{ gap: 14 }}>
        <Summary key={coupon} totals={totals} coupon={coupon} />
        <label className="check">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
          <span>
            <Link className="link" href="/yasal/on-bilgilendirme" target="_blank">Ön bilgilendirme formunu</Link> ve{" "}
            <Link className="link" href="/yasal/mesafeli-satis" target="_blank">mesafeli satış sözleşmesini</Link> okudum, onaylıyorum.
            Kişiye özel üretilen ürünlerde cayma hakkı olmadığını biliyorum.
          </span>
        </label>
        {error && <div className="alert err" role="alert">{error}</div>}
        {!ready && <div className="alert warn">Sipariş sistemi kurulum aşamasında. Siparişiniz için WhatsApp&apos;tan yazabilirsiniz.</div>}
        <button className="btn brand block" type="submit" disabled={busy || !ready}>
          {busy ? "Sipariş oluşturuluyor…" : payment === "kart" ? "Siparişi onayla ve öde" : "Siparişi onayla"}
        </button>
        <p className="small muted">Kişisel verileriniz yalnızca siparişiniz için işlenir. <Link className="link" href="/yasal/kvkk">KVKK aydınlatma metni</Link></p>
      </div>
    </form>
  );
}
