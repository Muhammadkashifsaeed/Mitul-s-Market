"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  AlertCircle,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Sparkles,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { GOOGLE_DEMO_ACCOUNTS } from "@/lib/auth-client";
import { apiClient, normalizeApiError } from "@/lib/axios";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import type { AuthCapabilities } from "@/types";

interface LoginFormProps {
  redirectTo: string;
  initialErrorCode?: string;
  initialGoogleDemoOpen?: boolean;
  initialCapabilities: AuthCapabilities;
}

const QUERY_ERROR_MESSAGES: Record<string, string> = {
  oauth_callback_invalid:
    "The Google sign-in verification state expired or was invalid. Please try again.",
};

export function LoginForm({
  redirectTo,
  initialErrorCode,
  initialGoogleDemoOpen = false,
  initialCapabilities,
}: LoginFormProps) {
  const router = useRouter();
  const {
    capabilities: liveCapabilities,
    refresh,
    signInGoogleDemo,
  } = useAuth();
  const capabilities = liveCapabilities ?? initialCapabilities;

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(() =>
    initialErrorCode && QUERY_ERROR_MESSAGES[initialErrorCode]
      ? QUERY_ERROR_MESSAGES[initialErrorCode]
      : null
  );
  const [showGooglePicker, setShowGooglePicker] = useState(
    initialGoogleDemoOpen
  );
  const [showCustomGoogle, setShowCustomGoogle] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [googlePendingKey, setGooglePendingKey] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  function fillDemoCredentials() {
    setValue("email", "aarav.patel@mitulsmarket.com", { shouldValidate: true });
    setValue("password", "Demo@1234", { shouldValidate: true });
    setServerError(null);
  }

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      await apiClient.post("/auth/login", values);
      await refresh();
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      setServerError(normalizeApiError(error).message);
    }
  }

  function handleGoogleClick() {
    setServerError(null);
    if (capabilities.googleOAuthConfigured) {
      router.push(
        `/api/auth/signin/google?callbackUrl=${encodeURIComponent(redirectTo)}`
      );
      return;
    }
    setShowGooglePicker((prev) => !prev);
  }

  async function handleGooglePreset(preset: "aarav" | "priya") {
    setServerError(null);
    setGooglePendingKey(preset);
    const result = await signInGoogleDemo({ preset });
    if (!result.ok) {
      setGooglePendingKey(null);
      setServerError(result.message);
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  async function handleCustomGoogleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setServerError(null);
    const emailTrimmed = customGoogleEmail.trim();
    const nameTrimmed = customGoogleName.trim();
    if (!emailTrimmed || !emailTrimmed.includes("@")) {
      setServerError("Please enter a valid Google email address.");
      return;
    }
    setGooglePendingKey("custom");
    const result = await signInGoogleDemo({
      email: emailTrimmed,
      name: nameTrimmed.length >= 2 ? nameTrimmed : undefined,
    });
    if (!result.ok) {
      setGooglePendingKey(null);
      setServerError(result.message);
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  const signupHref =
    redirectTo && redirectTo !== "/"
      ? `/signup?redirect=${encodeURIComponent(redirectTo)}`
      : "/signup";

  return (
    <AuthPageShell
      badgeText="Account Access"
      title="Welcome Back"
      subtitle="Sign in to track your orders, manage saved items, and check out faster."
      redirectTo={redirectTo}
      footer={
        <p>
          New to Mitul&apos;s Market?{" "}
          <Link
            href={signupHref}
            className="font-bold text-[#4F46E5] hover:underline"
          >
            Create an account
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

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="login-password"
              className="block text-sm font-semibold text-[#1E293B]"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#4F46E5] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
              className={`flex h-11 w-full rounded-xl border bg-white px-3.5 pr-11 text-sm text-[#1E293B] placeholder:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white ${errors.password
                  ? "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500/30"
                  : "border-gray-200 focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/25"
                }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#1E293B]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {errors.password?.message && (
            <p
              id="login-password-error"
              role="alert"
              className="text-xs font-medium text-rose-600"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-2.5">
            <input
              id="rememberMe"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]"
              {...register("rememberMe")}
            />
            <label
              htmlFor="rememberMe"
              className="text-xs font-medium text-[#475569] sm:text-sm"
            >
              Keep me signed in
            </label>
          </div>

          <button
            type="button"
            onClick={fillDemoCredentials}
            className="cursor-pointer rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-[#4F46E5] transition-colors hover:bg-indigo-100"
          >
            Fill Demo Account
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || Boolean(googlePendingKey)}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#4F46E5]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" aria-hidden="true" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-white px-3 font-semibold text-[#64748B]">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Sign-In Trigger */}
      <button
        type="button"
        disabled={Boolean(googlePendingKey)}
        onClick={handleGoogleClick}
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-[#1E293B] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm disabled:opacity-60"
      >
        <FcGoogle className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>Continue with Google</span>
        {!capabilities.googleOAuthConfigured && (
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${showGooglePicker ? "rotate-180" : ""
              }`}
            aria-hidden="true"
          />
        )}
      </button>

      {/* Google Runnable Demo Account Chooser */}
      {showGooglePicker && !capabilities.googleOAuthConfigured && (
        <div className="mt-4 space-y-2.5 rounded-2xl border border-indigo-100 bg-[#F8FAFC] p-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Choose Google Account</span>
            </span>
            <span className="text-[11px] text-[#64748B]">Instant Sign-In</span>
          </div>

          {GOOGLE_DEMO_ACCOUNTS.map((account) => {
            const isLoadingThis = googlePendingKey === account.preset;
            return (
              <button
                key={account.preset}
                type="button"
                disabled={Boolean(googlePendingKey)}
                onClick={() => handleGooglePreset(account.preset)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-left transition-all hover:border-[#4F46E5]/50 hover:bg-indigo-50/40 disabled:opacity-60"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-xs font-bold text-white">
                    {account.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#1E293B]">
                      {account.name}
                    </p>
                    <p className="truncate text-xs text-[#64748B]">
                      {account.email}
                    </p>
                  </div>
                </div>
                {isLoadingThis ? (
                  <Loader2
                    className="h-4 w-4 shrink-0 animate-spin text-[#4F46E5]"
                    aria-hidden="true"
                  />
                ) : (
                  <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#4F46E5]">
                    {account.badge}
                  </span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            disabled={Boolean(googlePendingKey)}
            onClick={() => setShowCustomGoogle((prev) => !prev)}
            className="w-full cursor-pointer py-1 text-center text-xs font-semibold text-[#64748B] transition-colors hover:text-[#4F46E5]"
          >
            {showCustomGoogle
              ? "Hide custom Google email"
              : "+ Sign in with custom Google email"}
          </button>

          {showCustomGoogle && (
            <form onSubmit={handleCustomGoogleSubmit} className="space-y-2">
              <input
                type="text"
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                placeholder="Full name (optional)"
                aria-label="Custom Google full name"
                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-[#1E293B] placeholder:text-gray-400 focus:border-[#4F46E5] focus:outline-none"
              />
              <input
                type="email"
                required
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                placeholder="you@gmail.com"
                aria-label="Custom Google email"
                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-[#1E293B] placeholder:text-gray-400 focus:border-[#4F46E5] focus:outline-none"
              />
              <button
                type="submit"
                disabled={Boolean(googlePendingKey)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#1E293B] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#0F172A] disabled:opacity-60"
              >
                {googlePendingKey === "custom" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FcGoogle className="h-4 w-4" aria-hidden="true" />
                )}
                <span>Continue with Custom Account</span>
              </button>
            </form>
          )}
        </div>
      )}
    </AuthPageShell>
  );
}
