import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireUserId();

    const rules = await prisma.rule.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.error("Error fetching rules:", error);
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
    const { categoryId, name, pattern, matchType, priority, isActive } = body;

    if (!categoryId || !name || !pattern) {
      return NextResponse.json(
        { error: "Category ID, name, and pattern are required" },
        { status: 400 },
      );
    }

    // Verify category belongs to user
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

    const rule = await prisma.rule.create({
      data: {
        userId,
        categoryId,
        name,
        pattern,
        matchType: matchType || "KEYWORD",
        priority: priority || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error("Error creating rule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
