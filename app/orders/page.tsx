import type { Metadata } from "next";
import { OrdersDashboard } from "@/components/orders/OrdersDashboard";
import { createPageMetadata } from "@/lib/seo";
import { getServerSessionUser } from "@/lib/server/auth";
import { getOrdersForCustomer } from "@/lib/server/db";
import {
  ORDERS_COOKIE_NAME,
  mergeOrdersWithOverlay,
  readSignedStateCookie,
  type OrdersCookieOverlay,
} from "@/lib/server/serverless-state";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "My Orders | Mitul's Market",
  description:
    "Track and manage all your purchases, status updates, tracking timelines, and invoices at Mitul's Market.",
  path: "/orders",
  noIndex: true,
});

export default async function OrdersPage() {
  const user = await getServerSessionUser();
  const baseOrders = user ? await getOrdersForCustomer(user.id) : [];
  const overlay = user
    ? await readSignedStateCookie<OrdersCookieOverlay>(ORDERS_COOKIE_NAME)
    : null;
  const orders = user
    ? mergeOrdersWithOverlay(baseOrders, user.id, overlay)
    : [];

  return (
    <OrdersDashboard
      initialAuthenticated={Boolean(user)}
      initialCustomerId={user?.id ?? ""}
      initialOrders={orders}
    />
  );
}
