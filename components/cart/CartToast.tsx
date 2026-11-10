"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertCircle, ArrowRight, CheckCircle2, X } from "lucide-react";
import { useCartNotification } from "@/hooks/use-cart";

export function CartToast() {
  const pathname = usePathname();
  const { notification, dismiss } = useCartNotification();

  if (!notification || pathname === "/cart") {
    return null;
  }

  const isWarning = notification.type === "warning";

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-50 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[380px]"
    >
      <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
        {notification.productImage ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={notification.productImage}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        ) : (
          <span
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              isWarning
                ? "bg-amber-50 text-amber-600"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {isWarning ? (
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {isWarning ? (
              <AlertCircle
                className="h-4 w-4 shrink-0 text-amber-600"
                aria-hidden="true"
              />
            ) : (
              <CheckCircle2
                className="h-4 w-4 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
            )}
            <p className="text-sm font-bold text-[#1E293B]">
              {notification.title}
            </p>
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs text-[#64748B]">
            {notification.message}
          </p>
          <div className="mt-2.5 flex items-center gap-3">
            <Link
              href="/cart"
              onClick={dismiss}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#4F46E5] transition-colors hover:text-[#4338CA]"
            >
              <span>View Cart</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notification"
          className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default CartToast;

