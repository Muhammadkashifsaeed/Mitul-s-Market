import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";
import { allProducts } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = publicEnv.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  const lastModified = new Date("2026-11-10T00:00:00.000Z");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/help-center`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shipping-returns`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = allProducts.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
    images: [`${baseUrl}${product.image}`],
  }));

  return [...staticRoutes, ...productRoutes];
}

