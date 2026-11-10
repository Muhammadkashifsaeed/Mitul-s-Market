import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export type BadgeVariant = "default" | "secondary" | "outline" | "success";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-muted text-muted-foreground border-border",
  outline: "bg-transparent text-foreground border-border",
  success:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

