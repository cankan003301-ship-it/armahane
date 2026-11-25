import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PatchArt from "@/components/PatchArt";
import { LANDINGS, getLanding } from "@/data/landings";
import { PRODUCTION_DAYS, quoteCustom, tl } from "@/lib/pricing";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => LANDINGS.map((l) => ({ alan: l.slug }));

export async function generateMetadata({ params }: { params: Promise<{ alan: string }> }): Promise<Metadata> {
  const l = getLanding((await params).alan);
  return l ? { title: l.title, description: l.description, alternates: { canonical: `/${l.slug}` }, openGraph: { title: l.title, description: l.description } } : {};
}

export default async function Page({ params }: { params: Promise<{ alan: string }> }) {
  const l = getLanding((await params).alan);
  if (!l) notFound();
  const rows = l.examples.map((e) => ({ ...e, q: quoteCustom({ ...e, artwork: "hazir" }) }));
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", name: l.h1, description: l.description, provider: { "@type": "Organization", name: SITE.name, url: SITE.url }, areaServed: "TR",
        offers: { "@type": "AggregateOffer", priceCurrency: "TRY", lowPrice: Math.min(...rows.map((r) => r.q.unit)), highPrice: Math.max(...rows.map((r) => r.q.unit)) } },
      { "@type": "FAQPage", mainEntity: l.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };
  return (
    <>
      <section className="hero">
        <div className="wrap grid">
          <div>
            <span className="eyebrow">Özel nakış arma</span>
            <h1>{l.h1}</h1>
            <p className="lead">{l.intro}</p>
            <div className="row">
              <Link href={`/arma-tasarla?alan=${l.slug}`} className="btn brand">Bu örnekle tasarlamaya başla</Link>
              <Link href="/kurumsal#form" className="btn ghost">Teklif iste</Link>
            </div>
            <div className="trust">
              <span>Üretim öncesi önizleme onayı</span>
              <span>{PRODUCTION_DAYS.normal} üretim</span>
              <span>Tek adetten sipariş</span>
            </div>
          </div>
          <div className="hero-art" style={{ maxWidth: 380 }} aria-hidden="true">
            <div className="p" style={{ inset: "8%" }}><PatchArt spec={l.art} /></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="wrap grid g2" style={{ alignItems: "start" }}>
          <div className="card">
            <h2 style={{ fontSize: "1.6rem" }}>Örnek fiyatlar</h2>
            <div className="scroll-x">
              <table className="table">
                <thead><tr><th>Senaryo</th><th>Ölçü</th><th>Adet</th><th>Birim</th><th>Toplam*</th></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label}>
                      <td>{r.label}</td><td>{r.cm} cm · {r.colors} renk</td><td>{r.qty}</td>
                      <td><b>{tl(r.q.unit)}</b></td><td>{tl(r.q.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="small muted" style={{ marginTop: 8 }}>*Dijitalleştirme dahil, kargo hariç. Kendi seçimlerinle kesin fiyat için <Link className="link" href={`/arma-tasarla?alan=${l.slug}`}>Arma Tasarla</Link>.</p>
          </div>
          <div className="card">
            <h2 style={{ fontSize: "1.6rem" }}>İpuçları</h2>
            <ul style={{ paddingLeft: 20, margin: 0 }}>{l.tips.map((t) => <li key={t} style={{ marginBottom: 8 }}>{t}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="narrow">
          <h2>Sık sorulanlar</h2>
          {l.faq.map((f) => <details key={f.q} className="faq"><summary>{f.q}</summary><p>{f.a}</p></details>)}
          <p style={{ marginTop: 18 }}>Diğer kullanımlar:{" "}
            {LANDINGS.filter((x) => x.slug !== l.slug).map((x, i) => (
              <span key={x.slug}>{i ? " · " : ""}<Link className="link" href={`/${x.slug}`}>{x.h1}</Link></span>
            ))}
          </p>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </>
  );
}
