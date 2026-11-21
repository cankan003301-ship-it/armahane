import type { Metadata } from "next";
import { FAQ } from "@/data/faq";

export const metadata: Metadata = { title: "Sık Sorulan Sorular", description: "Nakış arma siparişi, fiyat, kargo, ödeme ve iade hakkında sık sorulan sorular.", alternates: { canonical: "/sss" } };

export default function Page() {
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <section className="section">
      <div className="narrow">
        <h1>Sık sorulan sorular</h1>
        {FAQ.map((f) => <details key={f.q} className="faq"><summary>{f.q}</summary><p>{f.a}</p></details>)}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </section>
  );
}
