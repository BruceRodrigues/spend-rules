import { Button } from "@heroui/react";
import { Card, CardBody, CardHeader } from "@heroui/react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-col items-start gap-2 pb-0">
          <h1 className="text-3xl font-bold">Welcome to Spend Rules</h1>
        </CardHeader>
        <CardBody className="pt-6">
          <p className="text-default-600 mb-4">
            Analyze and categorize your credit card expenses automatically. Upload a CSV file and
            let the system match purchases to categories.
          </p>
          <Button color="primary" className="w-full">
            Get Started
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}
