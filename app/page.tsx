import { BenefitsSection } from "@/components/BenefitsSection";
import { CategorySection } from "@/components/CategorySection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { HeroSection } from "@/components/HeroSection";
import { STORE_SUPPORT_INFO } from "@/lib/customer-care";
import { publicEnv } from "@/lib/env";
import { SITE_DESCRIPTION, SITE_NAME, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: `${SITE_NAME} | Tech, Electronics & Lifestyle Store`,
  description: SITE_DESCRIPTION,
  path: "/",
  keywords: [
    "featured electronics",
    "premium tech store",
    "noise cancelling headphones",
    "smartwatch",
    "lifestyle accessories",
  ],
});

export default function HomePage() {
  const baseUrl = publicEnv.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        name: SITE_NAME,
        url: baseUrl,
        description: SITE_DESCRIPTION,
        inLanguage: "en-IN",
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/shop?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "OnlineStore",
        "@id": `${baseUrl}/#store`,
        name: SITE_NAME,
        url: baseUrl,
        logo: `${baseUrl}/icon.svg`,
        description: SITE_DESCRIPTION,
        email: STORE_SUPPORT_INFO.email,
        telephone: STORE_SUPPORT_INFO.phoneDisplay,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Morbi",
          addressRegion: "Gujarat",
          addressCountry: "IN",
        },
      },
    ],
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HeroSection />
      <BenefitsSection />
      <CategorySection />
      <FeaturedProducts />
    </main>
  );
}
