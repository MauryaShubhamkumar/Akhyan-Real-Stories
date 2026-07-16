import { cn } from "../../lib/cn";

interface Props {
  className?: string;
}

export default function Skeleton({
  className,
}: Props) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-border/40 dark:bg-border/20",
        className
      )}
    />
  );
}
