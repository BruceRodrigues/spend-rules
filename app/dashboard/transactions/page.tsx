"use client";

import type { TransactionWithRelations } from "@/app/components/transactions/TransactionRow";
import TransactionsFilters from "@/app/components/transactions/TransactionsFilters";
import TransactionsTable from "@/app/components/transactions/TransactionsTable";
import { useState } from "react";
import useSWR from "swr";

interface TransactionsResponse {
  data: TransactionWithRelations[];
  total: number;
  page: number;
  totalPages: number;
}

interface CategoriesResponse {
  categories: { id: string; name: string; color: string | null }[];
}

interface CreditCardsResponse {
  creditCards: { id: string; name: string; bank: string | null }[];
}

function buildTransactionsUrl(
  startDate: string | null,
  endDate: string | null,
  categoryId: string | null,
  creditCardId: string | null,
  page: number
): string {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  if (categoryId) params.set("categoryId", categoryId);
  if (creditCardId) params.set("creditCardId", creditCardId);
  params.set("page", String(page));
  return `/api/transactions?${params.toString()}`;
}

export default function TransactionsPage() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [creditCardId, setCreditCardId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const transactionsUrl = buildTransactionsUrl(startDate, endDate, categoryId, creditCardId, page);

  const { data: transactionsData, isLoading } = useSWR<TransactionsResponse>(transactionsUrl);
  const { data: categoriesData } = useSWR<CategoriesResponse>("/api/categories?limit=500");
  const { data: creditCardsData } = useSWR<CreditCardsResponse>("/api/credit-cards");

  function handleFilterChange(updater: () => void) {
    updater();
    setPage(1);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-foreground">Transactions</h1>

      <div className="mt-6 flex flex-col gap-4">
        <TransactionsFilters
          startDate={startDate}
          endDate={endDate}
          categoryId={categoryId}
          creditCardId={creditCardId}
          categories={categoriesData?.categories ?? []}
          creditCards={creditCardsData?.creditCards ?? []}
          onStartDateChange={(v) => handleFilterChange(() => setStartDate(v))}
          onEndDateChange={(v) => handleFilterChange(() => setEndDate(v))}
          onCategoryChange={(v) => handleFilterChange(() => setCategoryId(v))}
          onCreditCardChange={(v) => handleFilterChange(() => setCreditCardId(v))}
        />

        <TransactionsTable
          transactions={transactionsData?.data ?? []}
          isLoading={isLoading}
          total={transactionsData?.total ?? 0}
          page={transactionsData?.page ?? page}
          totalPages={transactionsData?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
