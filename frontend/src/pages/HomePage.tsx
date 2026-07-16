import { useSearchParams } from "react-router-dom";

import { usePosts } from "../features/posts/hooks";
import StoryCard from "../components/story/StoryCard";
import StoryCardSkeleton from "../components/story/StoryCardSkeleton";
import StorySortTabs from "../components/story/StorySortTabs";
import { Button, H1, Text } from "../components/ui";

import {
  categories,
} from "../constants/categories";

import type {
  Category,
} from "../types";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = (searchParams.get("category") as Category | null) ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const sort = searchParams.get("sort") ?? "new";
  const q = searchParams.get("q") ?? "";

  const { data, isLoading, error } = usePosts(page, category, sort, q);

  const updateParams = (newParams: Record<string, string | number | undefined>) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    setSearchParams(nextParams);
  };

  const handleCategoryChange = (value: Category | "") => {
    updateParams({
      category: value,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({
      page: newPage,
    });
  };

  const posts = data?.posts ?? [];
  const pagination = data?.pagination ?? null;

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <section>
        <H1>
          Real stories from real people.
        </H1>

        <Text className="max-w-xl mt-4 text-muted">
          A quiet place for the things we don't usually say out loud.
        </Text>
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((item) => (
            <Button
              key={item.label}
              onClick={() =>
                handleCategoryChange(item.value)
              }
              variant={category === item.value ? "primary" : "ghost"}
              size="sm"
              className={category === item.value ? "" : "text-muted hover:text-ink"}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <StorySortTabs />
      </div>

      {isLoading ? (
        <div className="space-y-6 py-6 animate-fade-in">
          <StoryCardSkeleton />
          <StoryCardSkeleton />
          <StoryCardSkeleton />
        </div>
      ) : error ? (
        <div className="py-16 text-center text-red-600">
          {error instanceof Error ? error.message : "Unable to load stories"}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-serif text-2xl text-ink">
            No stories yet.
          </p>

          <p className="mt-2 text-muted">
            Maybe you should write the first one.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {posts.map((post) => (
            <StoryCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      )}

      {!isLoading &&
        pagination &&
        pagination.totalPages > 1 && (
          <div className="flex items-center justify-between py-10">
            <Button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>

            <span className="text-sm text-muted">
              Page {page} of {pagination.totalPages}
            </span>

            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={
                page === pagination.totalPages
              }
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        )}
    </main>
  );
}