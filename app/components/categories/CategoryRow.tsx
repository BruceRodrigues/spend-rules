import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Category } from "@prisma/client";

type CategoryWithCount = Category & { _count: { rules: number } };

interface CategoryRowProps {
  category: CategoryWithCount;
  onEdit: (category: CategoryWithCount) => void;
  onDelete: (category: CategoryWithCount) => void;
}

export default function CategoryRow({
  category,
  onEdit,
  onDelete,
}: CategoryRowProps) {
  const color = category.color ?? "#6b7280";
  const createdAt = new Date(category.createdAt).toLocaleDateString("en-US", {
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
          {category.name}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-default-500">
        <span className="block max-w-xs truncate">
          {category.description ?? "—"}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-full bg-default-100 px-2.5 py-0.5 text-xs font-medium text-default-600">
          {category._count.rules}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-default-500">{createdAt}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="rounded-md p-1.5 text-default-400 transition-colors hover:bg-default-100 hover:text-default-600"
            aria-label="Edit category"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            className="rounded-md p-1.5 text-default-400 transition-colors hover:bg-danger-50 hover:text-danger"
            aria-label="Delete category"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
