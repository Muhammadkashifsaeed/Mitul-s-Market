import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Shopping Cart | Mitul's Market",
  description:
    "Review your selected products, update quantities, apply promo codes, and proceed to checkout at Mitul's Market.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return <CartView />;
}

