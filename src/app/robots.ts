import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/yonetim", "/api/", "/sepet", "/odeme", "/siparis/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
