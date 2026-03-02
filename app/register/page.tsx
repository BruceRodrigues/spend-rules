"use client";

import { Button, Card, CardBody, CardHeader, Input, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(responseData.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      router.push("/verify-email");
    } catch (err) {
      setError("An error occurred. Please try again.");
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
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-small text-default-500">Sign up to get started with Spend Rules</p>
        </CardHeader>
        <CardBody className="gap-4 pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Name"
              type="text"
              placeholder="Enter your name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              isDisabled={isLoading}
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              isDisabled={isLoading}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              isDisabled={isLoading}
              description="Must be at least 8 characters"
            />
            {error && <p className="text-small text-danger">{error}</p>}
            <Button type="submit" color="primary" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="text-center text-small">
            <span className="text-default-500">Already have an account? </span>
            <Link href="/login" size="sm">
              Sign in
            </Link>
          </div>
        </CardBody>
      </Card>
      </div>
    </div>
  );
}
