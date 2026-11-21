import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/data/guides";

export const metadata: Metadata = { title: "Rehber — Nakış Arma Kullanım ve Tasarım", description: "Ütüyle yapıştırma, logo hazırlama, boyut seçimi: nakış arma hakkında bilmen gerekenler.", alternates: { canonical: "/rehber" } };

export default function Page() {
  return (
    <section className="section">
      <div className="narrow">
        <h1>Rehber</h1>
        <div className="grid" style={{ gap: 14 }}>
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/rehber/${g.slug}`} className="cat"><h3>{g.title}</h3><p className="muted" style={{ margin: 0 }}>{g.description}</p></Link>
          ))}
        </div>
      </div>
    </section>
  );
}
