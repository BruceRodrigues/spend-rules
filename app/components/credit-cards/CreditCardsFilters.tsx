"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@heroui/react";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";

interface CreditCardsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function CreditCardsFilters({ search, onSearchChange }: CreditCardsFiltersProps) {
  const [inputValue, setInputValue] = useState(search);

  const debouncedOnSearchChange = useCallback(
    debounce((value: string) => onSearchChange(value), 300),
    []
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
    <div className="flex-1">
      <Input
        startContent={<MagnifyingGlassIcon className="h-4 w-4 text-default-400" />}
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search by name, bank or last 4 digits…"
      />
    </div>
  );
}
