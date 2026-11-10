"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Lock, LogIn } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { GoogleLoginModal } from "@/components/GoogleLoginModal";
import { useAuth } from "@/hooks/use-auth";

interface OrderAccessGateProps {
  orderId: string;
}

export function OrderAccessGate({ orderId }: OrderAccessGateProps) {
  const router = useRouter();
  const { signInGoogleDemo } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const callbackPath = `/orders/${encodeURIComponent(orderId)}`;

  async function handleQuickSignIn() {
    setIsSigningIn(true);
    const res = await signInGoogleDemo({ preset: "aarav" });
    setIsSigningIn(false);
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <main className="w-full flex-1 bg-[#F8FAFC]">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#4F46E5]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to My Orders</span>
        </Link>

        <div className="mt-6 rounded-[28px] border border-gray-200/80 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
            <Lock className="h-7 w-7" aria-hidden="true" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-[#1E293B] sm:text-3xl">
            Sign in to view order {orderId}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
            Customer order details and invoices are private to your account.
            Sign in below to view full tracking details.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              disabled={isSigningIn}
              onClick={handleQuickSignIn}
              className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-[#1E293B] shadow-xs transition-all hover:border-[#4F46E5]/50 hover:bg-indigo-50/40 disabled:opacity-60"
            >
              {isSigningIn ? (
                <Loader2
                  className="h-4 w-4 animate-spin text-[#4F46E5]"
                  aria-hidden="true"
                />
              ) : (
                <FcGoogle className="h-5 w-5" aria-hidden="true" />
              )}
              <span>Continue with Google (Aarav Patel)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer rounded-full border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-[#4F46E5] transition-colors hover:bg-indigo-100"
            >
              Other Google Account
            </button>

            <Link
              href={`/login?redirect=${encodeURIComponent(callbackPath)}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#4338CA]"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              <span>Sign in with Email</span>
            </Link>
          </div>
        </div>
      </div>

      <GoogleLoginModal
        key={`order-gate-${isModalOpen ? "open" : "closed"}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedProduct={null}
        actionIntent="add"
        callbackUrl={callbackPath}
        onSuccess={() => router.refresh()}
      />
    </main>
  );
}

