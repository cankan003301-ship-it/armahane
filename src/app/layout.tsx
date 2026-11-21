import type { Metadata, Viewport } from "next";
import { Manrope, Oswald } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE, whatsappLink } from "@/lib/site";
import { SHIPPING } from "@/lib/pricing";
import "./globals.css";

const head = Oswald({ subsets: ["latin", "latin-ext"], variable: "--font-head", weight: ["500", "600", "700"] });
const body = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { type: "website", locale: "tr_TR", siteName: SITE.name, url: SITE.url },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#f6f1e7", width: "device-width", initialScale: 1 };

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/icon.svg`,
  ...(SITE.instagram ? { sameAs: [`https://instagram.com/${SITE.instagram}`] } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const wa = whatsappLink("Merhaba, arma siparişi hakkında bilgi almak istiyorum.");
  return (
    <html lang="tr" className={`${head.variable} ${body.variable}`}>
      <body>
        <a href="#icerik" className="sr">İçeriğe geç</a>
        <div className="announce">
          <b>{SHIPPING.freeFrom.toLocaleString("tr-TR")} ₺</b> üzeri kargo ücretsiz · Havale/EFT ile <b>%3</b> indirim · İlk siparişe <b>HOSGELDIN10</b>
        </div>
        <Header />
        <main id="icerik">{children}</main>
        <Footer />
        {wa && (
          <a className="wa-fab" href={wa} target="_blank" rel="noopener" aria-label="WhatsApp ile yazın">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.8-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.2-1.6-1.2-3s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.6 0l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.4.1.1.1.6-.1 1.2Z"/></svg>
          </a>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
