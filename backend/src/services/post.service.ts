import { PostModel } from "../models/Post.js";

interface GetPostsOptions {
  page: number;
  limit: number;
  q?: string;
  category?: string;
}

export function buildPostFilter({
  q,
  category,
}: GetPostsOptions): Record<string, any> {
  const filter: Record<string, any> = {};

  if (category) {
    filter.category = category;
  }

  if (q) {
    filter.$text = {
      $search: q,
    };
  }

  return filter;
}
