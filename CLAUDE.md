# Armahane — çalışma kuralları

- Dil: arayüz ve içerik Türkçe; kod ve commit mesajları kısa, açıklayıcı.
- Fiyat, kupon, kargo, indirim: **yalnızca** `src/lib/pricing.ts`. Sayfalara sabit fiyat yazma; SSS (`src/data/faq.ts`) de buradan üretilir.
- Sunucu, sipariş tutarını her zaman `src/lib/lines.ts` ile yeniden hesaplar; tarayıcıdan gelen fiyata güvenme.
- Sipariş yalnızca PayTR bildirimi (`/api/paytr/bildirim`) veya yönetim panelinden "ödendi" olur.
- Gizli bilgiler (PayTR, IBAN, şifreler) sadece Vercel ortam değişkenlerinde; repoya veya sohbete yazılmaz.
- Dosyalar 500 satırın altında kalsın.
- Değişiklikten sonra: `npx tsc --noEmit && npm test && npx next build`.
- Next.js 16: `params`/`searchParams` Promise'tir; `middleware` yerine `proxy`. Belge: `node_modules/next/dist/docs/`.
