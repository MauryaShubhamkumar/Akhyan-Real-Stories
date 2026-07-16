import { Clock3, CalendarDays } from "lucide-react";
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
  const relativeDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
      <StoryCategoryBadge category={category} />

      <span>•</span>

      <span className="flex items-center gap-1">
        <Clock3 size={14} />
        {readingTime} min read
      </span>

      <span>•</span>

      <span className="flex items-center gap-1">
        <CalendarDays size={14} />
        {relativeDate}
      </span>
    </div>
  );
}
