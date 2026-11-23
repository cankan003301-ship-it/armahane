import type { OrderRow } from "@/lib/orders";
import { respondProof } from "@/app/siparis/[code]/actions";

/** Müşteri sipariş sayfasındaki tasarım onay kutusu. */
export default function ProofApproval({ o, t, result }: { o: OrderRow; t: string; result?: string }) {
  if (!o.proof_url) return null;
  const waiting = o.status === "tasarim-onay" && o.approval === "bekliyor";
  return (
    <div className="card" id="onay" style={waiting ? { borderColor: "var(--brand)", borderWidth: 2 } : undefined}>
      <h3>Tasarım önizlemesi</h3>
      <img src={o.proof_url} alt="Armanızın nakış önizlemesi" style={{ width: "100%", maxWidth: 480, borderRadius: 12, background: "var(--paper-2)" }} />
      {o.proof_note && <p style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{o.proof_note}</p>}
      {result === "tamam" && <div className="alert ok">Onayın alındı, armanı üretime aldık. Teşekkürler!</div>}
      {result === "revizyon" && <div className="alert ok">Revizyon talebin alındı; yeni önizlemeyi en kısa sürede göndereceğiz.</div>}
      {result === "mesaj" && <div className="alert err">Lütfen neyin değişmesini istediğini birkaç kelimeyle yaz.</div>}
      {result === "hata" && <div className="alert err">Çok fazla deneme yapıldı, birkaç dakika sonra tekrar dene.</div>}
      {waiting ? (
        <div className="grid g2" style={{ marginTop: 14, alignItems: "start" }}>
          <form action={respondProof}>
            <input type="hidden" name="code" value={o.code} />
            <input type="hidden" name="t" value={t} />
            <input type="hidden" name="karar" value="onay" />
            <button className="btn brand block">Onaylıyorum, üretime başlayın</button>
            <p className="small muted" style={{ marginTop: 6 }}>Onaydan sonra değişiklik yapılamaz.</p>
          </form>
          <form action={respondProof}>
            <input type="hidden" name="code" value={o.code} />
            <input type="hidden" name="t" value={t} />
            <input type="hidden" name="karar" value="revizyon" />
            <label className="field" style={{ marginBottom: 8 }}>
              <span className="label">Değişiklik istiyorum</span>
              <textarea name="mesaj" maxLength={1000} placeholder="Örn. Yazı biraz daha büyük olsun, kenar rengi lacivert." />
            </label>
            <button className="btn ghost block">Revizyon iste</button>
          </form>
        </div>
      ) : (
        o.approval === "onaylandi" ? <p className="small" style={{ color: "var(--ok)", marginTop: 10 }}>✓ Bu tasarımı onayladın.</p>
        : o.approval === "revizyon" ? <p className="small muted" style={{ marginTop: 10 }}>Revizyon talebin üzerinde çalışıyoruz.</p> : null
      )}
    </div>
  );
}
