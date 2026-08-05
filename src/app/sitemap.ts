import type { MetadataRoute } from "next";
import { demoProducts } from "@/data/demo-products";
import { informationSlugs } from "@/data/information-pages";
import { journalStories } from "@/data/journal-stories";
import { publicSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!publicSiteUrl) return [];
  const paths = [
    "",
    "/catalog",
    "/journal",
    "/ritual",
    ...informationSlugs.map((slug) => `/${slug}`),
    ...demoProducts.map((product) => `/product/${product.id}`),
    ...journalStories.map((story) => `/journal/${story.slug}`),
  ];
  return [...new Set(paths)].map((path) => ({ url: `${publicSiteUrl}${path}`, changeFrequency: path.startsWith("/product/") ? "weekly" : "monthly" }));
}
