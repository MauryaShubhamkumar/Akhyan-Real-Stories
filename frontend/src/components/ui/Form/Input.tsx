import {
  forwardRef,
  type InputHTMLAttributes,
} from "react";

import { cn } from "../../../lib/cn";

interface Props
  extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<
  HTMLInputElement,
  Props
>(({ className, error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border bg-surface px-4 text-sm outline-none transition text-ink",

        error
          ? "border-red-500"
          : "border-border focus:border-accent",

        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
