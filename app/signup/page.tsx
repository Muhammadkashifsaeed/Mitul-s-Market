import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";
import { createPageMetadata } from "@/lib/seo";
import { getSafeRedirectPath, getServerCapabilities } from "@/lib/server/auth";

export const metadata: Metadata = createPageMetadata({
  title: "Create Account | Mitul's Market",
  description:
    "Create your Mitul's Market customer account to save products, track deliveries, and speed up future checkouts.",
  path: "/signup",
  noIndex: true,
});

interface SignupPageProps {
  searchParams: Promise<{
    redirect?: string | string[];
    callbackUrl?: string | string[];
  }>;
}

function getSingleParam(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const rawRedirect =
    getSingleParam(params.redirect) ?? getSingleParam(params.callbackUrl);
  const redirectTo = getSafeRedirectPath(rawRedirect);
  const capabilities = getServerCapabilities();

  return (
    <SignupForm redirectTo={redirectTo} initialCapabilities={capabilities} />
  );
}

