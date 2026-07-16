import { useQuery } from "@tanstack/react-query";

import { getPosts } from "./api";
import { queryKeys } from "../../lib/queryKeys";

import type { Category } from "../../types";

export function usePosts(
  page: number,
  category?: Category | "",
  sort?: string,
  q?: string
) {
  return useQuery({
    queryKey: queryKeys.posts.list(page, category, sort, q),

    queryFn: () =>
      getPosts({
        page,
        category,
        sort,
        q,
      }),
  });
}
