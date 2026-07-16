import { Skeleton } from "../ui";

export default function StoryCardSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-border p-6">
      <Skeleton className="h-5 w-40" />

      <Skeleton className="h-8 w-3/4" />

      <Skeleton className="h-4 w-full" />

      <Skeleton className="h-4 w-11/12" />

      <Skeleton className="h-4 w-8/12" />
    </div>
  );
}
