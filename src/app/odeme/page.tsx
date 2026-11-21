import type { Metadata } from "next";
import Checkout from "@/components/Checkout";
import { paytrConfigured } from "@/lib/paytr";
import { dbConfigured } from "@/lib/db";

export const metadata: Metadata = { title: "Ödeme", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <section className="section" style={{ paddingTop: 32 }}>
      <div className="wrap">
        <h1>Ödeme</h1>
        <Checkout cardEnabled={paytrConfigured()} ready={dbConfigured() && Boolean(process.env.ADMIN_SECRET)} />
      </div>
    </section>
  );
}
