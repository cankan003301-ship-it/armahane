import "server-only";
import { neon } from "@neondatabase/serverless";

type Sql = ReturnType<typeof neon>;
let client: Sql | null = null;
let schemaReady: Promise<void> | null = null;

export function dbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

/** Tabloları ilk kullanımda oluşturur (ayrı migration adımı gerektirmez). */
async function ensureSchema(sql: Sql) {
  await sql`CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    payment TEXT NOT NULL,
    paid BOOLEAN NOT NULL DEFAULT FALSE,
    customer JSONB NOT NULL,
    items JSONB NOT NULL,
    totals JSONB NOT NULL,
    note TEXT,
    tracking TEXT,
    history JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS orders_created_idx ON orders (created_at DESC)`;
  await sql`CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    qty INTEGER,
    message TEXT,
    file_url TEXT,
    status TEXT NOT NULL DEFAULT 'yeni',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
}

export async function db(): Promise<Sql> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL tanımlı değil");
  client ??= neon(process.env.DATABASE_URL);
  schemaReady ??= ensureSchema(client).catch((e) => {
    schemaReady = null;
    throw e;
  });
  await schemaReady;
  return client;
}
