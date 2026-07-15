import { Link } from "react-router-dom";
import {
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import type { Post } from "../types";
import { categoryLabels } from "../constants/categories";

interface PostCardProps {
  post: Post;
}

export default function PostCard({
  post,
}: PostCardProps) {
  const authorName = post.isAnonymous
    ? "Anonymous"
    : post.author?.username ?? "Unknown";

  return (
    <article className="border-b border-border py-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-border text-sm font-medium text-muted">
          {post.isAnonymous
            ? "A"
            : authorName.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="text-sm font-medium">
            {authorName}
          </p>

          <p className="text-xs text-muted">
            {new Date(post.createdAt).toLocaleDateString(
              undefined,
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            )}
          </p>
        </div>
      </div>

      <Link
        to={`/post/${post.id}`}
        className="group block"
      >
        <h2 className="mt-5 font-serif text-2xl font-semibold leading-snug group-hover:underline">
          {post.title}
        </h2>

        <p className="mt-3 line-clamp-3 font-serif text-[17px] leading-7 text-muted">
          {post.body}
        </p>
      </Link>

      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-full bg-border/60 px-3 py-1 text-xs text-muted">
          {categoryLabels[post.category]}
        </span>

        <div className="flex items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <ThumbsUp size={15} />
            {post.counts.likes}
          </span>

          <span className="flex items-center gap-1.5">
            <ThumbsDown size={15} />
            {post.counts.dislikes}
          </span>
        </div>
      </div>
    </article>
  );
}