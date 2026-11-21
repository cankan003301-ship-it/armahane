import Link from "next/link";
import PatchArt, { type ArtSpec } from "@/components/PatchArt";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/data/catalog";
import { FAQ } from "@/data/faq";
import { PRODUCTION_DAYS, QTY_DISCOUNTS, SIZE_TIERS, quoteCustom, tl } from "@/lib/pricing";

const HERO: { spec: ArtSpec; style: React.CSSProperties }[] = [
  { spec: { shape: "kalkan", bg: "#1f2a44", border: "#d9a441", fg: "#f6f1e7", accent: "#c8452c", icon: "kanat", text: "ARMAHANE", sub: "EST. 2026" }, style: { left: "24%", top: "14%", width: "52%", ["--r" as string]: "-3deg" } },
  { spec: { shape: "yuvarlak", bg: "#2a9d8f", border: "#f6f1e7", fg: "#f6f1e7", accent: "#e9c46a", icon: "dag", text: "ZİRVE KULÜBÜ", sub: "1987" }, style: { left: "0%", top: "52%", width: "38%", ["--r" as string]: "-10deg" } },
  { spec: { shape: "dikdortgen", bg: "#c8452c", border: "#1c2230", fg: "#f6f1e7", icon: "yok", text: "SENİN", sub: "LOGON" }, style: { right: "0%", top: "56%", width: "40%", ["--r" as string]: "8deg" } },
  { spec: { shape: "yuvarlak", bg: "#f6f1e7", border: "#1f2a44", fg: "#1f2a44", accent: "#c8452c", icon: "lale" }, style: { right: "4%", top: "2%", width: "24%", ["--r" as string]: "12deg" } },
];

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8);
  const maxDiscount = Math.round(QTY_DISCOUNTS[0].rate * 100);
  return (
    <>
      <section className="hero">
        <div className="wrap grid">
          <div>
            <span className="eyebrow">Makine nakışı · Tek adetten toplu üretime</span>
            <h1>Logonu yükle, <em>armanı</em> biz işleyelim.</h1>
            <p className="lead">
              Kulübün, şirketin, takımın ya da sadece sen. Boyutu, rengi ve adedi seç; fiyatı anında gör,
              tasarım onayından sonra {PRODUCTION_DAYS.normal} içinde kapında.
            </p>
            <div className="row">
              <Link href="/arma-tasarla" className="btn brand">Arma Tasarla — fiyatı gör</Link>
              <Link href="/urunler" className="btn ghost">Hazır armalar</Link>
            </div>
            <div className="trust">
              <span>Üretim öncesi ücretsiz önizleme</span>
              <span>{SIZE_TIERS[0].price} ₺&apos;den başlayan fiyatlar</span>
              <span>Toplu siparişte %{maxDiscount}&apos;a varan indirim</span>
              <span>PayTR ile güvenli ödeme</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            {HERO.map((h, i) => (
              <div key={i} className="p" style={h.style}><PatchArt spec={h.spec} /></div>
            ))}
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div>{Array(8).fill("Kulüp armaları ✦ Şirket logoları ✦ Takım yamaları ✦ Etkinlik rozetleri ✦ Motor yelekleri ✦ ").join("")}</div>
      </div>

      <section className="section">
        <div className="wrap">
          <span className="eyebrow">Nasıl çalışır?</span>
          <h2>Dört adımda kendi armanız</h2>
          <div className="grid g4 steps" style={{ marginTop: 24 }}>
            {[
              ["Tasarla", "Logonu yükle ya da yazını yaz; boyut, şekil ve arka yüzeyi seç."],
              ["Fiyatı gör", "Her kalem açıkça yazar. Adet arttıkça birim fiyat otomatik düşer."],
              ["Onayla", "Nakışa uyarladığımız önizlemeyi gönderiyoruz; onayın olmadan üretmiyoruz."],
              ["Teslim al", `${PRODUCTION_DAYS.normal} içinde üretip kargoluyoruz, takip kodu e-postana gelir.`],
            ].map(([t, d]) => (
              <div key={t} className="card step"><h3>{t}</h3><p className="muted" style={{ margin: 0 }}>{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="wrap">
          <div className="row between">
            <div><span className="eyebrow">Hazır koleksiyon</span><h2>Öne çıkan armalar</h2></div>
            <Link href="/urunler" className="link">Tümünü gör →</Link>
          </div>
          <div className="grid g4" style={{ marginTop: 18 }}>
            {featured.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <span className="eyebrow">Koleksiyonlar</span>
          <h2>Ne arıyorsun?</h2>
          <div className="grid g3" style={{ marginTop: 18 }}>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/koleksiyon/${c.slug}`} className="cat">
                <h3>{c.name}</h3>
                <p className="muted" style={{ margin: 0 }}>{c.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--navy)", color: "#f3ead8" }}>
        <div className="wrap grid g2" style={{ alignItems: "center" }}>
          <div>
            <span className="eyebrow" style={{ color: "var(--thread)" }}>Kurumsal & toplu</span>
            <h2 style={{ color: "#fff" }}>Kulüp, okul, şirket ve etkinlikler için</h2>
            <p>Üniformalar, takım formaları, personel kıyafetleri, festival ve kamp rozetleri. 50 adet üzeri siparişlerde
              numune, kurumsal fatura ve tekrar siparişte aynı dosyayla hızlı üretim.</p>
            <Link href="/kurumsal" className="btn brand">Teklif iste</Link>
          </div>
          <div className="card" style={{ background: "transparent", borderColor: "rgba(255,255,255,.2)", color: "inherit", boxShadow: "none" }}>
            <h3 style={{ color: "#fff" }}>Adet indirimleri</h3>
            <table className="table" style={{ color: "inherit" }}>
              <tbody>
                {[...QTY_DISCOUNTS].reverse().map((d) => (
                  <tr key={d.minQty}><td>{d.minQty}+ adet</td><td style={{ textAlign: "right", color: "var(--thread)", fontWeight: 700 }}>%{Math.round(d.rate * 100)} indirim</td></tr>
                ))}
              </tbody>
            </table>
            <p className="small" style={{ marginTop: 10, opacity: 0.8 }}>Örnek: 7 cm, 4 renk, 50 adet → birim {tl(quoteCustom({ cm: 7, colors: 4, qty: 50 }).unit)}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="narrow">
          <span className="eyebrow">Merak edilenler</span>
          <h2>Sık sorulan sorular</h2>
          {FAQ.slice(0, 6).map((f) => (
            <details key={f.q} className="faq"><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
          <p style={{ marginTop: 18 }}><Link href="/sss" className="link">Tüm sorular →</Link></p>
        </div>
      </section>
    </>
  );
}
