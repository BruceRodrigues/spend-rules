"use client";

import CreditCardsFilters from "@/app/components/credit-cards/CreditCardsFilters";
import CreditCardsTable from "@/app/components/credit-cards/CreditCardsTable";
import type { CreditCard } from "@prisma/client";
import { useMemo, useState } from "react";
import useSWR from "swr";

interface CreditCardsResponse {
  creditCards: CreditCard[];
}

function matchesSearch(creditCard: CreditCard, search: string): boolean {
  const q = search.toLowerCase();
  return (
    creditCard.name.toLowerCase().includes(q) ||
    (creditCard.bank?.toLowerCase().includes(q) ?? false) ||
    (creditCard.lastFourDigits?.includes(q) ?? false)
  );
}

export default function CreditCardsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useSWR<CreditCardsResponse>("/api/credit-cards");

  const filteredCreditCards = useMemo(() => {
    const all = data?.creditCards ?? [];
    if (!search.trim()) return all;
    return all.filter((card) => matchesSearch(card, search));
  }, [data, search]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Credit Cards</h1>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <CreditCardsFilters search={search} onSearchChange={setSearch} />

        <CreditCardsTable creditCards={filteredCreditCards} isLoading={isLoading} />
      </div>
    </div>
  );
}
