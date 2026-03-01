"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "@heroui/react";
import { HexColorPicker } from "react-colorful";
import { generateReadableColor } from "@/lib/colors";
import type { Category } from "@prisma/client";

interface InlineCategoryFormValues {
  name: string;
  color: string;
}

interface InlineCategoryFormProps {
  onCreated: (category: Category) => void;
  onCancel: () => void;
}

export default function InlineCategoryForm({
  onCreated,
  onCancel,
}: InlineCategoryFormProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InlineCategoryFormValues>({
    defaultValues: { name: "", color: "" },
  });

  const watchedColor = watch("color");

  useEffect(() => {
    setValue("color", generateReadableColor());
  }, [setValue]);

  async function onSubmit(data: InlineCategoryFormValues) {
    setApiError(null);
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name, color: data.color }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setApiError(body.error ?? "Failed to create category.");
      return;
    }

    const category: Category = await response.json();
    onCreated(category);
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-divider bg-content1 p-3">
      <Input
        autoFocus
        placeholder="Category name"
        {...register("name", { required: "Name is required" })}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
      />

      <div className="flex flex-col gap-2">
        <input
          type="hidden"
          {...register("color", { required: "Color is required" })}
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPickerOpen((prev) => !prev)}
            className="h-8 w-8 flex-shrink-0 rounded-full border-2 border-divider shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ backgroundColor: watchedColor }}
            aria-label="Toggle color picker"
          />
          <span className="font-mono text-sm text-default-500">
            {watchedColor}
          </span>
        </div>
        {isPickerOpen && (
          <HexColorPicker
            color={watchedColor}
            onChange={(hex) => setValue("color", hex, { shouldValidate: true })}
            style={{ width: "100%" }}
          />
        )}
      </div>

      {apiError && <p className="text-xs text-danger">{apiError}</p>}

      <div className="flex gap-2">
        <Button variant="bordered" size="sm" onPress={onCancel}>
          Cancel
        </Button>
        <Button
          color="primary"
          size="sm"
          isLoading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          Add Category
        </Button>
      </div>
    </div>
  );
}
