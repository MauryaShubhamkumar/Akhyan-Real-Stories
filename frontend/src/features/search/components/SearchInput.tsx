import {
  Search,
} from "lucide-react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  useDebouncedCallback,
} from "use-debounce";

import Input from "../../../components/ui/Form/Input";
import { saveSearch } from "../../../utils/searchHistory";

export default function SearchInput() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const update =
    useDebouncedCallback(
      (value: string) => {
        const params =
          new URLSearchParams(
            searchParams
          );

        if (value) {
          params.set("q", value);
          saveSearch(value);
        } else {
          params.delete("q");
        }

        params.delete("page"); // Reset page on query update

        setSearchParams(params);
      },
      300
    );

  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      />

      <Input
        defaultValue={
          searchParams.get("q") ?? ""
        }
        placeholder="Search stories..."
        className="pl-10"
        onChange={(e) =>
          update(e.target.value)
        }
      />
    </div>
  );
}
