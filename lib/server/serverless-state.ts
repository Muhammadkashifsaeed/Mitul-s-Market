import crypto from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { allProducts, getProductById } from "@/lib/products";
import { getAuthSecret, isSecureRequest } from "@/lib/server/auth";
import type { StoredUserRecord } from "@/lib/server/db";
import type {
  DeliveryAddress,
  Order,
  OrderItem,
  PaymentMethod,
  PaymentStatus,
} from "@/types";

export const ACCOUNT_COOKIE_NAME = "mituls_market_acct";
export const RESET_COOKIE_NAME = "mituls_market_reset";
export const WISHLIST_COOKIE_NAME = "mituls_market_wishlist";
export const ORDERS_COOKIE_NAME = "mituls_market_orders";

const MAX_COOKIE_VALUE_BYTES = 3400;

interface CompactOrderItem {
  pid: string;
  q: number;
}

interface CompactOrderRecord {
  id: string;
  cid: string;
  dt: string;
  fn: string;
  em: string;
  ph: string;
  addr: DeliveryAddress;
  nt?: string;
  it: CompactOrderItem[];
  sc: number;
  dc: number;
  tot: number;
  pm: PaymentMethod;
  ps: PaymentStatus;
  est: string;
}

export interface OrdersCookieOverlay {
  o: CompactOrderRecord[];
  c: Record<string, string>;
}

export interface ResetCookieState {
  email: string;
  resetTokenHash: string;
  resetTokenExpiresAt: number;
}

export interface WishlistCookieState {
  userId: string;
  productIds: string[];
}

