import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSessionUser } from "@/lib/server/auth";
import {
  cancelOrderInStore,
  getOrderByIdForCustomer,
  getOrdersForCustomer,
} from "@/lib/server/db";
import {
  ORDERS_COOKIE_NAME,
  markOrderCancelledInOverlay,
  mergeOrdersWithOverlay,
  readSignedStateCookie,
  setSignedStateCookie,
  type OrdersCookieOverlay,
} from "@/lib/server/serverless-state";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await context.params;
  const decodedId = decodeURIComponent(orderId);
  const user = await getServerSessionUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        code: "UNAUTHORIZED",
        message: "Sign in to view customer order details.",
      },
      { status: 401 }
    );
  }

  const overlay = await readSignedStateCookie<OrdersCookieOverlay>(
    ORDERS_COOKIE_NAME,
    request
  );
  const storeOrders = await getOrdersForCustomer(user.id);
  const merged = mergeOrdersWithOverlay(storeOrders, user.id, overlay);
  const targetLower = decodedId.trim().toLowerCase();
  const order =
    merged.find((o) => o.id.toLowerCase() === targetLower) ??
    (await getOrderByIdForCustomer(decodedId, user.id));
  if (!order) {
    return NextResponse.json(
      {
        success: false,
        code: "NOT_FOUND",
        message: `Order "${decodedId}" was not found for your account.`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: order,
    },
    { status: 200 }
  );
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await context.params;
  const decodedId = decodeURIComponent(orderId);
  const user = await getServerSessionUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        code: "UNAUTHORIZED",
        message: "Sign in to manage your orders.",
      },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    action?: string;
  };
  if (body.action !== "cancel") {
    return NextResponse.json(
      {
        success: false,
        code: "INVALID_ACTION",
        message: "Only order cancellation is supported right now.",
      },
      { status: 400 }
    );
  }

  const existingOverlay = await readSignedStateCookie<OrdersCookieOverlay>(
    ORDERS_COOKIE_NAME,
    request
  );
  let cancelledOrder = null as Awaited<
    ReturnType<typeof getOrderByIdForCustomer>
  >;

  const storeResult = await cancelOrderInStore(decodedId, user.id);
  if (storeResult.ok) {
    cancelledOrder = storeResult.order;
  } else {
    const storeOrders = await getOrdersForCustomer(user.id);
    const merged = mergeOrdersWithOverlay(storeOrders, user.id, existingOverlay);
    const targetLower = decodedId.trim().toLowerCase();
    const matched = merged.find((o) => o.id.toLowerCase() === targetLower);
    if (!matched) {
      return NextResponse.json(
        {
          success: false,
          code: "NOT_FOUND",
          message: `Order "${decodedId}" was not found for your account.`,
        },
        { status: 404 }
      );
    }
    if (matched.status !== "Processing") {
      return NextResponse.json(
        {
          success: false,
          code: "ORDER_CANNOT_CANCEL",
          message: `Order ${matched.id} is already "${matched.status}" and cannot be cancelled.`,
        },
        { status: 400 }
      );
    }
    cancelledOrder = {
      ...matched,
      status: "Cancelled",
      paymentStatus: "Cancelled",
      statusHistory: {
        ...matched.statusHistory,
        cancelledAt: new Date().toISOString(),
      },
    };
  }

  const nextOverlay = markOrderCancelledInOverlay(
    existingOverlay,
    cancelledOrder
  );
  const response = NextResponse.json(
    {
      success: true,
      message: `Order ${cancelledOrder.id} cancelled successfully.`,
      data: cancelledOrder,
    },
    { status: 200 }
  );
  setSignedStateCookie(response, ORDERS_COOKIE_NAME, nextOverlay, request);
  return response;
}
