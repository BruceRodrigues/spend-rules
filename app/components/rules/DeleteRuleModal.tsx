"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import type { Category, Rule } from "@prisma/client";
import { useState } from "react";

type RuleWithCategory = Rule & { category: Category };

interface DeleteRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
  rule: RuleWithCategory | null;
}

export default function DeleteRuleModal({
  isOpen,
  onClose,
  onDeleted,
  rule,
}: DeleteRuleModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    if (!rule) return;

    setIsDeleting(true);
    const response = await fetch(`/api/rules/${rule.id}`, {
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
        <ModalHeader className="text-foreground">Delete Rule</ModalHeader>
        <ModalBody>
          <p className="text-sm text-default-600">
            Are you sure you want to delete{" "}
            <strong className="text-foreground">{rule?.name}</strong>? This action cannot be undone.
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
