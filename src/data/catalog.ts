/**
 * Hazır ürün kataloğu. Gerçek ürün fotoğrafları gelene kadar görseller `art` tanımından
 * SVG olarak çizilir (src/components/PatchArt.tsx). Fotoğraf eklenince `images` alanına URL yazılır.
 */
import type { ArtSpec } from "@/components/PatchArt";

export type Category = { slug: string; name: string; blurb: string };

export const CATEGORIES: Category[] = [
  { slug: "dag-outdoor", name: "Dağ & Outdoor", blurb: "Zirveler, rotalar ve kamp ateşi için armalar." },
  { slug: "motor-yol", name: "Motor & Yol", blurb: "Yelek, ceket ve çantalar için yol armaları." },
  { slug: "anadolu-motif", name: "Anadolu Motifleri", blurb: "Lale, nazar, kilim desenleri — modern çizgiyle." },
  { slug: "deniz-kiyi", name: "Deniz & Kıyı", blurb: "Çapa, dalga, fener; denizciler için." },
  { slug: "yazi-slogan", name: "Yazı & Slogan", blurb: "Kısa, net, okunaklı nakış yazılar." },
  { slug: "kurumsal-ornek", name: "Kurumsal Örnekler", blurb: "Kulüp, takım ve şirket armalarına ilham." },
];

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  sizeCm: number;
  colors: number;
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  tags: string[];
  description: string;
  art: ArtSpec;
  images?: string[];
};

const P = (p: Product) => p;

