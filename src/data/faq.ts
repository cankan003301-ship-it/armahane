import {
  ARTWORK_FREE_FROM_QTY, ARTWORKS, BACKINGS, HAVALE_DISCOUNT_RATE, PRODUCTION_DAYS, QTY_DISCOUNTS, SHIPPING,
} from "@/lib/pricing";

const n = (x: number) => x.toLocaleString("tr-TR");
const tiers = [...QTY_DISCOUNTS].reverse().map((d) => `${d.minQty}+ adet %${Math.round(d.rate * 100)}`).join(", ");

/** SSS metinleri fiyat ayarlarından üretilir; fiyat değişince SSS de kendiliğinden güncellenir. */
export const FAQ: { q: string; a: string }[] = [
  { q: "En az kaç adet sipariş verebilirim?", a: `Tek adet bile olur. Adet arttıkça birim fiyat düşer: ${tiers}.` },
  { q: "Fiyatı nasıl hesaplıyorsunuz?", a: `Fiyat armanın en uzun kenarına (cm), renk sayısına, kenar tipine, arka yüzeye ve adede göre belirlenir. Ayrıca tasarımın nakış makinesine aktarılması için sipariş başına bir kez dijitalleştirme ücreti alınır (${ARTWORKS.map((a) => `${a.label.toLocaleLowerCase("tr-TR")}: ${n(a.fee)} ₺`).join(", ")}). ${ARTWORK_FREE_FROM_QTY} adet ve üzerinde dijitalleştirme ücretsizdir. Arma Tasarla sayfasında her kalemi ayrı ayrı görürsünüz.` },
  { q: "Üretim ve kargo ne kadar sürer?", a: `Tasarım onayından sonra normal üretim ${PRODUCTION_DAYS.normal}, ekspres üretim ${PRODUCTION_DAYS.express}. Kargo genelde 1–3 iş gününde ulaşır. Hazır armalar 1–2 iş gününde kargoya verilir.` },
  { q: "Kargo ücreti ne kadar?", a: `Kargo ${n(SHIPPING.flat)} ₺; kupon sonrası ${n(SHIPPING.freeFrom)} ₺ ve üzeri siparişlerde ücretsiz. Gönderimler ${SHIPPING.carrier} ile yapılır, takip numarası e-postanıza gelir.` },
  { q: "Hangi arka yüzeyi seçmeliyim?", a: BACKINGS.map((b) => `${b.label}: ${b.hint}`).join(" ") + " Ütüyle yapışan armaların kenarına birkaç dikiş atmak ömrünü uzatır." },
  { q: "Tasarımımı üretimden önce görebilir miyim?", a: "Evet. Özel armalarda logonuzu nakışa uygun hale getirip size dijital önizleme gönderiyoruz; onayınız olmadan üretime başlamıyoruz. Bir revizyon ücretsizdir." },
  { q: "Ödeme seçenekleri neler?", a: `Kredi/banka kartı (PayTR güvenli ödeme) ve havale/EFT. Havale/EFT ile ödemelerde %${Math.round(HAVALE_DISCOUNT_RATE * 100)} indirim uygulanır. Kart bilgileriniz sitemizde saklanmaz; ödeme doğrudan PayTR altyapısında yapılır.` },
  { q: "İade ve değişim nasıl oluyor?", a: "Kişiye özel üretilen armalarda yasal olarak cayma hakkı bulunmaz. Ancak ürün hatalı, onaylanan tasarımdan farklı veya kargoda hasar görmüşse fotoğrafla bize yazın; ücretsiz yeniden üretir veya bedelini iade ederiz. Hazır armalarda teslimden itibaren 14 gün cayma hakkınız vardır." },
  { q: "Renkler ekrandakiyle birebir aynı olur mu?", a: "Nakış iplikleri, tasarımınızdaki renklere en yakın tonlarla eşleştirilir. Ekran ayarları nedeniyle küçük farklar olabilir. Kurumsal renk kodunuz (Pantone) varsa sipariş notuna yazın." },
  { q: "Ne kadar küçük yazı işlenebilir?", a: "Harf yüksekliği 5 mm'nin altına inince yazı okunaksızlaşır. İnce çizgiler kalınlaşır, renk geçişleri (gradyan) düz renklere bölünür. Gerekirse sadeleştirip onayınıza sunarız." },
  { q: "Kurumsal fatura ve toplu sipariş yapıyor musunuz?", a: "Evet. Ödeme adımında fatura bilgilerinizi (unvan, vergi dairesi ve no) yazabilirsiniz. 50 adet üzeri ve tekrarlayan siparişler için Kurumsal sayfasından teklif isteyin; numune de gönderebiliriz." },
  { q: "Armayı nasıl yıkamalıyım?", a: "Ters çevirip 30°C'de hassas programda yıkayın. Ütüyle yapışanları ütülerken üzerine ince bir bez koyun. Ağartıcı ve kuru temizleme kullanmayın." },
];
