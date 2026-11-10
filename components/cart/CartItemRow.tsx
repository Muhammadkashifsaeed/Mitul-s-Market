"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { ResolvedCartItem } from "@/types";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format";

interface CartItemRowProps {
  item: ResolvedCartItem;
  onUpdateQuantity: (productId: string, nextQuantity: number) => void;
  onRemoveItem: (item: ResolvedCartItem) => void;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemRowProps) {
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const { product, quantity, lineTotal, inStock, atMaxStock } = item;
  const productHref = product.href ?? `/products/${product.id}`;
  const isLowStock = inStock && product.stock <= 5;

  return (
    <article
      data-testid={`cart-item-${product.id}`}
      className="rounded-[24px] border border-gray-200/80 bg-white p-4 shadow-xs transition-shadow duration-200 hover:shadow-md sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        {/* Product Thumbnail */}
        <Link
          href={productHref}
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-28 sm:w-28"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="112px"
            className="object-cover object-center transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Product Details & Controls */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex w-fit shrink-0 rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-xs font-semibold text-[#4F46E5]">
                  {product.category}
                </span>

                <span
                  className={cn(
                    "inline-flex w-fit shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    !inStock
                      ? "bg-rose-50 text-rose-700"
                      : isLowStock
                        ? "bg-amber-50 text-amber-800"
                        : "bg-emerald-50 text-emerald-700"
                  )}
                >
                  {!inStock
                    ? "Out of Stock"
                    : isLowStock
                      ? `Low Stock (${product.stock} left)`
                      : "In Stock"}
                </span>
              </div>

              <h2 className="mt-2 text-lg font-bold leading-snug text-[#1E293B] sm:text-xl">
                <Link
                  href={productHref}
                  className="transition-colors hover:text-[#4F46E5]"
                >
                  {product.name}
                </Link>
              </h2>

              <p className="mt-1 text-sm font-medium text-[#64748B]">
                Unit Price:{" "}
                <span className="font-semibold text-[#1E293B]">
                  {formatCurrency(product.price)}
                </span>
              </p>
            </div>

            {/* Desktop Item Subtotal + Delete Trigger */}
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-[#64748B]">Subtotal</p>
              <p
                data-testid={`cart-item-subtotal-${product.id}`}
                className="mt-0.5 text-xl font-bold text-[#4F46E5]"
              >
                {formatCurrency(lineTotal)}
              </p>
            </div>
          </div>

          {/* Quantity Controls + Mobile Subtotal + Trash Action */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <div
                aria-label={`Quantity controls for ${product.name}`}
                className="inline-flex items-center rounded-full border border-gray-200 bg-[#F8FAFC] p-1"
              >
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                  aria-label={`Decrease quantity of ${product.name}`}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#1E293B] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                </button>

                <span
                  data-testid={`cart-item-qty-${product.id}`}
                  aria-live="polite"
                  className="min-w-[2.25rem] text-center text-sm font-bold text-[#1E293B]"
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={!inStock || atMaxStock}
                  onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                  aria-label={`Increase quantity of ${product.name}`}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#1E293B] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              {atMaxStock && inStock && (
                <span className="text-xs font-medium text-amber-700">
                  Max stock ({product.stock}) reached
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Mobile Subtotal */}
              <div className="sm:hidden">
                <span className="text-xs font-medium text-[#64748B]">
                  Subtotal:{" "}
                </span>
                <span className="text-base font-bold text-[#4F46E5]">
                  {formatCurrency(lineTotal)}
                </span>
              </div>

              {!confirmingRemove && (
                <button
                  type="button"
                  onClick={() => setConfirmingRemove(true)}
                  aria-label={`Remove ${product.name} from cart`}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Inline Remove Confirmation */}
          {confirmingRemove && (
            <div
              role="alert"
              className="mt-3 flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs sm:text-sm"
            >
              <span className="font-medium text-rose-900">
                Remove <span className="font-bold">{product.name}</span> from
                your cart?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingRemove(false)}
                  className="cursor-pointer whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1E293B] transition-colors hover:bg-gray-50"
                >
                  Keep
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmingRemove(false);
                    onRemoveItem(item);
                  }}
                  className="cursor-pointer whitespace-nowrap rounded-full bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default CartItemRow;

