"use client";

import type { ParsedFile } from "@/app/components/import/DropZone";
import InlineCreditCardForm from "@/app/components/import/InlineCreditCardForm";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button, Chip, Select, SelectItem } from "@heroui/react";
import type { CreditCard } from "@prisma/client";
import { useState } from "react";

export interface ColumnMapping {
  dateColumn: string;
  descColumn: string;
  amountColumn: string;
}

interface ConfigureImportProps {
  parsedFile: ParsedFile;
  columnMapping: ColumnMapping;
  onColumnMappingChange: (mapping: ColumnMapping) => void;
  creditCards: CreditCard[];
  onCreditCardCreated: (card: CreditCard) => void;
  creditCardId: string | null;
  onCreditCardChange: (id: string | null) => void;
  hasRules: boolean;
  isSubmitting: boolean;
  onImport: () => void;
  onBack: () => void;
}

const PREVIEW_ROW_COUNT = 5;

export default function ConfigureImport({
  parsedFile,
  columnMapping,
  onColumnMappingChange,
  creditCards,
  onCreditCardCreated,
  creditCardId,
  onCreditCardChange,
  hasRules,
  isSubmitting,
  onImport,
  onBack,
}: ConfigureImportProps) {
  const [showMappingEditor, setShowMappingEditor] = useState(
    !parsedFile.detectionResult.isConfident
  );
  const [showNewCardForm, setShowNewCardForm] = useState(false);

  const { headers, rows, detectionResult } = parsedFile;
  const previewRows = rows.slice(0, PREVIEW_ROW_COUNT);

  function handleNewCardCreated(card: CreditCard) {
    onCreditCardCreated(card);
    onCreditCardChange(card.id);
    setShowNewCardForm(false);
  }

  const selectedCardName = creditCards.find((c) => c.id === creditCardId)?.name;

  return (
    <div className="w-full max-w-2xl">
      {/* File info header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <span className="text-xs font-bold text-primary">CSV</span>
        </div>
        <div>
          <p className="font-semibold text-foreground">{parsedFile.fileName}</p>
          <p className="text-xs text-default-500">{rows.length} rows detected</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Column mapping */}
        <section className="rounded-2xl border border-divider bg-content1 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Column Mapping</p>
              <p className="text-xs text-default-500">
                Map your CSV columns to the expected fields
              </p>
            </div>
            {detectionResult.isConfident && (
              <Button size="sm" variant="flat" onPress={() => setShowMappingEditor((v) => !v)}>
                {showMappingEditor ? "Hide" : "Edit mapping"}
              </Button>
            )}
          </div>

          {detectionResult.isConfident && !showMappingEditor ? (
            <div className="flex flex-wrap gap-2">
              <Chip
                startContent={<CheckCircleIcon className="h-4 w-4" />}
                color="success"
                variant="flat"
                size="md"
              >
                Date → {columnMapping.dateColumn}
              </Chip>
              <Chip
                startContent={<CheckCircleIcon className="h-4 w-4" />}
                color="success"
                variant="flat"
                size="md"
              >
                Description → {columnMapping.descColumn}
              </Chip>
              <Chip
                startContent={<CheckCircleIcon className="h-4 w-4" />}
                color="success"
                variant="flat"
                size="md"
              >
                Amount → {columnMapping.amountColumn}
              </Chip>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <Select
                label="Date column"
                selectedKeys={columnMapping.dateColumn ? [columnMapping.dateColumn] : []}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0] as string;
                  onColumnMappingChange({ ...columnMapping, dateColumn: val });
                }}
              >
                {headers.map((h) => (
                  <SelectItem key={h}>{h}</SelectItem>
                ))}
              </Select>
              <Select
                label="Description column"
                selectedKeys={columnMapping.descColumn ? [columnMapping.descColumn] : []}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0] as string;
                  onColumnMappingChange({ ...columnMapping, descColumn: val });
                }}
              >
                {headers.map((h) => (
                  <SelectItem key={h}>{h}</SelectItem>
                ))}
              </Select>
              <Select
                label="Amount column"
                selectedKeys={columnMapping.amountColumn ? [columnMapping.amountColumn] : []}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0] as string;
                  onColumnMappingChange({ ...columnMapping, amountColumn: val });
                }}
              >
                {headers.map((h) => (
                  <SelectItem key={h}>{h}</SelectItem>
                ))}
              </Select>
            </div>
          )}
        </section>

        {/* Preview table */}
        <section className="rounded-2xl border border-divider bg-content1 p-5">
          <div className="mb-3">
            <p className="font-medium text-foreground">Preview</p>
            <p className="text-xs text-default-500">
              First {Math.min(PREVIEW_ROW_COUNT, rows.length)} of {rows.length} rows
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-divider">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-content2">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-default-500">
                    Date
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-default-500">
                    Description
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-default-500">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, idx) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: CSV preview rows have no stable identifier
                  <tr key={idx} className="border-t border-divider">
                    <td className="px-4 py-2.5 text-default-600">
                      {row[columnMapping.dateColumn] ?? "—"}
                    </td>
                    <td className="max-w-xs truncate px-4 py-2.5 text-default-700">
                      {row[columnMapping.descColumn] ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-default-700">
                      {row[columnMapping.amountColumn] ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Credit card */}
        <section className="rounded-2xl border border-divider bg-content1 p-5">
          <div className="mb-4">
            <p className="font-medium text-foreground">Credit Card</p>
            <p className="text-xs text-default-500">
              Optionally associate these transactions with a card
            </p>
          </div>
          {!showNewCardForm ? (
            <div className="flex flex-col gap-2">
              <Select
                label="Select credit card"
                placeholder="None"
                selectedKeys={creditCardId ? [creditCardId] : []}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0] as string | undefined;
                  onCreditCardChange(val ?? null);
                }}
              >
                {creditCards.map((c) => (
                  <SelectItem key={c.id} textValue={c.bank ? `${c.name} — ${c.bank}` : c.name}>
                    {c.name}
                    {c.bank ? ` — ${c.bank}` : ""}
                  </SelectItem>
                ))}
              </Select>
              <Button
                variant="light"
                size="sm"
                className="self-start text-primary"
                onPress={() => setShowNewCardForm(true)}
              >
                + Add new card
              </Button>
            </div>
          ) : (
            <InlineCreditCardForm
              onCreated={handleNewCardCreated}
              onCancel={() => setShowNewCardForm(false)}
            />
          )}
        </section>

        {/* No-rules warning */}
        {!hasRules && (
          <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3">
            <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning-600" />
            <div>
              <p className="text-sm font-medium text-warning-700">No rules configured</p>
              <p className="text-xs text-warning-600">
                Transactions will be imported unmatched. Add rules to auto-categorize.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-2">
          <Button variant="flat" onPress={onBack}>
            Back
          </Button>
          <Button
            color="primary"
            size="lg"
            isLoading={isSubmitting}
            isDisabled={
              !columnMapping.dateColumn || !columnMapping.descColumn || !columnMapping.amountColumn
            }
            onPress={onImport}
          >
            Import {rows.length} transaction{rows.length !== 1 ? "s" : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}
