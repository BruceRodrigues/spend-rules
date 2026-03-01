"use client";

import DeleteRuleModal from "@/app/components/rules/DeleteRuleModal";
import RuleModal from "@/app/components/rules/RuleModal";
import RulesFilters from "@/app/components/rules/RulesFilters";
import RulesTable from "@/app/components/rules/RulesTable";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import type { Category, Rule } from "@prisma/client";
import type { MatchType } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";

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

function buildRulesUrl(search: string, matchType: MatchTypeFilter, page: number): string {
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
  const [ruleToEdit, setRuleToEdit] = useState<RuleWithCategory | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<RuleWithCategory | null>(null);

  const rulesUrl = buildRulesUrl(search, matchType, page);

  const {
    data: rulesData,
    isLoading: rulesLoading,
    mutate: mutateRules,
  } = useSWR<RulesResponse>(rulesUrl);

  const { data: categoriesData } = useSWR<CategoriesListResponse>("/api/categories?limit=500");

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleMatchTypeChange(value: MatchTypeFilter) {
    setMatchType(value);
    setPage(1);
  }

  function handleRuleSaved() {
    mutateRules();
  }

  function handleRuleDeleted() {
    mutateRules();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Rules</h1>
        <Button
          color="primary"
          startContent={<PlusIcon className="h-4 w-4" />}
          onPress={() => setIsModalOpen(true)}
        >
          Add Rule
        </Button>
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
          onEdit={setRuleToEdit}
          onDelete={setRuleToDelete}
        />
      </div>

      <RuleModal
        isOpen={isModalOpen || ruleToEdit !== null}
        onClose={() => { setIsModalOpen(false); setRuleToEdit(null); }}
        onSaved={handleRuleSaved}
        categories={categoriesData?.categories ?? []}
        rule={ruleToEdit}
      />

      <DeleteRuleModal
        isOpen={ruleToDelete !== null}
        onClose={() => setRuleToDelete(null)}
        onDeleted={handleRuleDeleted}
        rule={ruleToDelete}
      />
    </div>
  );
}
