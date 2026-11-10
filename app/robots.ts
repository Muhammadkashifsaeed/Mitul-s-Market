import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = publicEnv.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/shop",
          "/products/",
          "/help-center",
          "/shipping-returns",
          "/privacy-policy",
          "/terms-conditions",
        ],
        disallow: [
          "/api/",
          "/cart",
          "/checkout",
          "/orders",
          "/login",
          "/signup",
          "/forgot-password",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

