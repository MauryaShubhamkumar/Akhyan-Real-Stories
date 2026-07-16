import { Clock3, Eye } from "lucide-react";

interface Props {
  category: string;
  readingTime: number;
  views: number;
}

export default function StoryMeta({
  category,
  readingTime,
  views,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
      <span>{category}</span>

      <span>•</span>

      <span className="flex items-center gap-1">
        <Clock3 size={15} />
        {readingTime} min read
      </span>

      <span>•</span>

      <span className="flex items-center gap-1">
        <Eye size={15} />
        {views.toLocaleString()}
      </span>
    </div>
  );
}
