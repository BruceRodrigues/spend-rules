"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import type { Category } from "@prisma/client";
import InlineCategoryForm from "./InlineCategoryForm";

interface AddRuleFormValues {
  name: string;
  pattern: string;
  matchType: "KEYWORD" | "REGEX" | "EXACT";
  categoryId: string;
}

interface AddRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  categories: Category[];
}

const MATCH_TYPE_HELPER: Record<string, string> = {
  KEYWORD: "Matches if the transaction description contains this word or phrase.",
  REGEX: "Matches using a regular expression pattern.",
  EXACT: "Matches only if the description is exactly equal to this pattern.",
};

export default function AddRuleModal({
  isOpen,
  onClose,
  onCreated,
  categories,
}: AddRuleModalProps) {
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [localCategories, setLocalCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddRuleFormValues>({
    defaultValues: {
      name: "",
      pattern: "",
      matchType: "KEYWORD",
      categoryId: "",
    },
  });

  const watchedMatchType = watch("matchType");
  const allCategories = [...categories, ...localCategories];

  async function onSubmit(data: AddRuleFormValues) {
    const response = await fetch("/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, priority: 0, isActive: true }),
    });

    if (!response.ok) return;

    reset();
    setShowInlineForm(false);
    setLocalCategories([]);
    onCreated();
    onClose();
  }

  function handleClose() {
    reset();
    setShowInlineForm(false);
    setLocalCategories([]);
    onClose();
  }

  function renderCategoryField() {
    if (showInlineForm) {
      return (
        <InlineCategoryForm
          onCreated={(category) => {
            setLocalCategories((prev) => [...prev, category]);
            setValue("categoryId", category.id, { shouldValidate: true });
            setShowInlineForm(false);
          }}
          onCancel={() => setShowInlineForm(false)}
        />
      );
    }
    return (
      <>
        <select
          {...register("categoryId", { required: "Category is required" })}
          className="rounded-lg border border-divider bg-content1 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select a category…</option>
          {allCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowInlineForm(true)}
          className="self-start text-xs text-primary hover:underline"
        >
          + New category
        </button>
        {errors.categoryId && (
          <p className="text-xs text-danger">{errors.categoryId.message}</p>
        )}
      </>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="text-foreground">Add Rule</ModalHeader>
          <ModalBody className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">
                Name <span className="text-danger">*</span>
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="e.g. Grocery stores"
                className="rounded-lg border border-divider bg-content1 px-3 py-2 text-sm text-foreground placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.name && (
                <p className="text-xs text-danger">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">
                Match Type
              </label>
              <select
                {...register("matchType")}
                className="rounded-lg border border-divider bg-content1 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="KEYWORD">Keyword</option>
                <option value="REGEX">Regex</option>
                <option value="EXACT">Exact</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">
                Pattern <span className="text-danger">*</span>
              </label>
              <input
                {...register("pattern", { required: "Pattern is required" })}
                placeholder={
                  watchedMatchType === "REGEX"
                    ? "e.g. (?i)supermarket.*"
                    : "e.g. supermarket"
                }
                className="rounded-lg border border-divider bg-content1 px-3 py-2 text-sm text-foreground placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-default-400">
                {MATCH_TYPE_HELPER[watchedMatchType]}
              </p>
              {errors.pattern && (
                <p className="text-xs text-danger">{errors.pattern.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">
                Category <span className="text-danger">*</span>
              </label>
              {renderCategoryField()}
            </div>

          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={handleClose} type="button">
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              Create Rule
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
