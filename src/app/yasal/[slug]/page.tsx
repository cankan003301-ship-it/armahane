import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { SHIPPING } from "@/lib/pricing";

/**
 * Yasal metin şablonları (6502 sayılı Kanun, Mesafeli Sözleşmeler Yönetmeliği, 6698 sayılı KVKK).
 * Satıcı bilgileri Vercel ortam değişkenlerinden gelir. Yayına almadan önce bir hukukçuya kontrol ettirin.
 */
type Doc = { title: string; sections: { h: string; p: string[] }[] };

function seller() {
  const s = SITE.seller;
  return [
    `Unvan / Ad Soyad: ${s.title || "[SELLER_TITLE]"}`,
    `Adres: ${s.address || "[SELLER_ADDRESS]"}`,
    `Vergi dairesi / no: ${s.taxInfo || "[SELLER_TAX]"}`,
    ...(s.mersis ? [`MERSİS: ${s.mersis}`] : []),
    `Telefon: ${s.phone || "[SELLER_PHONE]"}`,
    `E-posta: ${SITE.email || "[NEXT_PUBLIC_CONTACT_EMAIL]"}`,
  ];
}

function docs(): Record<string, Doc> {
  const shipping = `Kargo ücreti ${SHIPPING.flat} TL'dir; ${SHIPPING.freeFrom} TL ve üzeri siparişlerde ücretsizdir.`;
  return {
    "mesafeli-satis": {
      title: "Mesafeli Satış Sözleşmesi",
      sections: [
        { h: "1. Taraflar", p: ["SATICI:", ...seller(), "ALICI: Sipariş formunda adı, adresi ve iletişim bilgileri yer alan kişidir."] },
        { h: "2. Konu", p: [`İşbu sözleşme, ALICI'nın ${SITE.url} üzerinden elektronik ortamda sipariş verdiği ürünlerin satışı ve teslimine ilişkin olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler.`] },
        { h: "3. Ürün, fiyat ve ödeme", p: ["Ürünlerin cinsi, miktarı, vergiler dahil satış fiyatı, ödeme şekli ve teslimat bilgileri sipariş özetinde ve ALICI'ya gönderilen onay e-postasında yer alır. Ödeme kredi/banka kartı (PayTR) veya havale/EFT ile yapılır.", shipping] },
        { h: "4. Teslimat", p: ["Hazır ürünler ödeme onayından itibaren 1–2 iş günü, kişiye özel ürünler tasarım onayından itibaren belirtilen üretim süresi içinde kargoya verilir. Teslimat süresi yasal 30 günlük süreyi aşamaz. Teslimat, ALICI'nın bildirdiği adrese yapılır."] },
        { h: "5. Cayma hakkı", p: ["ALICI, hazır (stok) ürünlerde teslim tarihinden itibaren 14 gün içinde gerekçe göstermeden cayma hakkına sahiptir. Cayma bildirimi e-posta veya WhatsApp ile yapılabilir; ürün kullanılmamış ve yeniden satılabilir durumda iade edilmelidir. İade kargo ücreti, ürün ayıplı değilse ALICI'ya aittir.", "Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi (ç) bendi uyarınca ALICI'nın istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan (kişiye özel tasarım, logo, yazı içeren) ürünlerde cayma hakkı bulunmamaktadır."] },
        { h: "6. Ayıplı ürün", p: ["Ürün ayıplı, onaylanan tasarımdan farklı veya kargoda hasarlı teslim edilirse ALICI, 6502 sayılı Kanun'un 11. maddesindeki seçimlik haklarını kullanabilir; SATICI ücretsiz yeniden üretim, ayıp oranında indirim veya bedel iadesi seçeneklerini sunar."] },
        { h: "7. Uyuşmazlık", p: ["Uyuşmazlıklarda Ticaret Bakanlığınca ilan edilen parasal sınırlar dahilinde ALICI'nın yerleşim yerindeki Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir."] },
        { h: "8. Yürürlük", p: ["ALICI, siparişi onaylamakla bu sözleşmenin tüm koşullarını kabul etmiş sayılır. Sözleşme, sipariş tarihinde elektronik ortamda kurulmuş ve ALICI'ya e-posta ile iletilmiştir."] },
      ],
    },
    "on-bilgilendirme": {
      title: "Ön Bilgilendirme Formu",
      sections: [
        { h: "Satıcı bilgileri", p: seller() },
        { h: "Ürün ve fiyat", p: ["Ürünün temel nitelikleri, vergiler dahil toplam fiyatı, kargo ücreti ve ödeme şekli sipariş tamamlanmadan önce sepet ve ödeme sayfasında gösterilir.", shipping] },
        { h: "Teslimat", p: ["Hazır ürünler 1–2 iş günü, kişiye özel ürünler tasarım onayından sonra belirtilen üretim süresinde kargoya verilir."] },
        { h: "Cayma hakkı", p: ["Hazır ürünlerde teslimden itibaren 14 gün cayma hakkı vardır. Kişiye özel üretilen ürünlerde (Mesafeli Sözleşmeler Yönetmeliği md. 15/ç) cayma hakkı yoktur."] },
        { h: "Şikâyet ve başvuru", p: ["Şikâyetlerinizi iletişim kanallarımızdan iletebilirsiniz. Tüketici Hakem Heyetleri ve Tüketici Mahkemelerine başvuru hakkınız saklıdır."] },
      ],
    },
    iade: {
      title: "İade, İptal ve Cayma",
      sections: [
        { h: "Kişiye özel ürünler", p: ["Logo, yazı veya tasarım içeren özel armalarda yasal olarak cayma hakkı yoktur. Tasarım onayınızdan önce siparişi ücretsiz iptal edebilirsiniz; dijitalleştirme başladıysa yalnızca dijitalleştirme ücreti kesilir."] },
        { h: "Hatalı veya hasarlı ürün", p: ["Ürün onaylanan tasarımdan farklı, hatalı ya da hasarlı geldiyse teslimden itibaren 14 gün içinde fotoğrafla bize yazın. Ücretsiz yeniden üretim yapar ya da bedelini iade ederiz; kargo bizden."] },
        { h: "Hazır ürünler", p: ["Teslimden itibaren 14 gün içinde kullanılmamış ürünü iade edebilirsiniz. İade onayından sonra ödeme 7 iş günü içinde aynı ödeme yöntemine iade edilir."] },
      ],
    },
    kvkk: {
      title: "KVKK Aydınlatma Metni",
      sections: [
        { h: "Veri sorumlusu", p: seller() },
        { h: "İşlenen veriler", p: ["Ad soyad, telefon, e-posta, teslimat ve fatura adresi, sipariş içeriği, yüklediğiniz tasarım dosyaları ve işlem güvenliği için IP adresi."] },
        { h: "Amaç ve hukuki sebep", p: ["Verileriniz; siparişin alınması, üretilmesi, teslimi, faturalandırılması ve müşteri hizmetleri amacıyla, KVKK md. 5/2-c (sözleşmenin ifası), 5/2-ç (hukuki yükümlülük) ve 5/2-f (meşru menfaat) hukuki sebeplerine dayanarak işlenir."] },
        { h: "Aktarım", p: ["Verileriniz yalnızca hizmetin gerektirdiği ölçüde kargo firmasına, ödeme kuruluşuna (PayTR), barındırma ve e-posta hizmet sağlayıcılarına ve yasal talep halinde yetkili kurumlara aktarılır. Kart bilgileriniz tarafımızca saklanmaz."] },
        { h: "Saklama süresi", p: ["Sipariş ve fatura kayıtları yasal saklama süreleri (10 yıl) boyunca, tasarım dosyaları tekrar sipariş kolaylığı için 2 yıl saklanır."] },
        { h: "Haklarınız", p: ["KVKK md. 11 kapsamındaki haklarınız (bilgi talep etme, düzeltme, silme, itiraz vb.) için iletişim adresimize yazabilirsiniz. Başvurular en geç 30 gün içinde yanıtlanır."] },
      ],
    },
    gizlilik: {
      title: "Gizlilik ve Çerez Politikası",
      sections: [
        { h: "Çerezler", p: ["Sitemizde reklam veya izleme çerezi kullanılmaz. Sepetiniz tarayıcınızın yerel deposunda (localStorage) tutulur. Yönetim paneli oturumu için zorunlu bir çerez kullanılır."] },
        { h: "İstatistik", p: ["Ziyaret istatistikleri kişisel veri içermeyen, çerezsiz bir analiz aracıyla toplanabilir."] },
        { h: "Ödeme güvenliği", p: ["Kartlı ödemeler PayTR'nin güvenli altyapısında işlenir. Kart numaranız sunucularımıza ulaşmaz."] },
      ],
    },
  };
}

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(docs()).map((slug) => ({ slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = docs()[(await params).slug];
  return d ? { title: d.title, alternates: { canonical: `/yasal/${(await params).slug}` } } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const d = docs()[(await params).slug];
  if (!d) notFound();
  const missing = !SITE.seller.title || !SITE.seller.address;
  return (
    <section className="section">
      <div className="narrow prose">
        <h1>{d.title}</h1>
        {missing && <div className="alert warn">Satıcı bilgileri henüz eklenmedi.</div>}
        {d.sections.map((s) => (
          <div key={s.h}><h2>{s.h}</h2>{s.p.map((x) => <p key={x}>{x}</p>)}</div>
        ))}
      </div>
    </section>
  );
}
