"use client";

import { Button, Card, CardBody, CardHeader, Input, Link } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type ResetPasswordFormData = {
  password: string;
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-green-950/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-start gap-2 pb-0">
            <h1 className="text-2xl font-bold">Invalid Link</h1>
          </CardHeader>
          <CardBody className="gap-4 pt-6">
            <p className="text-small text-default-500">
              This password reset link is invalid or has expired.
            </p>
            <Link href="/login" size="sm">
              Back to Sign In
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });

      if (!response.ok) {
        const body = await response.json();
        setError(body.error ?? "Failed to reset password.");
        return;
      }

      router.push("/login?passwordReset=true");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-green-950/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-900">
            <span className="text-sm font-bold text-white">SR</span>
          </div>
          <span className="text-base font-semibold text-foreground">Spend Rules</span>
        </div>
      <Card className="w-full">
        <CardHeader className="flex flex-col items-start gap-2 pb-0">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-small text-default-500">Enter your new password below.</p>
        </CardHeader>
        <CardBody className="gap-4 pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
              })}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              isDisabled={isLoading}
            />
            {error && (
              <div className="flex flex-col gap-1">
                <p className="text-small text-danger">{error}</p>
                <Link href="/login" size="sm">
                  Back to Sign In
                </Link>
              </div>
            )}
            <Button type="submit" color="primary" className="w-full" isLoading={isLoading}>
              Reset Password
            </Button>
          </form>
        </CardBody>
      </Card>
      </div>
    </div>
  );
}
