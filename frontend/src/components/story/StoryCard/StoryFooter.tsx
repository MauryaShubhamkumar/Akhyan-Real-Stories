import StoryActions from "../StoryActions";
import type { Post } from "../../../types";

interface Props {
  post: Post;
}

export default function StoryFooter({ post }: Props) {
  return (
    <div className="border-t border-border/40 pt-4">
      <StoryActions post={post} />
    </div>
  );
}
