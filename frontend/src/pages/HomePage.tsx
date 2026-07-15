import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { api } from "../api/client";
import PostCard from "../components/PostCard";

import {
  categories,
} from "../constants/categories";

import type {
  Category,
  Pagination,
  Post,
} from "../types";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  const [category, setCategory] = useState<
    Category | ""
  >("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/posts", {
          params: {
            page,
            ...(category && { category }),
          },
        });

        setPosts(response.data.posts);
        setPagination(response.data.pagination);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ??
              "Unable to load stories"
          );
        } else {
          setError("Unable to load stories");
        }
      } finally {
        setLoading(false);
      }
    };

    void getPosts();
  }, [page, category]);

  const handleCategoryChange = (
    value: Category | ""
  ) => {
    setCategory(value);
    setPage(1);
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <section>
        <h1 className="font-serif text-4xl font-medium leading-tight md:text-5xl">
          Real stories from real people.
        </h1>

        <p className="mt-4 max-w-xl text-lg leading-7 text-muted">
          A quiet place for the things we don't usually say out loud.
        </p>
      </section>

      <div className="mt-10 flex gap-2 overflow-x-auto border-b border-border pb-4">
        {categories.map((item) => (
          <button
            key={item.label}
            onClick={() =>
              handleCategoryChange(item.value)
            }
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
              category === item.value
                ? "btn-primary"
                : "text-muted hover:bg-border/60 hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted">
          Loading stories...
        </div>
      ) : error ? (
        <div className="py-16 text-center text-red-600">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-serif text-2xl">
            No stories yet.
          </p>

          <p className="mt-2 text-muted">
            Maybe you should write the first one.
          </p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      )}

      {!loading &&
        pagination &&
        pagination.totalPages > 1 && (
          <div className="flex items-center justify-between py-10">
            <button
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1)
                )
              }
              disabled={page === 1}
              className="rounded-full border border-border px-5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-muted">
              Page {page} of {pagination.totalPages}
            </span>

            <button
              onClick={() =>
                setPage((current) => current + 1)
              }
              disabled={
                page === pagination.totalPages
              }
              className="rounded-full border border-border px-5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
    </main>
  );
}