"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import useSWR from "swr";
import type { Category, Rule } from "@prisma/client";
import RulesFilters from "@/app/components/rules/RulesFilters";
import RulesTable from "@/app/components/rules/RulesTable";
import AddRuleModal from "@/app/components/rules/AddRuleModal";
import type { MatchType } from "@prisma/client";

type MatchTypeFilter = MatchType | "ALL";

type RuleWithCategory = Rule & { category: Category };

interface RulesResponse {
  rules: RuleWithCategory[];
  total: number;
  page: number;
  totalPages: number;
}

interface CategoriesListResponse {
  categories: Category[];
}

async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json() as Promise<T>;
}

function buildRulesUrl(
  search: string,
  matchType: MatchTypeFilter,
  page: number,
): string {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (matchType !== "ALL") params.set("matchType", matchType);
  params.set("page", String(page));
  return `/api/rules?${params.toString()}`;
}

export default function RulesPage() {
  const [search, setSearch] = useState("");
  const [matchType, setMatchType] = useState<MatchTypeFilter>("ALL");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rulesUrl = buildRulesUrl(search, matchType, page);

  const {
    data: rulesData,
    isLoading: rulesLoading,
    mutate: mutateRules,
  } = useSWR<RulesResponse>(rulesUrl, fetcher);

  const { data: categoriesData } = useSWR<CategoriesListResponse>("/api/categories?limit=500", fetcher);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleMatchTypeChange(value: MatchTypeFilter) {
    setMatchType(value);
    setPage(1);
  }

  function handleRuleCreated() {
    mutateRules();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Rules</h1>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <PlusIcon className="h-4 w-4" />
          Add Rule
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <RulesFilters
          search={search}
          onSearchChange={handleSearchChange}
          matchType={matchType}
          onMatchTypeChange={handleMatchTypeChange}
        />

        <RulesTable
          rules={rulesData?.rules ?? []}
          isLoading={rulesLoading}
          total={rulesData?.total ?? 0}
          page={rulesData?.page ?? page}
          totalPages={rulesData?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>

      <AddRuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleRuleCreated}
        categories={categoriesData?.categories ?? []}
      />
    </div>
  );
}
