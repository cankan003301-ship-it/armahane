import Link from "next/link";
import { CATEGORIES } from "@/data/catalog";
import { LANDINGS } from "@/data/landings";
import { SITE, whatsappLink } from "@/lib/site";
import { SHIPPING } from "@/lib/pricing";
import { LogoMark } from "./Logo";

export default function Footer() {
  const wa = whatsappLink();
  return (
    <footer className="footer">
      <div className="wrap grid g4">
        <div>
          <Link href="/" className="logo" style={{ color: "#fff" }}>
            <LogoMark /> {SITE.name}
          </Link>
          <p style={{ marginTop: 12 }}>{SITE.tagline}. Tek adetten binlerce adede, makine nakışıyla {SITE.city}&apos;de üretilir.</p>
        </div>
        <div>
          <h4>Alışveriş</h4>
          <ul>
            <li><Link href="/arma-tasarla">Arma Tasarla</Link></li>
            <li><Link href="/urunler">Hazır Armalar</Link></li>
            {CATEGORIES.slice(0, 3).map((c) => (
              <li key={c.slug}><Link href={`/koleksiyon/${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
          <h4 style={{ marginTop: 18 }}>Kullanım alanları</h4>
          <ul>
            {LANDINGS.map((l) => (
              <li key={l.slug}><Link href={`/${l.slug}`}>{l.h1}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Yardım</h4>
          <ul>
            <li><Link href="/siparis-takip">Sipariş Takip</Link></li>
            <li><Link href="/sss">Sık Sorulan Sorular</Link></li>
            <li><Link href="/rehber">Rehber</Link></li>
            <li><Link href="/kurumsal">Kurumsal & Toplu Sipariş</Link></li>
            <li><Link href="/iletisim">İletişim</Link></li>
          </ul>
        </div>
        <div>
          <h4>Bize Ulaşın</h4>
          <ul>
            {wa && <li><a href={wa} rel="noopener" target="_blank">WhatsApp</a></li>}
            {SITE.email && <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>}
            {SITE.instagram && <li><a href={`https://instagram.com/${SITE.instagram}`} rel="noopener" target="_blank">Instagram @{SITE.instagram}</a></li>}
            <li>{SHIPPING.freeFrom.toLocaleString("tr-TR")} ₺ üzeri kargo ücretsiz</li>
          </ul>
        </div>
      </div>
      <div className="wrap legal row between">
        <span>© {new Date().getFullYear()} {SITE.name}. Tüm hakları saklıdır.</span>
        <span className="row" style={{ gap: 16 }}>
          <Link href="/yasal/mesafeli-satis">Mesafeli Satış</Link>
          <Link href="/yasal/on-bilgilendirme">Ön Bilgilendirme</Link>
          <Link href="/yasal/iade">İade & Cayma</Link>
          <Link href="/yasal/kvkk">KVKK</Link>
          <Link href="/yasal/gizlilik">Gizlilik & Çerez</Link>
        </span>
      </div>
    </footer>
  );
}
