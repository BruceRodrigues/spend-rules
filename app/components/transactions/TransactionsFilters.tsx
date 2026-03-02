"use client";

import { Input, Select, SelectItem } from "@heroui/react";

interface Category {
  id: string;
  name: string;
  color: string | null;
}

interface CreditCard {
  id: string;
  name: string;
  bank: string | null;
}

interface TransactionsFiltersProps {
  startDate: string | null;
  endDate: string | null;
  categoryId: string | null;
  creditCardId: string | null;
  categories: Category[];
  creditCards: CreditCard[];
  onStartDateChange: (v: string | null) => void;
  onEndDateChange: (v: string | null) => void;
  onCategoryChange: (v: string | null) => void;
  onCreditCardChange: (v: string | null) => void;
}

export default function TransactionsFilters({
  startDate,
  endDate,
  categoryId,
  creditCardId,
  categories,
  creditCards,
  onStartDateChange,
  onEndDateChange,
  onCategoryChange,
  onCreditCardChange,
}: TransactionsFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        type="date"
        label="Start date"
        labelPlacement="outside"
        placeholder=" "
        value={startDate ?? ""}
        onChange={(e) => onStartDateChange(e.target.value || null)}
        className="w-44"
      />
      <Input
        type="date"
        label="End date"
        labelPlacement="outside"
        placeholder=" "
        value={endDate ?? ""}
        onChange={(e) => onEndDateChange(e.target.value || null)}
        className="w-44"
      />
      <Select
        label="Category"
        labelPlacement="outside"
        placeholder="All categories"
        selectedKeys={categoryId ? new Set([categoryId]) : new Set([""])}
        onSelectionChange={(keys) => {
          const value = Array.from(keys)[0] as string;
          onCategoryChange(value === "" ? null : value);
        }}
        className="w-48"
      >
        <SelectItem key="">All categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id}>{category.name}</SelectItem>
        ))}
      </Select>
      <Select
        label="Credit card"
        labelPlacement="outside"
        placeholder="All cards"
        selectedKeys={creditCardId ? new Set([creditCardId]) : new Set([""])}
        onSelectionChange={(keys) => {
          const value = Array.from(keys)[0] as string;
          onCreditCardChange(value === "" ? null : value);
        }}
        className="w-48"
      >
        <SelectItem key="">All cards</SelectItem>
        {creditCards.map((card) => (
          <SelectItem key={card.id}>{card.name}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
