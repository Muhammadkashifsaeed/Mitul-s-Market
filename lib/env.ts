import { z } from "zod";

function resolveSafeAppUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ];

  for (const raw of candidates) {
    if (!raw?.trim()) continue;
    const trimmed = raw.trim();
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    try {
      return new URL(withProtocol).toString().replace(/\/+$/, "");
    } catch {
      // Try next candidate
    }
  }

  return "http://localhost:3000";
}

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Mitul's Market"),
  NEXT_PUBLIC_APP_DESCRIPTION: z
    .string()
    .min(1)
    .default(
      "Shop quality tech, electronics, audio, and lifestyle fashion at Mitul's Market."
    ),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_BASE_URL: z.string().min(1).default("/api"),
});

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  API_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || undefined,
  NEXT_PUBLIC_APP_DESCRIPTION:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION || undefined,
  NEXT_PUBLIC_APP_URL: resolveSafeAppUrl(),
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || undefined,
});

export function getServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() must only be called on the server.");
  }

  return serverEnvSchema.parse({
    NODE_ENV: process.env.NODE_ENV || undefined,
    API_TIMEOUT_MS: process.env.API_TIMEOUT_MS || undefined,
  });
}
