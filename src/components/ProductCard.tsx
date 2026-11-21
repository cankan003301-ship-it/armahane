import Link from "next/link";
import type { Product } from "@/data/catalog";
import { tl } from "@/lib/pricing";
import PatchArt from "./PatchArt";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="pcard">
      {p.compareAt ? <span className="badge sale">İndirim</span> : p.isNew ? <span className="badge new">Yeni</span> : null}
      <div className="media">
        {p.images?.[0] ? <img src={p.images[0]} alt={p.name} loading="lazy" /> : <PatchArt spec={p.art} title={p.name} />}
      </div>
      <div className="body">
        <h3><Link href={`/urun/${p.slug}`}>{p.name}</Link></h3>
        <div className="meta">{p.sizeCm} cm · {p.colors} renk{p.stock < 10 ? ` · son ${p.stock}` : ""}</div>
        <div className="price">
          {tl(p.price)}
          {p.compareAt ? <s>{tl(p.compareAt)}</s> : null}
        </div>
      </div>
    </article>
  );
}
