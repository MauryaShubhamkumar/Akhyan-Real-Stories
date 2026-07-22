import {
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "../../lib/cn";

interface BaseProps
  extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export function H1({
  className,
  children,
  ...props
}: BaseProps) {
  return (
    <h1
      className={cn(
        "font-display text-5xl font-bold tracking-tight text-ink leading-[1.15]",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({
  className,
  children,
  ...props
}: BaseProps) {
  return (
    <h2
      className={cn(
        "font-display text-3xl font-semibold tracking-tight text-ink leading-[1.25]",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({
  className,
  children,
  ...props
}: BaseProps) {
  return (
    <h3
      className={cn(
        "font-display text-2xl font-semibold text-ink leading-[1.3]",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function Text({
  className,
  children,
  ...props
}: BaseProps) {
  return (
    <p
      className={cn(
        "text-base leading-7 text-ink",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Muted({
  className,
  children,
  ...props
}: BaseProps) {
  return (
    <p
      className={cn(
        "text-sm leading-6 text-muted",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Label({
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-ink",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
