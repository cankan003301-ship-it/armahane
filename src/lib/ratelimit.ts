import "server-only";
import { createHash } from "node:crypto";
import { db, dbConfigured } from "@/lib/db";

/** İstek yapan IP (Vercel x-forwarded-for). */
export function clientIp(req: Request) {
  return ipFrom(req.headers);
}
export function ipFrom(h: Headers) {
  return (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}

/**
 * Sabit pencereli hız sınırı (Postgres). IP saklanmaz, yalnızca özeti tutulur.
 * Veritabanı yoksa veya hata olursa isteği engellemez (siparişi kaybetmektense spam riskini alırız).
 */
export async function rateLimit(scope: string, ip: string, limit: number, windowSec: number): Promise<boolean> {
  if (!dbConfigured()) return true;
  const key = `${scope}:${createHash("sha256").update(ip).digest("base64url").slice(0, 22)}`;
  try {
    const sql = await db();
    const rows = (await sql`INSERT INTO rate_limits (key, window_start, count) VALUES (${key}, now(), 1)
      ON CONFLICT (key) DO UPDATE SET
        count = CASE WHEN rate_limits.window_start < now() - make_interval(secs => ${windowSec}) THEN 1 ELSE rate_limits.count + 1 END,
        window_start = CASE WHEN rate_limits.window_start < now() - make_interval(secs => ${windowSec}) THEN now() ELSE rate_limits.window_start END
      RETURNING count`) as { count: number }[];
    if (Math.random() < 0.02) await sql`DELETE FROM rate_limits WHERE window_start < now() - interval '1 day'`;
    return (rows[0]?.count ?? 0) <= limit;
  } catch (e) {
    console.error("rate limit error", e);
    return true;
  }
}
