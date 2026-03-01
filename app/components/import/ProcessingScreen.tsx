"use client";

import { Spinner } from "@heroui/react";

interface ProcessingScreenProps {
  fileName: string;
  rowCount: number;
}

export default function ProcessingScreen({ fileName, rowCount }: ProcessingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <Spinner size="lg" color="primary" />
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground">
          Processing {rowCount} transaction{rowCount !== 1 ? "s" : ""}…
        </p>
        <p className="mt-1 text-sm text-default-500">Matching against rules — {fileName}</p>
      </div>
    </div>
  );
}
