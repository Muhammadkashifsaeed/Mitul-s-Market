import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass, HelpCircle, ShoppingBag } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Page Not Found | Mitul's Market",
  description:
    "The page or product you requested could not be found at Mitul's Market.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#F8FAFC] px-4 py-20 sm:px-6">
      <div className="w-full max-w-lg rounded-[28px] border border-gray-200/80 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
          <Compass className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="mt-5 font-mono text-sm font-bold tracking-wider text-[#4F46E5]">
          404 &bull; PAGE NOT FOUND
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1E293B]">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-[#64748B] sm:text-base">
          The page or product you requested may have moved or the URL may be
          incomplete. Explore our storefront or visit Support below.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#1E293B] transition-colors hover:bg-gray-50"
          >
            <ShoppingBag className="h-4 w-4 text-[#4F46E5]" aria-hidden="true" />
            <span>Shop All</span>
          </Link>
          <Link
            href="/help-center"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#1E293B] transition-colors hover:bg-gray-50"
          >
            <HelpCircle className="h-4 w-4 text-[#4F46E5]" aria-hidden="true" />
            <span>Help Center</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
