import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { attachSessionCookie } from "@/lib/server/auth";
import { upsertGoogleDemoUser } from "@/lib/server/db";
import { googleDemoAuthSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  let rawBody: unknown = {};
  try {
    const text = await request.text();
    rawBody = text.trim() ? JSON.parse(text) : {};
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

  const parsed = googleDemoAuthSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "Please provide a valid Google account name and email.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { preset, name, email } = parsed.data;
  const user = await upsertGoogleDemoUser({
    preset: !preset && !email ? "aarav" : preset,
    name,
    email,
  });

  const response = NextResponse.json(
    {
      success: true,
      message: `Signed in with Google as ${user.name}.`,
      data: {
        authenticated: true,
        user,
      },
    },
    { status: 200 }
  );

  attachSessionCookie(response, user, true, request);

  return response;
}

