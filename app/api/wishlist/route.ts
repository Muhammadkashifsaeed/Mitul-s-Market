import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getProductById } from "@/lib/products";
import { getServerSessionUser } from "@/lib/server/auth";
import {
  addWishlistForUser,
  getWishlistForUser,
  removeWishlistForUser,
} from "@/lib/server/db";
import {
  WISHLIST_COOKIE_NAME,
  readSignedStateCookie,
  setSignedStateCookie,
  type WishlistCookieState,
} from "@/lib/server/serverless-state";
import type { ApiResponse, WishlistApiPayload } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getServerSessionUser();
  let productIds: string[] = [];

  if (user) {
    const cookieWishlist = await readSignedStateCookie<WishlistCookieState>(
      WISHLIST_COOKIE_NAME,
      request
    );
    productIds =
      cookieWishlist?.userId === user.id
        ? cookieWishlist.productIds
        : await getWishlistForUser(user.id);
  }

  const payload: ApiResponse<WishlistApiPayload> = {
    success: true,
    data: {
      backendConfigured: true,
      authenticated: Boolean(user),
      productIds,
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
        message: "Please sign in to save items to your wishlist.",
      },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    productId?: string;
  };
  const productId = body.productId?.trim();
  if (!productId) {
    return NextResponse.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "Product ID is required.",
      },
      { status: 400 }
    );
  }

  if (!getProductById(productId)) {
    return NextResponse.json(
      {
        success: false,
        code: "NOT_FOUND",
        message: "Product was not found in the catalog.",
      },
      { status: 404 }
    );
  }

  const cookieWishlist = await readSignedStateCookie<WishlistCookieState>(
    WISHLIST_COOKIE_NAME,
    request
  );
  const seedIds =
    cookieWishlist?.userId === user.id ? cookieWishlist.productIds : undefined;
  const productIds = await addWishlistForUser(user.id, productId, seedIds);

  const payload: ApiResponse<WishlistApiPayload> = {
    success: true,
    message: "Saved to your wishlist.",
    data: {
      backendConfigured: true,
      authenticated: true,
      productIds,
    },
  };

  const response = NextResponse.json(payload, { status: 200 });
  setSignedStateCookie(
    response,
    WISHLIST_COOKIE_NAME,
    { userId: user.id, productIds },
    request
  );
  return response;
}

export async function DELETE(request: NextRequest) {
  const user = await getServerSessionUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        code: "UNAUTHORIZED",
        message: "Please sign in to manage your wishlist.",
      },
      { status: 401 }
    );
  }

  let productId = request.nextUrl.searchParams.get("productId")?.trim() ?? "";
  if (!productId) {
    const body = (await request.json().catch(() => ({}))) as {
      productId?: string;
    };
    productId = body.productId?.trim() ?? "";
  }

  if (!productId) {
    return NextResponse.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "Product ID is required.",
      },
      { status: 400 }
    );
  }

  const cookieWishlist = await readSignedStateCookie<WishlistCookieState>(
    WISHLIST_COOKIE_NAME,
    request
  );
  const seedIds =
    cookieWishlist?.userId === user.id ? cookieWishlist.productIds : undefined;
  const productIds = await removeWishlistForUser(user.id, productId, seedIds);

  const payload: ApiResponse<WishlistApiPayload> = {
    success: true,
    message: "Removed from your wishlist.",
    data: {
      backendConfigured: true,
      authenticated: true,
      productIds,
    },
  };

  const response = NextResponse.json(payload, { status: 200 });
  setSignedStateCookie(
    response,
    WISHLIST_COOKIE_NAME,
    { userId: user.id, productIds },
    request
  );
  return response;
}
