import { Clock3 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Category } from "../../../types";
import StoryCategoryBadge from "../StoryCategoryBadge";

interface Props {
  category: Category;
  readingTime: number;
  createdAt: string;
}

export default function StoryMeta({
  category,
  readingTime,
  createdAt,
}: Props) {
  const relativeDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
      <StoryCategoryBadge category={category} />

      <span className="text-border">·</span>

      <span className="flex items-center gap-1 font-medium">
        <Clock3 size={12} />
        {readingTime} min read
      </span>

      <span className="text-border">·</span>

      <span>{relativeDate}</span>
    </div>
  );
}
