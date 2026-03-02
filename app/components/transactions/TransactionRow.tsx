import { CheckCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";

export type TransactionWithRelations = {
  id: string;
  date: string;
  description: string;
  amount: string;
  isMatched: boolean;
  category: { id: string; name: string; color: string | null } | null;
  creditCard: { id: string; name: string; bank: string | null; color: string | null } | null;
  rule: { id: string; name: string } | null;
};

interface TransactionRowProps {
  transaction: TransactionWithRelations;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(amount: string): string {
  return Number(amount).toFixed(2);
}

export default function TransactionRow({ transaction }: TransactionRowProps) {
  const amount = Number(transaction.amount);
  const categoryColor = transaction.category?.color ?? "#6b7280";
  const creditCardColor = transaction.creditCard?.color ?? "#6b7280";

  return (
    <tr className="border-b border-divider transition-colors hover:bg-default-50">
      <td className="px-4 py-3 text-sm text-default-500 whitespace-nowrap">
        {formatDate(transaction.date)}
      </td>
      <td className="px-4 py-3 text-sm text-foreground">
        <span className="block max-w-xs truncate">{transaction.description}</span>
      </td>
      <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
        <span className={amount >= 0 ? "text-success-600" : "text-danger-600"}>
          {amount >= 0 ? "+" : ""}
          {formatAmount(transaction.amount)}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-default-500">
        {transaction.creditCard ? (
          <span className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: creditCardColor }}
            />
            {transaction.creditCard.name}
          </span>
        ) : (
          "—"
        )}
      </td>
      <td className="px-4 py-3 text-sm text-default-500">
        {transaction.category ? (
          <span className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
            {transaction.category.name}
          </span>
        ) : (
          "—"
        )}
      </td>
      <td className="px-4 py-3">
        {transaction.isMatched ? (
          <CheckCircleIcon className="h-5 w-5 text-success-500" />
        ) : (
          <MinusCircleIcon className="h-5 w-5 text-default-300" />
        )}
      </td>
    </tr>
  );
}
