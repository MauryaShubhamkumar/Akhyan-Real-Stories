import { motion } from "framer-motion";
import type { Post } from "../../../types";
import StoryHeader from "./StoryHeader";
import StoryMeta from "./StoryMeta";
import StoryPreview from "./StoryPreview";
import StoryFooter from "./StoryFooter";

interface Props {
  post: Post;
  index?: number;
}

export default function StoryCard({ post, index = 0 }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group story-card-hover rounded-2xl px-1 py-7 md:px-3"
    >
      {/* Author + Meta row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <StoryHeader post={post} />
        <span className="text-border text-xs">·</span>
        <StoryMeta
          category={post.category}
          readingTime={post.readingTime}
          createdAt={post.createdAt}
        />
      </div>

      {/* Title + Body preview */}
      <StoryPreview
        id={post.id}
        title={post.title}
        body={post.body}
      />

      {/* Actions */}
      <div className="mt-5 pt-4 border-t border-border/40">
        <StoryFooter post={post} />
      </div>
    </motion.article>
  );
}
