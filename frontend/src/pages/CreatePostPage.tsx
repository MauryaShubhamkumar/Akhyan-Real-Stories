import {
  useState,
  type FormEvent,
} from "react";

import { useNavigate } from "react-router-dom";
import { PenLine, Flame, Heart, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import type { ComponentType } from "react";

import { useCreatePost } from "../features/posts/mutations";
import { categories } from "../constants/categories";
import { Button, Checkbox } from "../components/ui";

import type { Category } from "../types";

const categoryIcons: Record<string, ComponentType<{ size?: number }>> = {
  struggle: Flame,
  love: Heart,
  school: BookOpen,
  college: GraduationCap,
  general: Sparkles,
};

const categoryColors: Record<string, string> = {
  struggle: "hover:border-red-400/50 hover:bg-red-500/5",
  love: "hover:border-pink-400/50 hover:bg-pink-500/5",
  school: "hover:border-blue-400/50 hover:bg-blue-500/5",
  college: "hover:border-purple-400/50 hover:bg-purple-500/5",
  general: "hover:border-zinc-400/50 hover:bg-zinc-500/5",
};

export default function CreatePostPage() {
  const navigate = useNavigate();
  const mutation = useCreatePost();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<Category>("general");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate(
      { title, body, category, isAnonymous },
      {
        onSuccess: (data) => {
          navigate(`/post/${data.post.id}`);
        },
      }
    );
  };

  const bodyProgress = Math.min(100, (body.length / 20000) * 100);

  return (
    <main className="mx-auto max-w-2xl px-5 py-12 md:py-16">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-4"
          style={{
            background: "var(--accent-muted)",
            color: "var(--accent)",
          }}
        >
          <PenLine size={13} />
          Writing Studio
        </div>

        <h1
          className="font-display text-4xl font-bold text-ink leading-tight mb-3"
          style={{ fontStyle: "italic", letterSpacing: "-0.01em" }}
        >
          Tell your story.
        </h1>

        <p
          className="text-muted leading-relaxed"
          style={{ fontFamily: "var(--font-reading)", fontWeight: 300 }}
        >
          Write freely. Take your time. Every real story deserves to be told.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 animate-fade-up delay-75">
        {/* Title field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="story-title"
              className="text-xs font-semibold uppercase tracking-widest text-muted/70"
            >
              Title
            </label>
            <span className="text-xs text-muted/60">{title.length}/150</span>
          </div>
          <input
            id="story-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Give your story a compelling title..."
            required
            minLength={3}
            maxLength={150}
            className="w-full bg-transparent border-0 border-b-2 border-border rounded-none px-0 py-3 font-display text-2xl font-bold text-ink placeholder:text-muted/40 outline-none focus:border-accent transition-colors duration-200"
            style={{ letterSpacing: "-0.01em" }}
          />
        </div>

        {/* Body field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="story-body"
              className="text-xs font-semibold uppercase tracking-widest text-muted/70"
            >
              Your Story
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted/60">{body.length.toLocaleString()}/20,000</span>
              {/* Progress ring-like bar */}
              <div
                className="h-1.5 w-16 rounded-full overflow-hidden"
                style={{ background: "var(--border)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${bodyProgress}%`,
                    background: bodyProgress > 90
                      ? "#ef4444"
                      : "linear-gradient(90deg, var(--accent), var(--accent-hover))",
                  }}
                />
              </div>
            </div>
          </div>

          <textarea
            id="story-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Start writing your story... Let the words flow naturally."
            required
            minLength={10}
            maxLength={20000}
            rows={18}
            className="w-full resize-none rounded-2xl border border-border p-6 text-[17px] leading-8 outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/15"
            style={{
              fontFamily: "var(--font-reading)",
              background: "var(--surface)",
              color: "var(--ink)",
              minHeight: "380px",
            }}
          />
        </div>

        {/* Category selector */}
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted/70">
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((item) => item.value !== "")
              .map((item) => {
                const Icon = categoryIcons[item.value];
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setCategory(item.value as Category)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold border transition-all duration-200 ${
                      category === item.value
                        ? "btn-primary border-transparent"
                        : `border-border text-muted bg-paper ${categoryColors[item.value]}`
                    }`}
                  >
                    {Icon && <Icon size={13} />}
                    {item.label}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Anonymous toggle */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <Checkbox
            checked={isAnonymous}
            onChange={(event) => setIsAnonymous(event.target.checked)}
            label="Post anonymously"
          />
          <p
            className="mt-2.5 ml-7 text-sm leading-6 text-muted"
            style={{ fontFamily: "var(--font-reading)" }}
          >
            Your username won't be shown publicly. You can still manage this
            story from your profile.
          </p>
        </div>

        {/* Error */}
        {mutation.error && (
          <p className="text-sm font-medium text-red-500">
            {mutation.error.message}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-muted hover:text-ink"
          >
            ← Cancel
          </Button>

          <Button
            type="submit"
            size="lg"
            loading={mutation.isPending}
            className="font-semibold shadow-warm-md px-8"
          >
            Publish story →
          </Button>
        </div>
      </form>
    </main>
  );
}