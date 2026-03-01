"use client";

import { Button, Input } from "@heroui/react";
import type { CreditCard } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  name: string;
  bank: string;
}

interface InlineCreditCardFormProps {
  onCreated: (card: CreditCard) => void;
  onCancel: () => void;
}

export default function InlineCreditCardForm({ onCreated, onCancel }: InlineCreditCardFormProps) {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { name: "", bank: "" } });

  async function onSubmit(data: FormValues) {
    setApiError(null);
    const response = await fetch("/api/credit-cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name, bank: data.bank || undefined }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setApiError(body.error ?? "Failed to create credit card.");
      return;
    }

    const card: CreditCard = await response.json();
    onCreated(card);
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-divider bg-content1 p-3">
      <Input
        autoFocus
        label="Card name"
        placeholder="e.g. Nubank Mastercard"
        {...register("name", { required: "Name is required" })}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
      />
      <Input label="Bank (optional)" placeholder="e.g. Nubank" {...register("bank")} />

      {apiError && <p className="text-xs text-danger">{apiError}</p>}

      <div className="flex gap-2">
        <Button variant="bordered" size="sm" onPress={onCancel}>
          Cancel
        </Button>
        <Button
          color="primary"
          size="sm"
          isLoading={isSubmitting}
          onPress={() => handleSubmit(onSubmit)()}
        >
          Add Card
        </Button>
      </div>
    </div>
  );
}
