import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  findUserByEmail,
  issuePasswordResetCode,
  upsertUserRecordInStore,
} from "@/lib/server/db";
import {
  ACCOUNT_COOKIE_NAME,
  RESET_COOKIE_NAME,
  readSignedStateCookie,
  setSignedStateCookie,
  type AccountCookieRecord,
  type ResetCookieState,
} from "@/lib/server/serverless-state";
import { forgotPasswordSchema } from "@/lib/validations";

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

  const parsed = forgotPasswordSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "Please enter a valid email address.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (!existing) {
    const acctCookie = await readSignedStateCookie<AccountCookieRecord>(
      ACCOUNT_COOKIE_NAME,
      request
    );
    if (acctCookie && acctCookie.email.trim().toLowerCase() === normalizedEmail) {
      await upsertUserRecordInStore(acctCookie);
    }
  }

  const issued = await issuePasswordResetCode(normalizedEmail);

  const response = NextResponse.json(
    {
      success: true,
      message: issued.found
        ? "We generated a 6-digit verification code for your account. Enter it below to set a new password."
        : "If an account exists for that email address, a verification code has been issued.",
      data: {
        email: issued.email,
        found: issued.found,
        ...(issued.found && issued.resetCode
          ? { resetCodePreview: issued.resetCode }
          : {}),
      },
    },
    { status: 200 }
  );

  if (issued.found && issued.resetTokenHash && issued.resetTokenExpiresAt) {
    const state: ResetCookieState = {
      email: issued.email,
      resetTokenHash: issued.resetTokenHash,
      resetTokenExpiresAt: issued.resetTokenExpiresAt,
    };
    setSignedStateCookie(response, RESET_COOKIE_NAME, state, request, 900);
  }

  return response;
}
