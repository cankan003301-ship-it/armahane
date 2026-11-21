"use client";
import { useMemo, useState } from "react";
import type { Category, Product } from "@/data/catalog";
import ProductCard from "./ProductCard";

const SORTS = {
  onerilen: { label: "Önerilen", fn: (a: Product, b: Product) => Number(!!b.featured) - Number(!!a.featured) },
  yeni: { label: "En yeniler", fn: (a: Product, b: Product) => Number(!!b.isNew) - Number(!!a.isNew) },
  artan: { label: "Fiyat: artan", fn: (a: Product, b: Product) => a.price - b.price },
  azalan: { label: "Fiyat: azalan", fn: (a: Product, b: Product) => b.price - a.price },
} as const;

const norm = (s: string) => s.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");

export default function Catalog({ products, categories, initialCat = "" }: { products: Product[]; categories: Category[]; initialCat?: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(initialCat);
  const [sort, setSort] = useState<keyof typeof SORTS>("onerilen");
  const [maxCm, setMaxCm] = useState(0);

  const list = useMemo(() => {
    const nq = norm(q.trim());
    return products
      .filter((p) => !cat || p.category === cat)
      .filter((p) => !maxCm || p.sizeCm <= maxCm)
      .filter((p) => !nq || norm([p.name, ...p.tags, p.description].join(" ")).includes(nq))
      .sort(SORTS[sort].fn);
  }, [products, q, cat, sort, maxCm]);

  return (
    <>
      <div className="card" style={{ display: "grid", gap: 14, marginBottom: 20 }}>
        <div className="grid filters">
          <label className="field" style={{ margin: 0 }}>
            <span className="sr">Ara</span>
            <input type="search" placeholder="Ara: dağ, motor, lale, çapa…" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <label className="field" style={{ margin: 0 }}>
            <span className="sr">Boyut</span>
            <select value={maxCm} onChange={(e) => setMaxCm(Number(e.target.value))}>
              <option value={0}>Tüm boyutlar</option>
              <option value={6}>6 cm ve altı</option>
              <option value={8}>8 cm ve altı</option>
              <option value={10}>10 cm ve altı</option>
            </select>
          </label>
          <label className="field" style={{ margin: 0 }}>
            <span className="sr">Sırala</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)}>
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </label>
        </div>
        <div className="chips" role="group" aria-label="Koleksiyon">
          <button className="chip" aria-pressed={!cat} onClick={() => setCat("")}>Tümü</button>
          {categories.map((c) => (
            <button key={c.slug} className="chip" aria-pressed={cat === c.slug} onClick={() => setCat(c.slug)}>{c.name}</button>
          ))}
        </div>
      </div>
      <p className="muted small" aria-live="polite">{list.length} arma</p>
      {list.length ? (
        <div className="grid g4">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      ) : (
        <div className="card center">
          <p>Aradığını bulamadın mı? Kendi armanı tasarla — fiyatı anında gör.</p>
          <a className="btn brand" href="/arma-tasarla">Arma Tasarla</a>
        </div>
      )}
    </>
  );
}
