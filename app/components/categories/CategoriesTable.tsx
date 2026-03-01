import { TagIcon } from "@heroicons/react/24/outline";
import type { Category } from "@prisma/client";
import CategoryRow from "./CategoryRow";

type CategoryWithCount = Category & { _count: { rules: number } };

interface CategoriesTableProps {
  categories: CategoryWithCount[];
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-divider">
      {Array.from({ length: 4 }).map((_, i) => (
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
      <td colSpan={4} className="px-4 py-16 text-center">
        <TagIcon className="mx-auto mb-3 h-10 w-10 text-default-300" />
        <p className="text-sm font-medium text-default-500">
          No categories found
        </p>
        <p className="mt-1 text-xs text-default-400">
          Add a category or adjust your filters to see results.
        </p>
      </td>
    </tr>
  );
}

const TABLE_HEADERS = ["Name", "Description", "Rules", "Created"];

export default function CategoriesTable({
  categories,
  isLoading,
  total,
  page,
  totalPages,
  onPageChange,
}: CategoriesTableProps) {
  return (
    <div className="flex flex-col gap-0">
      <div className="overflow-x-auto rounded-lg border border-divider">
        <table className="w-full min-w-[480px]">
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
            ) : categories.length === 0 ? (
              <EmptyState />
            ) : (
              categories.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between px-1 pt-4">
          <p className="text-sm text-default-500">
            {total} categor{total !== 1 ? "ies" : "y"} total
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-md border border-divider px-3 py-1.5 text-sm text-default-500 transition-colors hover:bg-default-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="text-sm text-default-500">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="rounded-md border border-divider px-3 py-1.5 text-sm text-default-500 transition-colors hover:bg-default-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
