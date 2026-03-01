"use client";

import CategoriesFilters from "@/app/components/categories/CategoriesFilters";
import CategoriesTable from "@/app/components/categories/CategoriesTable";
import CategoryModal from "@/app/components/categories/CategoryModal";
import DeleteCategoryModal from "@/app/components/categories/DeleteCategoryModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import type { Category } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";

type CategoryWithCount = Category & { _count: { rules: number } };

interface CategoriesResponse {
  categories: CategoryWithCount[];
  total: number;
  page: number;
  totalPages: number;
}

function buildCategoriesUrl(search: string, page: number): string {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  params.set("page", String(page));
  return `/api/categories?${params.toString()}`;
}

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryWithCount | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryWithCount | null>(null);

  const categoriesUrl = buildCategoriesUrl(search, page);

  const {
    data: categoriesData,
    isLoading,
    mutate,
  } = useSWR<CategoriesResponse>(categoriesUrl);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleCategorySaved() {
    mutate();
  }

  function handleCategoryDeleted() {
    mutate();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
        <Button
          color="primary"
          startContent={<PlusIcon className="h-4 w-4" />}
          onPress={() => setIsAddModalOpen(true)}
        >
          Add Category
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <CategoriesFilters search={search} onSearchChange={handleSearchChange} />

        <CategoriesTable
          categories={categoriesData?.categories ?? []}
          isLoading={isLoading}
          total={categoriesData?.total ?? 0}
          page={categoriesData?.page ?? page}
          totalPages={categoriesData?.totalPages ?? 1}
          onPageChange={setPage}
          onEdit={setCategoryToEdit}
          onDelete={setCategoryToDelete}
        />
      </div>

      <CategoryModal
        isOpen={isAddModalOpen || categoryToEdit !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setCategoryToEdit(null);
        }}
        onSaved={handleCategorySaved}
        category={categoryToEdit}
      />

      <DeleteCategoryModal
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        onDeleted={handleCategoryDeleted}
        category={categoryToDelete}
      />
    </div>
  );
}
