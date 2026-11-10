"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Lock, LogIn } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { GoogleLoginModal } from "@/components/GoogleLoginModal";
import { EmptyOrdersState } from "@/components/orders/EmptyOrdersState";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrderSummaryCards } from "@/components/orders/OrderSummaryCards";
import { useAuth } from "@/hooks/use-auth";
import {
  computeOrderSummary,
  fetchCustomerOrdersState,
  filterAndSortOrders,
  filterOrdersForCustomer,
} from "@/lib/orders";
import type {
  Order,
  OrderDateRange,
  OrderFilterStatus,
  OrderSortOrder,
} from "@/types";

interface OrdersDashboardProps {
  initialAuthenticated?: boolean;
  initialCustomerId?: string;
  initialOrders?: readonly Order[];
}

export function OrdersDashboard({
  initialAuthenticated = false,
  initialCustomerId = "",
  initialOrders = [],
}: OrdersDashboardProps) {
  const {
    authenticated: authAuthenticated,
    user: authUser,
    isLoading: authLoading,
    signInGoogleDemo,
  } = useAuth();

  const [orders, setOrders] = useState<Order[]>(() =>
    initialAuthenticated
      ? filterOrdersForCustomer(initialOrders, initialCustomerId)
      : []
  );
  const [loadedForCustomerId, setLoadedForCustomerId] = useState<string | null>(
    initialAuthenticated ? initialCustomerId : null
  );
  const [referenceTimestampMs, setReferenceTimestampMs] = useState<number>();
  const [isQuickSigningIn, setIsQuickSigningIn] = useState(false);

  const [activeStatus, setActiveStatus] =
    useState<OrderFilterStatus>("All Orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<OrderDateRange>("all");
  const [sortBy, setSortBy] = useState<OrderSortOrder>("newest");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const effectiveAuthenticated = authLoading
    ? initialAuthenticated
    : authAuthenticated;
  const effectiveCustomerId = authLoading
    ? initialCustomerId
    : (authUser?.id ?? "");

  const isFetchingOrders =
    effectiveAuthenticated &&
    Boolean(effectiveCustomerId) &&
    loadedForCustomerId !== effectiveCustomerId;

  const refreshOrdersFromServer = useCallback(async () => {
    const apiState = await fetchCustomerOrdersState();
    setReferenceTimestampMs(Date.now());
    if (apiState.authenticated && apiState.customerId) {
      setOrders(filterOrdersForCustomer(apiState.orders, apiState.customerId));
      setLoadedForCustomerId(apiState.customerId);
    } else {
      setOrders([]);
      setLoadedForCustomerId(null);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !authAuthenticated || !authUser?.id) return;

    let cancelled = false;
    fetchCustomerOrdersState()
      .then((apiState) => {
        if (cancelled) return;
        setReferenceTimestampMs(Date.now());
        if (apiState.authenticated && apiState.customerId) {
          setOrders(
            filterOrdersForCustomer(apiState.orders, apiState.customerId)
          );
          setLoadedForCustomerId(apiState.customerId);
        } else {
          setOrders([]);
          setLoadedForCustomerId(null);
        }
      })
      .catch(() => {
        // Preserve existing orders on transient network issues.
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, authAuthenticated, authUser?.id]);

  async function handleQuickGoogleSignIn() {
    setIsQuickSigningIn(true);
    try {
      const result = await signInGoogleDemo({ preset: "aarav" });
      if (result.ok) {
        await refreshOrdersFromServer();
      }
    } finally {
      setIsQuickSigningIn(false);
    }
  }

  const scopedOrders = effectiveAuthenticated
    ? filterOrdersForCustomer(orders, effectiveCustomerId)
    : [];
  const summaryCounts = computeOrderSummary(scopedOrders);

  const filteredOrders = filterAndSortOrders(scopedOrders, {
    status: activeStatus,
    searchQuery,
    dateRange,
    sortBy,
    referenceTimestampMs,
  });

  function handleDateRangeChange(range: OrderDateRange) {
    setReferenceTimestampMs(Date.now());
    setDateRange(range);
  }

  function handleResetFilters() {
    setActiveStatus("All Orders");
    setSearchQuery("");
    setDateRange("all");
    setSortBy("newest");
  }

  const hasActiveFilter =
    activeStatus !== "All Orders" ||
    searchQuery.trim().length > 0 ||
    dateRange !== "all";

  return (
    <main className="w-full flex-1 bg-[#F8FAFC]">
      <section
        aria-labelledby="orders-page-heading"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
      >
        {/* 1. Orders Page Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              id="orders-page-heading"
              className="text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl lg:text-[42px] lg:leading-tight"
            >
              My Orders
            </h1>
            <p className="mt-2 text-base text-[#64748B] sm:text-lg">
              Track and manage all your purchases in one place.
            </p>
          </div>

          {effectiveAuthenticated && authUser && (
            <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-semibold text-[#1E293B] shadow-xs">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4F46E5] text-[11px] font-bold text-white">
                {authUser.name.charAt(0).toUpperCase()}
              </span>
              <span>{authUser.name}</span>
              <span className="text-[#64748B]">&bull; {authUser.email}</span>
            </div>
          )}
        </header>

        {/* Signed-out Customer Access Gate */}
        {!effectiveAuthenticated ? (
          <div className="mt-8 rounded-[28px] border border-gray-200/80 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
              <Lock className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-[#1E293B]">
              Sign in to view your orders
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
              Access your order history, shipment tracking timelines, and
              downloadable invoices using 1-click Google Sign-In or your email
              account.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={isQuickSigningIn}
                onClick={handleQuickGoogleSignIn}
                className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-[#1E293B] shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#4F46E5]/50 hover:bg-indigo-50/40 hover:shadow-md disabled:opacity-60"
              >
                {isQuickSigningIn ? (
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
                onClick={() => setIsLoginModalOpen(true)}
                className="cursor-pointer rounded-full border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-[#4F46E5] transition-colors hover:bg-indigo-100"
              >
                Other Google Account
              </button>

              <Link
                href="/login?redirect=%2Forders"
                className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#4338CA]"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                <span>Sign in with Email</span>
              </Link>
            </div>

            <p className="mt-5 text-xs text-[#64748B]">
              New customer?{" "}
              <Link
                href="/signup?redirect=%2Forders"
                className="font-bold text-[#4F46E5] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        ) : (
          <>
            {/* 2. Summary Cards */}
            <div className="mt-8">
              <OrderSummaryCards counts={summaryCounts} />
            </div>

            {/* 3. Order Filters & Orders List OR Empty Orders State */}
            {isFetchingOrders && scopedOrders.length === 0 ? (
              <div className="mt-8 flex items-center justify-center gap-3 rounded-[28px] border border-gray-200/80 bg-white px-6 py-16 text-sm font-medium text-[#64748B] shadow-xs">
                <Loader2
                  className="h-5 w-5 animate-spin text-[#4F46E5]"
                  aria-hidden="true"
                />
                <span>Loading your orders...</span>
              </div>
            ) : scopedOrders.length === 0 ? (
              <div className="mt-8">
                <EmptyOrdersState />
              </div>
            ) : (
              <>
                <div className="mt-8">
                  <OrderFilters
                    activeStatus={activeStatus}
                    onStatusChange={setActiveStatus}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    dateRange={dateRange}
                    onDateRangeChange={handleDateRangeChange}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                  />
                </div>

                <div className="mt-5 flex items-center justify-between text-sm font-medium text-[#64748B]">
                  <p aria-live="polite">
                    Showing {filteredOrders.length}{" "}
                    {filteredOrders.length === 1 ? "order" : "orders"}
                  </p>
                  {hasActiveFilter && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="cursor-pointer font-semibold text-[#4F46E5] hover:underline"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>

                {filteredOrders.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {filteredOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-[24px] border border-gray-200/80 bg-white px-6 py-14 text-center shadow-xs">
                    <h2 className="text-lg font-bold text-[#1E293B]">
                      No matching orders found
                    </h2>
                    <p className="mt-1.5 text-sm text-[#64748B]">
                      Try adjusting your status tab, search query, or date
                      range.
                    </p>
                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="cursor-pointer rounded-full bg-[#4F46E5] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4338CA]"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>

      <GoogleLoginModal
        key={`orders-auth-${isLoginModalOpen ? "open" : "closed"}`}
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        selectedProduct={null}
        actionIntent="add"
        callbackUrl="/orders"
        onSuccess={() => {
          void refreshOrdersFromServer();
        }}
      />
    </main>
  );
}

export default OrdersDashboard;
