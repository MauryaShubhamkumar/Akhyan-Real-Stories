import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { PenLine, BookOpen, Flame, Heart, GraduationCap, Sparkles, Layers } from "lucide-react";
import type { ComponentType } from "react";

import { usePosts } from "../features/posts/hooks";
import StoryCard from "../components/story/StoryCard";
import StoryCardSkeleton from "../components/story/StoryCardSkeleton";
import StorySortTabs from "../components/story/StorySortTabs";
import { Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";

import { categories } from "../constants/categories";
import type { Category } from "../types";

const categoryIcons: Record<string, ComponentType<{ size?: number }>> = {
  "": Layers,
  struggle: Flame,
  love: Heart,
  school: BookOpen,
  college: GraduationCap,
  general: Sparkles,
};

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

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
    updateParams({ category: value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const posts = data?.posts ?? [];
  const pagination = data?.pagination ?? null;

  return (
    <main>
      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="hero-gradient py-16 md:py-24 px-5">
        <div className="mx-auto max-w-3xl">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 animate-fade-up"
            style={{
              background: "var(--accent-muted)",
              color: "var(--accent)",
              border: "1px solid var(--accent-muted)",
            }}
          >
            <BookOpen size={12} />
            Real stories from real people
          </div>

          <h1
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-ink animate-fade-up delay-75"
            style={{ letterSpacing: "-0.02em" }}
          >
            Stories that{" "}
            <span
              className="font-display"
              style={{
                fontStyle: "italic",
                color: "var(--accent)",
              }}
            >
              matter.
            </span>
          </h1>

          <p
            className="mt-5 text-lg md:text-xl text-muted max-w-xl leading-relaxed animate-fade-up delay-150"
            style={{ fontFamily: "var(--font-reading)", fontWeight: 300 }}
          >
            A quiet place for the things we don't usually say out loud. Read
            real experiences. Share yours — openly or anonymously.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 animate-fade-up delay-225">
            {user ? (
              <Button
                asChild
                size="lg"
                leftIcon={<PenLine size={17} />}
                className="font-semibold shadow-warm-md"
              >
                <Link to="/create">Write your story</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="font-semibold shadow-warm-md"
                >
                  <Link to="/signup">Start reading</Link>
                </Button>
                <Link
                  to="/login"
                  className="text-sm font-medium text-muted hover:text-ink transition-colors"
                >
                  Already a member? Sign in →
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Feed Section ─────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 pb-16">
        {/* Category + Sort filters */}
        <div
          className="sticky top-16 z-20 -mx-5 px-5 py-3 mb-2 flex flex-wrap items-center justify-between gap-3"
          style={{
            background: "var(--paper)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {/* Category pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            {categories.map((item) => {
              const Icon = categoryIcons[item.value];
              return (
                <button
                  key={item.label}
                  onClick={() => handleCategoryChange(item.value)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    category === item.value
                      ? "bg-accent text-white shadow-warm-sm"
                      : "text-muted hover:text-ink border border-border hover:border-accent/30 hover:bg-surface"
                  }`}
                >
                  {Icon && <Icon size={13} />}
                  {item.label}
                </button>
              );
            })}
          </div>

          <StorySortTabs />
        </div>

        {/* Stories list */}
        {isLoading ? (
          <div className="divide-y divide-border/50">
            <StoryCardSkeleton />
            <StoryCardSkeleton />
            <StoryCardSkeleton />
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-red-500 font-medium">
              {error instanceof Error ? error.message : "Unable to load stories"}
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-24 text-center animate-fade-up">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-accent"
              style={{ background: "var(--surface)" }}
            >
              <BookOpen size={30} />
            </div>
            <p
              className="font-display text-3xl font-bold text-ink mb-3"
              style={{ fontStyle: "italic" }}
            >
              No stories yet.
            </p>
            <p className="text-muted mb-8">
              Be the first to share something real.
            </p>
            {user && (
              <Button asChild leftIcon={<PenLine size={16} />}>
                <Link to="/create">Write the first one</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {posts.map((post, i) => (
              <StoryCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-10 mt-4 border-t border-border/40">
            <Button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              variant="outline"
              size="sm"
            >
              ← Previous
            </Button>

            <span
              className="text-xs font-medium px-4 py-2 rounded-full"
              style={{ background: "var(--surface)", color: "var(--muted)" }}
            >
              {page} / {pagination.totalPages}
            </span>

            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
              variant="outline"
              size="sm"
            >
              Next →
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}