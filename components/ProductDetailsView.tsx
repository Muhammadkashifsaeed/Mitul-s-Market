"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { GoogleLoginModal } from "@/components/GoogleLoginModal";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { emitCartNotification } from "@/lib/cart";
import type { Product, ProductActionIntent } from "@/types";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format";

interface ProductDetailsViewProps {
  product: Product;
  relatedProducts: readonly Product[];
}

export function ProductDetailsView({
  product,
  relatedProducts,
}: ProductDetailsViewProps) {
  const { addToCart, getItemQuantity } = useCart();
  const { authenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedQty, setSelectedQty] = useState(1);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [authModalProduct, setAuthModalProduct] = useState<Product | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const inCartQty = getItemQuantity(product.id);
  const wishlisted = isWishlisted(product.id);
  const remainingAddable = Math.max(0, product.stock - inCartQty);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const maxSelectableQty = Math.max(1, remainingAddable);
  const clampedSelectedQty = Math.min(selectedQty, maxSelectableQty);

  function triggerAddedFeedback(productId: string, message?: string) {
    setRecentlyAddedId(productId);
    if (message) {
      setFeedbackMessage(message);
    }
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === productId ? null : prev));
    }, 1600);
  }

  function handlePrimaryAddToCart() {
    const result = addToCart(product, clampedSelectedQty);
    if (result.added) {
      triggerAddedFeedback(product.id, result.message);
      setSelectedQty(1);
    } else {
      setFeedbackMessage(result.message);
    }
  }

  async function handleWishlistClick(targetProduct: Product) {
    if (!authenticated) {
      setAuthModalProduct(targetProduct);
      return;
    }

    const result = await toggleWishlist(targetProduct.id);
    emitCartNotification({
      type: result.ok ? "success" : "warning",
      title: result.ok ? "Wishlist Updated" : "Wishlist Unavailable",
      message: result.message,
      productId: targetProduct.id,
      productImage: targetProduct.image,
    });
  }

  async function handleRelatedProductAction(
    related: Product,
    intent: ProductActionIntent
  ) {
    if (intent === "wishlist") {
      await handleWishlistClick(related);
      return;
    }
    const result = addToCart(related, 1);
    if (result.added) {
      triggerAddedFeedback(related.id);
    }
  }

  return (
    <main className="w-full flex-1 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#64748B]"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 font-medium text-[#4F46E5] transition-colors hover:text-[#4338CA]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Shop</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
          <Link
            href={`/shop?category=${encodeURIComponent(
              product.category.toLowerCase()
            )}`}
            className="transition-colors hover:text-[#1E293B]"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
          <span className="truncate font-medium text-[#1E293B]">
            {product.name}
          </span>
        </nav>

        {/* Main Product Card */}
        <div className="grid grid-cols-1 gap-8 rounded-[28px] border border-gray-200/80 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
          {/* Left: Product Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-[22px] bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-[#1E293B] shadow-xs backdrop-blur-xs">
              {product.category}
            </span>
          </div>

          {/* Right: Details & Purchase Controls */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Availability Badge */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                    isOutOfStock
                      ? "bg-rose-50 text-rose-700"
                      : isLowStock
                        ? "bg-amber-50 text-amber-800"
                        : "bg-emerald-50 text-emerald-700"
                  )}
                >
                  <PackageCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {isOutOfStock
                      ? "Out of Stock"
                      : isLowStock
                        ? `Low Stock (${product.stock} left)`
                        : `In Stock (${product.stock} available)`}
                  </span>
                </span>

                {inCartQty > 0 && (
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-[#4F46E5]">
                    {inCartQty} currently in cart
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-bold text-[#1E293B]">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-[#64748B]">
                  ({product.reviewsCount} customer reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-5">
                <p className="text-3xl font-bold text-[#4F46E5] sm:text-4xl">
                  {formatCurrency(product.price)}
                </p>
                <p className="mt-1 text-xs text-[#64748B]">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Description */}
              <p className="mt-6 text-base leading-relaxed text-[#475569]">
                {product.description}
              </p>

              {/* Quantity, Add to Cart & Wishlist Controls */}
              <div className="mt-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-full border border-gray-200 bg-[#F8FAFC] p-1">
                    <button
                      type="button"
                      disabled={clampedSelectedQty <= 1 || remainingAddable <= 0}
                      onClick={() =>
                        setSelectedQty((prev) => Math.max(1, prev - 1))
                      }
                      aria-label="Decrease quantity"
                      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#1E293B] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>

                    <span
                      aria-live="polite"
                      data-testid="detail-quantity-value"
                      className="min-w-[3rem] text-center text-base font-bold text-[#1E293B]"
                    >
                      {remainingAddable <= 0 ? 0 : clampedSelectedQty}
                    </span>

                    <button
                      type="button"
                      disabled={
                        isOutOfStock ||
                        remainingAddable <= 0 ||
                        clampedSelectedQty >= maxSelectableQty
                      }
                      onClick={() =>
                        setSelectedQty((prev) =>
                          Math.min(maxSelectableQty, prev + 1)
                        )
                      }
                      aria-label="Increase quantity"
                      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#1E293B] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isOutOfStock || remainingAddable <= 0}
                    onClick={handlePrimaryAddToCart}
                    className={cn(
                      "inline-flex flex-1 min-w-[180px] cursor-pointer items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 sm:text-base",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/50 focus-visible:ring-offset-2",
                      isOutOfStock || remainingAddable <= 0
                        ? "cursor-not-allowed bg-gray-300 text-gray-600 shadow-none"
                        : recentlyAddedId === product.id
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-[#4F46E5] hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-md"
                    )}
                  >
                    {recentlyAddedId === product.id ? (
                      <>
                        <Check className="h-5 w-5" aria-hidden="true" />
                        <span>Added to Cart</span>
                      </>
                    ) : isOutOfStock ? (
                      <span>Out of Stock</span>
                    ) : remainingAddable <= 0 ? (
                      <span>Max Stock in Cart ({product.stock})</span>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWishlistClick(product)}
                    aria-pressed={wishlisted}
                    aria-label={
                      wishlisted
                        ? `Remove ${product.name} from wishlist`
                        : `Save ${product.name} to wishlist`
                    }
                    className={cn(
                      "inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors",
                      wishlisted
                        ? "border-rose-200 bg-rose-50 text-rose-600"
                        : "border-gray-200 bg-white text-[#475569] hover:border-rose-200 hover:text-rose-500"
                    )}
                  >
                    <Heart
                      className={cn("h-5 w-5", wishlisted && "fill-current")}
                      aria-hidden="true"
                    />
                  </button>

                  {inCartQty > 0 && (
                    <Link
                      href="/cart"
                      className="inline-flex whitespace-nowrap items-center justify-center gap-2 rounded-full border border-[#4F46E5] bg-white px-6 py-3.5 text-sm font-bold text-[#4F46E5] transition-colors hover:bg-indigo-50"
                    >
                      View Cart ({inCartQty})
                    </Link>
                  )}
                </div>

                {feedbackMessage && (
                  <p
                    role="status"
                    aria-live="polite"
                    className="text-sm font-medium text-emerald-700"
                  >
                    {feedbackMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Store Guarantees */}
            <div className="mt-8 grid grid-cols-1 gap-3 border-t border-gray-100 pt-6 sm:grid-cols-3">
              <div className="flex items-center gap-2.5 text-xs font-medium text-[#475569]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                  <Truck className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>Free delivery over ₹999</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-medium text-[#475569]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>100% authentic product</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-medium text-[#475569]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>7-day easy returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section
            aria-labelledby="related-products-heading"
            className="mt-14 lg:mt-16"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] sm:text-sm">
                  MORE IN {product.category.toUpperCase()}
                </p>
                <h2
                  id="related-products-heading"
                  className="mt-1 text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl"
                >
                  You Might Also Like
                </h2>
              </div>

              <Link
                href={`/shop?category=${encodeURIComponent(
                  product.category.toLowerCase()
                )}`}
                className="text-sm font-bold text-[#4F46E5] transition-colors hover:text-[#4338CA]"
              >
                Explore {product.category} &rarr;
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-7">
              {relatedProducts.map((related) => (
                <ProductCard
                  key={related.id}
                  product={related}
                  inCartQuantity={getItemQuantity(related.id)}
                  isWishlisted={isWishlisted(related.id)}
                  justAdded={recentlyAddedId === related.id}
                  onActionClick={handleRelatedProductAction}
                  onWishlistClick={handleWishlistClick}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <GoogleLoginModal
        key={`product-wishlist-auth-${authModalProduct?.id ?? "closed"}`}
        isOpen={Boolean(authModalProduct)}
        onClose={() => setAuthModalProduct(null)}
        selectedProduct={authModalProduct}
        actionIntent="wishlist"
        title="Sign in to save favorites"
        description="Sign in to add items to your personal Mitul's Market wishlist."
      />
    </main>
  );
}

export default ProductDetailsView;
