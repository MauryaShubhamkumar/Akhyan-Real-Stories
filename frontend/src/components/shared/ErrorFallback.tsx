import { Button, H2, Muted } from "../ui";
import type { FallbackProps } from "react-error-boundary";

export default function ErrorFallback({
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <H2>Something went wrong.</H2>

      <Muted className="mt-3 max-w-md">
        We couldn't load this page. Please try again.
      </Muted>

      <Button
        className="mt-8"
        onClick={resetErrorBoundary}
      >
        Retry
      </Button>
    </main>
  );
}
