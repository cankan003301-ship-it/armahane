import type { Metadata } from "next";
import { adminConfigured } from "@/lib/admin";
import { login } from "../actions";

export const metadata: Metadata = { title: "Yönetim Girişi", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ hata?: string }> }) {
  const { hata } = await searchParams;
  return (
    <section className="section">
      <div className="narrow" style={{ maxWidth: 420 }}>
        <h1>Yönetim</h1>
        {!adminConfigured() && <div className="alert warn">ADMIN_PASSWORD ve ADMIN_SECRET (en az 16 karakter) Vercel ortam değişkenlerine eklenmeli.</div>}
        {hata && <div className="alert err">Şifre hatalı.</div>}
        <form action={login} className="card">
          <label className="field"><span className="label">Şifre</span><input type="password" name="password" required autoComplete="current-password" /></label>
          <button className="btn brand block" type="submit">Giriş</button>
        </form>
      </div>
    </section>
  );
}
