import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, getCategory, productsIn } from "@/data/catalog";

export const dynamicParams = false;
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCategory((await params).slug);
  if (!c) return {};
  return { title: `${c.name} Nakış Armaları`, description: c.blurb, alternates: { canonical: `/koleksiyon/${c.slug}` } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCategory((await params).slug);
  if (!c) notFound();
  const list = productsIn(c.slug);
  return (
    <section className="section">
      <div className="wrap">
        <nav className="small muted" aria-label="Konum"><Link href="/urunler">Hazır armalar</Link> / {c.name}</nav>
        <h1 style={{ marginTop: 10 }}>{c.name}</h1>
        <p className="lead">{c.blurb}</p>
        <div className="grid g4">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        <div className="card stitch center" style={{ marginTop: 28, boxShadow: "none" }}>
          <h3>Bu koleksiyonda kendi armanı mı istiyorsun?</h3>
          <p className="muted">İsim, tarih ya da logo ekleyerek tamamen sana özel yapalım.</p>
          <Link className="btn brand" href="/arma-tasarla">Arma Tasarla</Link>
        </div>
      </div>
    </section>
  );
}
