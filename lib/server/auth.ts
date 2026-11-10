import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { resolveWritableDataDir } from "@/lib/server/data-dir";
import type {
  AuthCapabilities,
  AuthSessionState,
  AuthUser,
  PaymentMethod,
} from "@/types";

export const SESSION_COOKIE_NAME = "mituls_market_session";
export const OAUTH_STATE_COOKIE_NAME = "mituls_market_oauth_state";

let cachedSecret: string | null = null;

export function getAuthSecret(): string {
  if (process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 16) {
    return process.env.AUTH_SECRET;
  }
  if (cachedSecret) {
    return cachedSecret;
  }

  // On Vercel serverless runtimes without an explicit AUTH_SECRET, derive a
  // deployment-consistent HMAC key so all isolated Serverless Functions verify
  // the same signed session and state cookies.
  if (process.env.VERCEL) {
    const scope =
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.VERCEL_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "mituls-market-vercel";
    cachedSecret = crypto
      .createHmac("sha256", "mituls-market-vercel-runtime-key-v1")
      .update(scope)
      .digest("hex");
    return cachedSecret;
  }

  try {
    const dataDir = resolveWritableDataDir();
    const secretFile = path.join(dataDir, ".auth-secret");
    if (fs.existsSync(secretFile)) {
      const existing = fs.readFileSync(secretFile, "utf8").trim();
      if (existing.length >= 32) {
        cachedSecret = existing;
        return existing;
      }
    }

    const generated = crypto.randomBytes(32).toString("hex");
    fs.writeFileSync(secretFile, generated, "utf8");
    cachedSecret = generated;
    return generated;
  } catch {
    const ephemeral = crypto.randomBytes(32).toString("hex");
    cachedSecret = ephemeral;
    return ephemeral;
  }
}

export function getRequestOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    const host = forwardedHost.split(",")[0].trim();
    const proto = forwardedProto
      ? forwardedProto.split(",")[0].trim()
      : "https";
    return `${proto}://${host}`;
  }
  return request.nextUrl.origin;
}

export function getSafeRedirectPath(raw?: string | null): string {
  if (!raw) return "/";
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return "/";
  }
  return trimmed;
}

export function getServerCapabilities(): AuthCapabilities {
  const hasRealGoogle = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );

  const configuredPaymentMethods: PaymentMethod[] = [
    "UPI",
    "Credit Card",
    "Debit Card",
    "Cash on Delivery",
  ];

  return {
    databaseConfigured: true,
    authSecretConfigured: true,
    credentialsAuthConfigured: true,
    googleOAuthConfigured: hasRealGoogle,
    googleDemoMode: !hasRealGoogle,
    passwordResetConfigured: true,
    paymentConfigured: true,
    configuredPaymentMethods,
  };
}

interface SignedSessionPayload {
  user: AuthUser;
  exp: number;
}

export function signSessionToken(
  user: AuthUser,
  maxAgeSeconds = 7 * 24 * 60 * 60
): string {
  const payload: SignedSessionPayload = {
    user,
    exp: Date.now() + maxAgeSeconds * 1000,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  const signatureB64 = crypto
    .createHmac("sha256", getAuthSecret())
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${signatureB64}`;
}

export function isSecureRequest(request?: NextRequest): boolean {
  if (!request) {
    return process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://") ?? false;
  }
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto) {
    return forwardedProto.split(",")[0].trim().toLowerCase() === "https";
  }
  return request.nextUrl.protocol === "https:";
}

export function attachSessionCookie(
  response: NextResponse,
  user: AuthUser,
  rememberMe = true,
  request?: NextRequest
): void {
  const maxAgeSeconds = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60;
  const token = signSessionToken(user, maxAgeSeconds);
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isSecureRequest(request),
    ...(rememberMe ? { maxAge: maxAgeSeconds } : {}),
  });
}

export function clearSessionCookie(
  response: NextResponse,
  request?: NextRequest
): void {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isSecureRequest(request),
    maxAge: 0,
  });
}

export async function getServerSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!rawToken) return null;

  const parts = rawToken.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signatureB64] = parts;
  if (!payloadB64 || !signatureB64) return null;

  const expectedSignature = crypto
    .createHmac("sha256", getAuthSecret())
    .update(payloadB64)
    .digest("base64url");

  const expectedBuf = Buffer.from(expectedSignature);
  const actualBuf = Buffer.from(signatureB64);
  if (expectedBuf.length !== actualBuf.length) {
    return null;
  }
  if (!crypto.timingSafeEqual(expectedBuf, actualBuf)) {
    return null;
  }

  try {
    const decoded = Buffer.from(payloadB64, "base64url").toString("utf8");
    const parsed = JSON.parse(decoded) as SignedSessionPayload;
    if (
      !parsed ||
      typeof parsed.exp !== "number" ||
      parsed.exp < Date.now() ||
      !parsed.user?.id ||
      !parsed.user?.email
    ) {
      return null;
    }
    return parsed.user;
  } catch {
    return null;
  }
}

export async function getServerAuthSessionState(): Promise<AuthSessionState> {
  const capabilities = getServerCapabilities();
  const user = await getServerSessionUser();
  return {
    authenticated: Boolean(user),
    user,
    capabilities,
  };
}
