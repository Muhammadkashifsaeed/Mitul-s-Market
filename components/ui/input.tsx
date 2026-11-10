import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, type = "text", ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-[#1E293B]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          className={cn(
            "flex h-11 w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-[#1E293B]",
            "placeholder:text-gray-400 transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white",
            "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:opacity-75",
            error
              ? "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500/30"
              : "border-gray-200 focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/25",
            className
          )}
          {...props}
        />
        {error ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs font-medium text-rose-600"
          >
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-[#64748B]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
