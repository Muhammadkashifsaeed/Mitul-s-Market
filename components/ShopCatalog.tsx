"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpDown, Search, X } from "lucide-react";
import { GoogleLoginModal } from "@/components/GoogleLoginModal";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useDebounce } from "@/hooks/use-debounce";
import { useWishlist } from "@/hooks/use-wishlist";
import { emitCartNotification } from "@/lib/cart";
import {
  SHOP_CATEGORIES,
  SHOP_COLLECTIONS,
  SHOP_SORT_OPTIONS,
  allProducts,
  type ShopCategory,
  type ShopCollectionKey,
  type ShopSortOption,
} from "@/lib/products";
import type { Product, ProductActionIntent } from "@/types";
import { cn } from "@/utils/cn";

interface ShopCatalogProps {
  initialCategory?: ShopCategory;
  initialCollection?: ShopCollectionKey | null;
  initialSearchQuery?: string;
}

export function ShopCatalog({
  initialCategory = "All",
  initialCollection = null,
  initialSearchQuery = "",
}: ShopCatalogProps) {
  const { addToCart, getItemQuantity } = useCart();
  const { authenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [activeCategory, setActiveCategory] =
    useState<ShopCategory>(initialCategory);
  const [activeCollection, setActiveCollection] =
    useState<ShopCollectionKey | null>(initialCollection);
  const [searchInput, setSearchInput] = useState(initialSearchQuery);
  const [sortBy, setSortBy] = useState<ShopSortOption>("featured");
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [authModalProduct, setAuthModalProduct] = useState<Product | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSearch = useDebounce(searchInput, 150);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const collectionConfig = activeCollection
    ? SHOP_COLLECTIONS[activeCollection]
    : null;
  const normalizedQuery = debouncedSearch.trim().toLowerCase();

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const matchesCollection =
        !collectionConfig || collectionConfig.productIds.includes(product.id);
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesCollection && matchesQuery;
    });

    if (sortBy === "price-asc") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    if (sortBy === "rating-desc") {
      return [...filtered].sort(
        (a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount
      );
    }
    return filtered;
  }, [activeCategory, collectionConfig, normalizedQuery, sortBy]);

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

  function handleResetFilters() {
    setActiveCategory("All");
    setActiveCollection(null);
    setSearchInput("");
    setSortBy("featured");
  }

  const hasActiveFilter =
    activeCategory !== "All" ||
    activeCollection !== null ||
    searchInput.trim().length > 0;

  return (
    <main className="w-full flex-1 bg-[#F8FAFC]">
      <section
        aria-labelledby="shop-page-heading"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        {/* Shop Page Header */}
        <header className="space-y-2.5">
          <h1
            id="shop-page-heading"
            className="text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl lg:text-[42px] lg:leading-tight"
          >
            Shop All Products
          </h1>
          <p className="text-base text-[#64748B] sm:text-lg">
            Browse our complete collection
          </p>
        </header>

        {/* Category Filter Pills + Inline Search + Sort */}
        <div className="mt-8 flex flex-col gap-4 rounded-[24px] border border-gray-200/80 bg-white p-4 shadow-xs sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Three Category Pills */}
            <nav
              aria-label="Product categories"
              className="flex items-center gap-2.5 overflow-x-auto pb-1 lg:pb-0"
            >
              {SHOP_CATEGORIES.map((category) => {
                const isSelected = activeCategory === category && !activeCollection;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      setActiveCategory(category);
                      setActiveCollection(null);
                    }}
                    className={cn(
                      "shrink-0 cursor-pointer whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/50 focus-visible:ring-offset-2",
                      isSelected
                        ? "bg-[#4F46E5] text-white shadow-sm shadow-[#4F46E5]/25"
                        : "border border-gray-200 bg-white text-[#1E293B] hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {category}
                  </button>
                );
              })}
            </nav>

            {/* Search + Sort Controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:w-64 lg:w-72">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Filter by product name..."
                  aria-label="Filter catalog products"
                  className="h-11 w-full rounded-full border border-gray-200 bg-[#F8FAFC] pl-10 pr-4 text-sm text-[#1E293B] placeholder:text-gray-400 transition-colors focus:border-[#4F46E5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
                />
              </div>

              <div className="relative flex items-center">
                <ArrowUpDown
                  className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#64748B]"
                  aria-hidden="true"
                />
                <select
                  aria-label="Sort products"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as ShopSortOption)
                  }
                  className="h-11 w-full cursor-pointer appearance-none rounded-full border border-gray-200 bg-white pl-10 pr-8 text-sm font-semibold text-[#1E293B] transition-colors focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15 sm:w-auto"
                >
                  {SHOP_SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Chips & Count Summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
            <div className="flex flex-wrap items-center gap-2">
              {collectionConfig && (
                <button
                  type="button"
                  onClick={() => setActiveCollection(null)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-[#4F46E5] transition-colors hover:bg-indigo-100"
                >
                  <span>Collection: {collectionConfig.label}</span>
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}

              {searchInput.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-[#4F46E5] transition-colors hover:bg-indigo-100"
                >
                  <span>Search: &ldquo;{searchInput.trim()}&rdquo;</span>
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}

              {!collectionConfig && searchInput.trim().length === 0 && (
                <span className="text-xs font-medium text-[#64748B]">
                  Category:{" "}
                  <strong className="text-[#1E293B]">{activeCategory}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="cursor-pointer text-xs font-bold text-[#4F46E5] hover:underline"
                >
                  Reset All
                </button>
              )}
              <p
                aria-live="polite"
                className="text-sm font-medium text-[#64748B]"
              >
                Showing {filteredAndSortedProducts.length}{" "}
                {filteredAndSortedProducts.length === 1 ? "product" : "products"}
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-7">
            {filteredAndSortedProducts.map((product) => (
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
        ) : (
          <div className="mt-10 rounded-[28px] border border-gray-200/80 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#1E293B]">
              No matching products found
            </h2>
            <p className="mt-2 text-sm text-[#64748B]">
              Try switching categories, clearing your collection filter, or
              searching for another keyword.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#4F46E5] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4338CA]"
              >
                View All Products
              </button>
            </div>
          </div>
        )}
      </section>

      <GoogleLoginModal
        key={`shop-wishlist-auth-${authModalProduct?.id ?? "closed"}`}
        isOpen={Boolean(authModalProduct)}
        onClose={() => setAuthModalProduct(null)}
        selectedProduct={authModalProduct}
        actionIntent="wishlist"
        title="Sign in to save favorites"
        description="Sign in to add products to your Mitul's Market wishlist."
      />
    </main>
  );
}

export default ShopCatalog;
