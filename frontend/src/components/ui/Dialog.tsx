import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "./utils";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Dialog({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = "md",
}: DialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={cn(
              "relative z-10 w-full overflow-hidden rounded-2xl border border-border bg-paper p-6 shadow-xl max-h-[90vh] flex flex-col",
              sizes[size],
              className
            )}
          >
            <div className="flex items-center justify-between pb-3">
              {title ? (
                <h3 className="font-serif text-2xl font-semibold leading-none tracking-tight">
                  {title}
                </h3>
              ) : (
                <div />
              )}
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
