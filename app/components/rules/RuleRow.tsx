import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import type { Category, MatchType, Rule } from "@prisma/client";

type RuleWithCategory = Rule & { category: Category };

interface RuleRowProps {
  rule: RuleWithCategory;
  onEdit: (rule: RuleWithCategory) => void;
  onDelete: (rule: RuleWithCategory) => void;
}

const MATCH_TYPE_STYLES: Record<MatchType, string> = {
  KEYWORD: "bg-blue-500/10 text-blue-500",
  REGEX: "bg-purple-500/10 text-purple-500",
  EXACT: "bg-orange-500/10 text-orange-500",
};

export default function RuleRow({ rule, onEdit, onDelete }: RuleRowProps) {
  const categoryColor = rule.category.color ?? "#6b7280";

  return (
    <tr className="border-b border-divider transition-colors hover:bg-default-50">
      <td className="px-4 py-3 text-sm font-medium text-foreground">{rule.name}</td>
      <td className="px-4 py-3 font-mono text-sm text-default-500">{rule.pattern}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${MATCH_TYPE_STYLES[rule.matchType]}`}
        >
          {rule.matchType}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: categoryColor }} />
          {rule.category.name}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-default-500">{rule.priority}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            rule.isActive ? "bg-success/10 text-success" : "bg-default-100 text-default-400"
          }`}
        >
          {rule.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={() => onEdit(rule)}
            aria-label="Edit rule"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </Button>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            color="danger"
            onPress={() => onDelete(rule)}
            aria-label="Delete rule"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
