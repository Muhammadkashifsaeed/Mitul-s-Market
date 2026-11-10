"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, ShoppingBag, X } from "lucide-react";
import { GoogleLoginModal } from "@/components/GoogleLoginModal";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartOrderSummary } from "@/components/cart/CartOrderSummary";
import { EmptyCartState } from "@/components/cart/EmptyCartState";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import type { Product, ResolvedCartItem } from "@/types";

export function CartView() {
  const router = useRouter();
  const { authenticated } = useAuth();
  const {
    items,
    totalItems,
    summary,
    hasOutOfStockItems,
    addToCart,
    updateQuantity,
    removeItem,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [lastRemoved, setLastRemoved] = useState<{
    product: Product;
    quantity: number;
  } | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  function handleRemoveItem(item: ResolvedCartItem) {
    removeItem(item.product.id);
    setLastRemoved({
      product: item.product,
      quantity: item.quantity,
    });
  }

  function handleUndoRemove() {
    if (!lastRemoved) return;
    addToCart(lastRemoved.product, lastRemoved.quantity);
    setLastRemoved(null);
  }

  function handleProceedToCheckout() {
    if (items.length === 0 || hasOutOfStockItems) {
      return;
    }

    if (authenticated) {
      router.push("/checkout");
      return;
    }

    // Require authentication before entering checkout; cart items remain
    // safely persisted in browser storage during sign-in.
    setIsLoginModalOpen(true);
  }

  return (
    <main className="w-full flex-1 bg-[#F8FAFC]">
      <section
        aria-labelledby="cart-page-heading"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
      >
        {/* Shopping Cart Page Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              id="cart-page-heading"
              className="text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl lg:text-[42px] lg:leading-tight"
            >
              Shopping Cart
            </h1>
            <p className="mt-2 text-base text-[#64748B] sm:text-lg">
              Review your selected products and proceed to checkout.
            </p>
          </div>

          <div
            data-testid="cart-item-count-pill"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-[#1E293B] shadow-xs"
          >
            <ShoppingBag
              className="h-4 w-4 text-[#4F46E5]"
              aria-hidden="true"
            />
            <span>
              {totalItems} {totalItems === 1 ? "item" : "items"} in cart
            </span>
          </div>
        </header>

        {/* Undo Feedback Banner after Removal */}
        {lastRemoved && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm text-[#1E293B] shadow-xs"
          >
            <p>
              Removed{" "}
              <span className="font-bold">{lastRemoved.product.name}</span> from
              your shopping cart.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUndoRemove}
                className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-[#4F46E5] transition-colors hover:bg-indigo-100"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Undo</span>
              </button>
              <button
                type="button"
                onClick={() => setLastRemoved(null)}
                aria-label="Dismiss message"
                className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* Cart Content or Empty State */}
        {items.length === 0 ? (
          <div className="mt-8">
            <EmptyCartState />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_410px]">
            {/* Cart Products List */}
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={handleRemoveItem}
                />
              ))}
            </div>

            {/* Order Summary Card */}
            <div>
              <CartOrderSummary
                summary={summary}
                isAuthenticated={authenticated}
                hasOutOfStockItems={hasOutOfStockItems}
                onApplyPromoCode={applyPromoCode}
                onRemovePromoCode={removePromoCode}
                onProceedToCheckout={handleProceedToCheckout}
              />
            </div>
          </div>
        )}
      </section>

      <GoogleLoginModal
        key={`cart-checkout-auth-${isLoginModalOpen ? "open" : "closed"}`}
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        selectedProduct={null}
        actionIntent="add"
        callbackUrl="/checkout"
        title="Sign in to checkout"
        description="Sign in with Google or email to proceed to checkout. Your shopping cart stays safely saved."
        cartSummary={{
          itemCount: totalItems,
          total: summary.total,
        }}
      />
    </main>
  );
}

export default CartView;
