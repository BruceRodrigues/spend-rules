"use client";

import { Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type ProfileFormData = {
  name: string;
};

interface ProfileFormProps {
  name: string;
  email: string;
}

export default function ProfileForm({ name, email }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({ defaultValues: { name } });

  const onSubmit = async (data: ProfileFormData) => {
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name }),
      });

      if (!response.ok) {
        const body = await response.json();
        setError(body.error ?? "Failed to update profile.");
        return;
      }

      setSuccessMessage("Profile updated.");
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Input
          label="Display Name"
          placeholder="Enter your name"
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" },
          })}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          isDisabled={isLoading}
        />
        <Input label="Email" value={email} isDisabled description="Email cannot be changed." />
      </div>
      {successMessage && <p className="text-small text-success">{successMessage}</p>}
      {error && <p className="text-small text-danger">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" color="primary" isLoading={isLoading} isDisabled={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
