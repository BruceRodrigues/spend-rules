"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HexColorPicker } from "react-colorful";
import { generateReadableColor } from "@/lib/colors";

interface AddCategoryFormValues {
  name: string;
  description: string;
  color: string;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onCreated,
}: AddCategoryModalProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddCategoryFormValues>({
    defaultValues: { name: "", description: "", color: "" },
  });

  const watchedColor = watch("color");

  useEffect(() => {
    if (isOpen) {
      setValue("color", generateReadableColor());
    } else {
      reset();
      setIsPickerOpen(false);
    }
  }, [isOpen, setValue, reset]);

  async function onSubmit(data: AddCategoryFormValues) {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        description: data.description || undefined,
        color: data.color,
      }),
    });

    if (!response.ok) return;

    reset();
    onCreated();
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
          <ModalHeader className="text-foreground">Add Category</ModalHeader>
          <ModalBody className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">
                Name <span className="text-danger">*</span>
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="e.g. Groceries"
                className="rounded-lg border border-divider bg-content1 px-3 py-2 text-sm text-foreground placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.name && (
                <p className="text-xs text-danger">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <input
                {...register("description")}
                placeholder="Optional description"
                className="rounded-lg border border-divider bg-content1 px-3 py-2 text-sm text-foreground placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">
                Color <span className="text-danger">*</span>
              </label>
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
                <div className="mt-2">
                  <HexColorPicker
                    color={watchedColor}
                    onChange={(hex) =>
                      setValue("color", hex, { shouldValidate: true })
                    }
                    style={{ width: "100%" }}
                  />
                </div>
              )}
              {errors.color && (
                <p className="text-xs text-danger">{errors.color.message}</p>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={handleClose} type="button">
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              Create Category
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
