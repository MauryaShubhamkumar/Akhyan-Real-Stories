import * as React from "react";
import { cn } from "./utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export default function Spinner({
  size = "md",
  className,
  ...props
}: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-current border-t-transparent",
        sizes[size],
        className
      )}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
