import { CreditCardIcon } from "@heroicons/react/24/outline";
import type { CreditCard } from "@prisma/client";
import CreditCardRow from "./CreditCardRow";

interface CreditCardsTableProps {
  creditCards: CreditCard[];
  isLoading: boolean;
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
        <CreditCardIcon className="mx-auto mb-3 h-10 w-10 text-default-300" />
        <p className="text-sm font-medium text-default-500">No credit cards found</p>
        <p className="mt-1 text-xs text-default-400">
          Add a credit card or adjust your search to see results.
        </p>
      </td>
    </tr>
  );
}

const TABLE_HEADERS = ["Name", "Bank", "Last 4 digits", "Created"];

export default function CreditCardsTable({ creditCards, isLoading }: CreditCardsTableProps) {
  return (
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
          ) : creditCards.length === 0 ? (
            <EmptyState />
          ) : (
            creditCards.map((creditCard) => (
              <CreditCardRow key={creditCard.id} creditCard={creditCard} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
