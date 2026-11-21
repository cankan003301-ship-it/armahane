"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, endSession, requireAdmin, startSession } from "@/lib/admin";
import { STATUSES, setOrderStatus, type StatusId } from "@/lib/orders";
import { mailStatusChanged } from "@/lib/mail";
import { db } from "@/lib/db";

export async function login(formData: FormData) {
  await new Promise((r) => setTimeout(r, 400)); // kaba kuvvet denemelerini yavaşlat
  if (!checkPassword(String(formData.get("password") ?? ""))) redirect("/yonetim/giris?hata=1");
  await startSession();
  redirect("/yonetim");
}

export async function logout() {
  await endSession();
  redirect("/yonetim/giris");
}

export async function updateOrder(formData: FormData) {
  await requireAdmin();
  const code = String(formData.get("code") ?? "");
  const status = String(formData.get("status") ?? "") as StatusId;
  if (!STATUSES.some((s) => s.id === status)) throw new Error("Geçersiz durum");
  const tracking = String(formData.get("tracking") ?? "").trim().slice(0, 120) || undefined;
  const note = String(formData.get("note") ?? "").trim().slice(0, 500) || undefined;
  const paid = formData.get("paid") === "on" || status === "odendi" ? true : undefined;
  const updated = await setOrderStatus(code, status, "yönetim", { tracking, note, paid });
  if (updated && formData.get("notify") === "on") await mailStatusChanged(updated);
  revalidatePath(`/yonetim/siparis/${code}`);
  redirect(`/yonetim/siparis/${code}?ok=1`);
}

export async function updateQuote(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isInteger(id) || !["yeni", "teklif-verildi", "kazanildi", "kaybedildi"].includes(status)) throw new Error("Geçersiz");
  const sql = await db();
  await sql`UPDATE quotes SET status = ${status} WHERE id = ${id}`;
  revalidatePath("/yonetim/teklifler");
}
