import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "ah_admin";
const MAX_AGE = 60 * 60 * 12; // 12 saat

function sign(v: string) {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 16) throw new Error("ADMIN_SECRET en az 16 karakter olmalı");
  return createHmac("sha256", s).update(`admin:${v}`).digest("base64url");
}
function safeEq(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SECRET && process.env.ADMIN_SECRET.length >= 16);
}

export function checkPassword(pw: string) {
  const real = process.env.ADMIN_PASSWORD || "";
  return real.length >= 8 && safeEq(sign(pw), sign(real));
}

export async function startSession() {
  const ts = String(Date.now());
  (await cookies()).set(COOKIE, `${ts}.${sign(ts)}`, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const [ts, sig] = v.split(".");
  if (!ts || !sig || !safeEq(sig, sign(ts))) return false;
  return Date.now() - Number(ts) < MAX_AGE * 1000;
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/yonetim/giris");
}
