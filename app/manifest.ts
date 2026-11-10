import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: publicEnv.NEXT_PUBLIC_APP_NAME,
    short_name: "Mitul's Market",
    description: publicEnv.NEXT_PUBLIC_APP_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#4F46E5",
    categories: ["shopping", "electronics", "lifestyle"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "32x32 16x16",
        type: "image/x-icon",
      },
    ],
  };
}

