"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GoogleLoginModal } from "@/components/GoogleLoginModal";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { emitCartNotification } from "@/lib/cart";
import { featuredProducts } from "@/lib/products";
import type { Product, ProductActionIntent } from "@/types";

export function FeaturedProducts() {
  const { addToCart, getItemQuantity } = useCart();
  const { authenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [authModalProduct, setAuthModalProduct] = useState<Product | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  async function handleProductAction(
    product: Product,
    intent: ProductActionIntent
  ) {
    if (intent === "wishlist") {
      await handleWishlistClick(product);
      return;
    }

    const result = addToCart(product, 1);
    if (result.added) {
      setRecentlyAddedId(product.id);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setRecentlyAddedId((prev) => (prev === product.id ? null : prev));
      }, 1400);
    }
  }

  async function handleWishlistClick(product: Product) {
    if (!authenticated) {
      setAuthModalProduct(product);
      return;
    }

    const result = await toggleWishlist(product.id);
    emitCartNotification({
      type: result.ok ? "success" : "warning",
      title: result.ok ? "Wishlist Updated" : "Wishlist Unavailable",
      message: result.message,
      productId: product.id,
      productImage: product.image,
    });
  }

  return (
    <section
      aria-labelledby="featured-products-heading"
      className="w-full bg-[#F8FAFC]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#4F46E5] sm:text-base lg:text-[18px]">
              TRENDING NOW
            </p>
            <h2
              id="featured-products-heading"
              className="mt-1.5 text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl lg:text-[44px] lg:leading-tight"
            >
              Featured Products
            </h2>
          </div>

          <Link
            href="/shop"
            className="group inline-flex w-fit items-center gap-2 text-base font-bold text-[#4F46E5] transition-colors duration-200 hover:text-[#4338CA]"
          >
            <span>View All</span>
            <ArrowRight
              className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Four Product Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-7">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              inCartQuantity={getItemQuantity(product.id)}
              isWishlisted={isWishlisted(product.id)}
              justAdded={recentlyAddedId === product.id}
              onActionClick={handleProductAction}
              onWishlistClick={handleWishlistClick}
            />
          ))}
        </div>
      </div>

      <GoogleLoginModal
        key={`featured-wishlist-auth-${authModalProduct?.id ?? "closed"}`}
        isOpen={Boolean(authModalProduct)}
        onClose={() => setAuthModalProduct(null)}
        selectedProduct={authModalProduct}
        actionIntent="wishlist"
        title="Sign in to save favorites"
        description="Sign in to save this product to your personal Mitul's Market wishlist across devices."
      />
    </section>
  );
}

export default FeaturedProducts;
