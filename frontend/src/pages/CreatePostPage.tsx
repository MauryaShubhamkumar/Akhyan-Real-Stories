import {
  useState,
  type FormEvent,
} from "react";

import { useNavigate } from "react-router-dom";

import { useCreatePost } from "../features/posts/mutations";
import { categories } from "../constants/categories";
import { Button, H2, Field, Input, Textarea, Checkbox } from "../components/ui";

import type { Category } from "../types";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const mutation = useCreatePost();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [category, setCategory] =
    useState<Category>("general");

  const [isAnonymous, setIsAnonymous] =
    useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate(
      {
        title,
        body,
        category,
        isAnonymous,
      },
      {
        onSuccess: (data) => {
          navigate(`/post/${data.post.id}`);
        },
      }
    );
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <div className="mb-10">
        <H2>
          Write your story
        </H2>

        <p className="mt-3 text-muted">
          Write freely. Take your time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field
          label="Title"
          required
          helperText={`${title.length}/150`}
        >
          <Input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Story title"
            required
            minLength={3}
            maxLength={150}
          />
        </Field>

        <Field
          label="Your Story"
          required
          helperText={`${body.length}/20,000`}
        >
          <Textarea
            value={body}
            onChange={(event) =>
              setBody(event.target.value)
            }
            placeholder="Start writing your story..."
            required
            minLength={10}
            maxLength={20000}
            rows={14}
            className="min-h-[350px]"
          />
        </Field>

        <Field label="Category" className="pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((item) => item.value !== "")
              .map((item) => (
                <Button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    setCategory(
                      item.value as Category
                    )
                  }
                  variant={category === item.value ? "primary" : "outline"}
                  size="sm"
                  className={category === item.value ? "" : "text-muted hover:text-ink"}
                >
                  {item.label}
                </Button>
              ))}
          </div>
        </Field>

        <div className="rounded-xl border border-border bg-surface p-5">
          <Checkbox
            checked={isAnonymous}
            onChange={(event) =>
              setIsAnonymous(event.target.checked)
            }
            label="Post anonymously"
          />
          <p className="mt-2 ml-7 text-sm leading-6 text-muted">
            Your username will not be shown publicly. You can still manage this story from your profile.
          </p>
        </div>

        {mutation.error && (
          <p className="text-sm text-red-600">
            {mutation.error.message}
          </p>
        )}

        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-muted hover:text-ink"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={mutation.isPending}
          >
            Publish story
          </Button>
        </div>
      </form>
    </main>
  );
}