"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center bg-[#F8FAFC] px-4 py-20 sm:px-6">
      <div className="w-full max-w-lg rounded-[28px] border border-gray-200/80 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-[#64748B] sm:text-base">
          An unexpected error occurred while rendering this page. You can retry
          the action or return to the homepage.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Try again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#1E293B] transition-colors hover:bg-gray-50"
          >
            <Home className="h-4 w-4 text-[#4F46E5]" aria-hidden="true" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
