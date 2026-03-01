"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@heroui/react";
import type { MatchType } from "@prisma/client";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";

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
    [onSearchChange]
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
      <div className="flex-1">
        <Input
          startContent={<MagnifyingGlassIcon className="h-4 w-4 text-default-400" />}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search by name, pattern or category…"
        />
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-divider bg-content1 p-1">
        {MATCH_TYPE_OPTIONS.map((option) => (
          <Button
            key={option.value}
            size="sm"
            variant={matchType === option.value ? "solid" : "light"}
            color={matchType === option.value ? "primary" : "default"}
            onPress={() => onMatchTypeChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
