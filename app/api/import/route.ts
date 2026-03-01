import { requireUserId } from "@/lib/auth";
import { parseDate } from "@/lib/csv";
import { prisma } from "@/lib/prisma";
import { applyRules } from "@/lib/rules-engine";
import { type NextRequest, NextResponse } from "next/server";

interface ImportRow {
  date: string;
  description: string;
  amount: number;
  rawData: Record<string, string>;
}

interface ImportRequestBody {
  rows: ImportRow[];
  creditCardId: string | null;
  fileName: string;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const body: ImportRequestBody = await request.json();
    const { rows, creditCardId, fileName } = body;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "No rows to import" }, { status: 400 });
    }

    const rules = await prisma.rule.findMany({
      where: { userId, isActive: true },
      include: { category: true },
      orderBy: { priority: "desc" },
    });

    const parsedDates = rows.map((row) => parseDate(row.date));
    const sortedDates = [...parsedDates].sort((a, b) => a.getTime() - b.getTime());
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];

    let matchedRows = 0;
    const transactionData = rows.map((row, idx) => {
      const matchedRule = applyRules(row.description, rules);
      if (matchedRule) matchedRows++;

      return {
        userId,
        creditCardId: creditCardId ?? null,
        date: parsedDates[idx],
        description: row.description,
        amount: row.amount,
        categoryId: matchedRule?.categoryId ?? null,
        ruleId: matchedRule?.id ?? null,
        isMatched: matchedRule !== null,
        rawData: row.rawData,
      };
    });

    const batch = await prisma.importBatch.create({
      data: {
        userId,
        creditCardId: creditCardId ?? null,
        fileName,
        totalRows: rows.length,
        matchedRows,
        startDate,
        endDate,
      },
    });

    await prisma.transaction.createMany({
      data: transactionData.map((t) => ({ ...t, importBatchId: batch.id })),
    });

    return NextResponse.json({
      batchId: batch.id,
      totalRows: rows.length,
      matchedRows,
      startDate,
      endDate,
    });
  } catch (error) {
    console.error("Error importing transactions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
