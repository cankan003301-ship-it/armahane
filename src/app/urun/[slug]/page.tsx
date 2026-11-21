import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import PatchArt from "@/components/PatchArt";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, getCategory, getProduct, productsIn } from "@/data/catalog";
import { SITE } from "@/lib/site";
import { SHIPPING, tl } from "@/lib/pricing";

export const dynamicParams = false;
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} Nakış Arma — ${p.sizeCm} cm`,
    description: `${p.description} ${tl(p.price)}. Ütüyle yapışan, cırt cırt veya dikilecek.`,
    alternates: { canonical: `/urun/${p.slug}` },
    openGraph: { title: p.name, description: p.description, images: p.images?.length ? p.images : undefined },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.category);
  const related = productsIn(p.category).filter((x) => x.slug !== p.slug).slice(0, 4);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    sku: p.slug,
    brand: { "@type": "Brand", name: SITE.name },
    category: cat?.name,
    ...(p.images?.length ? { image: p.images } : {}),
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/urun/${p.slug}`,
      priceCurrency: "TRY",
      price: p.price,
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
  return (
    <section className="section">
      <div className="wrap">
        <nav className="small muted" aria-label="Konum" style={{ marginBottom: 16 }}>
          <Link href="/urunler">Hazır armalar</Link>{cat && <> / <Link href={`/koleksiyon/${cat.slug}`}>{cat.name}</Link></>}
        </nav>
        <div className="pdp">
          <div className="gallery">
            {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : <PatchArt spec={p.art} title={p.name} />}
          </div>
          <div>
            <h1 style={{ fontSize: "clamp(2rem,4vw,2.8rem)" }}>{p.name}</h1>
            <div className="price" style={{ fontSize: "1.8rem", marginBottom: 10 }}>
              {tl(p.price)} {p.compareAt ? <s>{tl(p.compareAt)}</s> : null}
            </div>
            <p className="lead">{p.description}</p>
            <dl className="specs" style={{ margin: "18px 0 24px" }}>
              <dt>Boyut</dt><dd>{p.sizeCm} cm (en uzun kenar)</dd>
              <dt>Renk</dt><dd>{p.colors} iplik rengi</dd>
              <dt>Teknik</dt><dd>Makine nakışı, twill zemin</dd>
              <dt>Kargo</dt><dd>1–2 iş gününde · {SHIPPING.freeFrom.toLocaleString("tr-TR")} ₺ üzeri ücretsiz</dd>
              <dt>Stok</dt><dd>{p.stock > 0 ? (p.stock < 10 ? `Son ${p.stock} adet` : "Stokta") : "Tükendi"}</dd>
            </dl>
            <AddToCart slug={p.slug} price={p.price} stock={p.stock} />
            <div className="card stitch" style={{ marginTop: 24, boxShadow: "none" }}>
              <b>Bunu kendine göre uyarlayalım mı?</b>
              <p className="muted small" style={{ margin: "6px 0 10px" }}>Yazıyı, renkleri veya boyutu değiştirip sana özel üretebiliriz.</p>
              <Link className="link" href={`/arma-tasarla?ornek=${p.slug}`}>Bu armadan özel tasarım başlat →</Link>
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <h2>Benzer armalar</h2>
            <div className="grid g4">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
          </div>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </section>
  );
}
