import StoryActions from "../StoryActions";
import type { Post } from "../../../types";

interface Props {
  post: Post;
}

export default function StoryFooter({ post }: Props) {
  return <StoryActions post={post} />;
}
