import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "./utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center bg-surface/10",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-muted mb-4 border border-border/50 shadow-xs">
          <Icon size={24} className="text-muted" />
        </div>
      )}
      <h3 className="font-serif text-lg font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
