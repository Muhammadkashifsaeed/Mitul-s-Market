"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Download,
  MapPin,
  Package,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderTrackingTimeline } from "@/components/orders/OrderTrackingTimeline";
import {
  cancelOrderViaApi,
  generateOrderInvoiceHtml,
  isOrderCancellable,
} from "@/lib/orders";
import type { Order } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";

interface OrderDetailsViewProps {
  initialOrder: Order;
  justPlaced?: boolean;
}

export function OrderDetailsView({
  initialOrder,
  justPlaced = false,
}: OrderDetailsViewProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order>(initialOrder);
  const [isTrackingHighlighted, setIsTrackingHighlighted] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const canCancel = isOrderCancellable(order);

  function handleTrackOrderClick() {
    setIsTrackingHighlighted(true);
    const el = document.getElementById("order-tracking-timeline");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleDownloadInvoice() {
    const html = generateOrderInvoiceHtml(order);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `Mituls-Market-Invoice-${order.id}.html`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    setActionNotice(`Downloaded invoice for ${order.id}.`);
  }

  async function handleConfirmCancel() {
    if (!canCancel || isSubmittingCancel) return;
    setIsSubmittingCancel(true);

    try {
      const updated = await cancelOrderViaApi(order.id);
      if (updated) {
        setOrder(updated);
        setIsCancelConfirmOpen(false);
        setActionNotice(`Order ${order.id} has been cancelled.`);
        router.refresh();
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to cancel order right now.";
      setActionNotice(message);
    } finally {
      setIsSubmittingCancel(false);
    }
  }

  return (
    <main className="w-full flex-1 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {/* Back Link */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#4F46E5]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to My Orders</span>
        </Link>

        {/* Order Placed Confirmation Banner */}
        {justPlaced && order.status !== "Cancelled" && (
          <div
            role="status"
            className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900"
          >
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
              aria-hidden="true"
            />
            <div>
              <p className="font-bold">Order Placed Successfully!</p>
              <p className="mt-0.5 text-xs text-emerald-800 sm:text-sm">
                Thank you for shopping with Mitul&apos;s Market. Your order{" "}
                <strong>{order.id}</strong> is confirmed
                {order.estimatedDelivery
                  ? ` and estimated to arrive by ${order.estimatedDelivery}.`
                  : "."}
              </p>
            </div>
          </div>
        )}

        {/* Header + Action Buttons */}
        <header className="mt-6 flex flex-col gap-5 rounded-[24px] border border-gray-200/80 bg-white p-5 shadow-xs sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl">
                Order {order.id}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="mt-1.5 text-sm text-[#64748B]">
              Placed on{" "}
              <span className="font-medium text-[#1E293B]">
                {formatDate(order.orderDate)}
              </span>{" "}
              &bull; {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
              items &bull; Final Total{" "}
              <span className="font-bold text-[#4F46E5]">
                {formatCurrency(order.total)}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleTrackOrderClick}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-[#4F46E5] transition-colors hover:bg-indigo-100 sm:flex-initial"
            >
              <Truck className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Track Order</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1E293B] transition-colors hover:border-gray-300 hover:bg-gray-50 sm:flex-initial"
            >
              <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Download Invoice</span>
            </button>

            {canCancel && (
              <button
                type="button"
                onClick={() => setIsCancelConfirmOpen((prev) => !prev)}
                className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 sm:flex-initial"
              >
                <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Cancel Order</span>
              </button>
            )}

            <Link
              href="/shop"
              className="group inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-md sm:w-auto"
            >
              <span>Continue Shopping</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </header>

        {/* Cancel Confirmation Prompt (only when eligible & toggled) */}
        {canCancel && isCancelConfirmOpen && (
          <div
            role="alertdialog"
            aria-labelledby="cancel-confirm-title"
            className="mt-5 flex flex-col gap-4 rounded-[22px] border border-red-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2
                id="cancel-confirm-title"
                className="text-base font-bold text-[#1E293B]"
              >
                Cancel order {order.id}?
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Eligible processing orders can be cancelled immediately before
                dispatch.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsCancelConfirmOpen(false)}
                className="cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#1E293B] transition-colors hover:bg-gray-50"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={isSubmittingCancel}
                onClick={handleConfirmCancel}
                className="cursor-pointer rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmittingCancel ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        )}

        {/* Action Status Feedback */}
        {actionNotice && (
          <div
            role="status"
            className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-[#1E293B]"
          >
            <span>{actionNotice}</span>
            <button
              type="button"
              onClick={() => setActionNotice(null)}
              className="cursor-pointer text-xs font-semibold text-[#4F46E5] hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Order Tracking Timeline */}
        <div className="mt-6">
          <OrderTrackingTimeline
            order={order}
            isHighlighted={isTrackingHighlighted}
          />
        </div>

        {/* Details Grid: Ordered Products + Customer/Address/Pricing */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.45fr_0.95fr]">
          {/* Ordered Products */}
          <section
            aria-labelledby="ordered-products-heading"
            className="rounded-[24px] border border-gray-200/80 bg-white p-5 shadow-xs sm:p-7"
          >
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                <Package className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2
                id="ordered-products-heading"
                className="text-lg font-bold text-[#1E293B]"
              >
                Ordered Products ({order.items.length})
              </h2>
            </div>

            <ul className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-[#64748B]">
                        {item.category}
                      </span>
                      <h3 className="mt-1 text-base font-bold text-[#1E293B]">
                        <Link
                          href={`/products/${item.productId}`}
                          className="transition-colors hover:text-[#4F46E5]"
                        >
                          {item.name}
                        </Link>
                      </h3>
                      <p className="mt-0.5 text-sm text-[#64748B]">
                        {formatCurrency(item.unitPrice)} &times; {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:block sm:text-right">
                    <span className="text-xs font-medium text-[#64748B] sm:hidden">
                      Line Total
                    </span>
                    <p className="text-lg font-bold text-[#4F46E5]">
                      {formatCurrency(item.lineTotal)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Right Column: Price Summary, Customer Info, Delivery Address */}
          <div className="space-y-6">
            {/* Price & Payment Summary */}
            <section
              aria-labelledby="order-summary-heading"
              className="rounded-[24px] border border-gray-200/80 bg-white p-5 shadow-xs sm:p-6"
            >
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                  <CreditCard className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2
                  id="order-summary-heading"
                  className="text-lg font-bold text-[#1E293B]"
                >
                  Payment &amp; Price Summary
                </h2>
              </div>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-[#64748B]">
                  <dt>Subtotal</dt>
                  <dd className="font-semibold text-[#1E293B]">
                    {formatCurrency(order.subtotal)}
                  </dd>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <dt>Shipping Charges</dt>
                  <dd className="font-semibold text-[#1E293B]">
                    {order.shippingCharges === 0
                      ? "Free"
                      : formatCurrency(order.shippingCharges)}
                  </dd>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <dt>Discount</dt>
                  <dd className="font-semibold text-emerald-600">
                    -{formatCurrency(order.discount)}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <dt className="text-base font-bold text-[#1E293B]">
                    Final Total
                  </dt>
                  <dd className="text-xl font-bold text-[#4F46E5]">
                    {formatCurrency(order.total)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 space-y-2 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-3.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Payment Method</span>
                  <span className="font-semibold text-[#1E293B]">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Payment Status</span>
                  <span className="font-semibold text-[#1E293B]">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </section>

            {/* Customer Info + Delivery Address */}
            <section
              aria-labelledby="customer-address-heading"
              className="rounded-[24px] border border-gray-200/80 bg-white p-5 shadow-xs sm:p-6"
            >
              <h2 id="customer-address-heading" className="sr-only">
                Customer and Delivery Details
              </h2>

              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1E293B]">
                    <User
                      className="h-4 w-4 text-[#4F46E5]"
                      aria-hidden="true"
                    />
                    <span>Customer Information</span>
                  </div>
                  <div className="mt-2 space-y-1 pl-6 text-sm text-[#64748B]">
                    <p className="font-semibold text-[#1E293B]">
                      {order.customer.name}
                    </p>
                    <p className="break-all">{order.customer.email}</p>
                    <p>{order.customer.phone}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1E293B]">
                    <MapPin
                      className="h-4 w-4 text-[#4F46E5]"
                      aria-hidden="true"
                    />
                    <span>Delivery Address</span>
                  </div>
                  <address className="mt-2 space-y-0.5 pl-6 text-sm not-italic text-[#64748B]">
                    <p className="font-semibold text-[#1E293B]">
                      {order.shippingAddress.fullName}
                    </p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </address>
                  {order.deliveryNotes && (
                    <p className="mt-2 pl-6 text-xs text-[#64748B]">
                      Delivery note:{" "}
                      <span className="font-medium text-[#1E293B]">
                        {order.deliveryNotes}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderDetailsView;
