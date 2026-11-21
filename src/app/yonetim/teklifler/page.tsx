import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { db, dbConfigured } from "@/lib/db";
import { updateQuote } from "../actions";

type Quote = { id: number; name: string; company: string | null; phone: string; email: string | null; qty: number | null; message: string | null; file_url: string | null; status: string; created_at: string };

export default async function Page() {
  await requireAdmin();
  if (!dbConfigured()) return <div className="alert warn">DATABASE_URL tanımlı değil.</div>;
  const sql = await db();
  const rows = (await sql`SELECT * FROM quotes ORDER BY created_at DESC LIMIT 200`) as Quote[];
  return (
    <>
      <p><Link className="link" href="/yonetim">← Siparişler</Link></p>
      <h1>Teklif talepleri</h1>
      <div className="grid" style={{ gap: 12 }}>
        {rows.map((q) => (
          <div key={q.id} className="card">
            <div className="row between">
              <b>{q.name}{q.company ? ` — ${q.company}` : ""}</b>
              <span className="small muted">{new Date(q.created_at).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</span>
            </div>
            <div className="small">{q.phone} · {q.email} · {q.qty ?? "?"} adet</div>
            {q.message && <p style={{ whiteSpace: "pre-wrap", margin: "8px 0" }}>{q.message}</p>}
            {q.file_url && <a className="link small" href={q.file_url} target="_blank" rel="noopener">Ek dosya</a>}
            <form action={updateQuote} className="row" style={{ marginTop: 10 }}>
              <input type="hidden" name="id" value={q.id} />
              <select name="status" defaultValue={q.status} style={{ maxWidth: 220 }}>
                <option value="yeni">Yeni</option><option value="teklif-verildi">Teklif verildi</option>
                <option value="kazanildi">Kazanıldı</option><option value="kaybedildi">Kaybedildi</option>
              </select>
              <button className="btn sm">Kaydet</button>
            </form>
          </div>
        ))}
        {!rows.length && <p className="muted">Henüz teklif talebi yok.</p>}
      </div>
    </>
  );
}
