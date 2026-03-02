"use client";

import { generateReadableColor } from "@/lib/colors";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import type { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";

type CategoryWithCount = Category & { _count: { rules: number } };

interface CategoryFormValues {
  name: string;
  description: string;
  color: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  category?: CategoryWithCount | null;
}

export default function CategoryModal({ isOpen, onClose, onSaved, category }: CategoryModalProps) {
  const isEditing = category != null;
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    defaultValues: { name: "", description: "", color: "" },
  });

  const watchedColor = watch("color");

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        reset({
          name: category.name,
          description: category.description ?? "",
          color: category.color ?? "",
        });
      } else {
        setValue("color", generateReadableColor());
      }
    } else {
      reset();
      setIsPickerOpen(false);
    }
  }, [isOpen, category, isEditing, reset, setValue]);

  async function onSubmit(data: CategoryFormValues) {
    const url = isEditing ? `/api/categories/${category.id}` : "/api/categories";
    const method = isEditing ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        description: data.description || undefined,
        color: data.color,
      }),
    });

    if (!response.ok) return;

    if (!isEditing) reset();
    onSaved();
    onClose();
  }

  function handleClose() {
    reset();
    setIsPickerOpen(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="text-foreground">
            {isEditing ? "Edit Category" : "Add Category"}
          </ModalHeader>
          <ModalBody className="flex flex-col gap-4">
            <Input
              label="Name"
              isRequired
              placeholder="e.g. Groceries"
              {...register("name", { required: "Name is required" })}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />

            <Input
              label="Description"
              placeholder="Optional description"
              {...register("description")}
            />

            <div className="flex flex-col gap-1">
              {/* biome-ignore lint/a11y/noLabelWithoutControl: label is decorative; value is set via color picker, not a focusable input */}
              <label className="text-sm font-medium text-foreground">
                Color <span className="text-danger">*</span>
              </label>
              <input type="hidden" {...register("color", { required: "Color is required" })} />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPickerOpen((prev) => !prev)}
                  className="h-8 w-8 flex-shrink-0 rounded-full border-2 border-divider shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{ backgroundColor: watchedColor }}
                  aria-label="Toggle color picker"
                />
                <span className="font-mono text-sm text-default-500">{watchedColor}</span>
              </div>
              {isPickerOpen && (
                <div className="mt-2">
                  <HexColorPicker
                    color={watchedColor}
                    onChange={(hex) => setValue("color", hex, { shouldValidate: true })}
                    style={{ width: "100%" }}
                  />
                </div>
              )}
              {errors.color && <p className="text-xs text-danger">{errors.color.message}</p>}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={handleClose} type="button">
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              {isEditing ? "Save Changes" : "Create Category"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
