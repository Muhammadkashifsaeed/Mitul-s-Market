import crypto from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  OAUTH_STATE_COOKIE_NAME,
  attachSessionCookie,
  getRequestOrigin,
  getSafeRedirectPath,
  getServerCapabilities,
  isSecureRequest,
} from "@/lib/server/auth";
import { upsertGoogleDemoUser } from "@/lib/server/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const origin = getRequestOrigin(request);
  const callbackPath = getSafeRedirectPath(searchParams.get("callbackUrl"));
  const presetParam = searchParams.get("preset");
  const capabilities = getServerCapabilities();

  if (!capabilities.googleOAuthConfigured) {
    if (presetParam === "aarav" || presetParam === "priya") {
      const user = await upsertGoogleDemoUser({ preset: presetParam });
      const redirectUrl = new URL(callbackPath, origin);
      const response = NextResponse.redirect(redirectUrl);
      attachSessionCookie(response, user, true, request);
      return response;
    }

    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("google_demo", "1");
    if (callbackPath !== "/") {
      loginUrl.searchParams.set("redirect", callbackPath);
    }
    return NextResponse.redirect(loginUrl);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID as string;
  const state = crypto.randomBytes(24).toString("hex");
  const redirectUri = `${origin}/api/auth/callback/google`;

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("prompt", "select_account");
  googleAuthUrl.searchParams.set(
    "state",
    `${state}:${encodeURIComponent(callbackPath)}`
  );

  const response = NextResponse.redirect(googleAuthUrl);
  response.cookies.set(OAUTH_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
    secure: isSecureRequest(request),
  });
  return response;
}
