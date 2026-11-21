import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { checkOrderToken, getOrder } from "@/lib/orders";
import { paytrConfigured, paytrSiteUrls, paytrToken } from "@/lib/paytr";
import { tl } from "@/lib/pricing";

export const metadata: Metadata = { title: "Kartla Ödeme", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page({ params, searchParams }: { params: Promise<{ code: string }>; searchParams: Promise<{ t?: string }> }) {
  const { code } = await params;
  const { t } = await searchParams;
  if (!checkOrderToken(code, t)) notFound();
  const order = await getOrder(code);
  if (!order) notFound();
  const back = `/siparis/${code}?t=${t}`;
  if (order.paid) return <Msg title="Bu sipariş ödenmiş" back={back} />;
  if (!paytrConfigured() || order.payment !== "kart") return <Msg title="Kartla ödeme kullanılamıyor" back={back} />;

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "127.0.0.1";
  let token = "";
  let error = "";
  try {
    const urls = paytrSiteUrls(code, t!);
    token = await paytrToken(order, ip, urls.ok, urls.fail);
  } catch (e) {
    console.error(e);
    error = "Ödeme sayfası açılamadı. Birkaç dakika sonra tekrar deneyin veya havale ile ödeyin.";
  }
  return (
    <section className="section" style={{ paddingTop: 32 }}>
      <div className="narrow">
        <h1>Güvenli ödeme</h1>
        <p className="lead">Sipariş <b>{code}</b> · {tl(order.totals.total)}. Kart bilgileriniz PayTR altyapısında işlenir, bizde saklanmaz.</p>
        {error ? (
          <div className="alert err">{error} <Link className="link" href={back}>Siparişe dön</Link></div>
        ) : (
          <iframe src={`https://www.paytr.com/odeme/guvenli/${token}`} title="PayTR ödeme" style={{ width: "100%", minHeight: 720, border: 0 }} />
        )}
      </div>
    </section>
  );
}

function Msg({ title, back }: { title: string; back: string }) {
  return (
    <section className="section"><div className="narrow center"><h1>{title}</h1><Link className="btn" href={back}>Siparişi görüntüle</Link></div></section>
  );
}
