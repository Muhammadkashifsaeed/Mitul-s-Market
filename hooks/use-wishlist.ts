"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  ensureWishlistLoaded,
  getWishlistServerSnapshot,
  getWishlistSnapshot,
  refreshWishlistState,
  subscribeWishlist,
  toggleWishlistProduct,
} from "@/lib/auth-client";

export function useWishlist() {
  const snapshot = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    getWishlistServerSnapshot
  );

  useEffect(() => {
    ensureWishlistLoaded();
  }, []);

  const wishlistedSet = useMemo(
    () => new Set(snapshot.productIds),
    [snapshot.productIds]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlistedSet.has(productId),
    [wishlistedSet]
  );

  const toggleWishlist = useCallback((productId: string) => {
    return toggleWishlistProduct(productId);
  }, []);

  const refresh = useCallback(() => {
    return refreshWishlistState();
  }, []);

  return {
    productIds: snapshot.productIds,
    count: snapshot.productIds.length,
    isLoading: snapshot.isLoading,
    isWishlisted,
    toggleWishlist,
    refresh,
  };
}

