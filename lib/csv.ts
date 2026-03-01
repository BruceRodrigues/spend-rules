const DATE_HINTS = ["date", "data", "dt", "transaction date", "posting date"];
const DESCRIPTION_HINTS = [
  "description",
  "descricao",
  "descricção",
  "memo",
  "merchant",
  "title",
  "historico",
];
const AMOUNT_HINTS = ["amount", "valor", "value", "debit", "credit", "total", "montante"];

export interface ColumnDetectionResult {
  dateColumn: string | null;
  descColumn: string | null;
  amountColumn: string | null;
  isConfident: boolean;
}

function findBestMatch(headers: string[], hints: string[]): string | null {
  const lower = headers.map((h) => h.toLowerCase().trim());
  for (const hint of hints) {
    const idx = lower.findIndex((h) => h.includes(hint.toLowerCase()));
    if (idx !== -1) return headers[idx];
  }
  return null;
}

export function detectColumns(headers: string[]): ColumnDetectionResult {
  const dateColumn = findBestMatch(headers, DATE_HINTS);
  const descColumn = findBestMatch(headers, DESCRIPTION_HINTS);
  const amountColumn = findBestMatch(headers, AMOUNT_HINTS);
  const isConfident = dateColumn !== null && descColumn !== null && amountColumn !== null;

  return { dateColumn, descColumn, amountColumn, isConfident };
}

export function parseDate(value: string): Date {
  const trimmed = value.trim();

  // ISO: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return new Date(trimmed);
  }

  // DD/MM/YYYY (Brazilian) or MM/DD/YYYY (US) — treat as DD/MM/YYYY
  const slashMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return new Date(`${year}-${month}-${day}`);
  }

  return new Date(trimmed);
}
