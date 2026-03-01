import { requireUserId } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

export async function POST() {
  const userId = await requireUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, password: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (!user.password) {
    return NextResponse.json(
      { error: "This account uses Google Sign-In." },
      { status: 400 },
    );
  }

  const identifier = `password-reset:${user.email}`;

  await prisma.verificationToken.deleteMany({ where: { identifier } });

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.verificationToken.create({
    data: { identifier, token, expires },
  });

  await sendPasswordResetEmail(user.email, token);

  return NextResponse.json({ message: "Password reset email sent." });
}
