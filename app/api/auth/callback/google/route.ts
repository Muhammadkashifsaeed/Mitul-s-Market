import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  OAUTH_STATE_COOKIE_NAME,
  attachSessionCookie,
  getRequestOrigin,
  getSafeRedirectPath,
  getServerCapabilities,
} from "@/lib/server/auth";
import { upsertGoogleDemoUser } from "@/lib/server/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const origin = getRequestOrigin(request);
  const capabilities = getServerCapabilities();

  if (!capabilities.googleOAuthConfigured) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("google_demo", "1");
    return NextResponse.redirect(loginUrl);
  }

  const stateParam = searchParams.get("state") ?? "";
  const [receivedState, encodedCallback] = stateParam.split(":");
  const storedState = request.cookies.get(OAUTH_STATE_COOKIE_NAME)?.value;
  const code = searchParams.get("code");

  if (!receivedState || !storedState || receivedState !== storedState || !code) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", "oauth_callback_invalid");
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(OAUTH_STATE_COOKIE_NAME);
    return response;
  }

  const targetRedirect = getSafeRedirectPath(
    encodedCallback ? decodeURIComponent(encodedCallback) : "/"
  );

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID as string;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
    const redirectUri = `${origin}/api/auth/callback/google`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      throw new Error("Failed to exchange Google authorization code.");
    }

    const tokenData = (await tokenRes.json()) as { access_token?: string };
    if (!tokenData.access_token) {
      throw new Error("Missing access token from Google.");
    }

    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    if (!profileRes.ok) {
      throw new Error("Failed to retrieve Google user profile.");
    }

    const profile = (await profileRes.json()) as {
      email?: string;
      name?: string;
      picture?: string;
    };

    if (!profile.email) {
      throw new Error("Google account email not provided.");
    }

    const user = await upsertGoogleDemoUser({
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.picture,
    });

    const destination = new URL(targetRedirect, origin);
    const response = NextResponse.redirect(destination);
    response.cookies.delete(OAUTH_STATE_COOKIE_NAME);
    attachSessionCookie(response, user, true, request);
    return response;
  } catch {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", "oauth_callback_invalid");
    if (targetRedirect !== "/") {
      loginUrl.searchParams.set("redirect", targetRedirect);
    }
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(OAUTH_STATE_COOKIE_NAME);
    return response;
  }
}
