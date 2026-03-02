"use client";

import { Button, Card, CardBody, CardHeader, Link } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (error === "expired") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-start gap-2 pb-0">
            <h1 className="text-2xl font-bold">Link Expired</h1>
          </CardHeader>
          <CardBody className="gap-4 pt-6">
            <p className="text-default-600">
              Your verification link has expired. Please sign up again to receive a new link.
            </p>
            <Button as={Link} href="/register" color="primary" className="w-full">
              Sign up again
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error === "invalid") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-start gap-2 pb-0">
            <h1 className="text-2xl font-bold">Invalid Link</h1>
          </CardHeader>
          <CardBody className="gap-4 pt-6">
            <p className="text-default-600">
              This verification link is invalid or has already been used.
            </p>
            <Button as={Link} href="/login" color="primary" className="w-full">
              Go to sign in
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-start gap-2 pb-0">
          <h1 className="text-2xl font-bold">Check your inbox</h1>
        </CardHeader>
        <CardBody className="gap-4 pt-6">
          <p className="text-default-600">
            We&apos;ve sent a verification link to your email address. Click the link to activate
            your account.
          </p>
          <p className="text-small text-default-400">
            Didn&apos;t receive the email? Check your spam folder.
          </p>
          <div className="text-center text-small">
            <span className="text-default-500">Already verified? </span>
            <Link href="/login" size="sm">
              Sign in
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
