"use client";

import { Button } from "@heroui/react";
import { useState } from "react";

interface PasswordResetSectionProps {
  hasPassword: boolean;
}

export default function PasswordResetSection({ hasPassword }: PasswordResetSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  if (!hasPassword) {
    return (
      <div className="rounded-lg bg-default-50 px-4 py-3">
        <p className="text-small text-default-600">
          Your account uses Google Sign-In. Manage your password through Google.
        </p>
      </div>
    );
  }

  const handleSendResetEmail = async () => {
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
      });

      if (!response.ok) {
        const body = await response.json();
        setError(body.error ?? "Failed to send reset email.");
        return;
      }

      setSuccessMessage("Reset link sent to your email.");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="rounded-lg bg-success-50 px-4 py-3">
        <p className="text-small text-success-700">{successMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-small text-default-500">
        Send a password reset link to your email address.
      </p>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {error && <p className="text-small text-danger">{error}</p>}
        <Button
          color="primary"
          variant="bordered"
          onPress={handleSendResetEmail}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Send reset email
        </Button>
      </div>
    </div>
  );
}
