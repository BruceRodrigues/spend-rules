"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
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
    control,
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
        <Controller
          name="categoryId"
          control={control}
          rules={{ required: "Category is required" }}
          render={({ field, fieldState }) => (
            <Select
              label="Category"
              isRequired
              selectedKeys={field.value ? new Set([field.value]) : new Set()}
              onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] ?? "")}
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
            >
              {allCategories.map((cat) => (
                <SelectItem key={cat.id}>{cat.name}</SelectItem>
              ))}
            </Select>
          )}
        />
        <Button
          variant="light"
          size="sm"
          className="self-start"
          onPress={() => setShowInlineForm(true)}
        >
          + New category
        </Button>
      </>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="text-foreground">Add Rule</ModalHeader>
          <ModalBody className="flex flex-col gap-4">

            <Input
              label="Name"
              isRequired
              placeholder="e.g. Grocery stores"
              {...register("name", { required: "Name is required" })}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />

            <Controller
              name="matchType"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  label="Match Type"
                  selectedKeys={field.value ? new Set([field.value]) : new Set()}
                  onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] ?? "KEYWORD")}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                >
                  <SelectItem key="KEYWORD">Keyword</SelectItem>
                  <SelectItem key="REGEX">Regex</SelectItem>
                  <SelectItem key="EXACT">Exact</SelectItem>
                </Select>
              )}
            />

            <Input
              label="Pattern"
              isRequired
              placeholder={
                watchedMatchType === "REGEX"
                  ? "e.g. (?i)supermarket.*"
                  : "e.g. supermarket"
              }
              description={MATCH_TYPE_HELPER[watchedMatchType]}
              {...register("pattern", { required: "Pattern is required" })}
              isInvalid={!!errors.pattern}
              errorMessage={errors.pattern?.message}
            />

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
