import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";

export function EmptyCartState() {
  return (
    <div className="rounded-[28px] border border-gray-200/80 bg-white px-6 py-16 text-center shadow-xs sm:px-10 sm:py-20">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
        <ShoppingCart className="h-8 w-8" aria-hidden="true" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl">
        Your Cart is Empty
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#64748B] sm:text-base">
        Looks like you haven&apos;t added anything to your cart yet. Explore our
        collection and find something you love.
      </p>

      <div className="mt-7">
        <Link
          href="/shop"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#4F46E5] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-[#4F46E5]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-lg"
        >
          <span>Start Shopping</span>
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}

export default EmptyCartState;

