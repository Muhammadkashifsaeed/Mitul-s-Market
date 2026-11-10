import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSessionUser } from "@/lib/server/auth";
import { createOrderInStore, getOrdersForCustomer } from "@/lib/server/db";
import {
  ORDERS_COOKIE_NAME,
  appendCompactOrderToOverlay,
  getNextOrderSeqHint,
  mergeOrdersWithOverlay,
  readSignedStateCookie,
  setSignedStateCookie,
  type OrdersCookieOverlay,
} from "@/lib/server/serverless-state";
import { createOrderPayloadSchema } from "@/lib/validations";
import type { ApiResponse, OrdersApiPayload } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getServerSessionUser();
  const baseOrders = user ? await getOrdersForCustomer(user.id) : [];
  const overlay = user
    ? await readSignedStateCookie<OrdersCookieOverlay>(
        ORDERS_COOKIE_NAME,
        request
      )
    : null;
  const orders = user
    ? mergeOrdersWithOverlay(baseOrders, user.id, overlay)
    : [];

  const payload: ApiResponse<OrdersApiPayload> = {
    success: true,
    message: user
      ? "Loaded customer orders."
      : "Sign in to view your customer orders.",
    data: {
      backendConfigured: true,
      authenticated: Boolean(user),
      customerId: user?.id ?? null,
      orders,
    },
  };

  return NextResponse.json(payload, { status: 200 });
}

export async function POST(request: NextRequest) {
  const user = await getServerSessionUser();
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        code: "UNAUTHORIZED",
        message: "Please sign in before placing an order.",
      },
      { status: 401 }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        code: "INVALID_JSON",
        message: "Please send a valid JSON request body.",
      },
      { status: 400 }
    );
  }

  const parsed = createOrderPayloadSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "Please fix the highlighted checkout fields.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const existingOverlay = await readSignedStateCookie<OrdersCookieOverlay>(
    ORDERS_COOKIE_NAME,
    request
  );
  const data = parsed.data;
  const created = await createOrderInStore({
    user,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    shippingAddress: {
      fullName: data.fullName,
      street: data.street,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
    },
    deliveryNotes: data.deliveryNotes,
    items: data.items,
    couponCode: data.couponCode,
    paymentMethod: data.paymentMethod,
    minSeqHint: getNextOrderSeqHint(existingOverlay),
  });

  if (!created.ok) {
    return NextResponse.json(
      {
        success: false,
        code: "ORDER_CREATION_FAILED",
        message: created.message,
      },
      { status: 400 }
    );
  }

  const nextOverlay = appendCompactOrderToOverlay(existingOverlay, created.order);
  const response = NextResponse.json(
    {
      success: true,
      message: `Order ${created.order.id} placed successfully.`,
      data: created.order,
    },
    { status: 201 }
  );
  setSignedStateCookie(response, ORDERS_COOKIE_NAME, nextOverlay, request);
  return response;
}
