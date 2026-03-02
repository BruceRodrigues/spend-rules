"use client";

import { detectColumns } from "@/lib/csv";
import type { ColumnDetectionResult } from "@/lib/csv";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import Papa from "papaparse";
import { useRef, useState } from "react";

export interface ParsedFile {
  fileName: string;
  headers: string[];
  rows: Record<string, string>[];
  detectionResult: ColumnDetectionResult;
}

interface DropZoneProps {
  onFileParsed: (result: ParsedFile) => void;
}

export default function DropZone({ onFileParsed }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.name.endsWith(".csv")) {
      setError("Only .csv files are supported.");
      return;
    }
    setError(null);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(result) {
        const headers = result.meta.fields ?? [];
        const rows = result.data;
        const detectionResult = detectColumns(headers);
        onFileParsed({ fileName: file.name, headers, rows, detectionResult });
      },
      error() {
        setError("Failed to parse CSV file. Please check the file format.");
      },
    });
  }

  function handleDragOver(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex w-full flex-col items-center">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "flex w-full max-w-2xl cursor-pointer flex-col items-center justify-center gap-6 rounded-3xl border-2 border-dashed px-16 py-28 text-center transition-all duration-200",
          isDragging
            ? "scale-[1.01] border-primary bg-primary/10 shadow-lg"
            : "border-divider bg-content1 hover:border-primary/40 hover:bg-content2 hover:shadow-md",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-20 w-20 items-center justify-center rounded-2xl transition-colors duration-200",
            isDragging ? "bg-primary/20" : "bg-default-100",
          ].join(" ")}
        >
          <CloudArrowUpIcon
            className={`h-10 w-10 transition-colors duration-200 ${isDragging ? "text-primary" : "text-default-500"}`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-xl font-semibold text-foreground">
            {isDragging ? "Release to upload" : "Drop your CSV file here"}
          </p>
          <p className="text-sm text-default-500">Drag & drop or click anywhere to browse</p>
          <p className="mt-1 text-xs text-default-400">Only .csv files are accepted</p>
        </div>

        <div
          className={[
            "rounded-xl border px-5 py-2 text-sm font-medium transition-colors duration-200",
            isDragging
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-divider bg-background text-default-600",
          ].join(" ")}
        >
          Browse files
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleInputChange}
        />
      </button>

      {error && (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
