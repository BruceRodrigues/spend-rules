"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import type { MatchType } from "@prisma/client";

type MatchTypeFilter = MatchType | "ALL";

interface RulesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  matchType: MatchTypeFilter;
  onMatchTypeChange: (value: MatchTypeFilter) => void;
}

const MATCH_TYPE_OPTIONS: { label: string; value: MatchTypeFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Keyword", value: "KEYWORD" },
  { label: "Regex", value: "REGEX" },
  { label: "Exact", value: "EXACT" },
];

export default function RulesFilters({
  search,
  onSearchChange,
  matchType,
  onMatchTypeChange,
}: RulesFiltersProps) {
  const [inputValue, setInputValue] = useState(search);

  const debouncedOnSearchChange = useCallback(
    debounce((value: string) => onSearchChange(value), 300),
    [onSearchChange],
  );

  // Keep local input in sync when parent resets search
  useEffect(() => {
    if (search === "") setInputValue("");
  }, [search]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);
    debouncedOnSearchChange(value);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-default-400" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search by name, pattern or category…"
          className="w-full rounded-lg border border-divider bg-content1 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-divider bg-content1 p-1">
        {MATCH_TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onMatchTypeChange(option.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              matchType === option.value
                ? "bg-primary text-white"
                : "text-default-500 hover:bg-default-100 hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
