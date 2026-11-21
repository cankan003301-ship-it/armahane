import type { Metadata } from "next";
import Link from "next/link";
import { SITE, whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "İletişim", alternates: { canonical: "/iletisim" } };

export default function Page() {
  const wa = whatsappLink("Merhaba,");
  return (
    <section className="section">
      <div className="narrow">
        <h1>İletişim</h1>
        <p className="lead">Hafta içi 09:00–18:00 arası en geç birkaç saat içinde dönüyoruz.</p>
        <div className="grid g2">
          {wa && <a className="card" href={wa} target="_blank" rel="noopener" style={{ textDecoration: "none" }}><h3>WhatsApp</h3><p className="muted">En hızlı yol. Logonu da buradan gönderebilirsin.</p></a>}
          {SITE.email && <a className="card" href={`mailto:${SITE.email}`} style={{ textDecoration: "none" }}><h3>E-posta</h3><p className="muted">{SITE.email}</p></a>}
          {SITE.instagram && <a className="card" href={`https://instagram.com/${SITE.instagram}`} target="_blank" rel="noopener" style={{ textDecoration: "none" }}><h3>Instagram</h3><p className="muted">@{SITE.instagram}</p></a>}
          <Link className="card" href="/kurumsal#form" style={{ textDecoration: "none" }}><h3>Toplu sipariş</h3><p className="muted">Teklif formu</p></Link>
        </div>
      </div>
    </section>
  );
}
