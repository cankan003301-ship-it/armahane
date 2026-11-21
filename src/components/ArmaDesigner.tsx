"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PatchArt, { ICON_LABELS, type ArtIcon, type ArtSpec } from "./PatchArt";
import { cart } from "@/lib/cart";
import {
  ARTWORKS, ARTWORK_FREE_FROM_QTY, BACKINGS, EDGES, EXPRESS_RATE, INCLUDED_COLORS, EXTRA_COLOR_PER_UNIT,
  MAX_CM, MAX_COLORS, MIN_CM, PRODUCTION_DAYS, QTY_DISCOUNTS, SHAPES, quoteCustom, tl, type CustomSpec,
} from "@/lib/pricing";

const PALETTE = ["#1c2230", "#1f2a44", "#14213d", "#264653", "#2a9d8f", "#2f7d55", "#6a994e", "#e9c46a", "#d9a441", "#f4a261", "#e76f51", "#c8452c", "#9d0208", "#7f1d1d", "#6d597a", "#f6f1e7", "#ffffff", "#111111"];
const QTY_PRESETS = [1, 10, 25, 50, 100, 250];

type Props = { initialArt?: ArtSpec; initialCm?: number; uploadEnabled: boolean };

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="field">
      <span className="label">{label}</span>
      <div className="row" style={{ gap: 6 }}>
        {PALETTE.map((c) => (
          <button key={c} type="button" aria-label={c} aria-pressed={value === c} onClick={() => onChange(c)}
            style={{ width: 28, height: 28, borderRadius: 8, background: c, border: value === c ? "3px solid var(--brand)" : "1px solid var(--line)", cursor: "pointer" }} />
        ))}
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label={`${label} özel renk`} />
      </div>
    </div>
  );
}

