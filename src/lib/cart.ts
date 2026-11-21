"use client";
/** Tarayıcı sepeti (localStorage). Fiyat saklanmaz; her gösterimde lines.ts ile hesaplanır. */
import { useSyncExternalStore } from "react";
import { CartItemSchema, type CartItem } from "@/lib/lines";

const KEY = "armahane.cart.v1";
const COUPON_KEY = "armahane.coupon.v1";
const MAX_ITEMS = 30;

type State = { items: CartItem[]; coupon: string };
const EMPTY: State = { items: [], coupon: "" };
let state: State = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    const items = Array.isArray(raw) ? raw.flatMap((r) => { const p = CartItemSchema.safeParse(r); return p.success ? [p.data] : []; }) : [];
    state = { items, coupon: localStorage.getItem(COUPON_KEY) || "" };
  } catch {
    state = EMPTY;
  }
}

function save(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next.items));
    localStorage.setItem(COUPON_KEY, next.coupon);
  } catch {
    /* gizli sekme vb. — sepet yalnızca bu sayfa açıkken yaşar */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === COUPON_KEY) { loaded = false; load(); l(); }
  };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(l); window.removeEventListener("storage", onStorage); };
}

export function useCart() {
  return useSyncExternalStore(subscribe, () => { load(); return state; }, () => EMPTY);
}

export const cart = {
  get: () => { load(); return state; },
  add(item: CartItem) {
    load();
    const existing = state.items.find((i) => i.key === item.key);
    if (existing && existing.kind === "product" && item.kind === "product") {
      return save({ ...state, items: state.items.map((i) => (i.key === item.key && i.kind === "product" ? { ...i, qty: Math.min(999, i.qty + item.qty) } : i)) });
    }
    if (state.items.length >= MAX_ITEMS) return;
    save({ ...state, items: [...state.items.filter((i) => i.key !== item.key), item] });
  },
  setQty(key: string, qty: number) {
    load();
    save({ ...state, items: state.items.map((i) => (i.key === key && i.kind === "product" ? { ...i, qty: Math.max(1, Math.min(999, Math.round(qty) || 1)) } : i)) });
  },
  remove(key: string) { load(); save({ ...state, items: state.items.filter((i) => i.key !== key) }); },
  setCoupon(code: string) { load(); save({ ...state, coupon: code.trim().slice(0, 30) }); },
  clear() { save({ items: [], coupon: "" }); },
};

export function cartCount(items: CartItem[]) {
  return items.reduce((s, i) => s + (i.kind === "product" ? i.qty : i.spec.qty), 0);
}
