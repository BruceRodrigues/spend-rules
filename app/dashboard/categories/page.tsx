"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import useSWR from "swr";
import type { Category } from "@prisma/client";
import CategoriesFilters from "@/app/components/categories/CategoriesFilters";
import CategoriesTable from "@/app/components/categories/CategoriesTable";
import AddCategoryModal from "@/app/components/categories/AddCategoryModal";
import EditCategoryModal from "@/app/components/categories/EditCategoryModal";
import DeleteCategoryModal from "@/app/components/categories/DeleteCategoryModal";

type CategoryWithCount = Category & { _count: { rules: number } };

interface CategoriesResponse {
  categories: CategoryWithCount[];
  total: number;
  page: number;
  totalPages: number;
}

async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json() as Promise<T>;
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
  } = useSWR<CategoriesResponse>(categoriesUrl, fetcher);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleCategoryCreated() {
    mutate();
  }

  function handleCategoryUpdated() {
    mutate();
  }

  function handleCategoryDeleted() {
    mutate();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <PlusIcon className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <CategoriesFilters
          search={search}
          onSearchChange={handleSearchChange}
        />

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

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={handleCategoryCreated}
      />

      <EditCategoryModal
        isOpen={categoryToEdit !== null}
        onClose={() => setCategoryToEdit(null)}
        onUpdated={handleCategoryUpdated}
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
