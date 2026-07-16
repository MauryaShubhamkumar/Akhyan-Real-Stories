import { useSearchParams } from "react-router-dom";
import { Button } from "../ui";

export default function StorySortTabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "new";

  const handleSortChange = (sortValue: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("sort", sortValue);
    nextParams.delete("page"); // Reset page when sorting changes
    setSearchParams(nextParams);
  };

  return (
    <div className="flex items-center gap-1.5 border border-border bg-surface p-1 rounded-full">
      <Button
        onClick={() => handleSortChange("new")}
        variant={currentSort === "new" ? "secondary" : "ghost"}
        size="sm"
        className="h-8 rounded-full text-xs font-medium"
      >
        New
      </Button>
      <Button
        onClick={() => handleSortChange("top")}
        variant={currentSort === "top" ? "secondary" : "ghost"}
        size="sm"
        className="h-8 rounded-full text-xs font-medium"
      >
        Top
      </Button>
      <Button
        onClick={() => handleSortChange("trending")}
        variant={currentSort === "trending" ? "secondary" : "ghost"}
        size="sm"
        className="h-8 rounded-full text-xs font-medium"
      >
        Trending
      </Button>
    </div>
  );
}
