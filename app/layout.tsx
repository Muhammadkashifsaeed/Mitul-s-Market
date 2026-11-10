import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CartToast } from "@/components/cart/CartToast";
import { publicEnv } from "@/lib/env";
import { DEFAULT_SEO_KEYWORDS, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_APP_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} | Tech, Electronics & Lifestyle Store`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [...DEFAULT_SEO_KEYWORDS],
  authors: [{ name: SITE_NAME, url: publicEnv.NEXT_PUBLIC_APP_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "ecommerce",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    url: "/",
    title: `${SITE_NAME} | Tech, Electronics & Lifestyle Store`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Tech, Electronics & Lifestyle Store`,
    description: SITE_DESCRIPTION,
  },
  robots: {
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4F46E5" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <CartToast />
        <Footer />
      </body>
    </html>
  );
}

