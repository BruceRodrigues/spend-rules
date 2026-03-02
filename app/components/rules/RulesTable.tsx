import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import type { Category, Rule } from "@prisma/client";
import RuleRow from "./RuleRow";

type RuleWithCategory = Rule & { category: Category };

interface RulesTableProps {
  rules: RuleWithCategory[];
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (rule: RuleWithCategory) => void;
  onDelete: (rule: RuleWithCategory) => void;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-divider">
      {Array.from({ length: 7 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
        <td key={i} className="px-4 py-3">
          <div className="h-4 animate-pulse rounded bg-default-200" />
        </td>
      ))}
    </tr>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={7} className="px-4 py-16 text-center">
        <AdjustmentsHorizontalIcon className="mx-auto mb-3 h-10 w-10 text-default-300" />
        <p className="text-sm font-medium text-default-500">No rules found</p>
        <p className="mt-1 text-xs text-default-400">
          Add a rule or adjust your filters to see results.
        </p>
      </td>
    </tr>
  );
}

const TABLE_HEADERS = [
  "Name",
  "Pattern",
  "Match Type",
  "Category",
  "Priority",
  "Status",
  "Actions",
];

export default function RulesTable({
  rules,
  isLoading,
  total,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}: RulesTableProps) {
  return (
    <div className="flex flex-col gap-0">
      <div className="overflow-x-auto rounded-lg border border-divider">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-divider bg-default-50">
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-default-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : rules.length === 0 ? (
              <EmptyState />
            ) : (
              rules.map((rule) => (
                <RuleRow key={rule.id} rule={rule} onEdit={onEdit} onDelete={onDelete} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between px-1 pt-4">
          <p className="text-sm text-default-500">
            {total} rule{total !== 1 ? "s" : ""} total
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="bordered"
              size="sm"
              isDisabled={page <= 1}
              onPress={() => onPageChange(page - 1)}
            >
              ← Prev
            </Button>
            <span className="text-sm text-default-500">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="bordered"
              size="sm"
              isDisabled={page >= totalPages}
              onPress={() => onPageChange(page + 1)}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
