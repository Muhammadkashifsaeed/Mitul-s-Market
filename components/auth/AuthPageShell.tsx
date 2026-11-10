"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/utils/format";

interface AuthPageShellProps {
  badgeText: string;
  title: string;
  subtitle: string;
  redirectTo?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthPageShell({
  badgeText,
  title,
  subtitle,
  redirectTo = "/",
  children,
  footer,
}: AuthPageShellProps) {
  const { totalItems, summary } = useCart();

  return (
    <main className="flex flex-1 flex-col justify-center bg-[#F8FAFC] px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link
            href={redirectTo === "/checkout" ? "/cart" : "/"}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4F46E5] transition-colors hover:text-[#4338CA]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>
              {redirectTo === "/checkout" ? "Back to Cart" : "Back to Store"}
            </span>
          </Link>

          <Link
            href="/help-center"
            className="text-xs font-medium text-[#64748B] transition-colors hover:text-[#4F46E5]"
          >
            Need help?
          </Link>
        </div>

        <section
          aria-labelledby="auth-page-heading"
          className="rounded-[28px] border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
              {badgeText}
            </span>
            <h1
              id="auth-page-heading"
              className="mt-3 text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl"
            >
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              {subtitle}
            </p>
          </div>

          {totalItems > 0 && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-3.5 py-3 text-left">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#4F46E5] shadow-xs">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#1E293B]">
                  Your shopping cart stays saved
                </p>
                <p className="text-xs text-[#64748B]">
                  {totalItems} {totalItems === 1 ? "item" : "items"} &bull;{" "}
                  <span className="font-semibold text-[#4F46E5]">
                    {formatCurrency(summary.total)}
                  </span>
                </p>
              </div>
              <Link
                href="/cart"
                className="shrink-0 text-xs font-bold text-[#4F46E5] hover:underline"
              >
                View Cart
              </Link>
            </div>
          )}

          <div className="mt-6">{children}</div>

          {footer && (
            <div className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-[#64748B]">
              {footer}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

