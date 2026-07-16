import { type ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { Label, Muted } from "../Typography";

interface FieldProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export default function Field({
  label,
  error,
  helperText,
  required,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </Label>

      {children}

      {error ? (
        <p className="text-sm text-red-500">
          {error}
        </p>
      ) : helperText ? (
        <Muted>{helperText}</Muted>
      ) : null}
    </div>
  );
}
