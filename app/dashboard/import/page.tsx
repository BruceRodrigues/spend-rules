"use client";

import ConfigureImport from "@/app/components/import/ConfigureImport";
import type { ColumnMapping } from "@/app/components/import/ConfigureImport";
import DropZone from "@/app/components/import/DropZone";
import type { ParsedFile } from "@/app/components/import/DropZone";
import ImportResults from "@/app/components/import/ImportResults";
import type { ImportBatchResult } from "@/app/components/import/ImportResults";
import ProcessingScreen from "@/app/components/import/ProcessingScreen";
import { parseAmount } from "@/lib/csv";
import type { CreditCard } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";

type ImportStep = "upload" | "configure" | "processing" | "results";

interface CreditCardsResponse {
  creditCards: CreditCard[];
}

interface RulesResponse {
  total: number;
}

export default function ImportPage() {
  const [step, setStep] = useState<ImportStep>("upload");
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    dateColumn: "",
    descColumn: "",
    amountColumn: "",
  });
  const [creditCardId, setCreditCardId] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportBatchResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: creditCardsData, mutate: mutateCreditCards } =
    useSWR<CreditCardsResponse>("/api/credit-cards");

  const { data: rulesData } = useSWR<RulesResponse>("/api/rules?limit=1&isActive=true");

  const creditCards = creditCardsData?.creditCards ?? [];
  const hasRules = (rulesData?.total ?? 0) > 0;

  function handleFileParsed(result: ParsedFile) {
    setParsedFile(result);
    setColumnMapping({
      dateColumn: result.detectionResult.dateColumn ?? "",
      descColumn: result.detectionResult.descColumn ?? "",
      amountColumn: result.detectionResult.amountColumn ?? "",
    });
    setStep("configure");
  }

  function handleCreditCardCreated(card: CreditCard) {
    mutateCreditCards();
    setCreditCardId(card.id);
  }

  async function handleImport() {
    if (!parsedFile) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setStep("processing");

    const rows = parsedFile.rows.map((row) => ({
      date: row[columnMapping.dateColumn] ?? "",
      description: row[columnMapping.descColumn] ?? "",
      amount: parseAmount(row[columnMapping.amountColumn] ?? "0"),
      rawData: row,
    }));

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows,
          creditCardId,
          fileName: parsedFile.fileName,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Import failed");
      }

      const result: ImportBatchResult = await response.json();
      setImportResult(result);
      setStep("results");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Import failed";
      setSubmitError(message);
      setStep("configure");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleImportAnother() {
    setParsedFile(null);
    setColumnMapping({ dateColumn: "", descColumn: "", amountColumn: "" });
    setCreditCardId(null);
    setImportResult(null);
    setSubmitError(null);
    setStep("upload");
  }

  const selectedCardName = creditCards.find((c) => c.id === creditCardId)?.name;

  return (
    <div className="flex min-h-full flex-col p-8">
      {/* Header — always visible */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Import Transactions</h1>
        <p className="mt-1 text-sm text-default-500">
          Upload a CSV file to import and auto-match transactions against your rules
        </p>
      </div>

      {/* Error banner for configure step */}
      {submitError && step === "configure" && (
        <div className="mb-6 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {submitError}
        </div>
      )}

      {/* Upload step — drop zone fills remaining space */}
      {step === "upload" && (
        <div className="flex min-h-[60vh] items-center justify-center">
          <DropZone onFileParsed={handleFileParsed} />
        </div>
      )}

      {/* Configure step — centered card */}
      {step === "configure" && parsedFile && (
        <div className="flex justify-center">
          <ConfigureImport
            parsedFile={parsedFile}
            columnMapping={columnMapping}
            onColumnMappingChange={setColumnMapping}
            creditCards={creditCards}
            onCreditCardCreated={handleCreditCardCreated}
            creditCardId={creditCardId}
            onCreditCardChange={setCreditCardId}
            hasRules={hasRules}
            isSubmitting={isSubmitting}
            onImport={handleImport}
            onBack={() => setStep("upload")}
          />
        </div>
      )}

      {/* Processing step */}
      {step === "processing" && parsedFile && (
        <div className="flex min-h-[60vh] items-center justify-center">
          <ProcessingScreen fileName={parsedFile.fileName} rowCount={parsedFile.rows.length} />
        </div>
      )}

      {/* Results step */}
      {step === "results" && importResult && (
        <div className="flex min-h-[60vh] items-center justify-center">
          <ImportResults
            result={importResult}
            creditCardName={selectedCardName}
            onImportAnother={handleImportAnother}
          />
        </div>
      )}
    </div>
  );
}
