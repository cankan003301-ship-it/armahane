"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { NAV, SITE } from "@/lib/site";
import { LogoMark } from "./Logo";

export default function Header() {
  const path = usePathname();
  const { items } = useCart();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="header">
      <div className="wrap bar">
        <Link href="/" className="logo" aria-label={`${SITE.name} ana sayfa`}>
          <LogoMark /> {SITE.name}
        </Link>
        <button className="menu-btn" aria-expanded={open} aria-controls="nav" onClick={() => setOpen((o) => !o)}>
          Menü
        </button>
        <nav id="nav" className={`nav${open ? " open" : ""}`} aria-label="Ana menü">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/sepet" className="cart-btn" aria-label={`Sepet, ${items.length} ürün`}>
          Sepet <span className="count">{items.length}</span>
        </Link>
      </div>
    </header>
  );
}
