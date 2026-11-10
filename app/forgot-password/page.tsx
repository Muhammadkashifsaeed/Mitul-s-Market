import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { createPageMetadata } from "@/lib/seo";
import { getServerCapabilities } from "@/lib/server/auth";

export const metadata: Metadata = createPageMetadata({
  title: "Reset Password | Mitul's Market",
  description:
    "Request a password reset link for your Mitul's Market customer account.",
  path: "/forgot-password",
  noIndex: true,
});

export default async function ForgotPasswordPage() {
  const capabilities = getServerCapabilities();

  return <ForgotPasswordForm initialCapabilities={capabilities} />;
}

