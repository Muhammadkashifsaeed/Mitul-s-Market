"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { GOOGLE_DEMO_ACCOUNTS } from "@/lib/auth-client";
import { apiClient, normalizeApiError } from "@/lib/axios";
import { signupSchema, type SignupFormValues } from "@/lib/validations";
import type { AuthCapabilities } from "@/types";

interface SignupFormProps {
  redirectTo: string;
  initialCapabilities: AuthCapabilities;
}

export function SignupForm({
  redirectTo,
  initialCapabilities,
}: SignupFormProps) {
  const router = useRouter();
  const {
    capabilities: liveCapabilities,
    refresh,
    signInGoogleDemo,
  } = useAuth();
  const capabilities = liveCapabilities ?? initialCapabilities;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [googlePendingKey, setGooglePendingKey] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const passwordValue =
    useWatch({
      control,
      name: "password",
      defaultValue: "",
    }) ?? "";
  const passwordChecks = [
    { label: "8+ chars", met: passwordValue.length >= 8 },
    { label: "1 letter", met: /[A-Za-z]/.test(passwordValue) },
    { label: "1 number", met: /[0-9]/.test(passwordValue) },
  ];

  async function onSubmit(values: SignupFormValues) {
    setServerError(null);
    try {
      await apiClient.post("/auth/signup", values);
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

  const loginHref =
    redirectTo && redirectTo !== "/"
      ? `/login?redirect=${encodeURIComponent(redirectTo)}`
      : "/login";

  return (
    <AuthPageShell
      badgeText="New Customer"
      title="Create Your Account"
      subtitle="Join Mitul's Market to sync wishlists, save addresses, and track orders seamlessly."
      redirectTo={redirectTo}
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href={loginHref}
            className="font-bold text-[#4F46E5] hover:underline"
          >
            Sign in
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
          label="Full Name"
          placeholder="e.g., Aarav Patel"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-password"
            className="block text-sm font-semibold text-[#1E293B]"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "signup-password-error" : undefined
              }
              className={`flex h-11 w-full rounded-xl border bg-white px-3.5 pr-11 text-sm text-[#1E293B] placeholder:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white ${
                errors.password
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

          {/* Password Requirements Meter */}
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

          {errors.password?.message && (
            <p
              id="signup-password-error"
              role="alert"
              className="text-xs font-medium text-rose-600"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-confirm-password"
            className="block text-sm font-semibold text-[#1E293B]"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword
                  ? "signup-confirm-password-error"
                  : undefined
              }
              className={`flex h-11 w-full rounded-xl border bg-white px-3.5 pr-11 text-sm text-[#1E293B] placeholder:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white ${
                errors.confirmPassword
                  ? "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500/30"
                  : "border-gray-200 focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/25"
              }`}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              className="absolute right-2.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#1E293B]"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {errors.confirmPassword?.message && (
            <p
              id="signup-confirm-password-error"
              role="alert"
              className="text-xs font-medium text-rose-600"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Accept Terms */}
        <div className="space-y-1 pt-0.5">
          <div className="flex items-start gap-2.5">
            <input
              id="acceptTerms"
              type="checkbox"
              aria-invalid={Boolean(errors.acceptTerms)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]"
              {...register("acceptTerms")}
            />
            <label
              htmlFor="acceptTerms"
              className="text-xs leading-relaxed text-[#475569]"
            >
              I agree to the Mitul&apos;s Market{" "}
              <Link
                href="/terms-conditions"
                className="font-semibold text-[#4F46E5] hover:underline"
              >
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="font-semibold text-[#4F46E5] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </label>
          </div>
          {errors.acceptTerms?.message && (
            <p role="alert" className="text-xs font-medium text-rose-600">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || Boolean(googlePendingKey)}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#4F46E5]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              <span>Create Account</span>
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

      {/* Google Button */}
      <button
        type="button"
        disabled={Boolean(googlePendingKey)}
        onClick={handleGoogleClick}
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-[#1E293B] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm disabled:opacity-60"
      >
        <FcGoogle className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>Sign up with Google</span>
        {!capabilities.googleOAuthConfigured && (
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${
              showGooglePicker ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        )}
      </button>

      {showGooglePicker && !capabilities.googleOAuthConfigured && (
        <div className="mt-4 space-y-2.5 rounded-2xl border border-indigo-100 bg-[#F8FAFC] p-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Continue with Google</span>
            </span>
            <span className="text-[11px] text-[#64748B]">Instant Setup</span>
          </div>

          {GOOGLE_DEMO_ACCOUNTS.map((account) => (
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
              {googlePendingKey === account.preset ? (
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
          ))}

          <form onSubmit={handleCustomGoogleSubmit} className="space-y-2 pt-1">
            <p className="text-xs font-semibold text-[#475569]">
              Or use your own Google email
            </p>
            <input
              type="text"
              value={customGoogleName}
              onChange={(e) => setCustomGoogleName(e.target.value)}
              placeholder="Full name"
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
              <span>Sign Up with Custom Google Email</span>
            </button>
          </form>
        </div>
      )}
    </AuthPageShell>
  );
}
