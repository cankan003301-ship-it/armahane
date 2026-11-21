import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOrder, orderToken } from "@/lib/orders";
import { dbConfigured } from "@/lib/db";

export const metadata: Metadata = { title: "Sipariş Takip", description: "Sipariş kodun ve e-postanla siparişinin durumunu gör.", alternates: { canonical: "/siparis-takip" } };

async function find(formData: FormData) {
  "use server";
  const code = String(formData.get("code") ?? "").trim().toUpperCase().replace(/^AH(?!-)/, "AH-");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const o = dbConfigured() ? await getOrder(code) : null;
  if (!o || o.customer.email.toLowerCase() !== email) redirect("/siparis-takip?hata=1");
  redirect(`/siparis/${o.code}?t=${orderToken(o.code)}`);
}

export default async function Page({ searchParams }: { searchParams: Promise<{ hata?: string }> }) {
  const { hata } = await searchParams;
  return (
    <section className="section">
      <div className="narrow" style={{ maxWidth: 520 }}>
        <h1>Sipariş takip</h1>
        <p className="lead">Sipariş kodun (AH-…) onay e-postasında yazar.</p>
        {hata && <div className="alert err">Bu bilgilerle sipariş bulunamadı. Kodu ve e-postayı kontrol et.</div>}
        <form action={find} className="card">
          <label className="field"><span className="label">Sipariş kodu</span><input type="text" name="code" required placeholder="AH-XXXXXXX" maxLength={12} /></label>
          <label className="field"><span className="label">E-posta</span><input type="email" name="email" required autoComplete="email" /></label>
          <button className="btn brand block" type="submit">Siparişimi göster</button>
        </form>
      </div>
    </section>
  );
}
