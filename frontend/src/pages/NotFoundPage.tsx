import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col items-center justify-center px-5 text-center">
      <p className="text-sm font-medium text-accent">
        404
      </p>

      <h1 className="mt-4 font-serif text-5xl font-semibold">
        This story doesn't exist.
      </h1>

      <p className="mt-5 leading-7 text-muted">
        It may have been deleted, or the link might be incorrect.
      </p>

      <Link
        to="/"
        className="btn-primary mt-8 rounded-full px-6 py-3 text-sm font-medium"
      >
        Explore stories
      </Link>
    </main>
  );
}
