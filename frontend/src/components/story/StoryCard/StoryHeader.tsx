import StoryAuthor from "../StoryAuthor";
import type { Post } from "../../../types";

interface Props {
  post: Post;
}

export default function StoryHeader({ post }: Props) {
  return (
    <StoryAuthor
      username={post.author?.username}
      anonymous={post.isAnonymous}
      size="sm"
    />
  );
}
