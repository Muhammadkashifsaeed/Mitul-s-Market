import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderAccessGate } from "@/components/orders/OrderAccessGate";
import { OrderDetailsView } from "@/components/orders/OrderDetailsView";
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

interface OrderDetailsPageProps {
  params: Promise<{
    orderId: string;
  }>;
  searchParams: Promise<{
    placed?: string | string[];
  }>;
}

export async function generateMetadata({
  params,
}: OrderDetailsPageProps): Promise<Metadata> {
  const { orderId } = await params;
  const decodedId = decodeURIComponent(orderId);

  return createPageMetadata({
    title: `Order ${decodedId} | Mitul's Market`,
    description: `Order details, tracking timeline, payment summary, and invoice for order ${decodedId}.`,
    path: `/orders/${encodeURIComponent(decodedId)}`,
    noIndex: true,
  });
}

export default async function OrderDetailsPage({
  params,
  searchParams,
}: OrderDetailsPageProps) {
  const { orderId } = await params;
  const { placed } = await searchParams;
  const decodedId = decodeURIComponent(orderId);
  const placedValue = Array.isArray(placed) ? placed[0] : placed;

  const user = await getServerSessionUser();
  if (!user) {
    return <OrderAccessGate orderId={decodedId} />;
  }

  const overlay = await readSignedStateCookie<OrdersCookieOverlay>(
    ORDERS_COOKIE_NAME
  );
  const storeOrders = await getOrdersForCustomer(user.id);
  const mergedOrders = mergeOrdersWithOverlay(storeOrders, user.id, overlay);
  const targetLower = decodedId.trim().toLowerCase();
  const matchedOrder =
    mergedOrders.find((o) => o.id.toLowerCase() === targetLower) ?? null;
  if (!matchedOrder) {
    notFound();
  }

  return (
    <OrderDetailsView
      initialOrder={matchedOrder}
      justPlaced={placedValue === "1"}
    />
  );
}
