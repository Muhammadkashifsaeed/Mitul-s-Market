import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { attachSessionCookie } from "@/lib/server/auth";
import { createCredentialsUser } from "@/lib/server/db";
import {
  ACCOUNT_COOKIE_NAME,
  setSignedStateCookie,
} from "@/lib/server/serverless-state";
import { signupSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
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

  const parsed = signupSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "Please review the highlighted sign-up fields.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const created = await createCredentialsUser({
    name: parsed.data.name,
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (!created.ok) {
    return NextResponse.json(
      {
        success: false,
        code: "EMAIL_EXISTS",
        message: created.message,
      },
      { status: 409 }
    );
  }

  const response = NextResponse.json(
    {
      success: true,
      message: "Account created and signed in successfully.",
      data: {
        authenticated: true,
        user: created.user,
      },
    },
    { status: 201 }
  );

  attachSessionCookie(response, created.user, true, request);
  setSignedStateCookie(response, ACCOUNT_COOKIE_NAME, created.record, request);

  return response;
}
