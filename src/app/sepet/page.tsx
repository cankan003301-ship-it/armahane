import type { Metadata } from "next";
import CartView from "@/components/CartView";

export const metadata: Metadata = { title: "Sepet", robots: { index: false } };

export default function Page() {
  return (
    <section className="section" style={{ paddingTop: 32 }}>
      <div className="wrap">
        <h1>Sepet</h1>
        <CartView />
      </div>
    </section>
  );
}
