import { useQuery } from "@tanstack/react-query";

import { searchStories } from "./api";
import { queryKeys } from "../../lib/queryKeys";

export function useSearchStories(
  params: {
    q?: string;
    category?: string;
    sort?: "new" | "top" | "trending";
    page?: number;
  }
) {
  const hasValidQuery = !!params.q && params.q.trim().length >= 3;

  return useQuery({
    queryKey: queryKeys.posts.list(
      params.page ?? 1,
      params.category,
      params.sort,
      params.q
    ),

    queryFn: () =>
      searchStories(params),

    enabled:
      hasValidQuery ||
      !!params.category,

    placeholderData: (previous) => previous,
  });
}
