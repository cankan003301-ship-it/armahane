import type { Metadata } from "next";
import Catalog from "@/components/Catalog";
import { CATEGORIES, PRODUCTS } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Hazır Nakış Armaları",
  description: "Dağ, motor, Anadolu motifleri, denizci ve slogan nakış armaları. Ütüyle yapışan, cırt cırt veya dikilecek seçenekleriyle.",
  alternates: { canonical: "/urunler" },
};

export default function Page() {
  return (
    <section className="section">
      <div className="wrap">
        <span className="eyebrow">Hazır koleksiyon</span>
        <h1>Hazır armalar</h1>
        <p className="lead">Stoktan 1–2 iş gününde kargoda. Arka yüzeyi ürün sayfasında seçersin.</p>
        <Catalog products={PRODUCTS} categories={CATEGORIES} />
      </div>
    </section>
  );
}
