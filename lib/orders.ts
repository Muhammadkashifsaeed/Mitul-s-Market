import { apiClient } from "@/lib/axios";
import type {
  ApiResponse,
  Order,
  OrderDateRange,
  OrderFilterStatus,
  OrderSortOrder,
  OrderTimelineStep,
  OrdersApiPayload,
} from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";

export const ORDER_FILTER_TABS: readonly OrderFilterStatus[] = [
  "All Orders",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export const ORDER_DATE_RANGE_OPTIONS: readonly {
  value: OrderDateRange;
  label: string;
}[] = [
  { value: "all", label: "All Dates" },
  { value: "last7days", label: "Last 7 Days" },
  { value: "last30days", label: "Last 30 Days" },
  { value: "last90days", label: "Last 3 Months" },
] as const;

export interface OrderSummaryCounts {
  total: number;
  pending: number;
  delivered: number;
  cancelled: number;
}

export interface OrderQueryOptions {
  status: OrderFilterStatus;
  searchQuery: string;
  dateRange: OrderDateRange;
  sortBy: OrderSortOrder;
  referenceTimestampMs?: number;
}

/**
 * Ensures customer-scoped order access: only orders matching the authenticated customerId are returned.
 */
export function filterOrdersForCustomer(
  orders: readonly Order[],
  customerId: string | null | undefined
): Order[] {
  if (!customerId) return [];
  return orders.filter((order) => order.customerId === customerId);
}

export function computeOrderSummary(
  orders: readonly Order[]
): OrderSummaryCounts {
  let pending = 0;
  let delivered = 0;
  let cancelled = 0;

  for (const order of orders) {
    if (order.status === "Processing" || order.status === "Shipped") {
      pending += 1;
    } else if (order.status === "Delivered") {
      delivered += 1;
    } else if (order.status === "Cancelled") {
      cancelled += 1;
    }
  }

  return {
    total: orders.length,
    pending,
    delivered,
    cancelled,
  };
}

export function filterAndSortOrders(
  orders: readonly Order[],
  {
    status,
    searchQuery,
    dateRange,
    sortBy,
    referenceTimestampMs,
  }: OrderQueryOptions
): Order[] {
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const anchorMs = referenceTimestampMs ?? Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const minDateMs =
    dateRange === "last7days"
      ? anchorMs - 7 * dayMs
      : dateRange === "last30days"
        ? anchorMs - 30 * dayMs
        : dateRange === "last90days"
          ? anchorMs - 90 * dayMs
          : null;

  const filtered = orders.filter((order) => {
    const matchesStatus = status === "All Orders" || order.status === status;
    if (!matchesStatus) return false;

    if (minDateMs !== null) {
      const orderTime = new Date(order.orderDate).getTime();
      if (Number.isNaN(orderTime) || orderTime < minDateMs) {
        return false;
      }
    }

    if (normalizedSearch) {
      const matchesId = order.id.toLowerCase().includes(normalizedSearch);
      const matchesProduct = order.items.some((item) =>
        item.name.toLowerCase().includes(normalizedSearch)
      );
      if (!matchesId && !matchesProduct) {
        return false;
      }
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    const timeA = new Date(a.orderDate).getTime();
    const timeB = new Date(b.orderDate).getTime();
    return sortBy === "oldest" ? timeA - timeB : timeB - timeA;
  });
}

export function isOrderCancellable(order: Order): boolean {
  return order.status === "Processing";
}

export function buildOrderTimeline(order: Order): OrderTimelineStep[] {
  const isCancelled = order.status === "Cancelled";
  const stageRank =
    order.status === "Delivered"
      ? 5
      : order.status === "Shipped"
        ? 4
        : order.status === "Processing"
          ? 3
          : isCancelled && order.statusHistory.shippedAt
            ? 4
            : isCancelled && order.statusHistory.processingAt
              ? 3
              : isCancelled && order.statusHistory.confirmedAt
                ? 2
                : 1;

  return [
    {
      stepNumber: 1,
      label: "Order Placed",
      description: "Order received by Mitul's Market",
      completed: stageRank >= 1,
      isCurrent: !isCancelled && stageRank === 1,
      timestamp: order.statusHistory.placedAt,
    },
    {
      stepNumber: 2,
      label: "Order Confirmed",
      description: "Order details verified",
      completed: stageRank >= 2,
      isCurrent: !isCancelled && stageRank === 2,
      timestamp: order.statusHistory.confirmedAt,
    },
    {
      stepNumber: 3,
      label: "Processing",
      description: "Items packed & quality checked",
      completed: stageRank >= 3,
      isCurrent: !isCancelled && order.status === "Processing",
      timestamp: order.statusHistory.processingAt,
    },
    {
      stepNumber: 4,
      label: "Shipped",
      description: order.carrierName
        ? `Handed to ${order.carrierName}`
        : "Dispatched with courier partner",
      completed: stageRank >= 4,
      isCurrent: !isCancelled && order.status === "Shipped",
      timestamp: order.statusHistory.shippedAt,
    },
    {
      stepNumber: 5,
      label: "Delivered",
      description: order.estimatedDelivery
        ? order.status === "Delivered"
          ? "Delivered to shipping address"
          : `Est. delivery: ${order.estimatedDelivery}`
        : "Delivered to shipping address",
      completed: stageRank >= 5,
      isCurrent: !isCancelled && order.status === "Delivered",
      timestamp: order.statusHistory.deliveredAt,
    },
  ];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function generateOrderInvoiceHtml(order: Order): string {
  const formattedDate = formatDate(order.orderDate);
  const rowsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td>${escapeHtml(item.name)}<div style="color:#64748b;font-size:12px;">${escapeHtml(item.category)}</div></td>
        <td style="text-align:center;">${item.quantity}</td>
        <td style="text-align:right;">${escapeHtml(formatCurrency(item.unitPrice))}</td>
        <td style="text-align:right;font-weight:600;">${escapeHtml(formatCurrency(item.lineTotal))}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Invoice ${escapeHtml(order.id)} - Mitul's Market</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #1e293b; margin: 40px; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
    .brand { font-size: 26px; font-weight: 800; }
    .brand span { color: #4f46e5; }
    .demo-banner { margin-top: 16px; padding: 10px 14px; border-radius: 8px; background: #fffbeb; border: 1px solid #fde68a; color: #92400e; font-size: 13px; font-weight: 600; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
    .box h3 { margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { text-align: left; border-bottom: 2px solid #e2e8f0; padding: 10px 8px; font-size: 13px; color: #64748b; }
    td { border-bottom: 1px solid #e2e8f0; padding: 12px 8px; font-size: 14px; }
    .totals { width: 320px; margin-left: auto; margin-top: 20px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .totals-final { border-top: 2px solid #1e293b; margin-top: 8px; padding-top: 10px; font-size: 18px; font-weight: 700; color: #4f46e5; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Mitul's <span>Market</span></div>
      <div style="color:#64748b;font-size:13px;">Morbi, Gujarat · support@mitulsmarket.com</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:20px;font-weight:700;">INVOICE</div>
      <div style="font-size:14px;color:#475569;">Order ID: <strong>${escapeHtml(order.id)}</strong></div>
      <div style="font-size:13px;color:#64748b;">Date: ${escapeHtml(formattedDate)}</div>
      <div style="font-size:13px;color:#64748b;">Status: ${escapeHtml(order.status)}</div>
    </div>
  </div>
  ${order.isDemo ? `<div class="demo-banner">DEMO INVOICE — Generated from sample demonstration order data. Not an official tax or payment receipt.</div>` : ""}
  <div class="grid">
    <div class="box">
      <h3>Customer Details</h3>
      <div><strong>${escapeHtml(order.customer.name)}</strong></div>
      <div>${escapeHtml(order.customer.email)}</div>
      <div>${escapeHtml(order.customer.phone)}</div>
    </div>
    <div class="box">
      <h3>Delivery Address</h3>
      <div><strong>${escapeHtml(order.shippingAddress.fullName)}</strong></div>
      <div>${escapeHtml(order.shippingAddress.street)}</div>
      <div>${escapeHtml(order.shippingAddress.city)}, ${escapeHtml(order.shippingAddress.state)} ${escapeHtml(order.shippingAddress.postalCode)}</div>
      <div>${escapeHtml(order.shippingAddress.country)}</div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th style="text-align:center;">Qty</th>
        <th style="text-align:right;">Unit Price</th>
        <th style="text-align:right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
  <div class="totals">
    <div class="totals-row"><span>Subtotal</span><span>${escapeHtml(formatCurrency(order.subtotal))}</span></div>
    <div class="totals-row"><span>Shipping Charges</span><span>${order.shippingCharges === 0 ? "Free" : escapeHtml(formatCurrency(order.shippingCharges))}</span></div>
    <div class="totals-row"><span>Discount</span><span>-${escapeHtml(formatCurrency(order.discount))}</span></div>
    <div class="totals-row"><span>Payment (${escapeHtml(order.paymentMethod)})</span><span>${escapeHtml(order.paymentStatus)}</span></div>
    <div class="totals-row totals-final"><span>Final Total</span><span>${escapeHtml(formatCurrency(order.total))}</span></div>
  </div>
</body>
</html>`;
}

export async function fetchCustomerOrdersState(): Promise<OrdersApiPayload> {
  const response = await apiClient.get<ApiResponse<OrdersApiPayload>>("/orders");
  if (response.data.success) {
    return response.data.data;
  }

  return {
    backendConfigured: false,
    authenticated: false,
    customerId: null,
    orders: [],
  };
}

export async function cancelOrderViaApi(orderId: string): Promise<Order | null> {
  const response = await apiClient.patch<ApiResponse<Order>>(
    `/orders/${encodeURIComponent(orderId)}`,
    { action: "cancel" }
  );

  if (response.data.success) {
    return response.data.data;
  }

  return null;
}