export const PRODUCTS: Product[] = [
  P({ slug: "kackar-zirve-3937", name: "Kaçkar Zirve 3937", category: "dag-outdoor", price: 185, sizeCm: 8, colors: 5, stock: 40, featured: true,
    tags: ["dağ", "kaçkar", "zirve", "trekking"], description: "Kaçkar'ın zirvesine çıkanlara ya da hayalini kuranlara. Çanta ve şapka için ideal boyut.",
    art: { shape: "yuvarlak", bg: "#1f3b4d", border: "#e9c46a", fg: "#f4efe6", accent: "#e76f51", icon: "dag", text: "KAÇKAR", sub: "3937 M" } }),
  P({ slug: "agri-5137", name: "Ağrı 5137", category: "dag-outdoor", price: 195, sizeCm: 9, colors: 5, stock: 25, isNew: true,
    tags: ["ağrı dağı", "zirve", "dağcılık"], description: "Türkiye'nin çatısı. Kalkan formunda, lazer kesim kenarlı arma.",
    art: { shape: "kalkan", bg: "#2b2d42", border: "#edf2f4", fg: "#edf2f4", accent: "#ef233c", icon: "dag", text: "AĞRI", sub: "5137" } }),
  P({ slug: "kamp-atesi", name: "Kamp Ateşi", category: "dag-outdoor", price: 165, sizeCm: 7, colors: 4, stock: 60, featured: true,
    tags: ["kamp", "ateş", "outdoor"], description: "Gece, ateş, sohbet. Ütüyle yapışan seçeneğiyle polar ve montlarda çok iyi durur.",
    art: { shape: "yuvarlak", bg: "#264653", border: "#f4a261", fg: "#f4efe6", accent: "#f4a261", icon: "ates", text: "KAMP", sub: "GECESİ" } }),
  P({ slug: "pusula", name: "Yönünü Bul", category: "dag-outdoor", price: 170, sizeCm: 7, colors: 3, stock: 35,
    tags: ["pusula", "yön", "gezgin"], description: "Gezginler için minimal pusula arması.",
    art: { shape: "yuvarlak", bg: "#f4efe6", border: "#1d3557", fg: "#1d3557", accent: "#e63946", icon: "pusula", text: "YÖNÜNÜ BUL" } }),
  P({ slug: "asfalt-kurdu", name: "Asfalt Kurdu", category: "motor-yol", price: 240, sizeCm: 12, colors: 4, stock: 20, featured: true,
    tags: ["motor", "yelek", "biker"], description: "Yelek sırtı için büyük boy. Kalın overlok kenar, dikilecek arka yüzey önerilir.",
    art: { shape: "kalkan", bg: "#111111", border: "#c9a227", fg: "#f1f1f1", accent: "#c9a227", icon: "kanat", text: "ASFALT", sub: "KURDU" } }),
  P({ slug: "gece-surucusu", name: "Gece Sürücüsü", category: "motor-yol", price: 190, sizeCm: 9, colors: 4, stock: 30,
    tags: ["motor", "gece", "ay"], description: "Gece yolculuklarına. Ay ve yol çizgisi.",
    art: { shape: "yuvarlak", bg: "#0b132b", border: "#5bc0be", fg: "#f4efe6", accent: "#5bc0be", icon: "ay", text: "GECE", sub: "SÜRÜCÜSÜ" } }),
  P({ slug: "tam-gaz", name: "Tam Gaz", category: "motor-yol", price: 175, sizeCm: 8, colors: 3, stock: 45, isNew: true,
    tags: ["motor", "hız", "şimşek"], description: "Şimşek desenli, dikdörtgen yol arması.",
    art: { shape: "dikdortgen", bg: "#1b1b1b", border: "#ffb703", fg: "#ffb703", accent: "#fb8500", icon: "simsek", text: "TAM GAZ" } }),
  P({ slug: "lale", name: "Lale", category: "anadolu-motif", price: 160, sizeCm: 6, colors: 4, stock: 70, featured: true,
    tags: ["lale", "motif", "osmanlı", "çiçek"], description: "Klasik lale motifinin sade nakış yorumu. Ceket yakası ve çantalar için.",
    art: { shape: "yuvarlak", bg: "#f4efe6", border: "#9d0208", fg: "#9d0208", accent: "#2a9d8f", icon: "lale" } }),
  P({ slug: "nazar", name: "Nazar", category: "anadolu-motif", price: 140, sizeCm: 5, colors: 3, stock: 90, featured: true,
    tags: ["nazar boncuğu", "göz", "şans"], description: "Küçük ama etkili. Bebek çantasından deri cekete her yere.",
    art: { shape: "yuvarlak", bg: "#0353a4", border: "#f4efe6", fg: "#f4efe6", accent: "#023e7d", icon: "nazar" } }),
  P({ slug: "cay-saati", name: "Çay Saati", category: "anadolu-motif", price: 150, sizeCm: 6, colors: 4, stock: 55, isNew: true,
    tags: ["çay", "ince belli", "eğlenceli"], description: "İnce belli bardakta tavşan kanı. Eğlenceli hediye arması.",
    art: { shape: "yuvarlak", bg: "#fefae0", border: "#bc4749", fg: "#bc4749", accent: "#6a994e", icon: "cay", text: "ÇAY SAATİ" } }),
  P({ slug: "kilim-yildiz", name: "Kilim Yıldızı", category: "anadolu-motif", price: 170, sizeCm: 7, colors: 4, stock: 30,
    tags: ["kilim", "yıldız", "desen"], description: "Kilim desenlerinden ilham alan sekiz köşeli yıldız.",
    art: { shape: "dikdortgen", bg: "#7f1d1d", border: "#f4efe6", fg: "#f4efe6", accent: "#e9c46a", icon: "yildiz" } }),
  P({ slug: "capa", name: "Çapa", category: "deniz-kiyi", price: 160, sizeCm: 7, colors: 3, stock: 50, featured: true,
    tags: ["çapa", "denizci", "yelken"], description: "Denizciler ve yelkenciler için klasik çapa arması.",
    art: { shape: "yuvarlak", bg: "#14213d", border: "#f4efe6", fg: "#f4efe6", accent: "#fca311", icon: "capa", text: "DENİZCİ" } }),
  P({ slug: "ege-dalgasi", name: "Ege Dalgası", category: "deniz-kiyi", price: 165, sizeCm: 8, colors: 4, stock: 40,
    tags: ["ege", "dalga", "sörf", "yaz"], description: "Yaz, rüzgâr, dalga. Plaj çantaları için ütüyle yapışan seçenek önerilir.",
    art: { shape: "yuvarlak", bg: "#caf0f8", border: "#0077b6", fg: "#0077b6", accent: "#f4a261", icon: "dalga", text: "EGE" } }),
  P({ slug: "fener", name: "Deniz Feneri", category: "deniz-kiyi", price: 185, sizeCm: 9, colors: 5, stock: 20,
    tags: ["fener", "deniz", "kıyı"], description: "Kalkan formunda deniz feneri arması.",
    art: { shape: "kalkan", bg: "#003049", border: "#fcbf49", fg: "#f4efe6", accent: "#d62828", icon: "fener", text: "FENER" } }),
  P({ slug: "kolay-gelsin", name: "Kolay Gelsin", category: "yazi-slogan", price: 130, sizeCm: 9, colors: 2, stock: 80,
    tags: ["yazı", "slogan", "esnaf"], description: "Atölyeden mutfağa her çalışana. Önlük ve iş kıyafetlerinde çok sevilir.",
    art: { shape: "dikdortgen", bg: "#f4efe6", border: "#264653", fg: "#264653", icon: "yok", text: "KOLAY", sub: "GELSİN" } }),
  P({ slug: "eyvallah", name: "Eyvallah", category: "yazi-slogan", price: 130, sizeCm: 9, colors: 2, stock: 75, featured: true,
    tags: ["yazı", "slogan"], description: "Tek kelime, her şeyi anlatır.",
    art: { shape: "dikdortgen", bg: "#111111", border: "#e9c46a", fg: "#e9c46a", icon: "yok", text: "EYVALLAH" } }),
  P({ slug: "sabir", name: "Sabır", category: "yazi-slogan", price: 125, sizeCm: 7, colors: 2, stock: 60,
    tags: ["yazı", "motivasyon"], description: "Kendine küçük bir hatırlatma.",
    art: { shape: "yuvarlak", bg: "#2a9d8f", border: "#f4efe6", fg: "#f4efe6", icon: "kalp", text: "SABIR" } }),
  P({ slug: "kulup-ornek-yildiz", name: "Kulüp Arması (Örnek)", category: "kurumsal-ornek", price: 220, compareAt: 260, sizeCm: 9, colors: 5, stock: 15,
    tags: ["kulüp", "takım", "spor"], description: "Kendi kulübün için ilham: bu örneği isim ve renklerinle uyarlayabiliriz. Toplu siparişte adet başı fiyat düşer.",
    art: { shape: "kalkan", bg: "#1d3557", border: "#f1faee", fg: "#f1faee", accent: "#e63946", icon: "yildiz", text: "SK 1987" } }),
  P({ slug: "sirket-ornek-gunes", name: "Şirket Logosu (Örnek)", category: "kurumsal-ornek", price: 200, sizeCm: 8, colors: 3, stock: 15,
    tags: ["kurumsal", "logo", "üniforma"], description: "Üniforma ve iş kıyafetleri için logo arması örneği. Kendi logonla fiyatı Arma Tasarla sayfasında gör.",
    art: { shape: "dikdortgen", bg: "#f4efe6", border: "#e76f51", fg: "#264653", accent: "#e76f51", icon: "gunes", text: "ATÖLYE CO." } }),
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}
export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}
export function productsIn(category: string) {
  return PRODUCTS.filter((p) => p.category === category);
}
