import type { CreditCard } from "@prisma/client";

interface CreditCardRowProps {
  creditCard: CreditCard;
}

export default function CreditCardRow({ creditCard }: CreditCardRowProps) {
  const color = creditCard.color ?? "#6b7280";
  const createdAt = new Date(creditCard.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <tr className="border-b border-divider transition-colors hover:bg-default-50">
      <td className="px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <span
            className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          {creditCard.name}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-default-500">{creditCard.bank ?? "—"}</td>
      <td className="px-4 py-3 text-sm text-default-500">
        {creditCard.lastFourDigits ? (
          <span className="font-mono">•••• {creditCard.lastFourDigits}</span>
        ) : (
          "—"
        )}
      </td>
      <td className="px-4 py-3 text-sm text-default-500">{createdAt}</td>
    </tr>
  );
}
