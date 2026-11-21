# Armahane

Kişiye ve kuruma özel nakış arma & yama mağazası. Next.js 16 (App Router) + Neon Postgres + PayTR, Vercel'de çalışır.

## Kurulum (Vercel)

1. Vercel → **Add New Project** → bu repoyu seç → Deploy.
2. Project → **Storage**:
   - **Neon** (Postgres) ekle → `DATABASE_URL` otomatik gelir. Tablolar ilk siparişte kendiliğinden oluşur.
   - **Blob** ekle → `BLOB_READ_WRITE_TOKEN` otomatik gelir (logo yükleme).
3. Project → **Settings → Environment Variables** (`.env.example` dosyasındaki liste):

| Değişken | Ne için | Zorunlu |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sitenin adresi, ör. `https://armahane.com` | Evet |
| `ADMIN_PASSWORD` | `/yonetim` şifresi (en az 8 karakter) | Evet |
| `ADMIN_SECRET` | En az 16 karakter rastgele metin (oturum ve sipariş bağlantısı imzası) | Evet |
| `BANK_ACCOUNT_NAME`, `BANK_NAME`, `BANK_IBAN` | Havale bilgileri | Evet |
| `SELLER_TITLE`, `SELLER_ADDRESS`, `SELLER_TAX`, `SELLER_PHONE`, `SELLER_MERSIS` | Yasal sayfalardaki satıcı bilgileri | Evet |
| `NEXT_PUBLIC_WHATSAPP` | `905xxxxxxxxx` biçiminde | Önerilir |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_INSTAGRAM`, `NEXT_PUBLIC_CITY` | İletişim | Önerilir |
| `PAYTR_MERCHANT_ID`, `PAYTR_MERCHANT_KEY`, `PAYTR_MERCHANT_SALT` | Kartla ödeme. Boşsa kart seçeneği gizlenir | Kart için |
| `PAYTR_TEST_MODE` | `1` test, `0` canlı | Kart için |
| `RESEND_API_KEY`, `MAIL_FROM`, `SHOP_NOTIFY_EMAIL` | Sipariş e-postaları | Önerilir |

Değişkenleri ekledikten sonra **Redeploy** yapın (yasal sayfalar derleme anında oluşur).

4. **PayTR Mağaza Paneli → Ayarlar → Bildirim URL**: `https://<site>/api/paytr/bildirim`
   Sipariş yalnızca bu bildirim geldiğinde "Ödendi" olur. Önce `PAYTR_TEST_MODE=1` ile test kartıyla deneyin.

## Günlük kullanım

- **Siparişler:** `/yonetim` → sipariş → durum güncelle (havale gelince "Ödeme alındı"), kargo takip no gir. "Müşteriye e-posta gönder" işaretliyse müşteri bilgilendirilir.
- **Teklifler:** `/yonetim/teklifler`
- **Fiyatlar, kuponlar, kargo:** `src/lib/pricing.ts` (tek kaynak; SSS ve sayfalar buradan beslenir).
- **Ürünler:** `src/data/catalog.ts`. Gerçek fotoğraf için ürüne `images: ["https://..."]` ekleyin; Google Merchant feed'i (`/feed.xml`) yalnızca fotoğraflı ürünleri listeler.

## Google

- Search Console → site ekle → `https://<site>/sitemap.xml` gönder.
- Merchant Center → Ürünler → Feed → `https://<site>/feed.xml` (zamanlanmış getirme).

## Geliştirme

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # fiyat kuralları testleri
npm run build
```
