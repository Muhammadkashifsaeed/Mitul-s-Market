import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { createPageMetadata } from "@/lib/seo";
import { getSafeRedirectPath, getServerCapabilities } from "@/lib/server/auth";

export const metadata: Metadata = createPageMetadata({
  title: "Sign In | Mitul's Market",
  description:
    "Sign in to your Mitul's Market account with email or Google to manage your orders, saved items, and checkout.",
  path: "/login",
  noIndex: true,
});

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string | string[];
    callbackUrl?: string | string[];
    error?: string | string[];
    google_demo?: string | string[];
  }>;
}

function getSingleParam(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const rawRedirect =
    getSingleParam(params.redirect) ?? getSingleParam(params.callbackUrl);
  const redirectTo = getSafeRedirectPath(rawRedirect);
  const initialErrorCode = getSingleParam(params.error);
  const initialGoogleDemoOpen = getSingleParam(params.google_demo) === "1";
  const capabilities = getServerCapabilities();

  return (
    <LoginForm
      redirectTo={redirectTo}
      initialErrorCode={initialErrorCode}
      initialGoogleDemoOpen={initialGoogleDemoOpen}
      initialCapabilities={capabilities}
    />
  );
}
