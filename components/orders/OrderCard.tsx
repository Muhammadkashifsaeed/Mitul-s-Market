import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, CreditCard } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import type { Order } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const leadItem = order.items[0];
  const totalQuantity = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const additionalItemsCount = Math.max(order.items.length - 1, 0);

  return (
    <article className="overflow-hidden rounded-[24px] border border-gray-200/80 bg-white shadow-xs transition-all duration-200 hover:border-indigo-200/80 hover:shadow-md">
      {/* Top Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-[#F8FAFC]/80 px-5 py-3.5 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-[#64748B]">
              Order ID
            </span>
            <span className="font-mono text-sm font-bold text-[#1E293B]">
              {order.id}
            </span>
            {order.isDemo && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                Demo
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{formatDate(order.orderDate)}</span>
          </div>
        </div>

        <OrderStatusBadge status={order.status} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Product Thumbnail + Summary */}
        <div className="flex min-w-0 items-center gap-4">
          {leadItem && (
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100">
              <Image
                src={leadItem.image}
                alt={leadItem.name}
                fill
                sizes="96px"
                className="object-cover object-center"
              />
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-1.5">
            <h3 className="truncate text-base font-bold text-[#1E293B] sm:text-lg">
              {leadItem?.name ?? "Order Items"}
              {additionalItemsCount > 0 && (
                <span className="ml-2 text-sm font-medium text-[#64748B]">
                  +{additionalItemsCount} more{" "}
                  {additionalItemsCount === 1 ? "item" : "items"}
                </span>
              )}
            </h3>

            {additionalItemsCount > 0 && (
              <p className="truncate text-xs text-[#64748B]">
                Also includes:{" "}
                {order.items
                  .slice(1)
                  .map((item) => item.name)
                  .join(", ")}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[#64748B] sm:text-sm">
              <span>
                Quantity:{" "}
                <strong className="font-semibold text-[#1E293B]">
                  {totalQuantity}
                </strong>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CreditCard
                  className="h-3.5 w-3.5 shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <span>{order.paymentMethod}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Price + Action */}
        <div className="flex flex-col justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center lg:border-t-0 lg:pt-0 lg:gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
              Total Price
            </p>
            <p className="text-xl font-bold text-[#4F46E5] sm:text-2xl">
              {formatCurrency(order.total)}
            </p>
          </div>

          <Link
            href={`/orders/${encodeURIComponent(order.id)}`}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-md sm:w-auto"
          >
            <span>View Details</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default OrderCard;

