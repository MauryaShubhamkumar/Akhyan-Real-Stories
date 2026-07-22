export default function StoryCardSkeleton() {
  return (
    <div className="rounded-2xl px-1 py-7 md:px-3 animate-pulse">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-full bg-surface-alt animate-shimmer" />
        <div className="h-3.5 w-24 rounded-full bg-surface-alt animate-shimmer" />
        <div className="h-3 w-1 rounded bg-border" />
        <div className="h-5 w-20 rounded-full bg-surface-alt animate-shimmer" />
        <div className="h-3 w-12 rounded-full bg-surface-alt animate-shimmer" />
      </div>

      {/* Title */}
      <div className="space-y-2.5 mb-3">
        <div className="h-7 w-4/5 rounded-lg bg-surface-alt animate-shimmer" />
        <div className="h-7 w-1/2 rounded-lg bg-surface-alt animate-shimmer" />
      </div>

      {/* Body preview */}
      <div className="space-y-2 mb-5">
        <div className="h-4 w-full rounded bg-surface-alt animate-shimmer" />
        <div className="h-4 w-11/12 rounded bg-surface-alt animate-shimmer" />
        <div className="h-4 w-3/4 rounded bg-surface-alt animate-shimmer" />
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-border/40 flex gap-5">
        <div className="h-4 w-14 rounded-full bg-surface-alt animate-shimmer" />
        <div className="h-4 w-10 rounded-full bg-surface-alt animate-shimmer" />
        <div className="h-4 w-10 rounded-full bg-surface-alt animate-shimmer" />
      </div>
    </div>
  );
}
