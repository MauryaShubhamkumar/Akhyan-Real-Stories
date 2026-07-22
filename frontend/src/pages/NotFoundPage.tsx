import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col items-center justify-center px-5 text-center animate-fade-up">
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full text-accent animate-float"
        style={{ background: "var(--surface)" }}
      >
        <FileQuestion size={36} />
      </div>

      <p
        className="text-sm font-semibold tracking-widest uppercase mb-4"
        style={{ color: "var(--accent)" }}
      >
        404
      </p>

      <h1
        className="font-display text-4xl font-bold text-ink mb-4"
        style={{ letterSpacing: "-0.01em", fontStyle: "italic" }}
      >
        This story doesn't exist.
      </h1>

      <p
        className="leading-7 text-muted mb-8 max-w-sm"
        style={{ fontFamily: "var(--font-reading)", fontWeight: 300 }}
      >
        It may have been deleted, or the link might be incorrect. But there are
        plenty of other stories waiting for you.
      </p>

      <Link
        to="/"
        className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold shadow-warm-md"
      >
        Explore stories →
      </Link>
    </main>
  );
}
