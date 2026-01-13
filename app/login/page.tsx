"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Link,
} from "@heroui/react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
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
          <p className="text-small text-default-500">
            Sign in to your account to continue
          </p>
        </CardHeader>
        <CardBody className="gap-4 pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
              isDisabled={isLoading}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              isDisabled={isLoading}
            />
            {error && (
              <p className="text-small text-danger">{error}</p>
            )}
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-default-200"></div>
            <span className="mx-4 flex-shrink text-small text-default-500">
              OR
            </span>
            <div className="flex-grow border-t border-default-200"></div>
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
