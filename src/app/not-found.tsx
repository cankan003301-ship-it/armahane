import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="narrow center">
        <span className="eyebrow">404</span>
        <h1>Bu sayfa sökülmüş gibi</h1>
        <p className="lead" style={{ marginInline: "auto" }}>Aradığın sayfa bulunamadı.</p>
        <div className="row" style={{ justifyContent: "center" }}>
          <Link className="btn brand" href="/arma-tasarla">Arma Tasarla</Link>
          <Link className="btn ghost" href="/">Ana sayfa</Link>
        </div>
      </div>
    </section>
  );
}