export default function ArmaDesigner({ initialArt, initialCm, uploadEnabled }: Props) {
  const router = useRouter();
  const [spec, setSpec] = useState<CustomSpec>({
    cm: initialCm ?? 8, colors: 4, qty: 10, shape: (initialArt?.shape as CustomSpec["shape"]) ?? "yuvarlak",
    backing: "utu", edge: "overlok", artwork: "hazir", express: false,
  });
  const [art, setArt] = useState<ArtSpec>(
    initialArt ?? { shape: "yuvarlak", bg: "#1f2a44", border: "#d9a441", fg: "#f6f1e7", accent: "#c8452c", icon: "dag", text: "KULÜBÜNÜN ADI", sub: "2026" },
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const q = useMemo(() => quoteCustom(spec), [spec]);
  const set = <K extends keyof CustomSpec>(k: K, v: CustomSpec[K]) => setSpec((s) => ({ ...s, [k]: v }));
  const setA = <K extends keyof ArtSpec>(k: K, v: ArtSpec[K]) => setArt((a) => ({ ...a, [k]: v }));

  useEffect(() => setArt((a) => ({ ...a, shape: spec.shape })), [spec.shape]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function onFile(f: File | null) {
    setError("");
    if (!f) { setFile(null); setPreview(""); return; }
    if (f.size > 4 * 1024 * 1024) return setError("Dosya en fazla 4 MB olabilir.");
    if (!/^(image\/(png|jpeg|webp|svg\+xml)|application\/pdf)$/.test(f.type)) return setError("PNG, JPG, WEBP, SVG veya PDF yükleyin.");
    setFile(f);
    setPreview(f.type.startsWith("image/") ? URL.createObjectURL(f) : "");
  }

  async function addToCart() {
    setBusy(true); setError("");
    try {
      let fileUrl: string | undefined;
      if (file && uploadEnabled) {
        const fd = new FormData(); fd.append("file", file);
        const res = await fetch("/api/yukle", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Logo yüklenemedi.");
        fileUrl = data.url;
      }
      const cleanArt: ArtSpec = { ...art, imageUrl: fileUrl && file?.type.startsWith("image/") ? fileUrl : undefined };
      const fileNote = file && !fileUrl ? `Logo dosyası (${file.name}) sipariş sonrası WhatsApp/e-posta ile gönderilecek.` : "";
      cart.add({
        kind: "custom", key: `custom-${Date.now()}`, spec: q.spec, art: cleanArt,
        note: [note.trim(), fileNote].filter(Boolean).join("\n").slice(0, 1000) || undefined,
        fileUrl, fileName: file?.name.slice(0, 200),
      });
      router.push("/sepet");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu.");
    } finally {
      setBusy(false);
    }
  }

  const shownArt: ArtSpec = { ...art, imageUrl: preview || undefined };
  const lockedLaser = spec.shape === "ozel" || spec.shape === "kalkan";
  const nextTier = [...QTY_DISCOUNTS].reverse().find((d) => d.minQty > spec.qty);

  return (
    <div className="designer">
      <div className="designer-preview">
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="gallery-box"><PatchArt spec={shownArt} title="Arma önizleme" /></div>
          <div style={{ padding: "14px 18px" }}>
            <SizeRuler cm={spec.cm} />
            <p className="small muted" style={{ margin: "8px 0 0" }}>Önizleme yaklaşıktır. Üretimden önce nakışa uyarlanmış son hali onayına gönderilir.</p>
          </div>
        </div>
        <PriceBox q={q} nextTier={nextTier} busy={busy} onAdd={addToCart} error={error} />
      </div>

      <div className="designer-form">
        <section className="card">
          <h2 className="eyebrow">1 · Tasarım</h2>
          <div className="field">
            <span className="label">Logo / görsel (isteğe bağlı)</span>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
            <span className="hint">
              {uploadEnabled ? "PNG, JPG, SVG veya PDF · en fazla 4 MB. Vektör dosya en iyi sonucu verir." : "Dosyanızı sipariş sonrası WhatsApp veya e-posta ile alacağız; önizleme için yine de seçebilirsiniz."}
            </span>
          </div>
          <div className="grid g2" style={{ gap: 12 }}>
            <label className="field"><span className="label">Üst yazı</span>
              <input type="text" maxLength={22} value={art.text ?? ""} onChange={(e) => setA("text", e.target.value)} placeholder="Örn. ZİRVE KULÜBÜ" /></label>
            <label className="field"><span className="label">Alt yazı</span>
              <input type="text" maxLength={22} value={art.sub ?? ""} onChange={(e) => setA("sub", e.target.value)} placeholder="Örn. 1987" /></label>
          </div>
          {!preview && (
            <label className="field"><span className="label">Simge</span>
              <select value={art.icon} onChange={(e) => setA("icon", e.target.value as ArtIcon)}>
                {(Object.keys(ICON_LABELS) as ArtIcon[]).map((k) => <option key={k} value={k}>{ICON_LABELS[k]}</option>)}
              </select></label>
          )}
          <ColorRow label="Zemin rengi" value={art.bg} onChange={(v) => setA("bg", v)} />
          <ColorRow label="Kenar rengi" value={art.border} onChange={(v) => setA("border", v)} />
          <ColorRow label="Yazı / simge rengi" value={art.fg} onChange={(v) => setA("fg", v)} />
          <ColorRow label="Vurgu rengi" value={art.accent ?? art.border} onChange={(v) => setA("accent", v)} />
        </section>

        <section className="card">
          <h2 className="eyebrow">2 · Ölçü ve şekil</h2>
          <div className="field">
            <span className="label">Şekil</span>
            <div className="chips">{SHAPES.map((s) => <button key={s.id} type="button" className="chip" aria-pressed={spec.shape === s.id} onClick={() => set("shape", s.id)}>{s.label}</button>)}</div>
          </div>
          <label className="field">
            <span className="label">Boyut: {spec.cm} cm <span className="muted">(en uzun kenar)</span></span>
            <input type="range" min={MIN_CM} max={MAX_CM} value={spec.cm} onChange={(e) => set("cm", Number(e.target.value))} />
            <span className="hint">Göğüs/kol için 6–8 cm, şapka için 5–6 cm, sırt için 15–20 cm önerilir. Daha büyük ölçü için teklif isteyin.</span>
          </label>
          <label className="field">
            <span className="label">Renk sayısı: {spec.colors}</span>
            <input type="range" min={1} max={MAX_COLORS} value={spec.colors} onChange={(e) => set("colors", Number(e.target.value))} />
            <span className="hint">İlk {INCLUDED_COLORS} renk dahil; sonrası adet başı +{EXTRA_COLOR_PER_UNIT} ₺. Zemin ve kenar da birer renk sayılır.</span>
          </label>
          <div className="field">
            <span className="label">Kenar</span>
            <div className="chips">{EDGES.map((e) => (
              <button key={e.id} type="button" className="chip" aria-pressed={spec.edge === e.id || (lockedLaser && e.id === "lazer")}
                disabled={lockedLaser && e.id === "overlok"} onClick={() => set("edge", e.id)}>
                {e.label} {e.perUnit ? `+${e.perUnit} ₺` : ""}<small>{e.hint}</small>
              </button>))}</div>
            {lockedLaser && <span className="hint">Kalkan ve özel şekillerde lazer kesim kullanılır.</span>}
          </div>
          <div className="field">
            <span className="label">Arka yüzey</span>
            <div className="chips">{BACKINGS.map((b) => (
              <button key={b.id} type="button" className="chip" aria-pressed={spec.backing === b.id} onClick={() => set("backing", b.id)}>
                {b.label} {b.perUnit ? `+${b.perUnit} ₺` : ""}<small>{b.hint}</small></button>))}</div>
          </div>
        </section>

        <section className="card">
          <h2 className="eyebrow">3 · Adet ve teslim</h2>
          <div className="field">
            <span className="label">Adet</span>
            <div className="row">
              <input type="number" min={1} max={5000} value={spec.qty} style={{ maxWidth: 140 }}
                onChange={(e) => set("qty", Math.max(1, Math.min(5000, Number(e.target.value) || 1)))} aria-label="Adet" />
              <div className="chips">{QTY_PRESETS.map((n) => <button key={n} type="button" className="chip" aria-pressed={spec.qty === n} onClick={() => set("qty", n)}>{n}</button>)}</div>
            </div>
          </div>
          <div className="field">
            <span className="label">Tasarım durumu</span>
            <div className="chips">{ARTWORKS.map((a) => (
              <button key={a.id} type="button" className="chip" aria-pressed={spec.artwork === a.id} onClick={() => set("artwork", a.id)}>
                {a.label} · {a.fee} ₺<small>{a.hint}</small></button>))}</div>
            <span className="hint">Sipariş başına bir kez alınır; {ARTWORK_FREE_FROM_QTY}+ adette ücretsiz. Tekrar siparişte alınmaz.</span>
          </div>
          <label className="check">
            <input type="checkbox" checked={spec.express} onChange={(e) => set("express", e.target.checked)} />
            <span><b>Ekspres üretim</b> — {PRODUCTION_DAYS.express} (+%{Math.round(EXPRESS_RATE * 100)}). Normal: {PRODUCTION_DAYS.normal}.</span>
          </label>
          <label className="field" style={{ marginTop: 14 }}><span className="label">Notunuz</span>
            <textarea maxLength={800} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Renk kodları (Pantone), kullanım yeri, teslim tarihi…" /></label>
        </section>
        <p className="small muted">200+ adet, 20 cm üstü veya özel kumaş/iplik (metalik, fosforlu) için <Link className="link" href="/kurumsal">teklif isteyin</Link>.</p>
      </div>
    </div>
  );
}

function SizeRuler({ cm }: { cm: number }) {
  const W = 300, scale = W / 22;
  return (
    <svg viewBox={`0 0 ${W} 70`} role="img" aria-label={`${cm} cm, 1 TL madeni para ile karşılaştırma`} style={{ width: "100%" }}>
      <circle cx={13 + 2.6 * scale / 2} cy={30} r={2.6 * scale / 2} fill="#d9a441" opacity=".8" />
      <text x={13 + 2.6 * scale / 2} y={62} fontSize="10" textAnchor="middle" fill="#6d6a62">1 TL</text>
      <rect x={60} y={30 - Math.min(cm, 6) * scale / 4} width={cm * scale * 0.95} height={Math.min(cm, 6) * scale / 2} rx="6" fill="none" stroke="#c8452c" strokeWidth="2" strokeDasharray="5 3" />
      <line x1={60} x2={60 + cm * scale * 0.95} y1={60} y2={60} stroke="#1c2230" strokeWidth="1.5" />
      <text x={60 + (cm * scale * 0.95) / 2} y={56} fontSize="11" textAnchor="middle" fill="#1c2230" fontWeight="700">{cm} cm</text>
    </svg>
  );
}

function PriceBox({ q, nextTier, busy, onAdd, error }: {
  q: ReturnType<typeof quoteCustom>; nextTier?: { minQty: number; rate: number }; busy: boolean; onAdd: () => void; error: string;
}) {
  const nextUnit = nextTier ? quoteCustom({ ...q.spec, qty: nextTier.minQty }).unit : 0;
  return (
    <div className="card" aria-live="polite">
      <div className="sum">
        <div><span>Birim fiyat ({q.spec.qty} adet)</span><b>{tl(q.unit)}</b></div>
        {q.discountRate > 0 && <div className="small"><span>Adet indirimi</span><span className="neg">%{Math.round(q.discountRate * 100)}</span></div>}
        <div className="small"><span>Üretim ({q.spec.qty} × {tl(q.unit)})</span><span>{tl(q.unit * q.spec.qty)}</span></div>
        <div className="small"><span>Dijitalleştirme (bir kez)</span><span>{q.setupFee ? tl(q.setupFee) : "Ücretsiz"}</span></div>
        {q.expressFee > 0 && <div className="small"><span>Ekspres üretim</span><span>{tl(q.expressFee)}</span></div>}
        <div className="total"><span>Toplam</span><span>{tl(q.total)}</span></div>
      </div>
      {nextTier && nextUnit < q.unit && (
        <p className="small" style={{ margin: "10px 0 0" }}>💡 {nextTier.minQty} adette birim fiyat <b>{tl(nextUnit)}</b> olur.</p>
      )}
      {error && <p className="err" role="alert" style={{ marginTop: 10 }}>{error}</p>}
      <button className="btn brand block" style={{ marginTop: 14 }} onClick={onAdd} disabled={busy}>{busy ? "Ekleniyor…" : "Sepete ekle"}</button>
      <p className="small muted" style={{ margin: "8px 0 0" }}>Kargo ve kupon sepette hesaplanır. Ödemeden sonra önizleme onayınıza gelir.</p>
    </div>
  );
}
