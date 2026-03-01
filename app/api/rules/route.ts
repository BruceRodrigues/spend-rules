import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { MatchType, Prisma } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireUserId();

    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") ?? "";
    const matchTypeParam = searchParams.get("matchType");
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.max(1, Number(searchParams.get("limit") ?? "50"));

    const validMatchTypes: MatchType[] = ["KEYWORD", "REGEX", "EXACT"];
    const matchType =
      matchTypeParam && validMatchTypes.includes(matchTypeParam as MatchType)
        ? (matchTypeParam as MatchType)
        : undefined;

    const where: Prisma.RuleWhereInput = {
      userId,
      ...(matchType ? { matchType } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { pattern: { contains: search, mode: "insensitive" } },
              { category: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const [rules, total] = await Promise.all([
      prisma.rule.findMany({
        where,
        include: { category: true },
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rule.count({ where }),
    ]);

    return NextResponse.json({
      rules,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error("Error fetching rules:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
        { status: 400 }
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
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
