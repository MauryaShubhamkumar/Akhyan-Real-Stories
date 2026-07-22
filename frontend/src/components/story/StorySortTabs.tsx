import { useSearchParams } from "react-router-dom";
import { Flame, Star, Sparkles } from "lucide-react";

const sortOptions = [
  { value: "new", label: "New", icon: Sparkles },
  { value: "top", label: "Top", icon: Star },
  { value: "trending", label: "Trending", icon: Flame },
] as const;

export default function StorySortTabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "new";

  const handleSortChange = (sortValue: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("sort", sortValue);
    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  return (
    <div
      className="flex items-center gap-0.5 p-1 rounded-full border border-border/70"
      style={{ background: "var(--surface)" }}
    >
      {sortOptions.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => handleSortChange(value)}
          className={`flex items-center gap-1.5 h-8 px-4 rounded-full text-xs font-semibold transition-all duration-200 ${
            currentSort === value
              ? "bg-accent text-white shadow-warm-sm"
              : "text-muted hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <Icon size={11} />
          {label}
        </button>
      ))}
    </div>
  );
}
