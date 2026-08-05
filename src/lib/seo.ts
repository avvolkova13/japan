import type { Metadata } from "next";

export const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || null;

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  canonicalPath?: string;
};

export function createPageMetadata({ title, description, path, noIndex = false, canonicalPath = path }: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: publicSiteUrl ? { canonical: `${publicSiteUrl}${canonicalPath}` } : undefined,
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
