import { CATEGORIES, PRODUCTS } from "@/data/catalog";
import { SITE } from "@/lib/site";
import { SHIPPING } from "@/lib/pricing";

/**
 * Google Merchant Center ürün feed'i (RSS 2.0, g: alanları).
 * Merchant Center gerçek ürün fotoğrafı ister; yalnızca `images` alanı dolu ürünler listelenir.
 */
const x = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

export const dynamic = "force-static";

export function GET() {
  const items = PRODUCTS.filter((p) => p.images?.length).map((p) => {
    const cat = CATEGORIES.find((c) => c.slug === p.category)?.name ?? "";
    return `<item>
<g:id>${x(p.slug)}</g:id>
<g:title>${x(`${p.name} Nakış Arma ${p.sizeCm} cm`)}</g:title>
<g:description>${x(p.description)}</g:description>
<g:link>${SITE.url}/urun/${p.slug}</g:link>
<g:image_link>${x(p.images![0])}</g:image_link>
${p.images!.slice(1, 10).map((i) => `<g:additional_image_link>${x(i)}</g:additional_image_link>`).join("")}
<g:availability>${p.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability>
<g:price>${(p.compareAt ?? p.price).toFixed(2)} TRY</g:price>
${p.compareAt ? `<g:sale_price>${p.price.toFixed(2)} TRY</g:sale_price>` : ""}
<g:condition>new</g:condition>
<g:brand>${x(SITE.name)}</g:brand>
<g:identifier_exists>no</g:identifier_exists>
<g:google_product_category>Apparel &amp; Accessories &gt; Clothing Accessories</g:google_product_category>
<g:product_type>${x(`Nakış Arma > ${cat}`)}</g:product_type>
<g:shipping><g:country>TR</g:country><g:price>${SHIPPING.flat.toFixed(2)} TRY</g:price></g:shipping>
</item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>
<title>${x(SITE.name)}</title><link>${SITE.url}</link><description>${x(SITE.description)}</description>
${items.join("\n")}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
