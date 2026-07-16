import { ThumbsDown, ThumbsUp } from "lucide-react";

interface Props {
  likes: number;
  dislikes: number;
}

export default function ReactionBar({ likes, dislikes }: Props) {
  return (
    <div className="flex items-center gap-4 text-sm text-muted">
      <span className="flex items-center gap-1.5 hover:text-ink transition-colors">
        <ThumbsUp size={15} />
        {likes}
      </span>

      <span className="flex items-center gap-1.5 hover:text-ink transition-colors">
        <ThumbsDown size={15} />
        {dislikes}
      </span>
    </div>
  );
}
