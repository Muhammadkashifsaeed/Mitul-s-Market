import crypto from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  completePasswordReset,
  findUserByEmail,
  upsertUserRecordInStore,
} from "@/lib/server/db";
import {
  ACCOUNT_COOKIE_NAME,
  RESET_COOKIE_NAME,
  clearSignedStateCookie,
  readSignedStateCookie,
  setSignedStateCookie,
  type AccountCookieRecord,
  type ResetCookieState,
} from "@/lib/server/serverless-state";
import { resetPasswordSchema } from "@/lib/validations";

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

  const parsed = resetPasswordSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "Please review the reset code and password fields.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase();
  let result = await completePasswordReset({
    email: normalizedEmail,
    code: parsed.data.code,
    newPassword: parsed.data.newPassword,
  });

  if (!result.ok) {
    const resetCookie = await readSignedStateCookie<ResetCookieState>(
      RESET_COOKIE_NAME,
      request
    );
    const codeHash = crypto
      .createHash("sha256")
      .update(parsed.data.code.trim())
      .digest("hex");

    if (
      resetCookie &&
      resetCookie.email.trim().toLowerCase() === normalizedEmail &&
      resetCookie.resetTokenExpiresAt >= Date.now() &&
      resetCookie.resetTokenHash === codeHash
    ) {
      const acctCookie = await readSignedStateCookie<AccountCookieRecord>(
        ACCOUNT_COOKIE_NAME,
        request
      );
      const baseRecord =
        acctCookie && acctCookie.email.trim().toLowerCase() === normalizedEmail
          ? acctCookie
          : await findUserByEmail(normalizedEmail);

      if (baseRecord) {
        const salt = crypto.randomBytes(16).toString("hex");
        const updatedRecord: AccountCookieRecord = {
          ...baseRecord,
          passwordSalt: salt,
          passwordHash: crypto
            .scryptSync(parsed.data.newPassword, salt, 64)
            .toString("hex"),
        };
        delete updatedRecord.resetTokenHash;
        delete updatedRecord.resetTokenExpiresAt;
        await upsertUserRecordInStore(updatedRecord);
        result = {
          ok: true,
          message: "Password updated successfully. You can now sign in.",
          record: updatedRecord,
        };
      }
    }
  }

  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        code: "INVALID_RESET_CODE",
        message: result.message,
      },
      { status: 400 }
    );
  }

  const response = NextResponse.json(
    {
      success: true,
      message: result.message,
      data: { reset: true },
    },
    { status: 200 }
  );

  clearSignedStateCookie(response, RESET_COOKIE_NAME, request);
  if (result.record) {
    setSignedStateCookie(response, ACCOUNT_COOKIE_NAME, result.record, request);
  }

  return response;
}

