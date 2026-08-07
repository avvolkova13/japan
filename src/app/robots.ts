import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!publicSiteUrl) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/account", "/cart", "/checkout", "/favorites", "/wishlist"] },
    sitemap: `${publicSiteUrl}/sitemap.xml`,
  };
}
