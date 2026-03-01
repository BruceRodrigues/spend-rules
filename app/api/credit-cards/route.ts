import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await requireUserId();

    const creditCards = await prisma.creditCard.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ creditCards });
  } catch (error) {
    console.error("Error fetching credit cards:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await request.json();
    const { name, bank, lastFourDigits, color } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const creditCard = await prisma.creditCard.create({
      data: { userId, name, bank, lastFourDigits, color },
    });

    return NextResponse.json(creditCard, { status: 201 });
  } catch (error) {
    console.error("Error creating credit card:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
