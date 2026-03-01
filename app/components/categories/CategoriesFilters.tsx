"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";

interface CategoriesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function CategoriesFilters({
  search,
  onSearchChange,
}: CategoriesFiltersProps) {
  const [inputValue, setInputValue] = useState(search);

  const debouncedOnSearchChange = useCallback(
    debounce((value: string) => onSearchChange(value), 300),
    [onSearchChange],
  );

  useEffect(() => {
    if (search === "") setInputValue("");
  }, [search]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);
    debouncedOnSearchChange(value);
  }

  return (
    <div className="relative flex-1">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-default-400" />
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search by name or description…"
        className="w-full rounded-lg border border-divider bg-content1 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
