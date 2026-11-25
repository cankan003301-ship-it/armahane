/**
 * Kullanım alanına göre açılış sayfaları (Google'da "kulüp arması", "şirket logosu nakış" gibi aramalar için).
 * Her sayfa: arama niyetine uygun başlık, örnek fiyat senaryoları, öneriler ve SSS.
 */
import type { ArtSpec } from "@/components/PatchArt";
import type { BackingId } from "@/lib/pricing";

export type Landing = {
  slug: string;
  title: string; // <title>
  h1: string;
  description: string; // meta description
  intro: string;
  art: ArtSpec;
  examples: { label: string; cm: number; colors: number; qty: number; backing: BackingId }[];
  tips: string[];
  faq: { q: string; a: string }[];
};

export const LANDINGS: Landing[] = [
  {
    slug: "kulup-armasi",
    title: "Kulüp Arması Nakış — Spor ve Dernek Armaları",
    h1: "Kulüp arması, nakışla",
    description: "Futbol, basketbol, dağcılık ve dernekler için nakış kulüp arması. Logonu yükle, fiyatı anında gör; 10 adetten itibaren indirim.",
    intro: "Formada, eşofmanda, çantada ve bayrakta aynı arma. Kulübünün logosunu yükle; renkleri iplik tonlarına eşleştirip üretim öncesi önizlemeyi onayına gönderiyoruz.",
    art: { shape: "kalkan", bg: "#1d3557", border: "#f1faee", fg: "#f1faee", accent: "#e63946", icon: "yildiz", text: "SPOR KULÜBÜ", sub: "1987" },
    examples: [
      { label: "Forma göğüs arması", cm: 8, colors: 5, qty: 25, backing: "utu" },
      { label: "Eşofman + çanta (karma)", cm: 7, colors: 4, qty: 50, backing: "dikis" },
      { label: "Taraftar armaları", cm: 9, colors: 5, qty: 250, backing: "utu" },
    ],
    tips: [
      "Forma için 7–9 cm, şapka için 5–6 cm idealdir.",
      "Polyester formalarda ütüyle yapışan yerine dikilecek arma daha uzun ömürlüdür.",
      "Kuruluş yılı ve şehir adı gibi küçük yazılar için harf yüksekliği en az 5 mm olmalı.",
    ],
    faq: [
      { q: "Kulüp renklerimiz birebir tutar mı?", a: "Kulüp renklerinizin Pantone kodlarını yazarsanız en yakın iplik tonlarını seçeriz; önizlemede renkleri görürsünüz." },
      { q: "Her sezon yeniden dijitalleştirme ücreti öder miyim?", a: "Hayır. Dosyanız saklanır, tekrar siparişte dijitalleştirme ücreti alınmaz." },
    ],
  },
  {
    slug: "sirket-logosu-nakis",
    title: "Şirket Logosu Nakış Arma — Kurumsal Üniforma Yaması",
    h1: "Şirket logon, üniformada",
    description: "Personel üniforması, iş kıyafeti ve promosyon için şirket logosu nakış arma. Kurumsal fatura, numune ve toplu indirim.",
    intro: "Mağaza, restoran, atölye, şantiye ve ofis ekipleri için logolu arma. Kıyafeti değiştirsen de arma aynı kalır; cırt cırt seçeneğiyle yelek ve montlara takılıp çıkarılır.",
    art: { shape: "dikdortgen", bg: "#f6f1e7", border: "#264653", fg: "#264653", accent: "#e76f51", icon: "gunes", text: "ŞİRKETİN", sub: "LOGOSU" },
    examples: [
      { label: "Küçük ekip (göğüs logosu)", cm: 7, colors: 3, qty: 10, backing: "dikis" },
      { label: "Personel üniforması", cm: 8, colors: 3, qty: 100, backing: "dikis" },
      { label: "İş güvenliği yeleği (cırt)", cm: 10, colors: 3, qty: 50, backing: "cirt" },
    ],
    tips: [
      "Logonun vektör dosyasını (AI, SVG, PDF) gönderirsen en net sonucu alırsın.",
      "Göğüs logosu genelde 7–8 cm; sırt için 20 cm'e kadar üretebiliyoruz.",
      "Yıkamaya dayanıklılık için iş kıyafetlerinde dikilecek arka yüzey öneririz.",
    ],
    faq: [
      { q: "Kurumsal fatura kesiyor musunuz?", a: "Evet. Ödeme adımında unvan, vergi dairesi ve vergi numaranızı yazmanız yeterli." },
      { q: "Toplu siparişten önce numune görebilir miyiz?", a: "50 adet üzeri siparişlerde fiziksel numune gönderebiliriz; Kurumsal sayfasından teklif isteyin." },
    ],
  },
  {
    slug: "okul-armasi",
    title: "Okul Arması Nakış — Okul Forması ve Mezuniyet Armaları",
    h1: "Okul armaları ve mezuniyet yamaları",
    description: "Okul forması, ceket, mezuniyet ve öğrenci kulüpleri için nakış okul arması. Sınıf ve yıl bazında toplu sipariş.",
    intro: "Okul ceketleri, kazaklar, mezuniyet hatıraları ve öğrenci kulüpleri için arma. Veli birliği ve okul yönetimleri için toplu fiyat, sınıflara göre paketleme.",
    art: { shape: "kalkan", bg: "#7f1d1d", border: "#e9c46a", fg: "#f6f1e7", accent: "#e9c46a", icon: "yildiz", text: "KOLEJİ", sub: "MEZUN 2026" },
    examples: [
      { label: "Öğrenci kulübü", cm: 7, colors: 4, qty: 25, backing: "utu" },
      { label: "Mezuniyet hatıra arması", cm: 8, colors: 5, qty: 100, backing: "utu" },
      { label: "Okul forması (tüm okul)", cm: 8, colors: 4, qty: 250, backing: "dikis" },
    ],
    tips: [
      "Mezuniyet armalarına yıl ve sınıf adı eklemek için alt yazıyı kullan.",
      "Çocuk kıyafetlerinde 5–7 cm arma orantılı durur.",
      "Okul döneminden önce sipariş verirsen ekspres ücreti ödemezsin.",
    ],
    faq: [
      { q: "Sınıflara göre ayrı paketleyebilir misiniz?", a: "Evet, sipariş notuna sınıf listesini yazın; armaları sınıf sınıf ayrı poşetleriz." },
      { q: "Okul olarak havale ile ödeyebilir miyiz?", a: "Evet, havale/EFT ile ödemede ayrıca %3 indirim uygulanır." },
    ],
  },
  {
    slug: "motor-yelek-armasi",
    title: "Motor Yelek Arması — Biker Kulübü ve Sırt Arması",
    h1: "Motor kulübü ve yelek armaları",
    description: "Motosiklet kulüpleri için büyük boy sırt arması, göğüs ve rocker yamaları. Kalın overlok kenar, deri ve kot yeleklere uygun.",
    intro: "Kulüp sırt arması, şehir ve bölüm yamaları, isim etiketleri. Deri ve kot yeleklerde uzun ömür için kalın kenar ve dikilecek arka yüzeyle üretiyoruz.",
    art: { shape: "yuvarlak", bg: "#111111", border: "#c9a227", fg: "#f1f1f1", accent: "#c9a227", icon: "kanat", text: "MOTOR KULÜBÜ", sub: "İSTANBUL" },
    examples: [
      { label: "Sırt arması (büyük)", cm: 20, colors: 4, qty: 10, backing: "dikis" },
      { label: "Göğüs arması", cm: 9, colors: 4, qty: 25, backing: "dikis" },
      { label: "İsim / rütbe etiketi", cm: 10, colors: 2, qty: 25, backing: "cirt" },
    ],
    tips: [
      "Deri yeleklerde ütüyle yapışan kullanılamaz; dikilecek seç.",
      "Sırt armaları için 20 cm'e kadar online fiyat alabilir, daha büyük ölçü için teklif isteyebilirsin.",
      "Cırt cırt isim etiketi, yeleği değiştirince taşımanı kolaylaştırır.",
    ],
    faq: [
      { q: "Üç parçalı sırt arması (üst-orta-alt) yapıyor musunuz?", a: "Evet. Her parçayı ayrı arma olarak sepete ekleyebilir ya da tek teklif için Kurumsal sayfasını kullanabilirsiniz." },
      { q: "Yağmurda ve güneşte solar mı?", a: "Polyester nakış iplikleri UV ve suya dayanıklıdır; yıllarca canlı kalır." },
    ],
  },
  {
    slug: "isim-yamasi",
    title: "İsim Yaması — Nakış İsim Etiketi ve Cırt Cırtlı İsimlik",
    h1: "Nakış isim yaması",
    description: "Üniforma, iş kıyafeti, çanta ve outdoor ekipmanı için nakış isim yaması. Cırt cırtlı, ütüyle yapışan veya dikilecek; tek adetten.",
    intro: "Ad, soyad, unvan ya da kan grubu. Hastane, mutfak, atölye, kamp ve spor ekipmanı için okunaklı nakış isimlik.",
    art: { shape: "dikdortgen", bg: "#2f3e46", border: "#cad2c5", fg: "#cad2c5", icon: "yok", text: "AHMET Y.", sub: "0 RH+" },
    examples: [
      { label: "Tek isimlik", cm: 10, colors: 2, qty: 1, backing: "cirt" },
      { label: "Ekip isimlikleri", cm: 10, colors: 2, qty: 10, backing: "cirt" },
      { label: "Mutfak/servis ekibi", cm: 9, colors: 2, qty: 25, backing: "dikis" },
    ],
    tips: [
      "Okunaklı olması için 10 cm genişlikte en fazla 12–14 karakter öner.",
      "Farklı isimler için her ismi ayrı satır olarak not alanına yazabilirsin; aynı tasarımda isim değişikliği için ek dijitalleştirme alınmaz.",
      "Kan grubu ve unvan için alt yazıyı kullan.",
    ],
    faq: [
      { q: "Her kişi için farklı isim yazdırabilir miyim?", a: "Evet. Aynı tasarımda isim listesini sipariş notuna yazın; adet indirimini toplam adet üzerinden uygularız." },
      { q: "Hangi arka yüzeyi seçmeliyim?", a: "Üniforma ve yeleklerde cırt cırt pratik; tişört ve önlüklerde ütüyle yapışan ya da dikilecek tercih edilir." },
    ],
  },
];

export const getLanding = (slug: string) => LANDINGS.find((l) => l.slug === slug) ?? null;
