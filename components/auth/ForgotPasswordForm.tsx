"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  MailCheck,
} from "lucide-react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { Input } from "@/components/ui/input";
import { apiClient, normalizeApiError } from "@/lib/axios";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordFormValues,
  type ResetPasswordFormValues,
} from "@/lib/validations";
import type { AuthCapabilities } from "@/types";

interface ForgotPasswordFormProps {
  initialCapabilities: AuthCapabilities;
}

export function ForgotPasswordForm({
  initialCapabilities: _initialCapabilities,
}: ForgotPasswordFormProps) {
  void _initialCapabilities;

  const [step, setStep] = useState<"request" | "reset" | "done">("request");
  const [serverError, setServerError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [targetEmail, setTargetEmail] = useState("");
  const [resetCodePreview, setResetCodePreview] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const requestForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue =
    useWatch({
      control: resetForm.control,
      name: "newPassword",
      defaultValue: "",
    }) ?? "";

  const passwordChecks = [
    { label: "8+ chars", met: newPasswordValue.length >= 8 },
    { label: "1 letter", met: /[A-Za-z]/.test(newPasswordValue) },
    { label: "1 number", met: /[0-9]/.test(newPasswordValue) },
  ];

  async function onRequestSubmit(values: ForgotPasswordFormValues) {
    setServerError(null);
    setStatusMessage(null);
    try {
      const response = await apiClient.post<{
        message?: string;
        data?: {
          email?: string;
          found?: boolean;
          resetCodePreview?: string;
        };
      }>("/auth/forgot-password", values);

      const resolvedEmail = response.data.data?.email ?? values.email.trim();
      setTargetEmail(resolvedEmail);
      setResetCodePreview(response.data.data?.resetCodePreview ?? null);
      setStatusMessage(
        response.data.message ??
          "Enter the 6-digit verification code and your new password below."
      );
      resetForm.reset({
        email: resolvedEmail,
        code: "",
        newPassword: "",
        confirmPassword: "",
      });
      setStep("reset");
    } catch (error) {
      setServerError(normalizeApiError(error).message);
    }
  }

  async function onResetSubmit(values: ResetPasswordFormValues) {
    setServerError(null);
    setStatusMessage(null);
    try {
      const response = await apiClient.post<{ message?: string }>(
        "/auth/reset-password",
        values
      );
      setStatusMessage(
        response.data.message ?? "Your password has been updated successfully."
      );
      setStep("done");
    } catch (error) {
      setServerError(normalizeApiError(error).message);
    }
  }

  return (
    <AuthPageShell
      badgeText="Account Recovery"
      title={
        step === "done"
          ? "Password Updated"
          : step === "reset"
            ? "Enter Verification Code"
            : "Reset Your Password"
      }
      subtitle={
        step === "done"
          ? "Your new password is saved and ready to use."
          : step === "reset"
            ? "Verify your 6-digit code and choose a strong new password."
            : "Enter the email address associated with your account to generate a reset code."
      }
      footer={
        <p>
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-bold text-[#4F46E5] hover:underline"
          >
            Back to Sign In
          </Link>
        </p>
      }
    >
      {serverError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs leading-relaxed text-rose-900"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-rose-600"
            aria-hidden="true"
          />
          <span>{serverError}</span>
        </div>
      )}

      {statusMessage && step !== "done" && (
        <div
          role="status"
          className="mb-5 flex items-start gap-2.5 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-3.5 text-xs leading-relaxed text-[#1E293B]"
        >
          <CheckCircle2
            className="mt-0.5 h-4 w-4 shrink-0 text-[#4F46E5]"
            aria-hidden="true"
          />
          <div className="flex-1">
            <p className="font-medium">{statusMessage}</p>
            {resetCodePreview && (
              <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-indigo-200 bg-white px-3 py-2">
                <span className="text-xs text-[#64748B]">
                  Verification Code:
                </span>
                <code
                  data-testid="reset-code-preview"
                  className="font-mono text-sm font-bold tracking-widest text-[#4F46E5]"
                >
                  {resetCodePreview}
                </code>
                <button
                  type="button"
                  onClick={() =>
                    resetForm.setValue("code", resetCodePreview, {
                      shouldValidate: true,
                    })
                  }
                  className="ml-auto cursor-pointer rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-[#4F46E5] hover:bg-indigo-100"
                >
                  Fill Code
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {step === "request" && (
        <form
          onSubmit={requestForm.handleSubmit(onRequestSubmit)}
          noValidate
          className="space-y-4"
        >
          <Input
            label="Registered Email Address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={requestForm.formState.errors.email?.message}
            {...requestForm.register("email")}
          />

          <button
            type="submit"
            disabled={requestForm.formState.isSubmitting}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#4F46E5]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
          >
            {requestForm.formState.isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Generating Code...</span>
              </>
            ) : (
              <>
                <MailCheck className="h-4 w-4" aria-hidden="true" />
                <span>Get Verification Code</span>
              </>
            )}
          </button>
        </form>
      )}

      {step === "reset" && (
        <form
          onSubmit={resetForm.handleSubmit(onResetSubmit)}
          noValidate
          className="space-y-4"
        >
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#F8FAFC] px-3.5 py-2 text-xs">
            <span className="truncate font-medium text-[#1E293B]">
              {targetEmail}
            </span>
            <button
              type="button"
              onClick={() => {
                setStep("request");
                setServerError(null);
                setStatusMessage(null);
              }}
              className="ml-2 shrink-0 cursor-pointer font-semibold text-[#4F46E5] hover:underline"
            >
              Change email
            </button>
          </div>

          <Input
            label="6-Digit Verification Code"
            placeholder="123456"
            inputMode="numeric"
            maxLength={6}
            error={resetForm.formState.errors.code?.message}
            {...resetForm.register("code")}
          />

          <div className="space-y-1.5">
            <label
              htmlFor="reset-new-password"
              className="block text-sm font-semibold text-[#1E293B]"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="reset-new-password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Choose a strong password"
                autoComplete="new-password"
                aria-invalid={Boolean(resetForm.formState.errors.newPassword)}
                className={`flex h-11 w-full rounded-xl border bg-white px-3.5 pr-11 text-sm text-[#1E293B] placeholder:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white ${
                  resetForm.formState.errors.newPassword
                    ? "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500/30"
                    : "border-gray-200 focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/25"
                }`}
                {...resetForm.register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                className="absolute right-2.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#1E293B]"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {passwordChecks.map((check) => (
                <span
                  key={check.label}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    check.met
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-[#64748B]"
                  }`}
                >
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                  <span>{check.label}</span>
                </span>
              ))}
            </div>

            {resetForm.formState.errors.newPassword?.message && (
              <p role="alert" className="text-xs font-medium text-rose-600">
                {resetForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <Input
            label="Confirm New Password"
            type={showNewPassword ? "text" : "password"}
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            error={resetForm.formState.errors.confirmPassword?.message}
            {...resetForm.register("confirmPassword")}
          />

          <button
            type="submit"
            disabled={resetForm.formState.isSubmitting}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#4F46E5]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
          >
            {resetForm.formState.isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </form>
      )}

      {step === "done" && (
        <div className="space-y-4">
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-900 sm:text-sm"
          >
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
              aria-hidden="true"
            />
            <span>{statusMessage}</span>
          </div>

          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#4F46E5]/25 transition-colors hover:bg-[#4338CA]"
          >
            <span>Sign In with New Password</span>
          </Link>
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-3.5 text-xs leading-relaxed text-[#64748B]">
        If you signed up using Google or need additional support, email{" "}
        <a
          href="mailto:support@mitulsmarket.com"
          className="font-semibold text-[#4F46E5] hover:underline"
        >
          support@mitulsmarket.com
        </a>{" "}
        or visit our{" "}
        <Link
          href="/help-center"
          className="font-semibold text-[#4F46E5] hover:underline"
        >
          Help Center
        </Link>
        .
      </div>
    </AuthPageShell>
  );
}
