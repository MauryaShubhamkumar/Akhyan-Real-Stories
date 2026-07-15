import {
  useState,
  type FormEvent,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import { api } from "../api/client";
import { categories } from "../constants/categories";

import type { Category } from "../types";

export default function CreatePostPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [category, setCategory] =
    useState<Category>("general");

  const [isAnonymous, setIsAnonymous] =
    useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const response = await api.post("/posts", {
        title,
        body,
        category,
        isAnonymous,
      });

      navigate(`/post/${response.data.post.id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            "Unable to publish story"
        );
      } else {
        setError("Unable to publish story");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-medium">
          Tell your story.
        </h1>

        <p className="mt-3 text-muted">
          Write freely. Take your time.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Story title"
            required
            minLength={3}
            maxLength={150}
            className="w-full border-none bg-transparent font-serif text-3xl font-medium outline-none placeholder:text-muted/50 md:text-4xl"
          />

          <p className="mt-2 text-right text-xs text-muted">
            {title.length}/150
          </p>
        </div>

        <div className="mt-8">
          <textarea
            value={body}
            onChange={(event) =>
              setBody(event.target.value)
            }
            placeholder="Start writing your story..."
            required
            minLength={10}
            maxLength={20000}
            rows={14}
            className="w-full resize-none border-none bg-transparent font-serif text-lg leading-8 outline-none placeholder:text-muted/50"
          />

          <p className="mt-2 text-right text-xs text-muted">
            {body.length}/20,000
          </p>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <label className="mb-3 block text-sm font-medium">
            Category
          </label>

          <div className="flex flex-wrap gap-2">
            {categories
              .filter((item) => item.value !== "")
              .map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    setCategory(
                      item.value as Category
                    )
                  }
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    category === item.value
                      ? "btn-primary"
                      : "border border-border text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </button>
              ))}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-surface p-5">
          <label className="flex cursor-pointer items-start justify-between gap-5">
            <div>
              <p className="font-medium">
                Post anonymously
              </p>

              <p className="mt-1 text-sm leading-6 text-muted">
                Your username will not be shown publicly.
                You can still manage this story from your
                profile.
              </p>
            </div>

            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(event) =>
                setIsAnonymous(event.target.checked)
              }
              className="mt-1 h-5 w-5 accent-ink"
            />
          </label>
        </div>

        {error && (
          <p className="mt-6 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-10 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm text-muted hover:text-ink"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full btn-primary px-7 py-3 text-sm font-medium"
          >
            {submitting
              ? "Publishing..."
              : "Publish story"}
          </button>
        </div>
      </form>
    </main>
  );
}