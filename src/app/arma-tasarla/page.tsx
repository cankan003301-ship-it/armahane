import type { Metadata } from "next";
import ArmaDesigner from "@/components/ArmaDesigner";
import { getProduct } from "@/data/catalog";
import { getLanding } from "@/data/landings";
import { SIZE_TIERS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Arma Tasarla — Özel Nakış Yama Fiyat Hesaplama",
  description: `Logonu yükle, boyut ve adedi seç, özel nakış armanın fiyatını anında gör. ${SIZE_TIERS[0].price} ₺'den başlayan fiyatlar, toplu siparişte indirim.`,
  alternates: { canonical: "/arma-tasarla" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ ornek?: string; alan?: string }> }) {
  const { ornek, alan } = await searchParams;
  const product = ornek ? getProduct(ornek) : null;
  const landing = alan ? getLanding(alan) : null;
  const base = product ?? (landing ? { art: landing.art, sizeCm: landing.examples[0].cm } : null);
  return (
    <section className="section" style={{ paddingTop: 32 }}>
      <div className="wrap">
        <span className="eyebrow">Özel arma</span>
        <h1>Armanı tasarla, fiyatı anında gör</h1>
        <p className="lead">Seçimlerini değiştirdikçe fiyat ve önizleme güncellenir. Ödemeden sonra nakışa uyarlanmış son hali onayına gönderiyoruz.</p>
        <ArmaDesigner initialArt={base?.art} initialCm={base?.sizeCm} uploadEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)} />
      </div>
    </section>
  );
}
