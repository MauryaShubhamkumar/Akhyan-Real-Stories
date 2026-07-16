import { useSearchParams } from "react-router-dom";
import { useSearchStories } from "../hooks";
import StoryCard from "../../../components/story/StoryCard";
import StoryCardSkeleton from "../../../components/story/StoryCardSkeleton";
import SearchEmpty from "./SearchEmpty";

export default function SearchResults() {
  const [searchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? undefined;
  const sort = (searchParams.get("sort") as "new" | "top" | "trending" | null) ?? undefined;
  const page = Number(searchParams.get("page") ?? "1");

  const { data, isLoading } = useSearchStories({
    q,
    category,
    sort,
    page,
  });

  if (!q && !category) {
    return (
      <div className="py-16 text-center text-muted">
        Type above to search stories...
      </div>
    );
  }

  const hasValidQuery = q.trim().length >= 3;
  if (q && !hasValidQuery && !category) {
    return (
      <div className="py-16 text-center text-muted">
        Type at least 3 characters to search...
      </div>
    );
  }

  const posts = data?.posts ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6 py-6 animate-fade-in">
        <StoryCardSkeleton />
        <StoryCardSkeleton />
        <StoryCardSkeleton />
      </div>
    );
  }

  if (posts.length === 0) {
    return <SearchEmpty />;
  }

  return (
    <div className="divide-y divide-border/60">
      {posts.map((post) => (
        <StoryCard key={post.id} post={post} />
      ))}
    </div>
  );
}
