/** Marka ve iletişim bilgileri. Boş olanlar sitede gösterilmez. */
export const SITE = {
  name: "Armahane",
  tagline: "Kişiye ve kuruma özel nakış arma & yama",
  description:
    "Logonu yükle, fiyatını anında gör. Kulüp, şirket, takım ve kişisel nakış armaları; tek adetten toplu üretime. Ütüyle yapışan, cırt cırt ve dikilecek seçenekleri.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://armahane.vercel.app").replace(/\/$/, ""),
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "", // 905xxxxxxxxx
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "", // kullanıcı adı, @ olmadan
  city: process.env.NEXT_PUBLIC_CITY || "Türkiye",
  /** Yasal sayfalarda görünen satıcı bilgileri (Vercel ortam değişkenlerinden). */
  seller: {
    title: process.env.SELLER_TITLE || "",
    address: process.env.SELLER_ADDRESS || "",
    taxInfo: process.env.SELLER_TAX || "",
    mersis: process.env.SELLER_MERSIS || "",
    phone: process.env.SELLER_PHONE || "",
  },
};

export function whatsappLink(text?: string) {
  if (!SITE.whatsapp) return "";
  return `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export const NAV = [
  { href: "/arma-tasarla", label: "Arma Tasarla" },
  { href: "/urunler", label: "Hazır Armalar" },
  { href: "/kurumsal", label: "Kurumsal & Toplu" },
  { href: "/rehber", label: "Rehber" },
  { href: "/siparis-takip", label: "Sipariş Takip" },
];
