import ReactionBar from "./ReactionBar";
import ShareMenu from "../shared/ShareMenu";
import { MessageSquare, Eye } from "lucide-react";
import type { Post } from "../../types";

interface Props {
  post: Post;
}

export default function StoryActions({ post }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-6">
        <ReactionBar
          likes={post.counts.likes}
          dislikes={post.counts.dislikes}
        />

        <div className="flex items-center gap-1.5 text-muted text-sm">
          <MessageSquare size={16} />
          <span>{post.commentCount ?? 0}</span>
        </div>

        <div className="flex items-center gap-1.5 text-muted text-sm">
          <Eye size={16} />
          <span>{(post.views ?? 0).toLocaleString()}</span>
        </div>
      </div>

      <ShareMenu title={post.title} />
    </div>
  );
}
