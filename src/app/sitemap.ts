import type { MetadataRoute } from "next";
import { CATEGORIES, PRODUCTS } from "@/data/catalog";
import { GUIDES } from "@/data/guides";
import { LANDINGS } from "@/data/landings";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string, priority = 0.6) => ({ url: `${SITE.url}${p}`, lastModified: new Date(), priority });
  return [
    u("/", 1), u("/arma-tasarla", 0.9), u("/urunler", 0.8), u("/kurumsal", 0.8), u("/rehber", 0.5), u("/sss", 0.5), u("/iletisim", 0.4),
    ...LANDINGS.map((l) => u(`/${l.slug}`, 0.8)),
    ...CATEGORIES.map((c) => u(`/koleksiyon/${c.slug}`, 0.7)),
    ...PRODUCTS.map((p) => u(`/urun/${p.slug}`, 0.7)),
    ...GUIDES.map((g) => u(`/rehber/${g.slug}`, 0.5)),
    ...["mesafeli-satis", "on-bilgilendirme", "iade", "kvkk", "gizlilik"].map((s) => u(`/yasal/${s}`, 0.2)),
  ];
}
