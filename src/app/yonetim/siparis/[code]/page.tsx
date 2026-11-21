import Link from "next/link";
import { notFound } from "next/navigation";
import PatchArt, { type ArtSpec } from "@/components/PatchArt";
import { requireAdmin } from "@/lib/admin";
import { STATUSES, getOrder, orderToken, statusLabel } from "@/lib/orders";
import { tl } from "@/lib/pricing";
import { updateOrder } from "../../actions";

type Item = { kind: "product" | "custom"; art?: ArtSpec; note?: string; fileUrl?: string; fileName?: string; spec?: Record<string, unknown> };

export default async function Page({ params, searchParams }: { params: Promise<{ code: string }>; searchParams: Promise<{ ok?: string }> }) {
  await requireAdmin();
  const { code } = await params;
  const { ok } = await searchParams;
  const o = await getOrder(code);
  if (!o) notFound();
  const c = o.customer;
  const phone = c.phone.replace(/\D/g, "").replace(/^0/, "90").replace(/^5/, "905");

  return (
    <>
      <p><Link className="link" href="/yonetim">← Siparişler</Link></p>
      <div className="row between">
        <h1 style={{ margin: 0 }}>{o.code}</h1>
        <span className={`pill ${o.status}`}>{statusLabel(o.status)}</span>
      </div>
      {ok && <div className="alert ok" style={{ marginTop: 12 }}>Güncellendi.</div>}
      <div className="grid g2" style={{ marginTop: 18, alignItems: "start" }}>
        <div className="grid" style={{ gap: 16 }}>
          <div className="card">
            <h3>Müşteri</h3>
            <dl className="specs">
              <dt>Ad</dt><dd>{c.name}</dd>
              <dt>Telefon</dt><dd><a className="link" href={`https://wa.me/${phone}`} target="_blank" rel="noopener">{c.phone}</a></dd>
              <dt>E-posta</dt><dd><a className="link" href={`mailto:${c.email}`}>{c.email}</a></dd>
              <dt>Adres</dt><dd>{c.address}, {c.district}/{c.city}</dd>
              {c.invoice && <><dt>Fatura</dt><dd>{c.invoice}</dd></>}
              <dt>Ödeme</dt><dd>{o.payment === "kart" ? "Kart (PayTR)" : "Havale/EFT"} · {o.paid ? "Ödendi" : "Ödenmedi"}</dd>
              {o.note && <><dt>Not</dt><dd style={{ whiteSpace: "pre-wrap" }}>{o.note}</dd></>}
            </dl>
            <p className="small muted" style={{ marginTop: 10 }}>Müşteri bağlantısı: <code>/siparis/{o.code}?t={orderToken(o.code)}</code></p>
          </div>
          <div className="card">
            <h3>Ürünler</h3>
            {o.items.map((l) => {
              const it = l.item as Item;
              return (
                <div key={l.key} style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                  <div>{it?.art && <PatchArt spec={it.art} />}</div>
                  <div>
                    <b>{l.name}</b> × {l.qty} — {tl(l.total)}
                    <div className="small muted">{l.detail}</div>
                    {it?.kind === "custom" && (
                      <div className="small" style={{ marginTop: 6 }}>
                        {it.art?.text && <div>Yazı: {it.art.text} / {it.art.sub}</div>}
                        {it.art && <div>Renkler: zemin {it.art.bg}, kenar {it.art.border}, yazı {it.art.fg}</div>}
                        {it.fileUrl ? <a className="link" href={it.fileUrl} target="_blank" rel="noopener">Logo dosyası: {it.fileName}</a> : it.fileName && <div>Dosya bekleniyor: {it.fileName}</div>}
                        {it.note && <div style={{ whiteSpace: "pre-wrap" }}>Not: {it.note}</div>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="sum" style={{ marginTop: 12 }}>
              <div><span>Ara toplam</span><span>{tl(o.totals.subtotal)}</span></div>
              {o.totals.couponDiscount > 0 && <div><span>Kupon {o.totals.couponCode}</span><span>−{tl(o.totals.couponDiscount)}</span></div>}
              <div><span>Kargo</span><span>{tl(o.totals.shipping)}</span></div>
              {o.totals.havaleDiscount > 0 && <div><span>Havale indirimi</span><span>−{tl(o.totals.havaleDiscount)}</span></div>}
              <div className="total"><span>Toplam</span><span>{tl(o.totals.total)}</span></div>
            </div>
          </div>
        </div>
        <div className="grid" style={{ gap: 16 }}>
          <form action={updateOrder} className="card">
            <h3>Durumu güncelle</h3>
            <input type="hidden" name="code" value={o.code} />
            <label className="field"><span className="label">Durum</span>
              <select name="status" defaultValue={o.status}>{STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select></label>
            <label className="field"><span className="label">Kargo takip no</span><input type="text" name="tracking" defaultValue={o.tracking ?? ""} /></label>
            <label className="field"><span className="label">İç not</span><input type="text" name="note" /></label>
            <label className="check"><input type="checkbox" name="paid" defaultChecked={o.paid} /> Ödeme alındı (havale onayı)</label>
            <label className="check" style={{ marginTop: 8 }}><input type="checkbox" name="notify" defaultChecked /> Müşteriye e-posta gönder</label>
            <button className="btn brand block" style={{ marginTop: 14 }}>Kaydet</button>
          </form>
          <div className="card">
            <h3>Geçmiş</h3>
            <ol className="timeline">
              {[...o.history].reverse().map((h, i) => (
                <li key={i} className={i === 0 ? "now" : "done"}>
                  <b>{statusLabel(h.status)}</b> <span className="small muted">· {h.by} · {new Date(h.at).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</span>
                  {h.note && <div className="small">{h.note}</div>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
