import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

export default function StatCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-surface p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="space-y-2">
        <span className="text-sm font-medium text-muted">
          {title}
        </span>
        <h3 className="text-3xl font-bold tracking-tight text-ink">
          {value}
        </h3>
      </div>
      {icon && (
        <div className="h-12 w-12 rounded-full bg-paper flex items-center justify-center text-accent border border-border/50">
          {icon}
        </div>
      )}
    </motion.div>
  );
}
