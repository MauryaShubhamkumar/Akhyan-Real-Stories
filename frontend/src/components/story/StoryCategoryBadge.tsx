import { categoryLabels } from "../../constants/categories";
import type { Category } from "../../types";
import { cn } from "../../lib/cn";

const colors: Record<Category, string> = {
  struggle:
    "bg-red-500/10 text-red-500 dark:text-red-400",

  love:
    "bg-pink-500/10 text-pink-500 dark:text-pink-400",

  school:
    "bg-blue-500/10 text-blue-500 dark:text-blue-400",

  college:
    "bg-purple-500/10 text-purple-500 dark:text-purple-400",

  general:
    "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400",
};

interface Props {
  category: Category;
}

export default function StoryCategoryBadge({
  category,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium border border-transparent select-none",
        colors[category]
      )}
    >
      {categoryLabels[category]}
    </span>
  );
}
