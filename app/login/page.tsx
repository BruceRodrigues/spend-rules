"use client";

import { Button, Card, CardBody, CardHeader, Input, Link } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-start gap-2 pb-0">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-small text-default-500">Sign in to your account to continue</p>
        </CardHeader>
        <CardBody className="gap-4 pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
              })}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              isDisabled={isLoading}
            />
            {error && <p className="text-small text-danger">{error}</p>}
            <Button type="submit" color="primary" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-default-200" />
            <span className="mx-4 flex-shrink text-small text-default-500">OR</span>
            <div className="flex-grow border-t border-default-200" />
          </div>

          <Button
            variant="bordered"
            className="w-full"
            onClick={handleGoogleSignIn}
            isDisabled={isLoading}
          >
            Continue with Google
          </Button>

          <div className="text-center text-small">
            <span className="text-default-500">Don&apos;t have an account? </span>
            <Link href="/register" size="sm">
              Sign up
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
