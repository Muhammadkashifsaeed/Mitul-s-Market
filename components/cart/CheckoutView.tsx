"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  LogIn,
  MapPin,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { GoogleLoginModal } from "@/components/GoogleLoginModal";
import { EmptyCartState } from "@/components/cart/EmptyCartState";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { apiClient, normalizeApiError } from "@/lib/axios";
import { checkoutSchema } from "@/lib/validations";
import type {
  ApiResponse,
  CheckoutFormValues,
  Order,
  PaymentMethod,
} from "@/types";
import { formatCurrency } from "@/utils/format";

const ALL_PAYMENT_OPTIONS: readonly {
  method: PaymentMethod;
  subtitle: string;
}[] = [
  { method: "UPI", subtitle: "Instant UPI apps & QR payment" },
  {
    method: "Credit Card",
    subtitle: "Visa, Mastercard & RuPay credit cards",
  },
  { method: "Debit Card", subtitle: "Major bank debit cards" },
  {
    method: "Cash on Delivery",
    subtitle: "Pay via cash or UPI upon delivery",
  },
];

export function CheckoutView() {
  const router = useRouter();
  const { rawItems, items, totalItems, summary, hasOutOfStockItems, clearCart } =
    useCart();
  const { authenticated, user, capabilities, signInGoogleDemo } = useAuth();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("UPI");
  const [upiHandle, setUpiHandle] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isQuickSigningIn, setIsQuickSigningIn] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const configuredMethods =
    capabilities.configuredPaymentMethods.length > 0
      ? capabilities.configuredPaymentMethods
      : (["UPI", "Credit Card", "Debit Card", "Cash on Delivery"] as const);

  const activePaymentMethod = configuredMethods.includes(selectedPaymentMethod)
    ? selectedPaymentMethod
    : configuredMethods[0];

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      deliveryNotes: "",
    },
  });

  useEffect(() => {
    if (!authenticated || !user) return;
    if (!getValues("fullName") && user.name) {
      setValue("fullName", user.name);
    }
    if (!getValues("email") && user.email) {
      setValue("email", user.email);
    }
  }, [authenticated, user, getValues, setValue]);

  async function handleQuickGoogleSignIn() {
    setServerError(null);
    setIsQuickSigningIn(true);
    const result = await signInGoogleDemo({ preset: "aarav" });
    setIsQuickSigningIn(false);
    if (!result.ok) {
      setServerError(result.message);
      return;
    }
    router.refresh();
  }

  async function onSubmit(values: CheckoutFormValues) {
    setServerError(null);

    if (!authenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (rawItems.length === 0 || hasOutOfStockItems) {
      setServerError(
        "Please ensure all cart items are available before placing your order."
      );
      return;
    }

    try {
      const response = await apiClient.post<ApiResponse<Order>>("/orders", {
        ...values,
        paymentMethod: activePaymentMethod,
        couponCode: summary.appliedCoupon?.code,
        items: rawItems,
      });

      if (response.data.success && response.data.data?.id) {
        const orderId = response.data.data.id;
        setPlacedOrderId(orderId);
        clearCart();
        router.push(`/orders/${encodeURIComponent(orderId)}?placed=1`);
        router.refresh();
        return;
      }

      setServerError("Unable to confirm order right now. Please try again.");
    } catch (error) {
      setServerError(normalizeApiError(error).message);
    }
  }

  return (
    <main className="w-full flex-1 bg-[#F8FAFC]">
      <section
        aria-labelledby="checkout-page-heading"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
      >
        {/* Top Back Link */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4F46E5] transition-colors hover:text-[#4338CA]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Shopping Cart</span>
        </Link>

        {/* Page Header */}
        <header className="mt-4">
          <h1
            id="checkout-page-heading"
            className="text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl lg:text-[42px] lg:leading-tight"
          >
            Checkout
          </h1>
          <p className="mt-2 text-base text-[#64748B] sm:text-lg">
            Complete your customer information, shipping address, and payment
            method.
          </p>
        </header>

        {placedOrderId ? (
          <div className="mt-8 rounded-[28px] border border-emerald-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-[#1E293B]">
              Order {placedOrderId} Confirmed!
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
              Redirecting to your order tracking and invoice page...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-8">
            <EmptyCartState />
          </div>
        ) : (
          <>
            {/* Express Account Sign-In Card when Guest */}
            {!authenticated && (
              <div
                role="region"
                aria-label="Express checkout sign in"
                className="mt-6 flex flex-col gap-4 rounded-2xl border border-indigo-200/80 bg-white px-5 py-4 shadow-xs lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-[#1E293B]">
                    Sign in to place your order
                  </p>
                  <p className="mt-0.5 text-xs text-[#64748B] sm:text-sm">
                    Use 1-click Google Sign-In or your email account to track
                    this order under My Orders. Your cart items stay saved.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    disabled={isQuickSigningIn}
                    onClick={handleQuickGoogleSignIn}
                    className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-[#1E293B] shadow-xs transition-colors hover:border-[#4F46E5]/50 hover:bg-indigo-50/50 disabled:opacity-60"
                  >
                    {isQuickSigningIn ? (
                      <Loader2
                        className="h-3.5 w-3.5 animate-spin text-[#4F46E5]"
                        aria-hidden="true"
                      />
                    ) : (
                      <FcGoogle className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span>Continue as Aarav Patel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(true)}
                    className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold text-[#4F46E5] transition-colors hover:bg-indigo-100"
                  >
                    <span>Choose Google Account</span>
                  </button>

                  <Link
                    href="/login?redirect=%2Fcheckout"
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#4F46E5] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#4338CA]"
                  >
                    <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Sign in with Email</span>
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_390px] xl:grid-cols-[1fr_420px]">
              {/* Customer Info + Shipping Address + Payment Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-6"
              >
                {/* Customer Information Card */}
                <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-7">
                  <div className="flex items-center justify-between gap-2.5 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                        <UserCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h2 className="text-lg font-bold text-[#1E293B] sm:text-xl">
                          Customer Information
                        </h2>
                        <p className="text-xs text-[#64748B]">
                          Used for delivery updates and order receipts
                        </p>
                      </div>
                    </div>

                    {authenticated && user && (
                      <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">
                        Signed in as {user.name}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Input
                        label="Full Name"
                        placeholder="e.g., Aarav Patel"
                        autoComplete="name"
                        error={errors.fullName?.message}
                        {...register("fullName")}
                      />
                    </div>

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="aarav@example.com"
                      autoComplete="email"
                      error={errors.email?.message}
                      {...register("email")}
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      error={errors.phone?.message}
                      {...register("phone")}
                    />
                  </div>
                </div>

                {/* Shipping Address Card */}
                <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-7">
                  <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                      <MapPin className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-[#1E293B] sm:text-xl">
                        Shipping Address
                      </h2>
                      <p className="text-xs text-[#64748B]">
                        Where should we deliver your order?
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Input
                        label="Street Address"
                        placeholder="House / Flat No., Building, Street"
                        autoComplete="street-address"
                        error={errors.street?.message}
                        {...register("street")}
                      />
                    </div>

                    <Input
                      label="City"
                      placeholder="e.g., Ahmedabad"
                      autoComplete="address-level2"
                      error={errors.city?.message}
                      {...register("city")}
                    />

                    <Input
                      label="State / Province"
                      placeholder="e.g., Gujarat"
                      autoComplete="address-level1"
                      error={errors.state?.message}
                      {...register("state")}
                    />

                    <Input
                      label="Postal Code"
                      placeholder="e.g., 380001"
                      autoComplete="postal-code"
                      error={errors.postalCode?.message}
                      {...register("postalCode")}
                    />

                    <Input
                      label="Country"
                      placeholder="e.g., India"
                      autoComplete="country-name"
                      error={errors.country?.message}
                      {...register("country")}
                    />

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="deliveryNotes"
                        className="block text-sm font-semibold text-[#1E293B]"
                      >
                        Delivery Instructions{" "}
                        <span className="font-normal text-[#64748B]">
                          (Optional)
                        </span>
                      </label>
                      <textarea
                        id="deliveryNotes"
                        rows={2}
                        placeholder="Landmark, gate code, preferred delivery hours..."
                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-[#1E293B] placeholder:text-gray-400 transition-colors focus-visible:border-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/25"
                        {...register("deliveryNotes")}
                      />
                      {errors.deliveryNotes?.message && (
                        <p className="mt-1 text-xs font-medium text-rose-600">
                          {errors.deliveryNotes.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Method Card */}
                <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs sm:p-7">
                  <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                        <CreditCard className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h2 className="text-lg font-bold text-[#1E293B] sm:text-xl">
                          Payment Method
                        </h2>
                        <p className="text-xs text-[#64748B]">
                          Select your preferred checkout payment option
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-[#475569]">
                      <ShieldCheck
                        className="h-3.5 w-3.5 text-[#4F46E5]"
                        aria-hidden="true"
                      />
                      <span>Encrypted</span>
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {ALL_PAYMENT_OPTIONS.map(({ method, subtitle }) => {
                      const isSelected = activePaymentMethod === method;
                      return (
                        <button
                          key={method}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setSelectedPaymentMethod(method)}
                          className={`flex cursor-pointer flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                            isSelected
                              ? "border-[#4F46E5] bg-indigo-50/70 ring-2 ring-[#4F46E5]/20"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex w-full items-center justify-between gap-2">
                            <span className="text-sm font-bold text-[#1E293B]">
                              {method}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                isSelected
                                  ? "bg-[#4F46E5] text-white"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {isSelected ? "Selected" : "Available"}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#64748B]">
                            {subtitle}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {activePaymentMethod === "UPI" && (
                    <div className="mt-4 rounded-2xl border border-indigo-100 bg-[#F8FAFC] p-3.5">
                      <label
                        htmlFor="checkout-upi-id"
                        className="block text-xs font-semibold text-[#1E293B]"
                      >
                        UPI ID / VPA{" "}
                        <span className="font-normal text-[#64748B]">
                          (Optional for Express Approval)
                        </span>
                      </label>
                      <input
                        id="checkout-upi-id"
                        type="text"
                        value={upiHandle}
                        onChange={(event) => setUpiHandle(event.target.value)}
                        placeholder="e.g., aarav@okaxis"
                        className="mt-1.5 h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-[#1E293B] placeholder:text-gray-400 focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                      />
                    </div>
                  )}

                  {/* Submit Action */}
                  <div className="mt-6 border-t border-gray-100 pt-5">
                    <button
                      type="submit"
                      disabled={hasOutOfStockItems || isSubmitting}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3.5 text-base font-bold text-white shadow-md shadow-[#4F46E5]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/50 focus-visible:ring-offset-2 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2
                            className="h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                          <span>Placing Order...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" aria-hidden="true" />
                          <span>
                            {authenticated
                              ? `Place Order (${formatCurrency(summary.total)})`
                              : `Sign in & Place Order (${formatCurrency(summary.total)})`}
                          </span>
                        </>
                      )}
                    </button>

                    {serverError && (
                      <div
                        role="alert"
                        className="mt-4 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs leading-relaxed text-rose-900"
                      >
                        <AlertCircle
                          className="mt-0.5 h-4 w-4 shrink-0 text-rose-600"
                          aria-hidden="true"
                        />
                        <span>{serverError}</span>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              {/* Right Column: Live Order Summary */}
              <aside
                aria-labelledby="checkout-summary-heading"
                className="h-fit rounded-[28px] border border-gray-200/80 bg-white p-6 shadow-sm sm:p-7 lg:sticky lg:top-28"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2
                    id="checkout-summary-heading"
                    className="text-xl font-bold text-[#1E293B]"
                  >
                    Order Summary
                  </h2>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-[#4F46E5]">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Line Items */}
                <ul className="mt-5 divide-y divide-gray-100">
                  {items.map((item) => (
                    <li
                      key={item.product.id}
                      className="flex items-center gap-3 py-3 first:pt-0"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#1E293B]">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-[#64748B]">
                          Qty {item.quantity} &times;{" "}
                          {formatCurrency(item.product.price)}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-[#1E293B]">
                        {formatCurrency(item.lineTotal)}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Pricing Totals */}
                <dl className="mt-4 space-y-2.5 border-t border-gray-100 pt-4 text-sm">
                  <div className="flex items-center justify-between text-[#475569]">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold text-[#1E293B]">
                      {formatCurrency(summary.subtotal)}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between text-[#475569]">
                    <dt>Shipping Charges</dt>
                    <dd
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

                  <div className="flex items-center justify-between text-[#475569]">
                    <dt>
                      Discount
                      {summary.appliedCoupon
                        ? ` (${summary.appliedCoupon.code})`
                        : ""}
                    </dt>
                    <dd
                      className={`font-semibold ${
                        summary.discount > 0
                          ? "text-emerald-600"
                          : "text-[#1E293B]"
                      }`}
                    >
                      {summary.discount > 0
                        ? `-${formatCurrency(summary.discount)}`
                        : formatCurrency(0)}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between text-[#475569]">
                    <dt>Estimated Tax</dt>
                    <dd className="font-semibold text-[#1E293B]">
                      {summary.taxAmount > 0
                        ? formatCurrency(summary.taxAmount)
                        : "₹0 (Included)"}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base">
                    <dt className="font-bold text-[#1E293B]">Total Amount</dt>
                    <dd className="text-xl font-bold text-[#4F46E5]">
                      {formatCurrency(summary.total)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5">
                  <Link
                    href="/cart"
                    className="flex w-full items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-[#1E293B] transition-colors hover:bg-gray-50"
                  >
                    Edit Cart / Apply Promo Code
                  </Link>
                </div>
              </aside>
            </div>
          </>
        )}
      </section>

      <GoogleLoginModal
        key={`checkout-auth-${isLoginModalOpen ? "open" : "closed"}`}
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        selectedProduct={null}
        actionIntent="add"
        callbackUrl="/checkout"
        title="Sign in to complete checkout"
        description="Sign in with your Google account or Mitul's Market email to link this order to your profile. Your cart stays saved."
        cartSummary={{
          itemCount: totalItems,
          total: summary.total,
        }}
      />
    </main>
  );
}

export default CheckoutView;
