import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="wrap" style={{ padding: "28px 0 60px" }}>{children}</div>;
}
