import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { attachSessionCookie } from "@/lib/server/auth";
import {
  findUserByEmail,
  toPublicAuthUser,
  upsertUserRecordInStore,
  verifyPassword,
} from "@/lib/server/db";
import {
  ACCOUNT_COOKIE_NAME,
  readSignedStateCookie,
  type AccountCookieRecord,
} from "@/lib/server/serverless-state";
import { loginSchema } from "@/lib/validations";

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

  const parsed = loginSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "Please check your email and password.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase();
  const acctCookie = await readSignedStateCookie<AccountCookieRecord>(
    ACCOUNT_COOKIE_NAME,
    request
  );
  const cookieMatchesEmail =
    acctCookie && acctCookie.email.trim().toLowerCase() === normalizedEmail
      ? acctCookie
      : null;

  const userRecord =
    cookieMatchesEmail ?? (await findUserByEmail(normalizedEmail));
  if (cookieMatchesEmail) {
    await upsertUserRecordInStore(cookieMatchesEmail);
  }
  if (!userRecord || !verifyPassword(userRecord, parsed.data.password)) {
    return NextResponse.json(
      {
        success: false,
        code: "INVALID_CREDENTIALS",
        message:
          "Invalid email or password. Please verify your details or sign in with Google.",
      },
      { status: 401 }
    );
  }

  const publicUser = toPublicAuthUser(userRecord);
  const response = NextResponse.json(
    {
      success: true,
      message: "Signed in successfully.",
      data: {
        authenticated: true,
        user: publicUser,
      },
    },
    { status: 200 }
  );

  attachSessionCookie(
    response,
    publicUser,
    parsed.data.rememberMe ?? true,
    request
  );

  return response;
}
