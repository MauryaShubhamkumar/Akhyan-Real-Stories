import * as React from "react";
import { cn } from "./utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger";
}

export default function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors border select-none";

  const variants = {
    default: "bg-accent/10 text-accent border-accent/20 dark:bg-accent/20 dark:text-accent",
    secondary: "bg-surface text-muted border-border dark:bg-surface dark:text-muted",
    success:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400",
    warning:
      "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400",
    danger:
      "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400",
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
}
