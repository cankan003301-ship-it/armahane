import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { dbConfigured } from "@/lib/db";
import { STATUSES, listOrders, statusLabel } from "@/lib/orders";
import { tl } from "@/lib/pricing";
import { logout } from "./actions";

export default async function Page({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  await requireAdmin();
  const { durum } = await searchParams;
  if (!dbConfigured()) return <div className="alert warn">DATABASE_URL tanımlı değil. Vercel &gt; Storage &gt; Neon ekleyin.</div>;
  const orders = await listOrders(200, durum);
  const all = durum ? await listOrders(500) : orders;
  const paid = all.filter((o) => o.paid);
  const revenue = paid.reduce((s, o) => s + o.totals.total, 0);
  const waiting = all.filter((o) => o.status === "odeme-bekliyor").length;
  const todo = all.filter((o) => ["odendi", "tasarim-onay", "uretimde"].includes(o.status)).length;

  return (
    <>
      <div className="row between">
        <h1 style={{ margin: 0 }}>Siparişler</h1>
        <div className="row">
          <Link className="btn ghost sm" href="/yonetim/teklifler">Teklif talepleri</Link>
          <form action={logout}><button className="btn ghost sm">Çıkış</button></form>
        </div>
      </div>
      <div className="grid g4" style={{ margin: "18px 0" }}>
        <Stat label="Ödenen ciro" value={tl(revenue)} />
        <Stat label="Ödenen sipariş" value={String(paid.length)} />
        <Stat label="Ödeme bekleyen" value={String(waiting)} />
        <Stat label="Yapılacak (üretim)" value={String(todo)} />
      </div>
      <div className="chips" style={{ marginBottom: 14 }}>
        <Link className="chip" aria-pressed={!durum} href="/yonetim">Tümü</Link>
        {STATUSES.map((s) => <Link key={s.id} className="chip" aria-pressed={durum === s.id} href={`/yonetim?durum=${s.id}`}>{s.label}</Link>)}
      </div>
      <div className="card scroll-x">
        <table className="table">
          <thead><tr><th>Kod</th><th>Tarih</th><th>Müşteri</th><th>Ödeme</th><th>Tutar</th><th>Durum</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.code}>
                <td><Link className="link" href={`/yonetim/siparis/${o.code}`}>{o.code}</Link></td>
                <td>{new Date(o.created_at).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Istanbul" })}</td>
                <td>{o.customer.name}<div className="small muted">{o.customer.city}</div></td>
                <td>{o.payment === "kart" ? "Kart" : "Havale"}{o.paid ? " ✓" : ""}</td>
                <td>{tl(o.totals.total)}</td>
                <td><span className={`pill ${o.status}`}>{statusLabel(o.status)}</span></td>
              </tr>
            ))}
            {!orders.length && <tr><td colSpan={6} className="muted">Sipariş yok.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="card"><div className="small muted">{label}</div><div className="price">{value}</div></div>;
}
