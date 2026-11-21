import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db, dbConfigured } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { QTY_DISCOUNTS, quoteCustom, tl } from "@/lib/pricing";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kurumsal & Toplu Nakış Arma Siparişi",
  description: "Şirket, kulüp, okul ve etkinlikler için toplu nakış arma üretimi. Numune, kurumsal fatura, %40'a varan adet indirimi.",
  alternates: { canonical: "/kurumsal" },
};

const Schema = z.object({
  name: z.string().trim().min(2).max(80),
  company: z.string().trim().max(120).optional(),
  phone: z.string().trim().min(10).max(20),
  email: z.string().trim().email().max(120).or(z.literal("")),
  qty: z.coerce.number().int().min(1).max(100000).optional(),
  message: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(), // bal küpü: botlar doldurur
});

async function submit(formData: FormData) {
  "use server";
  const parsed = Schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/kurumsal?hata=1#form");
  const d = parsed.data;
  if (dbConfigured()) {
    const sql = await db();
    await sql`INSERT INTO quotes (name, company, phone, email, qty, message) VALUES (${d.name}, ${d.company || null}, ${d.phone}, ${d.email || null}, ${d.qty ?? null}, ${d.message || null})`;
  }
  const to = process.env.SHOP_NOTIFY_EMAIL;
  if (to) {
    const esc = (s = "") => s.replace(/[<>&]/g, "");
    await sendMail(to, `Yeni teklif talebi: ${esc(d.company || d.name)} (${d.qty ?? "?"} adet)`,
      `<p>${esc(d.name)} · ${esc(d.company)} · ${esc(d.phone)} · ${esc(d.email)}</p><p>${esc(d.message)}</p>`);
  }
  redirect("/kurumsal?tamam=1#form");
}

const EXAMPLES = [
  { label: "Personel üniforması", cm: 8, colors: 3, qty: 100 },
  { label: "Futbol / spor kulübü", cm: 9, colors: 5, qty: 50 },
  { label: "Etkinlik / festival rozeti", cm: 7, colors: 4, qty: 250 },
];

export default async function Page({ searchParams }: { searchParams: Promise<{ tamam?: string; hata?: string }> }) {
  const sp = await searchParams;
  const wa = whatsappLink("Merhaba, toplu arma siparişi için teklif almak istiyorum.");
  return (
    <>
      <section className="section">
        <div className="wrap grid g2" style={{ alignItems: "center" }}>
          <div>
            <span className="eyebrow">Kurumsal & toplu</span>
            <h1>Ekibinin armasını biz işleyelim</h1>
            <p className="lead">Şirket logoları, kulüp ve takım armaları, okul ve kamp rozetleri, etkinlik yamaları. Tek muhatap, net fiyat, onaylı numune.</p>
            <ul className="lead" style={{ paddingLeft: 20 }}>
              <li>%{Math.round(QTY_DISCOUNTS[0].rate * 100)}&apos;a varan adet indirimi</li>
              <li>100+ adette dijitalleştirme ücretsiz</li>
              <li>Kurumsal fatura, tekrar siparişte aynı dosya</li>
              <li>İstenirse üretim öncesi fiziksel numune</li>
            </ul>
          </div>
          <div className="card">
            <h3>Örnek fiyatlar</h3>
            <table className="table">
              <thead><tr><th>Kullanım</th><th>Ölçü</th><th>Adet</th><th>Birim</th></tr></thead>
              <tbody>
                {EXAMPLES.map((e) => {
                  const q = quoteCustom({ ...e, backing: "dikis", artwork: "hazir" });
                  return <tr key={e.label}><td>{e.label}</td><td>{e.cm} cm · {e.colors} renk</td><td>{e.qty}</td><td><b>{tl(q.unit)}</b></td></tr>;
                })}
              </tbody>
            </table>
            <p className="small muted" style={{ marginTop: 8 }}>Dikilecek arka yüzey, overlok kenar. Kesin fiyat için Arma Tasarla&apos;yı kullan ya da teklif iste.</p>
          </div>
        </div>
      </section>
      <section className="section" id="form" style={{ background: "var(--paper-2)" }}>
        <div className="narrow">
          <h2>Teklif iste</h2>
          <p className="muted">Bir iş günü içinde dönüyoruz.{wa && <> Acilse <a className="link" href={wa} target="_blank" rel="noopener">WhatsApp</a>.</>}</p>
          {sp.tamam && <div className="alert ok">Talebin alındı, teşekkürler! En kısa sürede dönüş yapacağız.</div>}
          {sp.hata && <div className="alert err">Lütfen ad, telefon ve geçerli bir e-posta girin.</div>}
          <form action={submit} className="card grid g2" style={{ gap: "0 14px" }}>
            <label className="field"><span className="label">Ad soyad</span><input type="text" name="name" required maxLength={80} autoComplete="name" /></label>
            <label className="field"><span className="label">Kurum</span><input type="text" name="company" maxLength={120} autoComplete="organization" /></label>
            <label className="field"><span className="label">Telefon</span><input type="tel" name="phone" required maxLength={20} autoComplete="tel" /></label>
            <label className="field"><span className="label">E-posta</span><input type="email" name="email" maxLength={120} autoComplete="email" /></label>
            <label className="field"><span className="label">Tahmini adet</span><input type="number" name="qty" min={1} /></label>
            <label className="sr" aria-hidden="true">Web sitesi<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
            <label className="field" style={{ gridColumn: "1 / -1" }}><span className="label">Detaylar</span>
              <textarea name="message" maxLength={2000} placeholder="Kullanım yeri, ölçü, renk, teslim tarihi. Logonu cevabımızdan sonra e-posta ile gönderebilirsin." /></label>
            <button className="btn brand" type="submit" style={{ gridColumn: "1 / -1" }}>Teklif iste</button>
          </form>
        </div>
      </section>
    </>
  );
}
