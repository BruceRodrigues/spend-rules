"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useState } from "react";
import type { Category } from "@prisma/client";

type CategoryWithCount = Category & { _count: { rules: number } };

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
  category: CategoryWithCount | null;
}

export default function DeleteCategoryModal({
  isOpen,
  onClose,
  onDeleted,
  category,
}: DeleteCategoryModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    if (!category) return;

    setIsDeleting(true);
    const response = await fetch(`/api/categories/${category.id}`, {
      method: "DELETE",
    });
    setIsDeleting(false);

    if (!response.ok) return;

    onDeleted();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        <ModalHeader className="text-foreground">Delete Category</ModalHeader>
        <ModalBody>
          <p className="text-sm text-default-600">
            Are you sure you want to delete{" "}
            <strong className="text-foreground">{category?.name}</strong>? This
            action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} type="button">
            Cancel
          </Button>
          <Button color="danger" onPress={handleConfirm} isLoading={isDeleting}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
