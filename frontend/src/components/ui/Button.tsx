import { Slot, Slottable } from "@radix-ui/react-slot";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

import { Loader2 } from "lucide-react";

import { cn } from "../../lib/cn";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

type Size =
  | "sm"
  | "md"
  | "lg";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  asChild?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:opacity-90",

  secondary:
    "border border-border bg-surface text-ink hover:bg-border",

  outline:
    "border border-border bg-transparent text-ink hover:bg-surface",

  ghost:
    "bg-transparent text-ink hover:bg-surface",

  danger:
    "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",

  md: "h-11 px-5 text-sm",

  lg: "h-12 px-6 text-base",
};

const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        disabled={!asChild ? disabled || loading : undefined}
        className={cn(
          "inline-flex select-none items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2
            size={18}
            className="animate-spin"
          />
        ) : (
          leftIcon
        )}

        <Slottable>{children}</Slottable>

        {!loading && rightIcon}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export default Button;