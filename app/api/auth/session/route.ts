import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  clearSessionCookie,
  getServerAuthSessionState,
} from "@/lib/server/auth";
import type { ApiResponse, AuthSessionState } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionState = await getServerAuthSessionState();
  const payload: ApiResponse<AuthSessionState> = {
    success: true,
    data: sessionState,
  };
  return NextResponse.json(payload, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json(
    {
      success: true,
      message: "Signed out.",
      data: { signedOut: true },
    },
    { status: 200 }
  );

  clearSessionCookie(response, request);

  return response;
}
