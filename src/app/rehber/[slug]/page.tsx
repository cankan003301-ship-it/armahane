import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuide } from "@/data/guides";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = getGuide((await params).slug);
  return g ? { title: g.title, description: g.description, alternates: { canonical: `/rehber/${g.slug}` }, openGraph: { type: "article", title: g.title, description: g.description } } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.description, datePublished: g.date, author: { "@type": "Organization", name: SITE.name }, publisher: { "@type": "Organization", name: SITE.name } };
  return (
    <article className="section">
      <div className="narrow prose">
        <p className="small"><Link className="link" href="/rehber">← Rehber</Link></p>
        <h1>{g.title}</h1>
        {g.blocks.map((b, i) => (
          <div key={i}>
            {b.h && <h2>{b.h}</h2>}
            {b.p && <p>{b.p}</p>}
            {b.list && <ul>{b.list.map((x) => <li key={x}>{x}</li>)}</ul>}
          </div>
        ))}
        <div className="card stitch" style={{ marginTop: 32, boxShadow: "none" }}>
          <h3>Kendi armanı tasarla</h3>
          <p className="muted">Logonu yükle, fiyatı anında gör.</p>
          <Link className="btn brand" href="/arma-tasarla">Arma Tasarla</Link>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </article>
  );
}
