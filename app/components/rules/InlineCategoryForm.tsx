"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
      <div className="flex flex-col gap-1">
        <input
          {...register("name", { required: "Name is required" })}
          placeholder="Category name"
          autoFocus
          className="rounded-lg border border-divider bg-content1 px-3 py-2 text-sm text-foreground placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.name && (
          <p className="text-xs text-danger">{errors.name.message}</p>
        )}
      </div>

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
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-divider px-3 py-1.5 text-xs text-foreground hover:bg-default-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Adding…" : "Add Category"}
        </button>
      </div>
    </div>
  );
}
