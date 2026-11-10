"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Tag,
  Truck,
  X,
} from "lucide-react";
import type { ComputedCartSummary } from "@/lib/cart";
import { DEMO_COUPONS } from "@/lib/demo-coupons";
import type { CouponValidationResult } from "@/types";
import { formatCurrency } from "@/utils/format";

interface CartOrderSummaryProps {
  summary: ComputedCartSummary;
  isAuthenticated?: boolean;
  hasOutOfStockItems: boolean;
  onApplyPromoCode: (code: string) => CouponValidationResult;
  onRemovePromoCode: () => void;
  onProceedToCheckout: () => void;
}

export function CartOrderSummary({
  summary,
  isAuthenticated = false,
  hasOutOfStockItems,
  onApplyPromoCode,
  onRemovePromoCode,
  onProceedToCheckout,
}: CartOrderSummaryProps) {
  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  function handlePromoSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = onApplyPromoCode(promoInput);
    if (result.valid) {
      setPromoFeedback({
        type: "success",
        message: result.message,
      });
      setPromoInput("");
    } else {
      setPromoFeedback({
        type: "error",
        message: result.message,
      });
    }
  }

  function handleClearPromo() {
    onRemovePromoCode();
    setPromoFeedback(null);
  }

  const demoHints = DEMO_COUPONS.map((c) => c.code).join(", ");

  return (
    <aside
      aria-labelledby="order-summary-heading"
      className="rounded-[28px] border border-gray-200/80 bg-white p-6 shadow-sm sm:p-7 lg:sticky lg:top-28"
    >
      <h2
        id="order-summary-heading"
        className="text-xl font-bold tracking-tight text-[#1E293B] sm:text-2xl"
      >
        Order Summary
      </h2>

      {/* Free Shipping Status Banner */}
      {summary.subtotal > 0 && (
        <div
          className={`mt-4 flex items-start gap-2.5 rounded-2xl px-3.5 py-3 text-xs leading-relaxed ${
            summary.amountToFreeShipping === 0
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-indigo-100 bg-indigo-50/70 text-[#1E293B]"
          }`}
        >
          <Truck
            className={`mt-0.5 h-4 w-4 shrink-0 ${
              summary.amountToFreeShipping === 0
                ? "text-emerald-600"
                : "text-[#4F46E5]"
            }`}
            aria-hidden="true"
          />
          {summary.amountToFreeShipping === 0 ? (
            <p className="font-semibold">
              You unlocked FREE shipping on orders over{" "}
              {formatCurrency(summary.freeShippingThreshold)}.
            </p>
          ) : (
            <p>
              Add{" "}
              <span className="font-bold text-[#4F46E5]">
                {formatCurrency(summary.amountToFreeShipping)}
              </span>{" "}
              more for <span className="font-semibold">FREE shipping</span>{" "}
              (orders over {formatCurrency(summary.freeShippingThreshold)}).
            </p>
          )}
        </div>
      )}

      {/* Promo Code Input Section */}
      <div className="mt-5 border-t border-gray-100 pt-5">
        <label
          htmlFor="promo-code-input"
          className="flex items-center gap-1.5 text-sm font-semibold text-[#1E293B]"
        >
          <Tag className="h-4 w-4 text-[#4F46E5]" aria-hidden="true" />
          <span>Promo Code</span>
        </label>

        <form onSubmit={handlePromoSubmit} className="mt-2.5 flex gap-2">
          <input
            id="promo-code-input"
            type="text"
            value={promoInput}
            onChange={(event) => {
              setPromoInput(event.target.value);
              if (promoFeedback?.type === "error") {
                setPromoFeedback(null);
              }
            }}
            placeholder="Enter promo code"
            aria-label="Enter promo code"
            className="h-11 min-w-0 flex-1 rounded-full border border-gray-200 bg-white px-4 text-sm text-[#1E293B] uppercase placeholder:normal-case placeholder:text-gray-400 transition-colors focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
          />
          <button
            type="submit"
            className="shrink-0 cursor-pointer whitespace-nowrap rounded-full border border-[#4F46E5] bg-white px-5 py-2.5 text-sm font-bold text-[#4F46E5] transition-colors hover:bg-[#4F46E5] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/40"
          >
            Apply
          </button>
        </form>

        <p className="mt-2 text-[11px] text-[#64748B]">
          Available promo codes:{" "}
          <span className="font-semibold text-[#475569]">{demoHints}</span>
        </p>

        {/* Active Coupon Pill */}
        {summary.appliedCoupon && (
          <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs text-emerald-900">
            <div className="min-w-0">
              <p className="font-bold">{summary.appliedCoupon.code} applied</p>
              <p className="text-emerald-700">{summary.appliedCoupon.label}</p>
            </div>
            <button
              type="button"
              onClick={handleClearPromo}
              aria-label={`Remove promo code ${summary.appliedCoupon.code}`}
              className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Dynamic Promo Threshold Warning */}
        {summary.couponRequirementNote && (
          <p
            role="status"
            className="mt-2 flex items-start gap-1.5 text-xs font-medium text-amber-700"
          >
            <AlertCircle
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
            <span>{summary.couponRequirementNote}</span>
          </p>
        )}

        {/* Submit Validation Feedback */}
        {promoFeedback && (
          <p
            role={promoFeedback.type === "error" ? "alert" : "status"}
            className={`mt-2 flex items-start gap-1.5 text-xs font-medium ${
              promoFeedback.type === "error"
                ? "text-rose-600"
                : "text-emerald-700"
            }`}
          >
            {promoFeedback.type === "error" ? (
              <AlertCircle
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
            ) : (
              <CheckCircle2
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
            )}
            <span>{promoFeedback.message}</span>
          </p>
        )}
      </div>

      {/* Totals Breakdown */}
      <dl className="mt-5 space-y-3 border-t border-gray-100 pt-5 text-sm">
        <div className="flex items-center justify-between gap-2 text-[#475569]">
          <dt>
            Subtotal ({summary.totalItems}{" "}
            {summary.totalItems === 1 ? "item" : "items"})
          </dt>
          <dd
            data-testid="summary-subtotal"
            className="font-semibold text-[#1E293B]"
          >
            {formatCurrency(summary.subtotal)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-2 text-[#475569]">
          <dt>Shipping Charges</dt>
          <dd
            data-testid="summary-shipping"
            className={`font-semibold ${
              summary.shippingCharges === 0
                ? "text-emerald-600"
                : "text-[#1E293B]"
            }`}
          >
            {summary.shippingCharges === 0
              ? "Free"
              : formatCurrency(summary.shippingCharges)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-2 text-[#475569]">
          <dt>Discount</dt>
          <dd
            data-testid="summary-discount"
            className={`font-semibold ${
              summary.discount > 0 ? "text-emerald-600" : "text-[#1E293B]"
            }`}
          >
            {summary.discount > 0
              ? `-${formatCurrency(summary.discount)}`
              : formatCurrency(0)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-2 text-[#475569]">
          <dt>Estimated Tax</dt>
          <dd className="font-semibold text-[#1E293B]">
            {summary.taxAmount > 0
              ? formatCurrency(summary.taxAmount)
              : "₹0 (Included)"}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-gray-200 pt-3.5 text-base">
          <dt className="font-bold text-[#1E293B]">Total Amount</dt>
          <dd
            data-testid="summary-total"
            className="text-xl font-bold text-[#4F46E5]"
          >
            {formatCurrency(summary.total)}
          </dd>
        </div>
      </dl>

      {/* Out of stock guard notice */}
      {hasOutOfStockItems && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Please remove out-of-stock products before proceeding to checkout.
          </span>
        </div>
      )}

      {/* Proceed to Checkout Button */}
      <button
        type="button"
        disabled={summary.totalItems <= 0 || hasOutOfStockItems}
        onClick={onProceedToCheckout}
        className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3.5 text-base font-bold text-white shadow-md shadow-[#4F46E5]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/50 focus-visible:ring-offset-2 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:shadow-none"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Continue Shopping Link */}
      <Link
        href="/shop"
        className="mt-3 flex w-full items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-[#1E293B] transition-colors hover:bg-gray-50"
      >
        Continue Shopping
      </Link>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-[#64748B]">
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
        <span>
          {isAuthenticated
            ? "Signed in — ready for checkout"
            : "Sign in with Google or email before checkout"}
        </span>
      </p>
    </aside>
  );
}

export default CartOrderSummary;

