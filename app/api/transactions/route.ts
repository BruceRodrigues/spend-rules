import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireUserId();

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.max(1, Number(searchParams.get("limit") ?? "20"));
    const skip = (page - 1) * limit;

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const categoryId = searchParams.get("categoryId");
    const creditCardId = searchParams.get("creditCardId");

    const where = {
      userId,
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(`${endDate}T23:59:59.999Z`) } : {}),
            },
          }
        : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(creditCardId ? { creditCardId } : {}),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, color: true } },
          creditCard: { select: { id: true, name: true, bank: true, color: true } },
          rule: { select: { id: true, name: true } },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({
      data: transactions,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
