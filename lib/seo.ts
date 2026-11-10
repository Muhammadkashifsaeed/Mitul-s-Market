import type { Metadata } from "next";
import { publicEnv } from "@/lib/env";

export const SITE_NAME = publicEnv.NEXT_PUBLIC_APP_NAME;

export const SITE_DESCRIPTION =
  "Shop curated wireless headphones, smartwatches, mechanical keyboards, backpacks, footwear, and everyday essentials at Mitul's Market. Enjoy free shipping over ₹999 and 30-day returns.";

export const DEFAULT_SEO_KEYWORDS: readonly string[] = [
  "Mitul's Market",
  "electronics store",
  "tech gadgets India",
  "wireless headphones",
  "smart fitness watch",
  "mechanical gaming keyboard",
  "bluetooth speaker",
  "minimalist backpack",
  "running shoes",
  "online shopping",
];

interface CreatePageMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  noIndex?: boolean;
  ogType?: "website" | "article";
  image?: {
    url: string;
    alt: string;
  };
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  ogType = "website",
  image,
}: CreatePageMetadataOptions): Metadata {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const combinedKeywords = Array.from(
    new Set([...DEFAULT_SEO_KEYWORDS, ...keywords])
  );
  const resolvedImages = image
    ? [
        {
          url: image.url,
          alt: image.alt,
        },
      ]
    : canonicalPath === "/" || canonicalPath === "/404"
      ? undefined
      : [
          {
            url: "/opengraph-image",
            width: 1200,
            height: 630,
            alt: `${SITE_NAME} — Premium Tech, Electronics & Lifestyle Storefront`,
          },
        ];

  return {
    title: {
      absolute: fullTitle,
    },
    description,
    keywords: combinedKeywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: ogType,
      locale: "en_IN",
      siteName: SITE_NAME,
      url: canonicalPath,
      title: fullTitle,
      description,
      ...(resolvedImages ? { images: resolvedImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(resolvedImages ? { images: resolvedImages } : {}),
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

