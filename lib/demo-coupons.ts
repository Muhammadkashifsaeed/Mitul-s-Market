import type { PromoCoupon } from "@/types";

/**
 * Storefront promo codes validated on both client summary and server checkout.
 */
export const DEMO_COUPONS: readonly PromoCoupon[] = [
  {
    code: "MITUL10",
    label: "10% discount (up to ₹500)",
    type: "percent",
    value: 10,
    minSubtotal: 999,
    maxDiscount: 500,
    isDemo: false,
  },
  {
    code: "SAVE200",
    label: "Flat ₹200 discount on orders ₹1,500+",
    type: "flat",
    value: 200,
    minSubtotal: 1500,
    isDemo: false,
  },
];

