/** Rehber yazıları: Google'da "nasıl yapılır" aramalarından ziyaretçi getirmek için. */
export type Block = { h?: string; p?: string; list?: string[] };
export type Guide = { slug: string; title: string; description: string; date: string; blocks: Block[] };

export const GUIDES: Guide[] = [
  {
    slug: "utuyle-yapisan-arma-nasil-yapistirilir",
    title: "Ütüyle yapışan arma nasıl yapıştırılır? (Adım adım)",
    description: "Ütüyle yapışan nakış armayı kumaşa kalıcı yapıştırmanın doğru sıcaklığı, süresi ve sık yapılan hatalar.",
    date: "2026-11-21",
    blocks: [
      { p: "Ütüyle yapışan armaların arkasında ısıyla eriyen bir yapıştırıcı tabaka vardır. Doğru ısı ve baskıyla pamuklu, kot ve polyester karışımlı kumaşlara dakikalar içinde yapışır." },
      { h: "İhtiyacın olanlar", list: ["Buharsız ütü (buhar kapalı)", "İnce pamuklu bez veya pişirme kağıdı", "Sert ve düz bir yüzey (ütü masası yerine masa daha iyi)"] },
      { h: "Adımlar", list: [
        "Kumaşı yıka ve kurut; yumuşatıcı yapıştırmayı zayıflatır.",
        "Ütüyü pamuk ayarına getir (yaklaşık 150–160°C), buharı kapat.",
        "Yapıştıracağın yeri 10 saniye ütüleyerek ısıt ve düzleştir.",
        "Armayı yerleştir, üzerine ince bezi koy.",
        "Ütüyü kaydırmadan, tüm ağırlığınla 25–30 saniye bastır.",
        "Kumaşı ters çevir, arkadan da 20 saniye ütüle.",
        "Soğumasını bekle (2–3 dakika); sıcakken kenarlarını kontrol etme.",
      ] },
      { h: "Sık yapılan hatalar", list: [
        "Ütüyü gezdirmek: arma kayar, yapıştırıcı eşit dağılmaz. Sadece bastır.",
        "Buhar açık bırakmak: nem yapışmayı zayıflatır.",
        "Naylon, deri, su geçirmez ve esnek spor kumaşlara ütülemek: bu kumaşlar ısıya dayanmaz; dikilecek veya cırt cırt seç.",
      ] },
      { h: "Daha uzun ömür için", p: "Yapıştırdıktan sonra kenarlardan birkaç dikiş at. 30°C'de ters çevirerek yıka ve kurutma makinesinde yüksek ısı kullanma." },
    ],
  },
  {
    slug: "nakis-arma-icin-logo-nasil-hazirlanir",
    title: "Nakış arma için logo nasıl hazırlanır?",
    description: "Logonu nakışa uygun hale getirmek için dosya formatı, renk sayısı, en küçük yazı boyutu ve çizgi kalınlığı rehberi.",
    date: "2026-11-21",
    blocks: [
      { p: "Nakış, baskıdan farklı olarak görüntüyü iplikle örer. Bu yüzden ekranda güzel görünen her detay iplikte aynı çıkmaz. Birkaç basit kuralla sonuç çok daha net olur." },
      { h: "En iyi dosya formatları", list: ["Vektör: AI, EPS, SVG veya vektörel PDF (en iyisi)", "Yüksek çözünürlüklü PNG (en az 1000 px, şeffaf zemin)", "Fotoğraf veya ekran görüntüsü de olur; düzenleme ücreti çıkabilir"] },
      { h: "Nakışta neler değişir?", list: [
        "Yazılar: Harf yüksekliği 5 mm'nin altındaysa okunmaz. Küçük armada yazıyı kısa tut.",
        "İnce çizgiler: 1 mm'den ince çizgiler kalınlaşır, birbirine yakın olanlar birleşir.",
        "Renk geçişi (gradyan) ve gölge: düz renklere bölünür.",
        "Çok küçük detaylar: birleştirilir veya çıkarılır.",
      ] },
      { h: "Renk sayısı", p: "Her renk ayrı bir iplik demektir. 3–5 renk çoğu logo için yeterlidir. Kurumsal rengin varsa Pantone kodunu sipariş notuna yaz; en yakın iplik tonunu eşleştiririz." },
      { h: "Emin değil misin?", p: "Logonu olduğu gibi gönder. Nakışa uyarlanmış önizlemeyi üretimden önce onayına sunuyoruz; onaylamadan üretmiyoruz." },
    ],
  },
  {
    slug: "arma-boyutu-nasil-secilir",
    title: "Arma boyutu nasıl seçilir? Kullanım yerine göre ölçüler",
    description: "Göğüs, kol, şapka, çanta ve sırt için önerilen nakış arma boyutları.",
    date: "2026-11-21",
    blocks: [
      { p: "Ölçü her zaman armanın en uzun kenarıdır. Yuvarlak armada çap, dikdörtgende uzun kenar." },
      { h: "Önerilen ölçüler", list: [
        "Göğüs (sol üst): 6–9 cm",
        "Kol / omuz: 7–9 cm",
        "Şapka önü: 5–6 cm yükseklik",
        "Çanta, sırt çantası: 6–10 cm",
        "Yelek / ceket sırtı: 15–25 cm",
        "Bebek ve çocuk kıyafetleri: 4–6 cm",
      ] },
      { h: "Küçük mü büyük mü?", p: "Logoda yazı varsa bir boy büyük seç; yazı okunaklı kalır. Sadece simgeyse küçük arma daha şık durur. Arma Tasarla sayfasındaki cetvel, seçtiğin boyutu madeni parayla karşılaştırır." },
    ],
  },
  {
    slug: "nakis-arma-mi-baski-mi",
    title: "Nakış arma mı, baskı mı? Hangisini seçmeli?",
    description: "Nakış arma ile DTF/serigrafi baskıyı dayanıklılık, görünüm ve maliyet açısından karşılaştırıyoruz.",
    date: "2026-11-21",
    blocks: [
      { h: "Nakış armanın avantajları", list: ["Çok dayanıklı: yüzlerce yıkamada solmaz, çatlamaz", "Kabartmalı, premium görünüm", "Tak-çıkar (cırt cırt) veya farklı kıyafetlere aktarma imkânı", "Kıyafet sökülmeden değiştirilebilir"] },
      { h: "Baskının avantajları", list: ["Fotoğraf ve renk geçişlerini birebir verir", "Çok büyük alanlarda daha ekonomik", "Kumaşla bütünleşik, ince his"] },
      { h: "Kısa karar", p: "Logo, arma, yazı ve uzun ömür istiyorsan nakış. Fotoğraf gibi detaylı ve geniş bir görsel istiyorsan baskı. Kurumsal üniformalarda en çok tercih edilen nakıştır; profesyonel görünür ve yıllarca dayanır." },
    ],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug) ?? null;
