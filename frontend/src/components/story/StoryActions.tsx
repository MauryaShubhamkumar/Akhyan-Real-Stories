import ReactionBar from "./ReactionBar";
import ShareMenu from "../shared/ShareMenu";
import { MessageSquare, Eye } from "lucide-react";
import type { Post } from "../../types";

interface Props {
  post: Post;
}

export default function StoryActions({ post }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-5">
        <ReactionBar
          likes={post.counts.likes}
          dislikes={post.counts.dislikes}
        />

        <div className="flex items-center gap-1.5 text-muted text-sm hover:text-ink transition-colors duration-200">
          <MessageSquare size={15} />
          <span>{post.commentCount ?? 0}</span>
        </div>

        <div className="flex items-center gap-1.5 text-muted text-sm hover:text-ink transition-colors duration-200">
          <Eye size={15} />
          <span>{(post.views ?? 0).toLocaleString()}</span>
        </div>
      </div>

      <ShareMenu title={post.title} />
    </div>
  );
}
