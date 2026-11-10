import type { Metadata } from "next";
import { CheckoutView } from "@/components/cart/CheckoutView";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Checkout | Mitul's Market",
  description:
    "Enter your delivery information and review your order summary before completing checkout at Mitul's Market.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutView />;
}

