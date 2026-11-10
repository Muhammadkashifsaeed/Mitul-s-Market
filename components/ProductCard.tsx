"use client";

import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Heart, Plus, Star } from "lucide-react";
import type { Product, ProductActionIntent } from "@/types";
import { cn } from "@/utils/cn";

interface ProductCardProps {
  product: Product;
  onActionClick: (product: Product, intent: ProductActionIntent) => void;
  onWishlistClick?: (product: Product) => void;
  isWishlisted?: boolean;
  inCartQuantity?: number;
  justAdded?: boolean;
}

export function ProductCard({
  product,
  onActionClick,
  onWishlistClick,
  isWishlisted = false,
  inCartQuantity = 0,
  justAdded = false,
}: ProductCardProps) {
  const productHref = product.href ?? `/products/${product.id}`;
  const isOutOfStock = product.stock <= 0;

  function handleAddButtonClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (isOutOfStock) return;
    onActionClick(product, "add");
  }

  function handleWishlistButtonClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (onWishlistClick) {
      onWishlistClick(product);
    } else {
      onActionClick(product, "wishlist");
    }
  }

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-[28px] border border-gray-200/80 bg-white p-3.5 shadow-sm",
        "transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl"
      )}
    >
      {/* Top Product Image */}
      <div className="relative">
        <Link href={productHref} className="block">
          <div className="relative aspect-[388/320] w-full overflow-hidden rounded-[20px] bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#1E293B] shadow-xs backdrop-blur-xs">
              {product.category}
            </span>
            {inCartQuantity > 0 && (
              <span className="absolute bottom-3 left-3 z-10 rounded-full bg-[#4F46E5] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                {inCartQuantity} in cart
              </span>
            )}
          </div>
        </Link>

        {/* Dedicated Wishlist Toggle */}
        <button
          type="button"
          onClick={handleWishlistButtonClick}
          aria-pressed={isWishlisted}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          className={cn(
            "absolute right-3 top-3 z-10 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border shadow-xs backdrop-blur-xs transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/50",
            isWishlisted
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-white/80 bg-white/90 text-[#64748B] hover:border-rose-200 hover:bg-white hover:text-rose-500"
          )}
        >
          <Heart
            className={cn("h-4 w-4", isWishlisted && "fill-current")}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between px-2 pb-1.5 pt-4">
        <div>
          <h3 className="text-lg font-bold leading-snug text-[#1E293B] xl:text-[22px]">
            <Link
              href={productHref}
              className="transition-colors duration-200 hover:text-[#4F46E5]"
            >
              {product.name}
            </Link>
          </h3>

          {/* Rating & Review Count */}
          <div className="mt-2 flex items-center gap-1.5">
            <Star
              className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            <span className="text-sm font-semibold text-[#1E293B]">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-xs text-[#64748B]">
              ({product.reviewsCount} reviews)
            </span>
          </div>
        </div>

        {/* Bottom Price + Interactive Heart -> Plus Add-to-Cart */}
        <div className="mt-5 flex items-center justify-between gap-2">
          <p className="text-xl font-bold text-[#4F46E5] xl:text-[24px]">
            ₹{product.price}
          </p>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddButtonClick}
            aria-label={
              isOutOfStock
                ? `${product.name} is out of stock`
                : inCartQuantity > 0
                  ? `Add another ${product.name} to cart (${inCartQuantity} in cart)`
                  : `Add ${product.name} to cart`
            }
            className={cn(
              "relative inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full",
              "transition-all duration-300 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/50 focus-visible:ring-offset-2",
              isOutOfStock && "cursor-not-allowed opacity-50",
              justAdded
                ? "scale-105 bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                : "bg-transparent text-gray-400 group-hover:scale-105 group-hover:bg-[#4F46E5] group-hover:text-white group-hover:shadow-md group-hover:shadow-[#4F46E5]/30"
            )}
          >
            {justAdded ? (
              <Check className="h-5 w-5" aria-hidden="true" />
            ) : (
              <>
                <Heart
                  className="absolute h-5 w-5 opacity-100 scale-100 transition-all duration-200 group-hover:scale-75 group-hover:opacity-0"
                  aria-hidden="true"
                />
                <Plus
                  className="absolute h-5 w-5 scale-75 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
