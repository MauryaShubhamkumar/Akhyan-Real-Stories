import {
  forwardRef,
  type TextareaHTMLAttributes,
} from "react";

import { cn } from "../../../lib/cn";

interface Props
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = forwardRef<
  HTMLTextAreaElement,
  Props
>(({ className, error, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-40 w-full resize-none rounded-xl border bg-surface px-4 py-3 outline-none transition text-ink",

        error
          ? "border-red-500"
          : "border-border focus:border-accent",

        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
