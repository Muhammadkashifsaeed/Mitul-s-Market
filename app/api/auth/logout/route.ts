import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clearSessionCookie } from "@/lib/server/auth";

export async function POST(request: NextRequest) {
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
