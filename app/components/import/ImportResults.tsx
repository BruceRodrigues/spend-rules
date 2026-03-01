"use client";

import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import Link from "next/link";

export interface ImportBatchResult {
  batchId: string;
  totalRows: number;
  matchedRows: number;
  startDate: string;
  endDate: string;
}

interface ImportResultsProps {
  result: ImportBatchResult;
  creditCardName?: string;
  onImportAnother: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ImportResults({
  result,
  creditCardName,
  onImportAnother,
}: ImportResultsProps) {
  const unmatchedRows = result.totalRows - result.matchedRows;

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-8 text-center">
      {/* Success icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
        <CheckCircleIcon className="h-10 w-10 text-success" />
      </div>

      {/* Heading */}
      <div>
        <h2 className="text-3xl font-semibold text-foreground">Import complete!</h2>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm text-default-500">
          <span>{formatDate(result.startDate)} – {formatDate(result.endDate)}</span>
          {creditCardName && (
            <>
              <span>·</span>
              <span>{creditCardName}</span>
            </>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid w-full grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-divider bg-content1 py-5">
          <span className="text-3xl font-bold text-foreground">{result.totalRows}</span>
          <span className="text-xs font-medium uppercase tracking-wide text-default-500">
            Total
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-success/30 bg-success/10 py-5">
          <span className="text-3xl font-bold text-success">{result.matchedRows}</span>
          <span className="text-xs font-medium uppercase tracking-wide text-success/70">
            Matched
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-warning/30 bg-warning/10 py-5">
          <span className="text-3xl font-bold text-warning-600">{unmatchedRows}</span>
          <span className="text-xs font-medium uppercase tracking-wide text-warning-500">
            Unmatched
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <Button
          as={Link}
          href="/dashboard/transactions"
          color="primary"
          size="lg"
          className="flex-1"
        >
          View Transactions
        </Button>
        <Button variant="flat" size="lg" className="flex-1" onPress={onImportAnother}>
          Import Another File
        </Button>
      </div>
    </div>
  );
}
