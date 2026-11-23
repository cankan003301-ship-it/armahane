import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { checkOrderToken, getOrder, statusLabel, type StatusId } from "@/lib/orders";
import { tl } from "@/lib/pricing";
import { whatsappLink } from "@/lib/site";
import ProofApproval from "@/components/ProofApproval";

export const metadata: Metadata = { title: "Sipariş Durumu", robots: { index: false } };
export const dynamic = "force-dynamic";

const FLOW: StatusId[] = ["odeme-bekliyor", "odendi", "tasarim-onay", "uretimde", "kargoda", "teslim"];

export default async function Page({ params, searchParams }: {
  params: Promise<{ code: string }>; searchParams: Promise<{ t?: string; yeni?: string; odeme?: string; onay?: string }>;
}) {
  const { code } = await params;
  const sp = await searchParams;
  if (!checkOrderToken(code, sp.t)) notFound();
  const o = await getOrder(code);
  if (!o) notFound();
  const hasCustom = o.items.some((l) => (l.item as { kind?: string })?.kind === "custom");
  const flow = FLOW.filter((s) => hasCustom || s !== "tasarim-onay");
  const idx = flow.indexOf(o.status as StatusId);
  const bank = { name: process.env.BANK_ACCOUNT_NAME, bank: process.env.BANK_NAME, iban: process.env.BANK_IBAN };
  const wa = whatsappLink(`Merhaba, ${o.code} kodlu siparişim hakkında yazıyorum.`);

  return (
    <section className="section" style={{ paddingTop: 32 }}>
      <div className="narrow grid" style={{ gap: 18 }}>
        {sp.yeni && <div className="alert ok">Siparişin alındı, teşekkürler! Onay e-postası {o.customer.email} adresine gönderildi.</div>}
        {sp.odeme === "basarili" && !o.paid && <div className="alert ok">Ödemen alındı; onay birkaç saniye içinde bu sayfaya yansır. Sayfayı yenileyebilirsin.</div>}
        {sp.odeme === "basarisiz" && !o.paid && (
          <div className="alert err">Ödeme tamamlanamadı. <Link className="link" href={`/odeme/kart/${o.code}?t=${sp.t}`}>Tekrar dene</Link> ya da havale ile öde.</div>
        )}
        <div>
          <span className="eyebrow">Sipariş {o.code}</span>
          <h1 style={{ fontSize: "2.2rem" }}>{statusLabel(o.status)}</h1>
          <p className="muted">{new Date(o.created_at).toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Istanbul" })}</p>
        </div>

        {!o.paid && o.payment === "havale" && o.status !== "iptal" && (
          <div className="card stitch" style={{ boxShadow: "none" }}>
            <h3>Havale / EFT bilgileri</h3>
            {bank.iban ? (
              <dl className="specs">
                <dt>Alıcı</dt><dd>{bank.name}</dd>
                <dt>Banka</dt><dd>{bank.bank}</dd>
                <dt>IBAN</dt><dd style={{ fontFamily: "monospace" }}>{bank.iban}</dd>
                <dt>Tutar</dt><dd>{tl(o.totals.total)}</dd>
                <dt>Açıklama</dt><dd>{o.code}</dd>
              </dl>
            ) : <p>IBAN bilgisi kısa süre içinde e-posta/WhatsApp ile iletilecek.</p>}
            <p className="small muted" style={{ marginTop: 10 }}>Açıklamaya mutlaka sipariş kodunu yaz. Ödeme 1 iş günü içinde onaylanır; 3 gün içinde ödenmeyen siparişler iptal edilir.</p>
          </div>
        )}
        {!o.paid && o.payment === "kart" && o.status === "odeme-bekliyor" && !sp.odeme && (
          <Link className="btn brand" href={`/odeme/kart/${o.code}?t=${sp.t}`}>Ödemeyi tamamla</Link>
        )}

        <ProofApproval o={o} t={sp.t!} result={sp.onay} />

        {o.status !== "iptal" && (
          <div className="card">
            <ol className="timeline">
              {flow.map((s, i) => (
                <li key={s} className={i < idx ? "done" : i === idx ? "now" : ""}>
                  <b>{statusLabel(s)}</b>
                  {s === "kargoda" && o.tracking && <div className="small">Takip: {o.tracking}</div>}
                  {s === "tasarim-onay" && i === idx && <div className="small">{o.proof_url ? "Önizleme yukarıda; onayını bekliyoruz." : "Tasarımın nakışa uyarlanıyor; önizleme hazır olunca e-posta gelecek."}</div>}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="card">
          {o.items.map((l) => (
            <div key={l.key} className="row between" style={{ padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
              <div><b>{l.name}</b> × {l.qty}<div className="small muted">{l.detail}</div></div>
              <b>{tl(l.total)}</b>
            </div>
          ))}
          <div className="sum" style={{ marginTop: 12 }}>
            <div><span>Ara toplam</span><span>{tl(o.totals.subtotal)}</span></div>
            {o.totals.couponDiscount > 0 && <div><span>Kupon ({o.totals.couponCode})</span><span className="neg">−{tl(o.totals.couponDiscount)}</span></div>}
            <div><span>Kargo</span><span>{o.totals.shipping ? tl(o.totals.shipping) : "Ücretsiz"}</span></div>
            {o.totals.havaleDiscount > 0 && <div><span>Havale indirimi</span><span className="neg">−{tl(o.totals.havaleDiscount)}</span></div>}
            <div className="total"><span>Toplam</span><span>{tl(o.totals.total)}</span></div>
          </div>
        </div>
        <p className="small muted">Bu sayfanın bağlantısını sakla; sipariş durumunu buradan takip edebilirsin. {wa && <a className="link" href={wa} target="_blank" rel="noopener">WhatsApp&apos;tan yaz</a>}</p>
      </div>
    </section>
  );
}
