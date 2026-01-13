import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
        rule: true,
      },
      orderBy: {
        date: "desc",
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.transaction.count({
      where: {
        userId,
      },
    });

    return NextResponse.json({
      transactions,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await request.json();
    const { date, description, amount, categoryId, ruleId, rawData } = body;

    if (!date || !description || amount === undefined) {
      return NextResponse.json(
        { error: "Date, description, and amount are required" },
        { status: 400 },
      );
    }

    // Verify category belongs to user if provided
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          userId,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 },
        );
      }
    }

    // Verify rule belongs to user if provided
    if (ruleId) {
      const rule = await prisma.rule.findFirst({
        where: {
          id: ruleId,
          userId,
        },
      });

      if (!rule) {
        return NextResponse.json(
          { error: "Rule not found" },
          { status: 404 },
        );
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        date: new Date(date),
        description,
        amount: parseFloat(amount),
        categoryId: categoryId || null,
        ruleId: ruleId || null,
        isMatched: !!(categoryId || ruleId),
        rawData: rawData || null,
      },
      include: {
        category: true,
        rule: true,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
