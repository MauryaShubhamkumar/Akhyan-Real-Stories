import { motion } from "framer-motion";
import { Card } from "../../ui";
import type { Post } from "../../../types";
import StoryHeader from "./StoryHeader";
import StoryMeta from "./StoryMeta";
import StoryPreview from "./StoryPreview";
import StoryFooter from "./StoryFooter";

interface Props {
  post: Post;
}

export default function StoryCard({ post }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="p-6 space-y-4" hoverable>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <StoryHeader post={post} />
          <span>•</span>
          <StoryMeta
            category={post.category}
            readingTime={post.readingTime}
            createdAt={post.createdAt}
          />
        </div>

        <StoryPreview
          id={post.id}
          title={post.title}
          body={post.body}
        />

        <StoryFooter post={post} />
      </Card>
    </motion.article>
  );
}
