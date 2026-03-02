import { BanknotesIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import TransactionRow, { type TransactionWithRelations } from "./TransactionRow";

interface TransactionsTableProps {
  transactions: TransactionWithRelations[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-divider">
      {Array.from({ length: 6 }).map((_, i) => (
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
      <td colSpan={6} className="px-4 py-16 text-center">
        <BanknotesIcon className="mx-auto mb-3 h-10 w-10 text-default-300" />
        <p className="text-sm font-medium text-default-500">No transactions found</p>
        <p className="mt-1 text-xs text-default-400">
          Import a CSV file or adjust your filters to see results.
        </p>
      </td>
    </tr>
  );
}

const TABLE_HEADERS = ["Date", "Description", "Amount", "Credit Card", "Category", "Match"];

export default function TransactionsTable({
  transactions,
  total,
  page,
  totalPages,
  isLoading,
  onPageChange,
}: TransactionsTableProps) {
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
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : transactions.length === 0 ? (
              <EmptyState />
            ) : (
              transactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && (
        <div className="flex items-center justify-between px-1 pt-4">
          <p className="text-sm text-default-500">
            {total} transaction{total !== 1 ? "s" : ""}
          </p>
          {totalPages > 1 && (
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
          )}
        </div>
      )}
    </div>
  );
}
