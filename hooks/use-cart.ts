"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  addItemToCart,
  clearCart as clearStoredCart,
  computeCartPricing,
  dismissCartNotification,
  getCartCouponServerSnapshot,
  getCartCouponSnapshot,
  getCartNotificationServerSnapshot,
  getCartNotificationSnapshot,
  getCartServerSnapshot,
  getCartSnapshot,
  parseCartSnapshot,
  removeCartItem,
  resolveCartItems,
  subscribeCart,
  subscribeCartCoupon,
  subscribeCartNotification,
  updateCartItemQuantity,
  validatePromoCode,
  writeCartCouponCode,
} from "@/lib/cart";
import type { CouponValidationResult, Product } from "@/types";

export function useCart() {
  const rawCart = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot
  );

  const appliedCouponCode = useSyncExternalStore(
    subscribeCartCoupon,
    getCartCouponSnapshot,
    getCartCouponServerSnapshot
  );

  const rawItems = useMemo(() => parseCartSnapshot(rawCart), [rawCart]);
  const items = useMemo(() => resolveCartItems(rawItems), [rawItems]);

  const summary = useMemo(
    () => computeCartPricing(items, appliedCouponCode),
    [items, appliedCouponCode]
  );

  const quantityById = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      map.set(item.product.id, item.quantity);
    }
    return map;
  }, [items]);

  const addToCart = useCallback(
    (productOrId: Product | string, quantity = 1) => {
      const productId =
        typeof productOrId === "string" ? productOrId : productOrId.id;
      return addItemToCart(productId, quantity);
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, nextQuantity: number) => {
      return updateCartItemQuantity(productId, nextQuantity);
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    removeCartItem(productId);
  }, []);

  const clearCart = useCallback(() => {
    clearStoredCart();
  }, []);

  const applyPromoCode = useCallback(
    (rawCode: string): CouponValidationResult => {
      const result = validatePromoCode(rawCode, summary.subtotal);
      if (result.valid && result.coupon) {
        writeCartCouponCode(result.coupon.code);
      }
      return result;
    },
    [summary.subtotal]
  );

  const removePromoCode = useCallback(() => {
    writeCartCouponCode("");
  }, []);

  const getItemQuantity = useCallback(
    (productId: string) => quantityById.get(productId) ?? 0,
    [quantityById]
  );

  const hasOutOfStockItems = useMemo(
    () => items.some((item) => !item.inStock),
    [items]
  );

  return {
    rawItems,
    items,
    totalItems: summary.totalItems,
    uniqueItems: summary.uniqueItems,
    summary,
    appliedCouponCode,
    hasOutOfStockItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromoCode,
    removePromoCode,
    getItemQuantity,
  };
}

export function useCartNotification() {
  const notification = useSyncExternalStore(
    subscribeCartNotification,
    getCartNotificationSnapshot,
    getCartNotificationServerSnapshot
  );

  const dismiss = useCallback(() => {
    dismissCartNotification();
  }, []);

  return {
    notification,
    dismiss,
  };
}