function signCookieValue<T>(payload: T): string {
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  const sig = crypto
    .createHmac("sha256", getAuthSecret())
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${sig}`;
}

function verifyCookieValue<T>(raw?: string | null): T | null {
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return null;

  const expected = crypto
    .createHmac("sha256", getAuthSecret())
    .update(payloadB64)
    .digest("base64url");

  const a = Buffer.from(expected);
  const b = Buffer.from(sigB64);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null;
  }

  try {
    return JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    ) as T;
  } catch {
    return null;
  }
}

export async function readSignedStateCookie<T>(
  name: string,
  request?: NextRequest
): Promise<T | null> {
  if (request) {
    return verifyCookieValue<T>(request.cookies.get(name)?.value);
  }
  const store = await cookies();
  return verifyCookieValue<T>(store.get(name)?.value);
}

export function setSignedStateCookie<T>(
  response: NextResponse,
  name: string,
  payload: T,
  request?: NextRequest,
  maxAgeSeconds = 7 * 24 * 60 * 60
): void {
  response.cookies.set(name, signCookieValue(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isSecureRequest(request),
    maxAge: maxAgeSeconds,
  });
}

export function clearSignedStateCookie(
  response: NextResponse,
  name: string,
  request?: NextRequest
): void {
  response.cookies.set(name, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isSecureRequest(request),
    maxAge: 0,
  });
}

export function compactOrder(order: Order): CompactOrderRecord {
  return {
    id: order.id,
    cid: order.customerId,
    dt: order.orderDate,
    fn: order.customer.name,
    em: order.customer.email,
    ph: order.customer.phone,
    addr: order.shippingAddress,
    ...(order.deliveryNotes ? { nt: order.deliveryNotes } : {}),
    it: order.items.map((item) => ({ pid: item.productId, q: item.quantity })),
    sc: order.shippingCharges,
    dc: order.discount,
    tot: order.total,
    pm: order.paymentMethod,
    ps: order.paymentStatus,
    est: order.estimatedDelivery ?? "",
  };
}

export function hydrateCompactOrder(
  record: CompactOrderRecord,
  cancelledAt?: string
): Order {
  const hydratedItems: OrderItem[] = record.it.map((entry) => {
    const product = getProductById(entry.pid) ?? allProducts[0];
    return {
      productId: product.id,
      name: product.name,
      category: product.category,
      image: product.image,
      unitPrice: product.price,
      quantity: entry.q,
      lineTotal: product.price * entry.q,
    };
  });

  const subtotal = hydratedItems.reduce((acc, item) => acc + item.lineTotal, 0);

  return {
    id: record.id,
    customerId: record.cid,
    isDemo: false,
    orderDate: record.dt,
    status: cancelledAt ? "Cancelled" : "Processing",
    customer: {
      id: record.cid,
      name: record.fn,
      email: record.em,
      phone: record.ph,
    },
    shippingAddress: record.addr,
    ...(record.nt ? { deliveryNotes: record.nt } : {}),
    items: hydratedItems,
    subtotal,
    shippingCharges: record.sc,
    discount: record.dc,
    total: record.tot,
    paymentMethod: record.pm,
    paymentStatus: cancelledAt ? "Cancelled" : record.ps,
    carrierName: "BlueDart Express",
    estimatedDelivery: record.est || undefined,
    statusHistory: {
      placedAt: record.dt,
      confirmedAt: record.dt,
      processingAt: record.dt,
      ...(cancelledAt ? { cancelledAt } : {}),
    },
  };
}

export function mergeOrdersWithOverlay(
  baseOrders: Order[],
  customerId: string,
  overlay: OrdersCookieOverlay | null
): Order[] {
  const byId = new Map<string, Order>();

  for (const order of baseOrders) {
    byId.set(order.id, order);
  }

  if (overlay?.o) {
    for (const compact of overlay.o) {
      if (compact.cid !== customerId) continue;
      if (!byId.has(compact.id)) {
        const cancelledAt = overlay.c?.[compact.id];
        byId.set(compact.id, hydrateCompactOrder(compact, cancelledAt));
      }
    }
  }

  if (overlay?.c) {
    for (const [id, order] of byId.entries()) {
      const cancelledAt = overlay.c[id];
      if (cancelledAt && order.status === "Processing") {
        byId.set(id, {
          ...order,
          status: "Cancelled",
          paymentStatus: "Cancelled",
          statusHistory: {
            ...order.statusHistory,
            cancelledAt,
          },
        });
      }
    }
  }

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );
}

export function appendCompactOrderToOverlay(
  existing: OrdersCookieOverlay | null,
  newOrder: Order
): OrdersCookieOverlay {
  const created = [
    compactOrder(newOrder),
    ...(existing?.o ?? []).filter((entry) => entry.id !== newOrder.id),
  ];
  const cancelled = { ...(existing?.c ?? {}) };

  const overlay: OrdersCookieOverlay = { o: created, c: cancelled };
  while (
    overlay.o.length > 1 &&
    Buffer.byteLength(signCookieValue(overlay), "utf8") > MAX_COOKIE_VALUE_BYTES
  ) {
    overlay.o.pop();
  }
  return overlay;
}

export function markOrderCancelledInOverlay(
  existing: OrdersCookieOverlay | null,
  order: Order
): OrdersCookieOverlay {
  const cancelledAt =
    order.statusHistory.cancelledAt ?? new Date().toISOString();
  const overlay: OrdersCookieOverlay = {
    o: [...(existing?.o ?? [])],
    c: {
      ...(existing?.c ?? {}),
      [order.id]: cancelledAt,
    },
  };
  return overlay;
}

export function getNextOrderSeqHint(
  overlay: OrdersCookieOverlay | null
): number | undefined {
  if (!overlay?.o?.length) return undefined;
  let maxSeq = 1050;
  for (const entry of overlay.o) {
    const match = /^MM-\d{4}-(\d+)$/i.exec(entry.id);
    if (match) {
      const parsed = Number.parseInt(match[1], 10);
      if (Number.isFinite(parsed) && parsed > maxSeq) {
        maxSeq = parsed;
      }
    }
  }
  return maxSeq + 1;
}

export type AccountCookieRecord = StoredUserRecord;
