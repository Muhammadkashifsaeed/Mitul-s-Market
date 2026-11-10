import type { Metadata } from "next";
import { HelpCenterView } from "@/components/customer-care/HelpCenterView";
import { HELP_CENTER_CATEGORIES } from "@/lib/customer-care";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Help Center | Mitul's Market",
  description:
    "Search help topics and find answers on accounts, orders, payments, shipping, returns, and support at Mitul's Market.",
  path: "/help-center",
  keywords: ["help center", "customer care", "FAQ", "order help", "support"],
});

export default function HelpCenterPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HELP_CENTER_CATEGORIES.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HelpCenterView />
    </>
  );
}

