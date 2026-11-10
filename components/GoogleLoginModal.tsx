"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertCircle,
  ChevronDown,
  Loader2,
  Mail,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/hooks/use-auth";
import {
  GOOGLE_DEMO_ACCOUNTS,
  clearPendingProductAction,
  ensureProductWishlisted,
  savePendingProductAction,
} from "@/lib/auth-client";
import { addItemToCart, emitCartNotification } from "@/lib/cart";
import type { Product, ProductActionIntent } from "@/types";
import { formatCurrency } from "@/utils/format";

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: Product | null;
  actionIntent: ProductActionIntent;
  callbackUrl?: string;
  onSuccess?: () => void;
  title?: string;
  description?: string;
  cartSummary?: {
    itemCount: number;
    total: number;
  } | null;
}

export function GoogleLoginModal({
  isOpen,
  onClose,
  selectedProduct,
  actionIntent,
  callbackUrl,
  onSuccess,
  title = "Sign in to continue",
  description = "Sign in with Google or your Mitul's Market email account to continue.",
  cartSummary = null,
}: GoogleLoginModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { capabilities, signInGoogleDemo } = useAuth();

  const [pendingAccountKey, setPendingAccountKey] = useState<string | null>(
    null
  );
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isGoogleOAuthConfigured = Boolean(
    capabilities.googleOAuthConfigured || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  );

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !pendingAccountKey) {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, pendingAccountKey]);

  if (!isOpen) {
    return null;
  }

  const targetCallback = callbackUrl ?? pathname ?? "/";
  const redirectQuery =
    targetCallback && targetCallback !== "/"
      ? `?redirect=${encodeURIComponent(targetCallback)}`
      : "";

  function persistPendingAction() {
    if (selectedProduct) {
      savePendingProductAction({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        price: selectedProduct.price,
        intent: actionIntent,
      });
    }
  }

  async function finishAuthenticatedFlow() {
    if (selectedProduct) {
      if (actionIntent === "wishlist") {
        const wished = await ensureProductWishlisted(selectedProduct.id);
        if (wished.ok) {
          emitCartNotification({
            type: "success",
            title: "Saved to Wishlist",
            message: `${selectedProduct.name} was saved to your wishlist.`,
            productId: selectedProduct.id,
            productImage: selectedProduct.image,
          });
        }
      } else {
        addItemToCart(selectedProduct.id, 1);
      }
    }

    clearPendingProductAction();
    onSuccess?.();
    onClose();

    if (callbackUrl && callbackUrl !== pathname) {
      router.push(callbackUrl);
    }
    router.refresh();
  }

  function handleRealGoogleOAuth() {
    persistPendingAction();
    router.push(
      `/api/auth/signin/google?callbackUrl=${encodeURIComponent(targetCallback)}`
    );
  }

  async function handleGoogleDemoPreset(preset: "aarav" | "priya") {
    setErrorMessage(null);
    setPendingAccountKey(preset);
    const result = await signInGoogleDemo({ preset });
    if (!result.ok) {
      setPendingAccountKey(null);
      setErrorMessage(result.message);
      return;
    }
    await finishAuthenticatedFlow();
    setPendingAccountKey(null);
  }

  async function handleCustomGoogleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    const trimmedEmail = customEmail.trim();
    const trimmedName = customName.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMessage("Please enter a valid Google email address.");
      return;
    }

    setPendingAccountKey("custom");
    const result = await signInGoogleDemo({
      email: trimmedEmail,
      name: trimmedName.length >= 2 ? trimmedName : undefined,
    });
    if (!result.ok) {
      setPendingAccountKey(null);
      setErrorMessage(result.message);
      return;
    }
    await finishAuthenticatedFlow();
    setPendingAccountKey(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={() => {
        if (!pendingAccountKey) onClose();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="google-login-heading"
        aria-describedby="google-login-description"
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={Boolean(pendingAccountKey)}
          aria-label="Close sign in modal"
          className="absolute right-4 top-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 disabled:opacity-40"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Google Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 shadow-xs">
          <FcGoogle className="h-8 w-8" aria-hidden="true" />
        </div>

        {/* Heading & Description */}
        <div className="text-center">
          <h3
            id="google-login-heading"
            className="text-2xl font-bold tracking-tight text-[#1E293B]"
          >
            {title}
          </h3>
          <p
            id="google-login-description"
            className="mt-2 text-sm leading-relaxed text-[#64748B]"
          >
            {description}
          </p>
        </div>

        {/* Preserved Selected Product Context */}
        {selectedProduct && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#1E293B]">
                {selectedProduct.name}
              </p>
              <p className="text-xs text-[#64748B]">
                {actionIntent === "wishlist"
                  ? "Save to wishlist"
                  : "Continue with product"}{" "}
                &bull;{" "}
                <span className="font-semibold text-[#4F46E5]">
                  {formatCurrency(selectedProduct.price)}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Preserved Shopping Cart Context */}
        {!selectedProduct && cartSummary && cartSummary.itemCount > 0 && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#4F46E5] shadow-xs">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#1E293B]">
                Cart items saved for checkout
              </p>
              <p className="text-xs text-[#64748B]">
                {cartSummary.itemCount}{" "}
                {cartSummary.itemCount === 1 ? "item" : "items"} &bull;{" "}
                <span className="font-semibold text-[#4F46E5]">
                  {formatCurrency(cartSummary.total)}
                </span>
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-left text-xs text-rose-900"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-rose-600"
              aria-hidden="true"
            />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Sign-In Controls */}
        {isGoogleOAuthConfigured ? (
          <button
            type="button"
            onClick={handleRealGoogleOAuth}
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-[#1E293B] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 active:translate-y-0"
          >
            <FcGoogle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>Continue with Google</span>
          </button>
        ) : (
          <div className="mt-6 space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Quick Google Sign-In</span>
              </span>
              <span className="text-[11px] font-medium text-[#64748B]">
                1-click access
              </span>
            </div>

            {GOOGLE_DEMO_ACCOUNTS.map((account) => {
              const isLoadingThis = pendingAccountKey === account.preset;
              const initial = account.name.charAt(0).toUpperCase();
              return (
                <button
                  key={account.preset}
                  type="button"
                  disabled={Boolean(pendingAccountKey)}
                  onClick={() => handleGoogleDemoPreset(account.preset)}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4F46E5]/50 hover:bg-indigo-50/40 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-sm font-bold text-white">
                      {initial}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#1E293B]">
                        {account.name}
                      </p>
                      <p className="truncate text-xs text-[#64748B]">
                        {account.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#4F46E5] min-[400px]:inline-flex">
                      {account.badge}
                    </span>
                    {isLoadingThis ? (
                      <Loader2
                        className="h-5 w-5 animate-spin text-[#4F46E5]"
                        aria-hidden="true"
                      />
                    ) : (
                      <FcGoogle
                        className="h-5 w-5 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Optional Custom Google Email */}
            <div className="pt-0.5">
              <button
                type="button"
                disabled={Boolean(pendingAccountKey)}
                onClick={() => setShowCustomForm((prev) => !prev)}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-semibold text-[#64748B] transition-colors hover:text-[#4F46E5]"
              >
                <span>Use another Google email</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    showCustomForm ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {showCustomForm && (
                <form
                  onSubmit={handleCustomGoogleSubmit}
                  className="mt-2 space-y-2.5 rounded-2xl border border-gray-200 bg-[#F8FAFC] p-3.5"
                >
                  <input
                    type="text"
                    value={customName}
                    onChange={(event) => setCustomName(event.target.value)}
                    placeholder="Full name (e.g., Rohan Mehta)"
                    aria-label="Google account full name"
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-[#1E293B] placeholder:text-gray-400 focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                  />
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(event) => setCustomEmail(event.target.value)}
                    placeholder="you@gmail.com"
                    aria-label="Google account email"
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-[#1E293B] placeholder:text-gray-400 focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                  />
                  <button
                    type="submit"
                    disabled={Boolean(pendingAccountKey)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-[#1E293B] shadow-xs transition-colors hover:bg-gray-50 disabled:opacity-60"
                  >
                    {pendingAccountKey === "custom" ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin text-[#4F46E5]"
                          aria-hidden="true"
                        />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <FcGoogle className="h-4 w-4" aria-hidden="true" />
                        <span>Continue with this Google Account</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Email Sign In & Create Account Actions */}
        <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4">
          <Link
            href={`/login${redirectQuery}`}
            onClick={() => {
              persistPendingAction();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#4338CA]"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span>Sign in with Email</span>
          </Link>

          <p className="pt-1 text-center text-xs text-[#64748B]">
            New customer?{" "}
            <Link
              href={`/signup${redirectQuery}`}
              onClick={() => {
                persistPendingAction();
                onClose();
              }}
              className="font-bold text-[#4F46E5] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default GoogleLoginModal;
