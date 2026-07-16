import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchInput from "../features/search/components/SearchInput";
import SearchResults from "../features/search/components/SearchResults";
import { H1, Button } from "../components/ui";
import { getRecentSearches, clearHistory } from "../utils/searchHistory";
import { Clock, Trash2 } from "lucide-react";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(getRecentSearches());
  }, [searchParams]);

  const handleRecentClick = (query: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("q", query);
    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  const handleClear = () => {
    clearHistory();
    setRecent([]);
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 space-y-8 animate-fade-in">
      <div>
        <H1>Search Stories</H1>
        <p className="mt-2 text-muted">
          Search posts by titles, categories, or keywords.
        </p>
      </div>

      <SearchInput />

      {!q && recent.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink flex items-center gap-2">
              <Clock size={16} className="text-muted" />
              Recent Searches
            </span>
            <button
              onClick={handleClear}
              className="text-xs text-muted hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <Trash2 size={13} />
              Clear
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {recent.map((item) => (
              <Button
                key={item}
                onClick={() => handleRecentClick(item)}
                variant="outline"
                size="sm"
                className="h-8 rounded-full text-xs text-muted hover:text-ink hover:border-border"
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      )}

      <SearchResults />
    </main>
  );
}
