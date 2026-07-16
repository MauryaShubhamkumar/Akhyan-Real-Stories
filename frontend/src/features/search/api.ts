import { getPosts } from "../posts/api";

export interface SearchParams {
  q?: string;
  category?: string;
  sort?: "new" | "top" | "trending";
  page?: number;
}

export function searchStories(
  params: SearchParams
) {
  return getPosts({
    page: params.page ?? 1,
    category: params.category as any,
    q: params.q,
    sort: params.sort,
  });
}
